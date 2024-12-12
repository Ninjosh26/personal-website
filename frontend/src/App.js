import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, ActivityChoices } from "./pages";
import { Navbar } from "./components";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="activities" element={<ActivityChoices />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
