// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // NEW OPTIONAL FIELDS (won’t break your login)
    name: { type: String, default: "" },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // avoids duplicate-null errors
    },

    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },

    avatar: { type: String, default: "" }, // stored URL/base64

    // role: default to "user" so old docs are still fine (non-breaking)
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
