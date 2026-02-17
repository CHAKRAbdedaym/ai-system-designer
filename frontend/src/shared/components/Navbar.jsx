// src/shared/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("access");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
    setIsMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              AI System Designer
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            

            {isLoggedIn && (
              <>
              <Link
              to="/"
              className={`text-gray-300 hover:text-white transition font-medium ${
                isActive("/") ? "text-white underline underline-offset-4" : ""
              }`}
            >
              Home
            </Link>
            
              <Link
              to="/analyze"
              className={`text-gray-300 hover:text-white transition font-medium ${
                isActive("/analyze") ? "text-white underline underline-offset-4" : ""
              }`}
            >
              Analyze
            </Link>

                <Link
                  to="/history"
                  className={`text-gray-300 hover:text-white transition font-medium ${
                    isActive("/history") ? "text-white underline underline-offset-4" : ""
                  }`}
                >
                  History
                </Link>

                {/* Optional future pages */}
                <Link
                  to="/dashboard"
                  className={`text-gray-300 hover:text-white transition font-medium ${
                    isActive("/dashboard") ? "text-white underline underline-offset-4" : ""
                  }`}
                >
                  Dashboard
                </Link>

                
              </>
            )}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-3">
            

            {isLoggedIn && (
              <>
              <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              className={`block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition ${
                isActive("/") ? "bg-gray-800 text-white" : ""
              }`}
            >
              Home
            </Link>

              <Link
              to="/analyze"
              onClick={() => setIsMobileOpen(false)}
              className={`block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition ${
                isActive("/analyze") ? "bg-gray-800 text-white" : ""
              }`}
            >
              Analyze
            </Link>
                <Link
                  to="/history"
                  onClick={() => setIsMobileOpen(false)}
                  className={`block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition ${
                    isActive("/history") ? "bg-gray-800 text-white" : ""
                  }`}
                >
                  History
                </Link>

                {/* Optional future pages */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                >
                  Dashboard
                </Link>

                
              </>
            )}

            <div className="pt-4 border-t border-gray-800">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                >
                  Logout
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-3 text-center text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}