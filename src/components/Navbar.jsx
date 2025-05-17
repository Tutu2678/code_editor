import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getUser } from "../utils/auth";

// Theme options as constants
const THEMES = ["light", "dark", "retro", "cyberpunk", "valentine", "aqua"];

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const applySavedTheme = () => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  };

  const changeTheme = (e) => {
    const selected = e.target.value;
    document.documentElement.setAttribute("data-theme", selected);
    localStorage.setItem("theme", selected);
  };

  useEffect(() => {
    applySavedTheme();
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Start */}
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/editor">Editor</Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          CodeIt
        </Link>
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/editor">Editor</Link>
          </li>
        </ul>
      </div>

      {/* End */}
      <div className="navbar-end space-x-4">
        {/* Theme Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-sm">
            Theme
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-base-300 rounded-box z-10 w-52 p-2 shadow-2xl"
          >
            {THEMES.map((theme) => (
              <li key={theme}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={theme}
                  value={theme}
                  onChange={changeTheme}
                  defaultChecked={localStorage.getItem("theme") === theme}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Auth Info */}
        {isLoggedIn() ? (
          <>
            <span className="hidden sm:inline">{getUser()}</span>
            <button
              onClick={handleLogout}
              className="btn btn-ghost underline"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="btn btn-ghost">Guest</span>
        )}
      </div>
    </div>
  );
}
