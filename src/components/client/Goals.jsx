import { useClients } from "../../context/ClientsContext";

export default function Goals() {
  const { goals } = useClients();
  return (
    <section>
      {goals.length > 0 ? (
        <table className="w-full space-y-4">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left">Goal</th>
              <th className="text-left">Target Amount</th>
              <th className="text-left">Target Date</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td>{goal.name}</td>
                <td>${goal.target_amount}</td>
                <td>{new Date(goal.target_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <section className="space-y-4">
          <p className="bg-gray-300">Goals: </p>
          <p>No goals set.</p>
        </section>
      )}
    </section>
  );
}
