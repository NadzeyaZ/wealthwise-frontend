import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API;

export default function ClientDashboard() {
  const { user, token } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "client") return;

    async function loadInvestments() {
      try {
        const response = await fetch(`${API}/investments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load investments");
        }

        const data = await response.json();
        setInvestments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInvestments();
  }, [user, token]);

  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h2>Client dashboard</h2>
      <p>Welcome, {user.firstName}!</p>

      {loading ? (
        <p>Loading investments...</p>
      ) : investments.length === 0 ? (
        <p>You have no investments yet.</p>
      ) : (
        <ul>
          {investments.map((investment) => (
            <li key={investment.id}>
              <strong>{investment.name}</strong> - {investment.asset_class} -{" "}
              {investment.quantity} shares
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
