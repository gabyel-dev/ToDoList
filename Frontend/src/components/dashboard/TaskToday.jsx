import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TaskToday({ setActiveTab }) {
  const { user } = useParams();
  const navigate = useNavigate();

  const [taskCount, setTaskCount] = useState(0);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    prio: "",
  });
  const [filtering, setFiltering] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const deleteTask = async (taskId) => {
    if (!taskId) return;

    try {
      await axios.delete(`http://localhost:5000/delete/${taskId}`, {
        withCredentials: true,
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setTaskCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get_all/${user}`);
      const fetchTask = res.data.filter((task) => task.status !== "Complete");
      setTasks(fetchTask);
      setTaskCount(fetchTask.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChange = (e) => {
    const selectedPriority = e.target.value;

    if (selectedPriority) {
      setFiltering(true);
      const filteredHigh = tasks.filter(
        (task) => task.priority === selectedPriority
      );
      setFiltered(filteredHigh);
    } else {
      setFiltering(false);
      setFiltered([]);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/create_task", taskData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setTaskData({ title: "", description: "", prio: "" });
      fetchTasks();
    } catch (error) {
      setError("Failed to add task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const tasksToShow = filtering ? filtered : tasks;

  return (
    <div className="flex flex-col h-[94vh]">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Incomplete Tasks ({taskCount})
      </h1>

      <div className="w-full mx-auto flex-1 p-4 bg-white shadow rounded-lg overflow-hidden flex flex-col">
        {error && <p className="text-red-500">{error}</p>}

        {/* Task Form */}
        <form onSubmit={handleAddTask} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleTaskChange}
            placeholder="Task Title"
            required
            className="p-2 border rounded-lg text-sm outline-0"
          />
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleTaskChange}
            placeholder="Task Description"
            required
            className="p-2 border rounded-lg h-20 text-sm outline-0"
          />
          <div className="flex gap-5 justify-start items-center">
            <div className="flex gap-3">
              <label htmlFor="high">High</label>
              <input
                name="prio"
                type="radio"
                value="High"
                checked={taskData.prio === "High"}
                onChange={handleTaskChange}
                required
              />
            </div>
            <div className="flex gap-3">
              <label htmlFor="med">Medium</label>
              <input
                name="prio"
                type="radio"
                value="Medium"
                checked={taskData.prio === "Medium"}
                onChange={handleTaskChange}
                required
              />
            </div>
            <div className="flex gap-3">
              <label htmlFor="low">Low</label>
              <input
                name="prio"
                type="radio"
                value="Low"
                checked={taskData.prio === "Low"}
                onChange={handleTaskChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#38383A] text-white py-2 rounded-lg text-sm hover:bg-[#272728]"
          >
            Add Task
          </button>
        </form>

        {/* Filter */}
        <div className="w-full mt-4">
          <label className="mr-2 font-medium">Filter by Priority:</label>
          <select
            name="priority"
            onChange={handleChange}
            defaultValue=""
            className="border p-1 rounded text-sm"
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-2 overflow-y-scroll scroll-smooth min-h-[19vh] max-h-[53vh] mt-2">
          {tasksToShow.length > 0 ? (
            tasksToShow.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm w-[68vw]"
              >
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-xs break-all pr-5">
                    {task.description}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setActiveTab("Taskoverview");
                      navigate(`/dashboard/${user}/task/${task.id}`);
                    }}
                    className="hover:bg-gray-200 p-2 rounded-full"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-gray-200 p-2 rounded-full"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm">
              {filtering
                ? "No tasks found for this priority."
                : "No tasks yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
