import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    accessToken: { type: String },
    accessTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      this.password = await bcrypt.hash(this.password, 12);
      next();
    } catch (err) {
      console.error(`Error hashing password: ${err}`);
      next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    console.error(`Error comparing password: ${err}`);
    throw err;
  }
};

userSchema.methods.generateAccessToken = async function () {
  try {
    const accessToken = await bcrypt.hash(this.password, 6);
    this.accessToken = accessToken;
    this.accessTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    return this;
  } catch (err) {
    console.error(`Error generating access token: ${err}`);
    throw err;
  }
};

const User = mongoose.model("User", userSchema, "users");

export default User;
