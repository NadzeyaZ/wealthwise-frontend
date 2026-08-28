import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";
import { useClients } from "../context/ClientsContext";
import { getAge } from "../utils/date";

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const { advisors } = useClients();

  const userAge = user ? getAge(user.dob) : null;
  const isAdvisor = user ? user.role === "advisor" : false;
  const isClient = user ? user.role === "client" : false;

  return (
    <header
      id="navbar"
      className="flex flex-row justify-between items-center bg-gray-800 text-white p-4"
    >
      {!token ? (
        <NavLink
          id="brand"
          to="/login"
          className="flex flex-row justify-start items-center space-x-2"
        >
          <img
            src="/wealthwise_ww_monogram_light.png"
            alt="wealthwise-logo"
            className="h-12 w-auto"
          />
          <p>WealthWise</p>
        </NavLink>
      ) : isAdvisor ? (
        <NavLink
          id="brand"
          to="/clients"
          className="flex flex-row justify-start items-center space-x-2"
        >
          <img
            src="/wealthwise_ww_monogram_light.png"
            alt="wealthwise-logo"
            className="h-12 w-auto"
          />
          <p>WealthWise</p>
        </NavLink>
      ) : isClient ? (
        <NavLink
          id="brand"
          to={`/clients/${user.id}/investments`}
          className="flex flex-row justify-start items-center space-x-2"
        >
          <img
            src="/wealthwise_ww_monogram_light.png"
            alt="wealthwise-logo"
            className="h-12 w-auto"
          />
          <p>WealthWise</p>
        </NavLink>
      ) : null}
      <nav>
        {token ? (
          user ? (
            <div className="flex flex-row justify-start items-center space-x-4">
              <div>
                <p>
                  {user.firstName} {user.lastName} ({user.role})
                  {userAge !== null ? `, Age ${userAge}` : ""}
                </p>
                {advisors && advisors.length > 0 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Advisor: {advisors[0].firstName} {advisors[0].lastName}
                  </p>
                )}
              </div>
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
