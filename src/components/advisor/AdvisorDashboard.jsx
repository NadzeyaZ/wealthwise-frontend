import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAdvisorClients } from "../../../api/wealthwise";

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const displayName = user?.firstName;
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "advisor") return;

    async function loadClients() {
      try {
        const data = await getAdvisorClients(token);
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
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Name
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Portfolio Value
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Goals
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Pending Recommendations
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
              >
                <td className="py-4 pr-4">
                  <strong className="font-medium text-slate-900">
                    {client.firstName} {client.lastName}
                  </strong>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-600">
                  ${client.portfolioValue}
                </td>
                <td className="py-4 pr-4 text-sm text-gray-600">0</td>
                <td className="py-4 pr-4 text-sm text-gray-600">0</td>
                <td className="py-4 pr-4">
                  <button
                    onClick={() =>
                      navigate(`/clients/${client.id}/investments`)
                    }
                    className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                  >
                    View Client
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
