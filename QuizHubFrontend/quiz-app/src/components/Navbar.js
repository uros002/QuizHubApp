import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();
    authContext.logout();
  };

  return (
    <nav className="navbar bg-gray-800 text-white p-4">
      <ul>
        {authContext.token && (
          <li>
            <Link to="/home" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
        )}

        <li>
          {authContext.token ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 button"
            >
              Logout
            </button>
          ) : (
            <> </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
