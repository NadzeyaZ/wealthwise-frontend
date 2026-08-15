import { useAuth } from "../../context/AuthContext";

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const displayName = user?.firstName;

  return (
    <div>
      <h2>Advisor dashboard</h2>
      <p>Welcome, {displayName}!</p>
    </div>
  );
}
