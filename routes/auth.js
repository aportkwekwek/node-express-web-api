import express from "express";
const router = express.Router();
import User from "../models/userSchema.js";

import generateToken from "../utils/generateToken.js"; // Import the generateToken function

router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  try {
    var getUserByEmail = await User.findOne({ email: email }); // Fetch user by email from the "users" collection
    if (getUserByEmail) {
      const isMatch = await getUserByEmail.comparePassword(password); // Compare the provided password with the stored hashed password
      if (isMatch) {
        //Generate Token
        const token = generateToken(getUserByEmail); // Generate JWT token using the generateToken function

        const accessToken = await getUserByEmail.generateAccessToken(); // Generate access token for the user
        await getUserByEmail.save(); // Save the updated user with the new access token

        res.json({
          jwtToken: token,
          accessToken: accessToken.accessToken,
        }); // If password matches, send back the user in the response
      } else {
        res.status(401).json({ message: "Invalid username or password" }); // Handle case when password does not match
      }
    } else {
      res.status(401).json({ message: "Invalid username or password" }); // Handle case when user is not found
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/refreshToken", async (req, res) => {
  const { accessToken } = req.body; // Destructure refreshToken from the request body

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Fetch user by refresh token from the "users" collection
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" }); // Handle case when refresh token is invalid
    }

    if (user.accessTokenExpiry < Date.now()) {
      return res.status(401).json({ message: "Refresh token expired" }); // Handle case when refresh token is expired
    }
    const token = generateToken(user); // Generate JWT token using the generateToken function

    const newAccessToken = await user.generateAccessToken(); // Generate access token for the user
    await user.save(); // Save the updated user with the new access token

    res.json({
      jwtToken: token,
      accessToken: newAccessToken.accessToken,
    }); // If password matches, send back the user in the response

    res.status(200).json({ user }); // Send back the user in the response
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
