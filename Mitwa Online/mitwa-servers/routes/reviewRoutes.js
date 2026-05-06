import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

router.post("/", async (req, res) => {
  const review = await Review.create(req.body);
  res.json(review);
});

export default router;
