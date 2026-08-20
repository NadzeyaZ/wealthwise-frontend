import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_API;

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const displayName = user?.firstName;
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "advisor") return;

    async function loadClients() {
      try {
        const response = await fetch(`${API}/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load clients");
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadClients();
  }, [user, token]);

  console.log(clients);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-900 ">My clients</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-300">
          <tr>
            <th className="text-left border border-gray-300 px-4 py-2">Name</th>
            <th className="text-left border border-gray-300 px-4 py-2">
              Portfolio Value
            </th>
            <th className="text-left border border-gray-300 px-4 py-2">
              Goals
            </th>
            <th className="text-left border border-gray-300 px-4 py-2">
              Pending Recommendations
            </th>
            <th className="text-left border border-gray-300 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className=" px-4 py-2">
                {client.firstName} {client.lastName}
              </td>
              <td className="px-4 py-2">{client.portfolioValue}</td>
              <td className="px-4 py-2">0</td>
              <td className="px-4 py-2">0</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => navigate(`/clients/${client.id}/investments`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Client
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
