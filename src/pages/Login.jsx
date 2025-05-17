import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim()) return alert("Enter username");
    login(username.trim());
    navigate("/editor");
  };

  const skipLogin = () => {
    navigate("/editor");
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/img/background.png)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md p-10 rounded-lg shadow-lg">
          <h1 className="mb-8 text-5xl font-bold">Login</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input input-bordered w-full max-w-xs mb-4 placeholder:text-gray-400"
          />
          <button
            onClick={handleLogin}
            className="btn btn-primary w-full max-w-xs mb-4"
          >
            Login
          </button>
          <button
            onClick={skipLogin}
            className="btn btn-ghost btn-link w-full max-w-xs mb-6"
          >
            Continue as Guest
          </button>
          <Link
            to="/register"
            className="text-blue-300 underline hover:text-blue-400"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
