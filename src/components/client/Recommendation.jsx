import { useAuth } from "../../context/AuthContext";
import { useClients } from "../../context/ClientsContext";

export default function Recommendation({ rec }) {
  const { user, token } = useAuth();
  const { recommendations, setRecommendations } = useClients();
  const isClient = user?.role === "client";
  const isAdvisor = user?.role === "advisor";
  const statusClass =
    rec.status === "pending"
      ? "bg-yellow-200"
      : rec.status === "rejected"
        ? "bg-red-200"
        : "bg-green-200";

  const onAcceptRec = async (recId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/recommendations/${recId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "accepted" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to accept recommendation");
      }

      const updatedRec = await response.json();
      const updatedRecommendations = recommendations.map((rec) =>
        rec.id === recId ? { ...rec, ...updatedRec } : rec,
      );
      setRecommendations(updatedRecommendations);
    } catch (error) {
      console.error(error);
    }
  };

  const onRejectRec = async (recId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/recommendations/${recId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "rejected" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reject recommendation");
      }

      const updatedRec = await response.json();
      const updatedRecommendations = recommendations.map((rec) =>
        rec.id === recId ? { ...rec, ...updatedRec } : rec,
      );
      setRecommendations(updatedRecommendations);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteRec = async (recId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/recommendations/${recId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete recommendation");
      }

      const updatedRecommendations = recommendations.filter(
        (rec) => rec.id !== recId,
      );
      setRecommendations(updatedRecommendations);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <table className="w-full my-2">
      <tbody>
        <tr className="flex flex-row justify-between items-center mx-2">
          <td>{rec.content}</td>
          <td className={`${statusClass} text-center w-18`}>{rec.status}</td>
          {isClient && (
            <td className="flex space-x-2">
              <button
                onClick={() => onAcceptRec(rec.id)}
                className="text-lg text-gray-500 hover:bg-gray-300 border border-gray-300 rounded w-fit px-4 py-2"
              >
                Accept
              </button>
              <button
                onClick={() => onRejectRec(rec.id)}
                className="text-lg text-gray-500 hover:bg-gray-300 border border-gray-300 rounded w-fit px-4 py-2"
              >
                Reject
              </button>
            </td>
          )}
          {isAdvisor && (
            <td className="flex space-x-2">
              <button
                onClick={() => onDeleteRec(rec.id)}
                className="text-lg text-gray-500 hover:bg-gray-300 border border-gray-300 rounded w-fit px-4 py-2"
              >
                Delete
              </button>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
}
