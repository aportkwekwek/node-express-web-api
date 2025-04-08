import express from "express";
import path from "path";
import posts from "./routes/posts.js";
import users from "./routes/users.js";
import authentication from "./routes/auth.js";
import bodyparser from "body-parser";

const app = express();

import mongoose from "mongoose";

const mongouser = process.env.MONGO_USER;
const mongopass = process.env.MONGO_PASS;
const mongoserver = process.env.MONGO_SERVER;
const mongodb = process.env.MONGO_DB;
const mongocluster = process.env.MONGO_CLUSTER;

mongoose
  .connect(
    `mongodb+srv://${mongouser}:${mongopass}@${mongoserver}/${mongodb}?retryWrites=true&w=majority&appName=${mongocluster}`,
    {}
  )
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(bodyparser.json());
//Static folder
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/auth", authentication);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
