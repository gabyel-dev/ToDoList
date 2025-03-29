import { useState } from "react";
import {
  faBars,
  faFilter,
  faListCheck,
  faListUl,
  faRightFromBracket,
  faSearch,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Menu({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div
      className={`flex flex-col ${
        isCollapsed ? "w-18" : "w-64"
      } h-[94vh] bg-gray-100 rounded-xl p-4 text-[#38383A] shadow-md transition-all duration-300`}
    >
      <div className="flex justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold pb-5">Menu</h1>}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 p-2 text-gray-600 hover:bg-gray-200 rounded-md flex justify-center items-center"
        >
          {isCollapsed ? (
            <FontAwesomeIcon icon={faBars} />
          ) : (
            <FontAwesomeIcon icon={faXmark} />
          )}
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div
            className={`flex items-center bg-white rounded-md px-2 py-2 shadow-sm transition-all ${
              isCollapsed ? "justify-center w-10 p-3" : "w-full"
            }`}
          >
            <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            {!isCollapsed && (
              <input
                type="text"
                placeholder="Search"
                className="outline-none ml-2 w-full text-sm bg-transparent"
              />
            )}
          </div>

          {/* Tasks Section */}
          <div>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-500 pt-2">TASKS</p>
            )}
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "All" ? "bg-gray-300" : "hover:bg-gray-200"
              } transition p-2 rounded-md`}
              onClick={() => setActiveTab("All")}
            >
              <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
              {!isCollapsed && <p className="text-sm">All</p>}
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "Today" ? "bg-gray-300" : "hover:bg-gray-200"
              } transition p-2 rounded-md`}
              onClick={() => setActiveTab("Today")}
            >
              <FontAwesomeIcon icon={faListUl} className="text-gray-600" />
              {!isCollapsed && <p className="text-sm">Pending</p>}
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "Completed" ? "bg-gray-300" : "hover:bg-gray-200"
              } transition p-2 rounded-md`}
              onClick={() => setActiveTab("Completed")}
            >
              <FontAwesomeIcon icon={faListCheck} className="text-gray-600" />
              {!isCollapsed && <p className="text-sm">Completed</p>}
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
            <FontAwesomeIcon icon={faSliders} className="text-gray-600" />
            {!isCollapsed && <p className="text-sm">Settings</p>}
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              activeTab === "logout" ? "bg-gray-300" : "hover:bg-gray-200"
            } transition p-2 rounded-md`}
            onClick={handleLogout}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-gray-600"
            />
            {!isCollapsed && <p className="text-sm">Sign out</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
