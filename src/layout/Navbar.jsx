import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";
import { getAge } from "../utils/date";

export default function Navbar() {
  const { token, logout, user } = useAuth();

  const userAge = user ? getAge(user.dob) : null;

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
          user ? (
            <div className="flex flex-row justify-start items-center space-x-4">
              <p>
                {user.firstName} {user.lastName} ({user.role})
                {userAge !== null ? `, Age ${userAge}` : ""}
              </p>
              <NavLink to="/" onClick={logout}>
                Log out
              </NavLink>
            </div>
          ) : (
            <p>Loading profile...</p>
          )
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
