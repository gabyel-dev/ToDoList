import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./DashboardMenu";

export default function TaskOverview({ activeTab, setActiveTab }) {
  const [task, setTask] = useState(null);
  const [taskDate, setTaskDate] = useState("");
  const { id, user } = useParams();
  const navigate = useNavigate();

  const nav = () => {
    navigate(`/dashboard/${user}`);
  };

  useEffect(() => {
    document.title = `Task - ${id}`;
    fetchTask();
  }, [id]);

  useEffect(() => {
    if (activeTab === "Today" || activeTab === "Completed") {
      navigate(`/dashboard/${user}`);
    }
  }, [activeTab, navigate, user]);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/task/${id}`);
      setTask(res.data);
      const formatedDate = res.data.created_at;
      const extractedDate = formatedDate.split(" ").slice(0, 4).join(" ");
      setTaskDate(extractedDate);
    } catch (error) {
      console.error(
        "Error fetching task:",
        error.response?.data || error.message
      );
    }
  };

  if (!task) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-500 text-lg">
        <span className="animate-pulse">Loading Task...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white p-5">
      {/* Sidebar Menu */}
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Completed" && nav()}
      {activeTab === "TaskOverview" && nav()}
      {/* Main Content */}
      <div className="flex-grow px-5">
        <h1 className="text-2xl font-bold text-gray-800">Task Overview</h1>
        <div className="mt-6 space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Title:</span>{" "}
            {task.title}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Description:</span>{" "}
            {task.description || "No description"}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Status:</span>
            <span
              className={`ml-2 px-3 py-1 text-sm rounded-lg text-white ${
                task.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {task.status}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Date:</span>{" "}
            {taskDate}
          </p>
        </div>
        {/* Navigation Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => {
              setActiveTab("Today");
              navigate(`/dashboard/${user}`);
            }}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to Dashboard
          </button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
}
