import FormInput from "../FormInput";
import { useAuth } from "../../context/AuthContext";
import { useClients } from "../../context/ClientsContext";
import { useParams } from "react-router";
import { addGoal } from "../../../api/wealthwise";

export default function NewGoalForm({ setIsAddGoal }) {
  const { token } = useAuth();
  const { clientId } = useParams();
  const { setGoals } = useClients();

  const onAddGoal = async (formData) => {
    const name = formData.get("name");
    const target_amount = formData.get("target_amount");
    const target_date = formData.get("target_date");
    try {
      const newGoal = await addGoal(token, {
        clientId,
        name,
        target_amount,
        target_date,
      });
      setGoals((currentGoals) => [...currentGoals, newGoal]);
      setIsAddGoal(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
      role="presentation"
      onClick={() => setIsAddGoal(false)}
    >
      <div
        className="w-full max-w-md rounded bg-white p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-investment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="add-investment-title" className="text-xl font-bold">
            Add Goal
          </h2>
          <button
            type="button"
            className="text-xl text-gray-500 hover:text-gray-800"
            aria-label="Close add investment dialog"
            onClick={() => setIsAddGoal(false)}
          >
            X
          </button>
        </div>
        <form action={onAddGoal} className="space-y-4">
          <FormInput label="Goal name" name="name" type="text" required />
          <FormInput
            label="Target Amount"
            name="target_amount"
            type="number"
            required
          />
          <FormInput
            label="Target Date"
            name="target_date"
            type="date"
            required
          />
          <button
            type="submit"
            className="bg-blue-950 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Goal
          </button>
        </form>
      </div>
    </div>
  );
}
