import express from "express";
import fetch from "node-fetch";

console.log(">>> USDA ROUTER LOADED <<<");

const router = express.Router();


function calculateHealthScore({ calories, protein, fat, sugar, fiber }) {
  let score = 50; 

  if (protein != null) {
    score += Math.min(protein * 1.5, 15);
  }

  if (fiber != null) {
    score += Math.min(fiber * 3, 15);
  }

  if (sugar != null) {
    score -= Math.min(sugar * 1.0, 25);
  }

  if (fat != null) {
    score -= Math.min(fat * 0.8, 20);
  }

  if (calories != null && calories > 250) {
    score -= Math.min((calories - 250) / 10, 15);
  }

  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

function extractKeyNutrients(detailData) {
  const nutrients = detailData.foodNutrients || [];

  const get = (num) => {
    const item = nutrients.find(
      (n) => String(n.nutrient.number) === String(num)
    );
    return item ? item.amount : null;
  };

  const calories = get("208"); 
  const protein = get("203");  
  const fat     = get("204");  
  const carbs   = get("205");  
  const sugar   = get("269");  
  const fiber   = get("291");  

  const healthScore = calculateHealthScore({
    calories,
    protein,
    fat,
    sugar,
    fiber,
  });

  return {
    name: detailData.description,
    portion: 100,
    portionUnit: "g",
    calories,
    protein,
    fat,
    carbs,
    sugar,
    fiber,
    healthScore,
  };
}

async function safeFetchJSON(url) {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "NutriTrackApp",
      "Accept": "application/json",
    },
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
      `&pageSize=10` +
      `&dataType=Foundation&dataType=SR%20Legacy`;

    console.log("Search URL:", searchUrl);

    let searchData = await safeFetchJSON(searchUrl);

    if (searchData.htmlError) {
      console.log("HTML error on first try — retrying...");
      searchData = await safeFetchJSON(searchUrl);
    }

    if (!searchData || !searchData.foods || searchData.foods.length === 0) {
      return res.json({ error: "Food not found" });
    }

    const foods = searchData.foods;

    const foundationMatch = foods.find((f) => f.dataType === "Foundation");
    const legacyMatch = foods.find((f) => f.dataType === "SR Legacy");
    const bestMatch = foundationMatch || legacyMatch || foods[0];

    console.log("BEST MATCH:", bestMatch.description);
    console.log("dataType:", bestMatch.dataType);
    console.log("FDC ID:", bestMatch.fdcId);

    const detailUrl =
      `https://api.nal.usda.gov/fdc/v1/food/${bestMatch.fdcId}?api_key=${process.env.USDA_KEY}`;

    let detailData = await safeFetchJSON(detailUrl);

    if (detailData.htmlError || detailData.parseError) {
      return res.status(503).json({
        error: "USDA temporarily unavailable. Try again.",
      });
    }

    const simplified = extractKeyNutrients(detailData);

    return res.json(simplified);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

export default router;
