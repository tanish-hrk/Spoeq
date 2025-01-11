import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LandingPage from "./components/LandingPage";
import FitnessCate from "./components/CategoryPage/FitnessCate";
import RunningCategory from "./components/CategoryPage/RunningCate";
import TeamSportCategory from "./components/CategoryPage/TeamSportCate";
import TrainingCate from "./components/CategoryPage/TrainingCate";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/fitnessCate" element={<FitnessCate />} />
          <Route path="/runningCate" element={<RunningCategory />} />
          <Route path="/teamSportsCate" element={<TeamSportCategory />} />
          <Route path="/trainingCate" element={<TrainingCate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
