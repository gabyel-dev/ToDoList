import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function TaskToday() {
  const { user } = useParams();

  const [taskCount, setTaskCount] = useState(0);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const getTaskLength = async () => {
    const res = await axios.get("http://localhost:5000/get_all");
  };

  // Handle task input changes
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get_all/${user}`);
      setTasks(res.data);
      setTaskCount(res.data.length);
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
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTaskData({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      setError("Failed to add task.");
    }
  };

  // Fetch user & tasks on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        fetchTasks();
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user.");
      }
    };
    fetchData();
  }, [user]);

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold">Incomplete Tasks {taskCount}</h1>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleTaskChange}
            placeholder="Task Title"
          />
          <input
            type="text"
            name="description"
            value={taskData.description}
            onChange={handleTaskChange}
            placeholder="Task Description"
          />
          <button type="submit">Add</button>
        </form>
        {/* Display tasks */}
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="flex gap-3">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))
        ) : (
          <p>No tasks yet.</p>
        )}
      </div>
    </>
  );
}
