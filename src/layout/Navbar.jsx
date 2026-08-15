import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";
import AdvisorDashboard from "../components/advisor/AdvisorDashboard";

export default function Navbar() {
  const { token, logout, user } = useAuth();
  return (
    <header
      id="navbar"
      className="flex flex-row justify-between items-center bg-gray-800 text-white p-4"
    >
      <NavLink
        id="brand"
        to="/"
        className="flex flex-row justify-start items-center space-x-2"
      >
        <img
          src="public/wealthwise_ww_monogram_light.png"
          alt="wealthwise-logo"
          className="h-12 w-auto"
        />
        <p>WealthWise</p>
      </NavLink>
      <nav>
        {token ? (
          <>
            <NavLink to="/" onClick={logout}>
              Log out
            </NavLink>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
