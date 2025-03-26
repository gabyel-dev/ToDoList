import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();

    try {
      axios.post("http://localhost:5000/register", registerData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch {
      console.log("error registering data");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((data) => ({ ...data, [name]: value }));
  };

  //show password toggle
  const toggleShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[#f2f2f2]">
      <div>
        <form onSubmit={handleRegister}>
          <div className="flex gap-2 border-b-1 border-gray-400">
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              className="outline-0 p-1"
            />
          </div>
          <div className="flex gap-2 border-b-1 border-gray-400">
            {}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="outline-0 p-1"
            />
            <button onClick={toggleShow}>
              {showPassword ? "hide" : "show"}
            </button>
          </div>
          <button
            type="submit"
            className="bg-[#38383A] rounded-sm px-5 py-2 text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
