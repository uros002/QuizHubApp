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
    <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left: App Name */}
      <Link to="/" className="text-2xl font-bold">
        QuizHub
      </Link>

      {/* Right: Navigation links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/home"
          className="hover:text-purple-200 transition-colors text-lg"
        >
          Home
        </Link>
        {authContext.userType === "Admin" ? (
          <>
            <Link
              to="/create-quiz"
              className="hover:text-purple-200 transition-colors text-lg"
            >
              New Quiz
            </Link>
            <Link
              to="/allResults"
              className="hover:text-purple-200 transition-colors text-lg"
            >
              Results
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/my-results"
              className="hover:text-purple-200 transition-colors text-lg"
            >
              My Results
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-purple-200 transition-colors text-lg"
            >
              Leaderboard
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-white text-purple-700 font-semibold px-4 py-2 rounded hover:bg-purple-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>

    // <div className="navbar bg-base-100 shadow-sm">
    //   <div className="flex-1">
    //     <a className="btn btn-ghost text-xl">daisyUI</a>
    //   </div>
    //   <div className="flex-none">
    //     <ul className="menu menu-horizontal px-1">
    //       <li>
    //         <Link to="/home">Home</Link>
    //       </li>
    //       <li>
    //         {authContext.token ? (
    //           <button onClick={handleLogout}>Logout</button>
    //         ) : (
    //           <> </>
    //         )}
    //       </li>
    //       <li>
    //         {/* <details>
    //           <summary>Parent</summary>
    //           <ul className="bg-base-100 rounded-t-none p-2">
    //             <li>
    //               <a>Link 1</a>
    //             </li>
    //             <li>
    //               <a>Link 2</a>
    //             </li>
    //           </ul>
    //         </details> */}
    //       </li>
    //     </ul>
    //   </div>
    // </div>

    // <nav className="navbar bg-gray-800 text-white p-4">
    //   <ul>
    //     {authContext.token && (
    //       <li>
    //         <Link to="/home" className="text-white hover:text-gray-300">
    //           Home
    //         </Link>
    //       </li>
    //     )}

    //     <li>
    //       {authContext.token ? (
    //         <button
    //           onClick={handleLogout}
    //           className="text-white hover:text-gray-300 button"
    //         >
    //           Logout
    //         </button>
    //       ) : (
    //         <> </>
    //       )}
    //     </li>
    //   </ul>
    // </nav>
  );
};

export default Navbar;
