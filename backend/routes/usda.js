import express from "express";
import fetch from "node-fetch";

console.log(">>> USDA ROUTER LOADED <<<");

const router = express.Router();

function extractKeyNutrients(detailData) {
  const nutrients = detailData.foodNutrients || [];

  const get = (num) => {
    const item = nutrients.find((n) => n.nutrient.number === num);
    return item ? item.amount : null;
  };

  return {
    name: detailData.description,
    calories: get("208"),
    protein: get("203"),
    fat: get("204"),
    carbs: get("205"),
    sugar: get("269"),
    fiber: get("291")
  };
}

async function safeFetchJSON(url) {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "NutriTrackApp",
      "Accept": "application/json"
    }
  });

  const text = await resp.text();

  if (text.startsWith("<")) {
    return { htmlError: true, text };
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return { parseError: true, raw: text };
  }
}

router.get("/", async (req, res) => {
  console.log(">>> USDA ROUTE HIT <<<");

  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const searchUrl =
      `https://api.nal.usda.gov/fdc/v1/foods/search?` +
      `api_key=${process.env.USDA_KEY}` +
      `&query=${encodeURIComponent(query)}` +
      `&pageSize=10`;

    console.log("Search URL:", searchUrl);

    let searchData = await safeFetchJSON(searchUrl);

    if (searchData.htmlError) {
      console.log("HTML error on first try — retrying...");
      searchData = await safeFetchJSON(searchUrl);
    }

    if (!searchData || !searchData.foods || searchData.foods.length === 0) {
      return res.json({ error: "Food not found" });
    }

    const bestMatch = searchData.foods[0];

    console.log("BEST MATCH:", bestMatch.description);
    console.log("FDC ID:", bestMatch.fdcId);

    const detailUrl =
      `https://api.nal.usda.gov/fdc/v1/food/${bestMatch.fdcId}?api_key=${process.env.USDA_KEY}`;

    let detailData = await safeFetchJSON(detailUrl);

    if (detailData.htmlError || detailData.parseError) {
      return res.status(503).json({
        error: "USDA temporarily unavailable. Try again."
      });
    }

    const simplified = extractKeyNutrients(detailData);

    return res.json(simplified);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

export default router;