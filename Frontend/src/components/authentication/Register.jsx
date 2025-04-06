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

export default function Register() {
  const navigate = useNavigate();
  const { user } = useParams();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });
  const [registerring, setRegsiterring] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (registerring) return;
      setRegsiterring(true);
      await axios.post("http://localhost:5000/register", registerData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/");
    } catch (error) {
      setError(
        error.response?.status === 409
          ? "✕ Username taken"
          : error.response?.status === 400
          ? "Password must be 8 characters long"
          : ""
      );

      setTimeout(() => setError(""), 5000);
    } finally {
      setRegsiterring(false);
    }
  };

  //onchange inputs
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((data) => ({ ...data, [name]: value }));
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
        navigate(res.data.logged_in ? `/dashboard/${user}` : "/register");
      });
  }, [navigate]);

  return (
    <>
      <div className="w-full h-[85vh] flex flex-col justify-center items-center bg-[#f2f2f2] text-[#38383A]">
        <div className="w-[18em] text-left pb-24">
          <h1 className="text-left font-bold text-4xl">Taskly</h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-10">
          <form
            onSubmit={handleRegister}
            className="w-[18em] flex flex-col gap-5"
          >
            <div className="flex justify-start items-center gap-2 border-b-1 border-gray-400">
              {user_icon}
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                className="outline-0 p-1"
                required
                placeholder="Username"
              />
            </div>
            <div className="flex justify-between items-center gap-2 border-b-1 border-gray-400">
              <div className="flex justify-start items-center gap-2 w-full">
                {password_icon}
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="outline-0 p-1"
                  required
                  placeholder="New password"
                />
              </div>
              <button onClick={toggleShow}>{showPassword ? hide : show}</button>
            </div>
            {error && (
              <p className="text-red-500 text-[0.8em] leading-0 pb-3 ">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={registerring}
              className={`${
                !registerring ? "bg-[#38383A]" : "bg-gray-500"
              } rounded-sm px-5 py-2 text-white cursor-pointer mt-3`}
            >
              {registerring ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-1 bg-[#f2f2f2] h-[15vh]">
        <p className="text-gray-400 text-[0.9em]">Already have an account?</p>
        <Link to={"/"} className="font-semibold text-lg">
          LOGIN
        </Link>
      </div>
    </>
  );
}
