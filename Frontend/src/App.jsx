import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import Dashboard from "./components/dashboard/Dashboard";
import ResetPass from "./components/authentication/ResetPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import TaskOverview from "./components/dashboard/TaskOverview";

function App() {
  const [activeTab, setActiveTab] = useState("Today");

  return (
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

        {/* ✅ Corrected Route for TaskOverview */}
        <Route
          path="/dashboard/:user/task/:id"
          element={
            <TaskOverview activeTab={activeTab} setActiveTab={setActiveTab} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
