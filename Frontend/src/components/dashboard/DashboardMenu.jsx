import {
  faListCheck,
  faListUl,
  faRightFromBracket,
  faSearch,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const settings = <FontAwesomeIcon icon={faSliders} className="text-gray-600" />;
const logout = (
  <FontAwesomeIcon icon={faRightFromBracket} className="text-gray-600" />
);
const search = <FontAwesomeIcon icon={faSearch} className="text-gray-500" />;
const today = <FontAwesomeIcon icon={faListUl} className="text-gray-600" />;
const completed = (
  <FontAwesomeIcon icon={faListCheck} className="text-gray-600" />
);

export default function Menu({ activeTab, setActiveTab }) {
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
  return (
    <div className="flex flex-col w-64 h-[94vh] bg-gray-100 rounded-xl p-4 text-[#38383A] shadow-md">
      <h1 className="text-xl font-bold pb-5">Menu</h1>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-md px-3 py-2 shadow-sm w-full">
            {search}
            <input
              type="text"
              placeholder="Search"
              className="outline-none ml-2 w-full text-sm bg-transparent"
            />
          </div>

          {/* Tasks Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 pt-2">TASKS</p>
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "Today" ? "bg-gray-300" : "hover:bg-gray-200"
              }  transition p-2 rounded-md`}
              onClick={() => setActiveTab("Today")}
            >
              {today}
              <p className="text-sm">Today</p>
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "Completed" ? "bg-gray-300" : "hover:bg-gray-200"
              }  transition p-2 rounded-md`}
              onClick={() => setActiveTab("Completed")}
            >
              {completed}
              <p className="text-sm">Completed</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-0 pt-3">
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              activeTab === "settings" ? "bg-gray-300" : "hover:bg-gray-200"
            } transition p-2 rounded-md`}
            onClick={() => setActiveTab("settings")}
          >
            {settings}
            <p className="text-sm">Settings</p>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              activeTab === "logout" ? "bg-gray-300" : "hover:bg-gray-200"
            } transition p-2 rounded-md`}
            onClick={handleLogout}
          >
            {logout}
            <p className="text-sm">Sign out</p>
          </div>
        </div>
      </div>
    </div>
  );
}
