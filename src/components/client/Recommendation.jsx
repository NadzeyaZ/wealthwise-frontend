import { useAuth } from "../../context/AuthContext";
import { useClients } from "../../context/ClientsContext";

export default function Recommendation({ rec, isAdvisor, isClient }) {
  const { token } = useAuth();
  const { recommendations, setRecommendations } = useClients();

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
      <td className="py-4 pr-4">
        <strong className="font-medium text-slate-900">{rec.content}</strong>
      </td>
      <td className="py-4 pr-4">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(rec.status)}`}
        >
          {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm text-gray-600">{rec.note || "—"}</td>
      <td className="py-4 pr-4">
        <div className="flex space-x-2">
          {isClient && (
            <>
              <button
                onClick={() => onAcceptRec(rec.id)}
                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onRejectRec(rec.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {isAdvisor && (
            <button
              onClick={() => onDeleteRec(rec.id)}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
