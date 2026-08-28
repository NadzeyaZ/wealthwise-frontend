import FormInput from "../FormInput";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router";
import { useClients } from "../../context/ClientsContext";

const API = import.meta.env.VITE_API;

export default function AddRecommendationForm() {
  const { token, user } = useAuth();
  const { clientId } = useParams();
  const { recommendations, setRecommendations } = useClients();
  const advisorId = user?.id;

  const onAddRecommendation = async (formData) => {
    const content = formData.get("content");
    try {
      const response = await fetch(`${API}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clientId, advisorId, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add recommendation");
      }

      const newRecommendation = await response.json();
      setRecommendations([...recommendations, newRecommendation]);
      console.log("New recommendation added:", newRecommendation);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form action={onAddRecommendation} className="flex flex-col space-y-4 my-4">
      <FormInput label="" name="content" type="text" required />
      <button
        type="submit"
        className="text-lg text-gray-500 hover:bg-gray-300 border border-gray-300 rounded w-fit px-4 py-2"
      >
        Add Recommendation
      </button>
    </form>
  );
}
