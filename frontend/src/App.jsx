import { useState } from 'react'
import './App.css'


function getHealthLabel(score) {
  if (score == null) return "Not enough data to rate this food.";
  if (score >= 80) return "Very healthy choice 😊";
  if (score >= 60) return "Generally healthy 😊";
  if (score >= 40) return "Okay in moderation 🙄";
  return "Occasional treat 🍰";
}

function App() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    setError("");
    setData(null);

    if (!query.trim()) {
      setError("Please enter a food name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/usda?q=${encodeURIComponent(query)}`);

      if (!res.ok) {
        setError("Server error — try again.");
        setLoading(false);
        return;
      }

      const json = await res.json();

      if (json.error) {
        setError("Food not found.");
        setLoading(false);
        return;
      }

      setData(json);
    } catch (err) {
      setError("Network error.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">NutriTrack — Food Info & Health Checker</h1>

      <div className="search-bar">
        <input
          className="input"
          type="text"
          placeholder="Search for food (e.g. banana, ramen)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="button" onClick={searchFood}>Search</button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!data && !loading && !error && (
        <p className="placeholder">Search for a food item to see its info.</p>
      )}

      {data && (
        <div className="card">
          <h2>{data.name}</h2>
          <ul className="list">
            <li><strong>Portion:</strong> {data.portion} {data.portionUnit}</li>
            <li><strong>Calories:</strong> {data.calories}</li>
            <li><strong>Protein:</strong> {data.protein} g</li>
            <li><strong>Fat:</strong> {data.fat} g</li>
            <li><strong>Carbs:</strong> {data.carbs} g</li>
            <li><strong>Sugar:</strong> {data.sugar} g</li>
            <li><strong>Fiber:</strong> {data.fiber} g</li>
          </ul>

          {/* Health score section */}
          {data.healthScore != null && (
            <>
              <div className="section-title" style={{ marginTop: "16px" }}> Health Score</div>
              <div className="health-bar-bg">
                <div className="health-bar-fill" style={{ width: `${data.healthScore}%` }}/>
              </div>
              <p className="placeholder" style={{ marginTop: "8px" }}>
                {getHealthLabel(data.healthScore)} (Score: {data.healthScore}/100)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
