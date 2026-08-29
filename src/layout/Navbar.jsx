import { NavLink, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import { useClients } from "../context/ClientsContext";
import { getAge } from "../utils/date";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();
  const { advisors } = useClients();

  const userAge = user ? getAge(user.dob) : null;
  const isAdvisor = user ? user.role === "advisor" : false;
  const isClient = user ? user.role === "client" : false;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            <div className="flex flex-row items-center justify-end gap-6">
              <div className="text-right">
                <p className="font-medium">
                  {user.firstName} {user.lastName} ({user.role})
                  {isClient && userAge !== null ? `, Age ${userAge}` : ""}
                </p>
                {advisors && advisors.length > 0 && (
                  <p className="text-sm text-gray-300">
                    Advisor: {advisors[0].firstName} {advisors[0].lastName}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogout}
                className=" bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <p>Loading profile...</p>
          )
        ) : (
          <NavLink
            to="/login"
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Log in
          </NavLink>
        )}
      </nav>
    </header>
  );
}
