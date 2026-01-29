import axios from "axios";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import NodeCache from "node-cache";
import * as cheerio from "cheerio";

const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// --- GitHub ---
export async function getGithubStats(req, res, next) {
  const { username } = req.params;
  if (!username) return next(new ApiError(400, "Username required"));
  const cacheKey = `github:${username}`;
  if (cache.has(cacheKey))
    return res.json(new ApiResponse(200, cache.get(cacheKey)));
  try {
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const eventsRes = await axios.get(
      `https://api.github.com/users/${username}/events/public`,
    );
    const data = {
      public_repos: userRes.data.public_repos,
      followers: userRes.data.followers,
      recent_activity: eventsRes.data.slice(0, 5).map((e) => ({
        repo: e.repo?.name,
        type: e.type,
        date: e.created_at,
      })),
    };
    cache.set(cacheKey, data);
    res.json(new ApiResponse(200, data));
  } catch (err) {
    if (err.response && err.response.status === 404)
      return next(new ApiError(404, "GitHub user not found"));
    next(new ApiError(500, "GitHub API error"));
  }
}

// --- Codeforces ---
export async function getCodeforcesStats(req, res, next) {
  const { username } = req.params;
  if (!username) return next(new ApiError(400, "Username required"));
  const cacheKey = `codeforces:${username}`;
  if (cache.has(cacheKey))
    return res.json(new ApiResponse(200, cache.get(cacheKey)));
  try {
    const userRes = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`,
    );
    const statusRes = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`,
    );
    const solved = new Set();
    statusRes.data.result.forEach((sub) => {
      if (sub.verdict === "OK")
        solved.add(sub.problem.contestId + "-" + sub.problem.index);
    });
    const user = userRes.data.result[0];
    const data = {
      problems_solved: solved.size,
      current_rating: user.rating || null,
      max_rating: user.maxRating || null,
      rank: user.rank || null,
    };
    cache.set(cacheKey, data);
    res.json(new ApiResponse(200, data));
  } catch (err) {
    if (err.response && err.response.status === 400)
      return next(new ApiError(404, "Codeforces user not found"));
    next(new ApiError(500, "Codeforces API error"));
  }
}

// --- CodeChef ---
export async function getCodechefStats(req, res, next) {
  const { username } = req.params;
  if (!username) return next(new ApiError(400, "Username required"));
  const cacheKey = `codechef:${username}`;
  if (cache.has(cacheKey))
    return res.json(new ApiResponse(200, cache.get(cacheKey)));
  try {
    const url = `https://www.codechef.com/users/${username}`;
    const resp = await axios.get(url);
    const $ = cheerio.load(resp.data);
    const rating = $(".rating-number").first().text().trim();
    const stars = $(".rating-star").first().text().trim().length;
    let problems = 0;
    $("section.problems-solved h5").each((i, el) => {
      const txt = $(el).text();
      const match = txt.match(/\d+/);
      if (match) problems += parseInt(match[0]);
    });
    const data = {
      problems_solved: problems,
      current_rating: rating ? parseInt(rating) : null,
      stars: stars || null,
    };
    cache.set(cacheKey, data);
    res.json(new ApiResponse(200, data));
  } catch (err) {
    if (err.response && err.response.status === 404)
      return next(new ApiError(404, "CodeChef user not found"));
    next(new ApiError(500, "CodeChef scraping error"));
  }
}
