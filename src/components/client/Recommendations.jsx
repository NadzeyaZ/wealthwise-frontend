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
    <section className="col-span-2">
      {isAdvisor ? (
        <p className="bg-gray-300">Recommendations:</p>
      ) : (
        <p className="bg-gray-300">Recommendations from advisor: </p>
      )}
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec) => (
            <li key={rec.id}>
              <Recommendation rec={rec} />
            </li>
          ))}
        </ul>
      ) : (
        isClient && <p>Nothing to review.</p>
      )}
      {isAdvisor && <AddRecommendationForm />}
    </section>
  );
}
