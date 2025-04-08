import express from "express";
const router = express.Router();
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/authentication.js";
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

router.post("/adduser", async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure name, email, and password from the request body
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" }); // Handle case when required fields are missing
  }
  try {
    const newUser = new User({ name, email, password, role }); // Create a new user instance
    await newUser.save(); // Save the new user to the database
    res.status(201).json(newUser); // Send back the created user in the response
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/deleteuser",
  authMiddleware,
  authorizeRole("admin"),
  async (req, res) => {
    const { id } = req.body; // Destructure id from the request body
    if (!id) {
      return res.status(400).json({ message: "User not found" }); // Handle case when id is missing
    }
    try {
      const deletedUser = await User.findByIdAndDelete(id); // Delete the user by ID from the "users" collection
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" }); // Handle case when user is not found
      }
      res.json(deletedUser); // Send back the deleted user in the response
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
