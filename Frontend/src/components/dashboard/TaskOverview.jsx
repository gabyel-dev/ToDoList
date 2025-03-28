import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./DashboardMenu";

export default function TaskOverview({ activeTab, setActiveTab }) {
  const [task, setTask] = useState(null);
  const { id, user } = useParams();
  const navigate = useNavigate();

  const fetchTask = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/task/${id}`);
      console.log("API Response:", res.data);
      setTask(res.data);
    } catch (error) {
      console.error(
        "Error fetching task:",
        error.response?.data || error.message
      );
    }
  };

  const navToDashboard = () => {
    navigate(`/dashboard/${user}`);
  };

  const navToCompleted = () => {
    navigate(`/dashboard/${user}`);
  };

  // Fetch task when ID changes
  useEffect(() => {
    document.title = `Task - ${id}`;
    fetchTask();
  }, [id]);

  if (!task) {
    return (
      <div className="h-[100vh] w-full flex justify-center text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex p-5">
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Today" && navToDashboard()}
      {activeTab === "Completed" && navToCompleted()}
      {activeTab === "TaskOverview" && (
        <div>
          <h2>Task Overview</h2>
          <p>
            <strong>ID:</strong> {task.id}
          </p>
          <p>
            <strong>Title:</strong> {task.title}
          </p>
          <p>
            <strong>Description:</strong> {task.description || "No description"}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
        </div>
      )}
    </div>
  );
}
