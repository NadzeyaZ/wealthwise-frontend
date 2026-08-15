import { useAuth } from "../../context/AuthContext";

export default function ClientDashboard() {
  const { user } = useAuth();
  const displayName = user?.firstName;

  return (
    <div>
      <h2>Client dashboard</h2>
      <p>Welcome, {displayName}!</p>
    </div>
  );
}
