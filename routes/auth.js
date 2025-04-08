import express from "express";
const router = express.Router();
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  try {
    var getUserByEmail = await User.findOne({ email: email }); // Fetch user by email from the "users" collection
    if (getUserByEmail) {
      const isMatch = await getUserByEmail.comparePassword(password); // Compare the provided password with the stored hashed password
      if (isMatch) {
        const token = jwt.sign(
          {
            id: getUserByEmail._id,
            name: getUserByEmail.name,
            email: getUserByEmail.email,
            role: getUserByEmail.role,
          },
          JWT_SECRET,
          {
            expiresIn: "1h", // Token expiration time
          }
        );
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

export default router;
