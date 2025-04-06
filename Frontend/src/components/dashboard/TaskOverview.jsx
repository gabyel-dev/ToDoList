import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./DashboardMenu";

export default function TaskOverview({ activeTab, setActiveTab }) {
  const [task, setTask] = useState(null);
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    status: "",
    prio: "",
  });
  const [canEdit, setCanEdit] = useState(false);
  const [taskDate, setTaskDate] = useState("");
  const { id, user } = useParams();
  const navigate = useNavigate();
  const [submitting, isSubmitting] = useState(false);

  const nav = () => {
    navigate(`/dashboard/${user}`);
  };

  const edit = () => {
    if (!canEdit) {
      setEditTask({
        title: task.title,
        description: task.description,
        status: task.status,
        prio: task.priority,
      });
    }
    setCanEdit(!canEdit);
  };

  const cancel = () => {
    setEditTask({
      title: task.title,
      description: task.description,
      status: task.status,
      prio: task.priority,
    });
    setCanEdit(false);
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
    const { name, value } = e.target;
    setEditTask((prev) => ({ ...prev, [name]: value }));
  };

  const updateTask = async () => {
    try {
      if (submitting) return;
      isSubmitting(true);
      await axios.post(`http://localhost:5000/update/${id}`, editTask, {
        withCredentials: true,
      });
      setEditTask({ title: "", description: "", status: "", prio: "" });
      setCanEdit(false);
      fetchTask();
    } catch {
      console.error("Failed to update task");
    } finally {
      isSubmitting(false);
    }
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
              value={canEdit ? editTask.title : task.title}
              onChange={handleChange}
              className={
                canEdit
                  ? "border-b-2 border-gray-400 outline-none"
                  : "border-none bg-transparent"
              }
            />
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Description:</span>{" "}
            <input
              type="text"
              name="description"
              disabled={!canEdit}
              value={canEdit ? editTask.description : task.description}
              onChange={handleChange}
              className={
                canEdit
                  ? "border-b-2 border-gray-400 outline-none"
                  : "border-none bg-transparent"
              }
            />
          </p>

          {/* Status and Priority */}
          <div>
            <p className="text-lg font-semibold text-gray-700">Status:</p>
            {canEdit ? (
              <div className="ml-2 flex flex-col gap-4 mt-2">
                {/* Status */}
                <div className="flex items-center gap-3">
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

                {/* Priority */}
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="prio"
                      value="High"
                      checked={editTask.prio === "High"}
                      onChange={handleChange}
                    />
                    <span>High</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="prio"
                      value="Medium"
                      checked={editTask.prio === "Medium"}
                      onChange={handleChange}
                    />
                    <span>Medium</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="prio"
                      value="Low"
                      checked={editTask.prio === "Low"}
                      onChange={handleChange}
                    />
                    <span>Low</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="ml-2 flex flex-col gap-2">
                <span
                  className={`px-3 py-1 text-sm rounded-lg text-white w-max ${
                    task.status === "Complete" ? "bg-gray-300" : "bg-gray-500"
                  }`}
                >
                  {task.status}
                </span>
                <span className="text-lg font-semibold text-gray-600">
                  Priority: <strong>{task.priority}</strong>
                </span>
              </div>
            )}
            <div className="flex gap-2 mt-4">
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
            disabled={submitting}
            onClick={canEdit ? updateTask : edit}
          >
            {canEdit ? "Save" : "Edit Task"}
          </button>
          {canEdit && (
            <button
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={cancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
