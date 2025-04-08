import express from "express";
const router = express.Router();

import User from "../models/userSchema.js";

router.get("/getusers", async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users from the "users" collection
    console.log("Fetched users:", users.length); // Log the fetched users for debugging
    if (!users.length) {
      return res.status(404).json({ message: "No users found" }); // Handle case when no users are found
    }
    res.json(users); // Send back the users in the response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getuser/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters
  try {
    const user = await User.findById(userId); // Fetch the user by ID from the "users" collection
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle case when user is not found
    }
    res.json(user); // Send back the user in the response
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verifyuserbyemailandpassword", async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from t

  console.log("Email:", email); // Log the email for debugging
  console.log("Password:", password);
  try {
    var getUserByEmail = await User.findOne({ email: email }); // Fetch user by email from the "users" collection
    if (getUserByEmail) {
      console.log("User found:", getUserByEmail); // Log the found user for debugging

      const isMatch = await getUserByEmail.comparePassword(password); // Compare the provided password with the stored hashed password
      console.log("Password match:", isMatch); // Log the password match result for debugging
      if (isMatch) {
        res.json(getUserByEmail); // If password matches, send back the user in the response
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

export default router;
