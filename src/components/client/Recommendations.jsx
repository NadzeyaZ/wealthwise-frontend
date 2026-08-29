import React from "react";
import { useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useClients } from "../../context/ClientsContext";
import AddRecommendationForm from "../advisor/AddRecommendationForm";
import Recommendation from "./Recommendation";
export default function Recommendations() {
  const { user } = useAuth();
  const { clientId } = useParams();
  const { recommendations, setRecommendations } = useClients();

  const isAdvisor = user?.role === "advisor";
  const isClient = user?.role === "client";
  return (
    <section className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {isAdvisor ? (
        <p className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Recommendations:
        </p>
      ) : (
        <p className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Recommendations from advisor
        </p>
      )}
      {recommendations.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Recommendation
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Status
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Note
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <Recommendation
                key={rec.id}
                rec={rec}
                isAdvisor={isAdvisor}
                isClient={isClient}
              />
            ))}
          </tbody>
        </table>
      ) : (
        isClient && <p className="text-gray-600">Nothing to review.</p>
      )}
      {isAdvisor && <AddRecommendationForm />}
    </section>
  );
}
