import FormInput from "../FormInput";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router";
import { useClients } from "../../context/ClientsContext";
import { addRecommendation } from "../../../api/wealthwise";

export default function AddRecommendationForm() {
  const { token, user } = useAuth();
  const { clientId } = useParams();
  const { recommendations, setRecommendations } = useClients();
  const advisorId = user?.id;

  const onAddRecommendation = async (formData) => {
    const content = formData.get("content");
    try {
      const newRecommendation = await addRecommendation(token, {
        clientId,
        advisorId,
        content,
      });
      setRecommendations([...recommendations, newRecommendation]);
      console.log("New recommendation added:", newRecommendation);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form action={onAddRecommendation} className="flex flex-col space-y-3 my-4">
      <FormInput
        label=""
        name="content"
        type="text"
        placeholder="Enter recommendation..."
        required
      />
      <button
        type="submit"
        className="bg-blue-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors w-fit"
      >
        Add Recommendation
      </button>
    </form>
  );
}
