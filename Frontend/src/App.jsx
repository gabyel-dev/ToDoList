import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import Dashboard from "./components/dashboard/Dashboard";
import ResetPass from "./components/authentication/ResetPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("Today");

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/:user"
            element={
              <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
            }
          />
          <Route path="/reset-password" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
