import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const google = <FontAwesomeIcon icon={faGoogle} />;

const user_icon = <FontAwesomeIcon icon={faUser} />;
const password_icon = <FontAwesomeIcon icon={faLock} />;

const show = <FontAwesomeIcon icon={faEye} />;
const hide = <FontAwesomeIcon icon={faEyeSlash} />;

export default function Login() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/login", loginData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.status === 401
          ? "Invalid username or password"
          : error.response?.status === 400
      );

      setTimeout(() => setError(""), 5000);
    }
  };

  //onchange inputs
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((data) => ({ ...data, [name]: value }));
  };

  //show password toggle
  const toggleShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
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
  }, [navigate]);

  return (
    <>
      <div className="w-full h-[85vh] flex flex-col justify-center items-center bg-[#f2f2f2] text-[#38383A]">
        <div className="w-[18em] text-left pb-24">
          <h1 className="text-left font-bold text-4xl">Taskly</h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-11">
          <form onSubmit={handleLogin} className="w-[18em] flex flex-col gap-7">
            <div className="flex justify-start items-center gap-2 border-b-1 border-gray-400">
              {user_icon}
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                className="outline-0 p-1"
                required
                placeholder="Username"
              />
            </div>
            <div>
              <div className="flex justify-between items-center gap-2 border-b-1 border-gray-400">
                <div className="flex justify-start items-center gap-2 w-full">
                  {password_icon}
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="outline-0 p-1"
                    required
                    placeholder="Password"
                  />
                </div>

                <button onClick={toggleShow} className="text-gray-500">
                  {showPassword ? hide : show}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-[0.8em] flex justify-start text-left leading-8 rounded-sm ">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Link
                to={"/reset-password"}
                className="text-[0.8em] leading-0 text-gray-500"
              >
                Forgot password?
              </Link>

              <button
                type="submit"
                className="bg-[#38383A] rounded-sm px-8 py-2 text-white cursor-pointer"
              >
                LOGIN
              </button>
            </div>
          </form>
          <div className="flex justify-center items-center gap-2 w-[80%] leading-0">
            <hr className="flex-grow border-gray-400" />
            <span className="text-gray-400 pb-[0.3em]">or</span>
            <hr className="flex-grow border-gray-400" />
          </div>

          <div className="flex w-full">
            <div className="bg-black flex justify-center items-center text-white text-sm px-3 py-2 rounded-bl-sm rounded-tl-sm">
              {google}
            </div>
            <button className="bg-[#38383A] cursor-pointer text-white text-sm px-5 py-2.5 rounded-br-sm rounded-tr-sm w-full flex justify-center items-center">
              LOGIN WITH GOOGLE
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-1 bottom-0 bg-[#f2f2f2] h-[15vh]">
        <p className="text-gray-400 text-[0.9em]">Don't have an account?</p>
        <Link to={"/register"} className="font-semibold text-lg">
          SIGN UP
        </Link>
      </div>
    </>
  );
}
