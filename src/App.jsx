import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SciFiStories from "./comps/SciFiStories";
import StoryDetails from "./comps/StoryDetails";

function App() {
  return (
    // ✅ The content will now inherit the Router from main.jsx
    <Routes>
      <Route path="/" element={<SciFiStories />} />
      <Route path="/story-details/:storyId" element={<StoryDetails />} />
    </Routes>
  );
}

export default App;
