import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./DashboardMenu";
import { text } from "@fortawesome/fontawesome-svg-core";

export default function TaskOverview({ activeTab, setActiveTab }) {
  const [task, setTask] = useState(null);
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [canEdit, setCanEdit] = useState(false);
  const [taskDate, setTaskDate] = useState("");
  const { id, user } = useParams();
  const navigate = useNavigate();

  const nav = () => {
    navigate(`/dashboard/${user}`);
  };

  const edit = () => {
    if (!canEdit) {
      setEditTask({
        title: task.title,
        description: task.description,
        status: task.status,
      });
    }
    setCanEdit(!canEdit);
  };

  const cancel = () => {
    setEditTask({
      title: task.title,
      description: task.description,
      status: task.status,
    });

    setCanEdit(!canEdit);
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEditTask((task) => ({ ...task, [name]: value }));
  };

  const updateTask = async () => {
    await axios.post(`http://localhost:5000/update/${id}`, editTask, {
      withCredentials: true,
    });
    setEditTask({ title: "", description: "", status: "" });
    setCanEdit(false);
    fetchTask();
  };

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
      {activeTab === "All" && nav()}
      {activeTab === "Completed" && nav()}
      {activeTab === "TaskOverview" && nav()}
      {/* Main Content */}
      <div className="flex-grow px-5">
        <h1 className="text-2xl font-bold text-gray-800">Task Overview</h1>
        <div className="mt-6 space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Title:</span>{" "}
            <input
              type="text"
              name="title"
              disabled={!canEdit}
              value={canEdit ? editTask.title : task?.title}
              onChange={handleChange}
              defaultValue={task.title}
              className={
                canEdit ? `border-b-1 border-b-gray-500` : "border-none"
              }
            />
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Description:</span>{" "}
            <input
              type="text"
              name="description"
              disabled={!canEdit}
              value={canEdit ? editTask.description : task?.description}
              onChange={handleChange}
              className={
                canEdit ? `border-b-1 border-b-gray-500` : "border-none"
              }
            />
          </p>
          <div>
            <p className="text-lg">
              <span className="font-semibold text-gray-700">Status:</span>
              {canEdit ? (
                <div className="ml-2 flex items-center gap-3">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="status"
                      value="Incomplete"
                      checked={editTask.status === "Incomplete"}
                      onChange={handleChange}
                    />
                    <span>Incomplete</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="status"
                      value="Complete"
                      checked={editTask.status === "Complete"}
                      onChange={handleChange}
                    />
                    <span>Completed</span>
                  </label>
                </div>
              ) : (
                <span
                  className={`ml-2 px-3 py-1 text-sm rounded-lg text-white ${
                    task.status === "Complete" ? "bg-gray-300" : "bg-gray-500"
                  }`}
                >
                  {task.status}
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700">Date Posted:</span>
              {taskDate}
            </div>
          </div>
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
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={canEdit ? updateTask : edit}
          >
            {canEdit ? "Save" : "Edit Task"}
          </button>
          <button
            className={`${
              canEdit ? "block" : "hidden"
            } bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition`}
            onClick={canEdit && cancel}
          >
            {canEdit && "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
