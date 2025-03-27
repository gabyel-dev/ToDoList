import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./DashboardMenu";

export default function Dashboard({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  //check user session
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => {
        navigate(res.data.logged_in ? "/dashboard" : "/");
      });
  }, []);

  return (
    <div className="flex p-5">
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        {activeTab === "Today" && (
          <h2 className="text-2xl">📅 Today's Tasks</h2>
        )}
        {activeTab === "Completed" && (
          <h2 className="text-2xl">✅ Completed Tasks</h2>
        )}
      </div>
    </div>
  );
}
