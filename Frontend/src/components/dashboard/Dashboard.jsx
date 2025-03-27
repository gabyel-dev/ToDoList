import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/logout",
      {},
      {
        withCredentials: true,
      }
    );
    navigate("/");
  };

  //check user session
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => {
        navigate(res.data.logged_in ? "/dashboard" : "/");
      });
  }, []);

  return (
    <div>
      <button onClick={handleLogout} className="bg-gray-500 text-white">
        Logout
      </button>
    </div>
  );
}
