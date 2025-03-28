import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function TaskToday({ setActiveTab }) {
  const { user } = useParams();
  const [taskCount, setTaskCount] = useState(0);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({ title: "", description: "" });

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get_all/${user}`);
      const fetchTask = res.data.filter((task) => task.status !== "Complete");
      setTasks(fetchTask);
      setTaskCount(fetchTask.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks.");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/create_task", taskData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setTaskData({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      setError("Failed to add task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return (
    <div className="flex">
      {/* Task Content */}
      <div className="w-full mx-auto h-[94vh] p-4 bg-white shadow rounded-lg flex-1">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Incomplete Tasks ({taskCount})
        </h1>
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
            className="p-2 border rounded-lg text-sm"
          />
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleTaskChange}
            placeholder="Task Description"
            required
            className="p-2 border rounded-lg h-20 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-2 overflow-y-scroll scroll-smooth min-h-[19vh] max-h-[53vh]">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                key={index}
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
                <button onClick={() => setActiveTab("TaskOverview")}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm">No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
