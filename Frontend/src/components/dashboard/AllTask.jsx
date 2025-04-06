import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AllTask({ setActiveTab }) {
  const { user } = useParams();
  const navigate = useNavigate(); // ✅ Get navigate function
  const [taskCount, setTaskCount] = useState(0);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [submitting, isSubmitting] = useState(false);

  const deleteTask = async (taskId) => {
    if (!taskId) {
      console.error("Task ID is undefined");
      return;
    }

    try {
      if (submitting) return;
      isSubmitting(true);

      await axios.delete(`http://localhost:5000/delete/${taskId}`, {
        withCredentials: true,
      });

      // Update the task list after deletion
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setTaskCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      isSubmitting(false);
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

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get_all/${user}`);
      setTasks(res.data);
      setTaskCount(res.data.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const taskToShow = filtering ? filtered : tasks;

  return (
    <div className="flex flex-col">
      {/* Task Content */}
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        All Tasks ({taskCount})
      </h1>
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

        {error && <p className="text-red-500">{error}</p>}

        {/* Task List */}
        <div className="space-y-2 overflow-y-scroll scroll-smooth min-h-[19vh] max-h-[53vh]">
          {taskToShow.length > 0 ? (
            taskToShow.map((task) => (
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

                {/* ✅ Navigate to TaskOverview when clicked */}
                <div>
                  <button
                    onClick={() => {
                      setActiveTab("Taskoverview"); // Call activeTab function
                      navigate(`/dashboard/${user}/task/${task.id}`); // Navigate to the new route
                    }}
                    className="hover:bg-gray-200 p-2 rounded-full"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  <button
                    disabled={submitting}
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-gray-200 p-2 rounded-full"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
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
