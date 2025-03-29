import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const user_icon = <FontAwesomeIcon icon={faUser} />;
const password_icon = <FontAwesomeIcon icon={faLock} />;

const show = <FontAwesomeIcon icon={faEye} />;
const hide = <FontAwesomeIcon icon={faEyeSlash} />;

export default function ResetPass() {
  const navigate = useNavigate();
  const { user } = useParams();
  const [error, setError] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    username: "",
    password: "",
    newPassword: "",
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/reset-password",
        resetPasswordData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/");
    } catch (error) {
      setError(
        error.response?.status === 500
          ? "Something went wrong..."
          : error.response?.status === 409
          ? "New password must be different from old password."
          : error.response?.status === 401
          ? "Invalid username or password"
          : error.response?.status === 400
          ? "Password must be 8 characters long"
          : ""
      );
      setTimeout(() => setError(""), 5000);
    }
  };

  //onchange inputs
  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData((data) => ({ ...data, [name]: value }));
  };

  //show password toggle
  const toggleShow1 = (e) => {
    e.preventDefault();
    setShowPassword1(!showPassword1);
  };
  //show password toggle
  const toggleShow2 = (e) => {
    e.preventDefault();
    setShowPassword2(!showPassword2);
  };

  //check user session
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => {
        navigate(res.data.logged_in ? `/dashboard/${user}` : "/reset-password");
      });
  }, [navigate]);

  return (
    <>
      <div className="w-full h-[85vh] flex flex-col justify-center items-center bg-[#f2f2f2] text-[#38383A]">
        <div className="w-[18em] text-left pb-24">
          <h1 className="text-left font-bold text-3xl">Taskly</h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-10">
          <form
            onSubmit={handleResetPassword}
            className="w-[18em] flex flex-col gap-5"
          >
            <div className="flex justify-start items-center gap-2 border-b-1 border-gray-400">
              {user_icon}
              <input
                type="text"
                name="username"
                value={resetPasswordData.username}
                onChange={handleResetPasswordChange}
                className="outline-0 p-1"
                required
                placeholder="Username"
              />
            </div>
            <div className="flex justify-between items-center gap-2 border-b-1 border-gray-400">
              <div className="flex justify-start items-center gap-2 w-full">
                {password_icon}
                <input
                  type={showPassword1 ? "text" : "password"}
                  name="password"
                  value={resetPasswordData.password}
                  onChange={handleResetPasswordChange}
                  className="outline-0 p-1"
                  required
                  placeholder="Old password"
                />
              </div>
              <button onClick={toggleShow1}>
                {showPassword1 ? hide : show}
              </button>
            </div>
            <div className="flex justify-between items-center gap-2 border-b-1 border-gray-400">
              <div className="flex justify-start items-center gap-2 w-full">
                {password_icon}
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="newPassword"
                  value={resetPasswordData.newPassword}
                  onChange={handleResetPasswordChange}
                  className="outline-0 p-1"
                  required
                  placeholder="New password"
                />
              </div>
              <button onClick={toggleShow2}>
                {showPassword2 ? hide : show}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-[0.8em] leading-0 text-nowrap pb-3 ">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="bg-[#38383A] rounded-sm px-5 py-2 text-white cursor-pointer mt-3"
            >
              RESET
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-1 h-[15vh] bg-[#f2f2f2]">
        <p className="text-gray-400 text-[0.9em]">Back to login</p>
        <Link to={"/"} className="font-semibold text-lg">
          LOGIN
        </Link>
      </div>
    </>
  );
}
