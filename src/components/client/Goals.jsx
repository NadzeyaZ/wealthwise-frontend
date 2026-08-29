import { useClients } from "../../context/ClientsContext";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NewGoalForm from "./NewGoalForm";
const API = import.meta.env.VITE_API;

export default function Goals({ isAdvisor }) {
  const { token, user } = useAuth();
  const { goals, setGoals } = useClients();
  const [isAddGoal, setIsAddGoal] = useState(false);
  const isClient = user?.role === "client";

  const onDeleteGoal = async (goalId) => {
    try {
      const response = await fetch(`${API}/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete goal");
      }

      setGoals((currentGoals) =>
        currentGoals.filter((goal) => goal.id !== goalId),
      );
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
        Goals:
      </p>
      {goals.length > 0 ? (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                  Goal
                </th>
                <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                  Target Amount
                </th>
                <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                  Target Date
                </th>
                {isClient && (
                  <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr
                  key={goal.id}
                  className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <strong className="font-medium text-slate-900">
                      {goal.name}
                    </strong>
                  </td>
                  <td className="py-4 pr-4 text-sm text-gray-600">
                    ${goal.target_amount}
                  </td>
                  <td className="py-4 pr-4 text-sm text-gray-600">
                    {new Date(goal.target_date).toLocaleDateString()}
                  </td>
                  {isClient && (
                    <td className="py-4 pr-4">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
                        onClick={() => onDeleteGoal(goal.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-gray-600">No goals set.</p>
      )}
      {isClient && (
        <button
          type="button"
          className="bg-blue-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors mt-4"
          onClick={() => setIsAddGoal(true)}
        >
          Add goal
        </button>
      )}
      {isAddGoal && <NewGoalForm setIsAddGoal={setIsAddGoal} />}
    </section>
  );
}
