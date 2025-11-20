import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  
  fetch("/api/test-get")
  .then(response => response.json())
  .then(json => console.log(json));

  return (
    <div className="container">

      <h1 className="title">NutriTrack — Food Info & Health Checker</h1>

      <div className="search-bar">
        <input 
          className="input"
          type="text"
          placeholder="Search for food (e.g. banana, ramen)"
        />
        <button className="button">Search</button>
      </div>

      <div className="card">
        <h2 className="section-title">Food Information</h2>
        <p className="placeholder">
          Food info will appear here once connected to API.
        </p>
      </div>

      <div className="card">
        <h2 className="section-title">Nutrition Facts</h2>
        <ul className="list">
          <li>Calories: —</li>
          <li>Sugar: —</li>
          <li>Fat: —</li>
          <li>Protein: —</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="section-title">Health Grade</h2>
        
        <div className="health-bar-bg">
          <div 
            className="health-bar-fill"
            style={{ width: "0%" }}
          ></div>
        </div>

        <p className="placeholder">Grade will appear waiting on API data.</p>
      </div>

    </div>
  );
}

export default App
