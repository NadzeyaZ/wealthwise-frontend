import FormInput from "../FormInput";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API;

export default function AddInvestmentForm({
  clientId,
  setIsAddInvestmentOpen,
  setInvestments,
}) {
  const { token } = useAuth();
  const onAddInvestment = async (formData) => {
    const name = formData.get("name");
    const asset_class = formData.get("asset_class");
    const quantity = formData.get("quantity");
    const unit_price = formData.get("unit_price");
    try {
      const response = await fetch(`${API}/clients/${clientId}/investments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, asset_class, quantity, unit_price }),
      });

      if (!response.ok) {
        throw new Error("Failed to add investment");
      }

      const newInvestment = await response.json();
      setInvestments((prevInvestments) => [...prevInvestments, newInvestment]);
      setIsAddInvestmentOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
      role="presentation"
      onClick={() => setIsAddInvestmentOpen(false)}
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
            Add Investment
          </h2>
          <button
            type="button"
            className="text-xl text-gray-500 hover:text-gray-800"
            aria-label="Close add investment dialog"
            onClick={() => setIsAddInvestmentOpen(false)}
          >
            X
          </button>
        </div>
        <form action={onAddInvestment} className="space-y-4">
          <FormInput label="Investment name" name="name" type="text" required />
          <FormInput label="Asset class" name="asset_class" type="select" />
          <FormInput
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            required
          />
          <FormInput
            label="Unit price"
            name="unit_price"
            type="number"
            min="0"
            step="0.01"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 px-4 py-2"
              onClick={() => setIsAddInvestmentOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
