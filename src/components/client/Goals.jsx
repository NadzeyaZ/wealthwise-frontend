import { useClients } from "../../context/ClientsContext";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NewGoalForm from "./NewGoalForm";

export default function Goals({ isAdvisor }) {
  const { user } = useAuth();
  const { goals } = useClients();
  const [isAddGoal, setIsAddGoal] = useState(false);
  const isClient = user?.role === "client";
  return (
    <div>
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
      {isClient && (
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsAddGoal(true)}
        >
          Add goal
        </button>
      )}
      {isAddGoal && <NewGoalForm setIsAddGoal={setIsAddGoal} />}
    </div>
  );
}
