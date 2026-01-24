import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return (
        !this?.oauthProviders?.google?.id && !this?.oauthProviders?.github?.id
      );
    },
  },
  oauthProviders: {
    google: {
      id: { type: String, default: "" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      verified: { type: Boolean, default: false },
    },
    github: {
      id: { type: String, default: "" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      verified: { type: Boolean, default: false },
      username: { type: String, trim: true, default: "" },
    },
  },
  // Profile fields
  address: {
    type: String,
    trim: true,
    default: "",
  },
  city: {
    type: String,
    trim: true,
    default: "",
  },
  state: {
    type: String,
    trim: true,
    default: "",
  },
  country: {
    type: String,
    trim: true,
    default: "",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  // Coding platform links
  github: {
    type: String,
    trim: true,
    default: "",
  },
  leetcode: {
    type: String,
    trim: true,
    default: "",
  },
  codeforces: {
    type: String,
    trim: true,
    default: "",
  },
  codechef: {
    type: String,
    trim: true,
    default: "",
  },
  otherPlatforms: [
    {
      name: { type: String, trim: true },
      url: { type: String, trim: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  if (!this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
