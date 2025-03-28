import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function CompleteTask({ setActiveTab }) {
  const { user } = useParams();
  const [tasks, setTasks] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  const fetchTask = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get_all/${user}`);
      const filterComplete = res.data.filter(
        (task) => task.status !== "Incomplete"
      );
      setTasks(filterComplete);
      setCount(filterComplete.length);
    } catch (error) {
      setError("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [user]);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Completed Tasks ({count})
      </h1>
      <div className="w-full mx-auto h-[94vh] p-4 bg-white shadow rounded-lg flex-1">
        {error && <p className="text-red-500">{error}</p>}

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
            <p className="text-gray-500 text-center text-sm">
              No completed tasks yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
