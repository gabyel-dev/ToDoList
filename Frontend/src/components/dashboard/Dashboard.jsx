import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Menu from "./DashboardMenu";
import TaskToday from "./TaskToday";
import CompleteTask from "./TaskCompleted";
import axios from "axios";

export default function Dashboard({ activeTab, setActiveTab }) {
  const { user } = useParams();
  const navigate = useNavigate();

  //check user session
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => {
        navigate(res.data.logged_in ? `/dashboard/${res.data.user}` : "/");
      });
  }, [user, navigate]);

  return (
    <div className="flex p-5">
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 px-7">
        {activeTab === "Today" && <TaskToday />}
        {activeTab === "Completed" && <CompleteTask />}
      </div>
    </div>
  );
}
