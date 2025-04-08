import express from "express";

const router = express.Router();

let posts = [
  { id: 1, title: "Post 1", content: "Content for post 1" },
  { id: 2, title: "Post 2", content: "Content for post 2" },
  { id: 3, title: "Post 3", content: "Content for post 3" },
  { id: 4, title: "Post 4", content: "Content for post 4" },
  { id: 5, title: "Post 5", content: "Content for post 5" },
];

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit);

  if (!isNaN(limit) && limit > 0) {
    res.json(posts.slice(0, limit));
  } else {
    res.json(posts);
  }
});

router.get("/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.filter((post) => post.id == postId)[0];
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

export default router;
