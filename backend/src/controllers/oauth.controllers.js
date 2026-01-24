import crypto from "crypto";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import generateToken from "../utils/jwt.js";

const getServerBaseUrl = (req) => {
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL.replace(/\/$/, "");
  }

  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return `${protocol}://${req.get("host")}`;
};

const getFrontendBaseUrl = () => {
  return (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
};

const getSafeRedirectUrl = (redirect) => {
  const base = getFrontendBaseUrl();
  if (!redirect) {
    return `${base}/oauth/callback`;
  }

  try {
    const parsed = new URL(redirect);
    const baseUrl = new URL(base);
    if (parsed.origin !== baseUrl.origin) {
      return `${base}/oauth/callback`;
    }
    return parsed.toString();
  } catch {
    return `${base}/oauth/callback`;
  }
};

const setOauthCookies = (res, { state, redirect }) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookie("oauth_state", state, { ...options, maxAge: 10 * 60 * 1000 });
  res.cookie("oauth_redirect", redirect, {
    ...options,
    maxAge: 10 * 60 * 1000,
  });
};

const clearOauthCookies = (res) => {
  res.clearCookie("oauth_state");
  res.clearCookie("oauth_redirect");
};

const buildGoogleAuthUrl = (req, state) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${getServerBaseUrl(req)}/api/auth/oauth/google/callback`,
  );

  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    include_granted_scopes: true,
    state,
  });
};

const buildGithubAuthUrl = (req, state) => {
  const redirectUri = `${getServerBaseUrl(req)}/api/auth/oauth/github/callback`;
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

const normalizeUsername = (value) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_\-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
};

const generateUniqueUsername = async (base) => {
  const sanitized = normalizeUsername(base) || "user";
  let candidate = sanitized;
  let suffix = 0;

  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${sanitized}${suffix}`.slice(0, 20);
  }

  return candidate;
};

const upsertOAuthUser = async ({
  provider,
  providerId,
  email,
  emailVerified,
  profile,
}) => {
  const providerKey = `oauthProviders.${provider}.id`;
  let user = await User.findOne({ [providerKey]: providerId });

  if (!user) {
    user = await User.findOne({ email });

    if (user) {
      if (!emailVerified) {
        throw new ApiError(400, "Provider email is not verified");
      }
      if (user.email.toLowerCase() !== email.toLowerCase()) {
        throw new ApiError(
          400,
          "Provider email does not match existing account",
        );
      }
    }
  }

  const providerPayload = {
    id: providerId,
    email,
    verified: emailVerified,
    ...(provider === "github" ? { username: profile.username || "" } : {}),
  };

  if (user) {
    user.oauthProviders = user.oauthProviders || {};
    user.oauthProviders[provider] = providerPayload;
    await user.save();
    return user;
  }

  const usernameSource = profile.username || email.split("@")[0];
  const username = await generateUniqueUsername(usernameSource);

  const createdUser = await User.create({
    username,
    email,
    oauthProviders: {
      [provider]: providerPayload,
    },
  });

  return createdUser;
};

export const startOAuth = asyncHandler(async (req, res) => {
  const { provider } = req.params;

  if (!provider || !["google", "github"].includes(provider)) {
    throw new ApiError(400, "Unsupported OAuth provider");
  }

  if (!process.env.GOOGLE_CLIENT_ID && provider === "google") {
    throw new ApiError(500, "Google OAuth is not configured");
  }

  if (!process.env.GITHUB_CLIENT_ID && provider === "github") {
    throw new ApiError(500, "GitHub OAuth is not configured");
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirect = getSafeRedirectUrl(
    typeof req.query.redirect === "string" ? req.query.redirect : undefined,
  );

  setOauthCookies(res, { state, redirect });

  const authUrl =
    provider === "google"
      ? buildGoogleAuthUrl(req, state)
      : buildGithubAuthUrl(req, state);

  return res.redirect(authUrl);
});

export const handleOAuthCallback = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const { code, state, error } = req.query;

  const redirect = getSafeRedirectUrl(
    typeof req.cookies?.oauth_redirect === "string"
      ? req.cookies.oauth_redirect
      : undefined,
  );

  try {
    if (error) {
      clearOauthCookies(res);
      return res.redirect(`${redirect}?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      throw new ApiError(400, "Missing OAuth callback parameters");
    }

    if (state !== req.cookies?.oauth_state) {
      throw new ApiError(401, "Invalid OAuth state");
    }

    if (!provider || !["google", "github"].includes(provider)) {
      throw new ApiError(400, "Unsupported OAuth provider");
    }

    let profileData;

    if (provider === "google") {
      const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${getServerBaseUrl(req)}/api/auth/oauth/google/callback`,
      );

      const { tokens } = await client.getToken(code);

      if (!tokens?.id_token) {
        throw new ApiError(400, "Invalid Google OAuth response");
      }

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload?.email) {
        throw new ApiError(400, "Google account missing email");
      }

      profileData = {
        providerId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified === true,
        profile: {
          username: payload.name || payload.given_name || "",
        },
      };
    } else {
      const redirectUri = `${getServerBaseUrl(req)}/api/auth/oauth/github/callback`;

      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
          state,
        },
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!tokenResponse.data?.access_token) {
        throw new ApiError(400, "GitHub OAuth token exchange failed");
      }

      const accessToken = tokenResponse.data.access_token;

      const [userResponse, emailResponse] = await Promise.all([
        axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }),
        axios.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }),
      ]);

      const emails = Array.isArray(emailResponse.data)
        ? emailResponse.data
        : [];
      const verifiedEmail =
        emails.find((item) => item.verified && item.primary) ||
        emails.find((item) => item.verified);

      if (!verifiedEmail?.email) {
        throw new ApiError(400, "GitHub account email is not verified");
      }

      profileData = {
        providerId: String(userResponse.data?.id),
        email: verifiedEmail.email,
        emailVerified: true,
        profile: {
          username: userResponse.data?.login || "",
        },
      };
    }

    const user = await upsertOAuthUser({
      provider,
      providerId: profileData.providerId,
      email: profileData.email,
      emailVerified: profileData.emailVerified,
      profile: profileData.profile,
    });

    const jwtToken = generateToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    clearOauthCookies(res);

    return res
      .status(200)
      .cookie("jwtToken", jwtToken, cookieOptions)
      .redirect(
        `${redirect}?token=${encodeURIComponent(jwtToken)}&provider=${provider}`,
      );
  } catch (caughtError) {
    clearOauthCookies(res);
    const message =
      caughtError?.message || "OAuth authentication failed. Please try again.";
    return res.redirect(`${redirect}?error=${encodeURIComponent(message)}`);
  }
});

export const oauthStatus = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { ok: true }, "OAuth ready"));
});
