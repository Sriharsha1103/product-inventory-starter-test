const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    // ❗ Edge case: missing query
    if (!query) {
      return res.status(400).json({ error: "Query parameter required" });
    }

    // ✅ Case-insensitive + partial match
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    return res.status(200).json(products);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

