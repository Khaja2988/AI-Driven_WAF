import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ThreatAnalyzer from "./components/ThreatAnalyzer";
import LoginMonitor from "./components/LoginMonitor";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter basename="/AI-Driven_WAF/">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyzer" element={<ThreatAnalyzer />} />
        <Route path="/login-monitor" element={<LoginMonitor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
