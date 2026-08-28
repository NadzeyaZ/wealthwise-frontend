import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router";

const API = import.meta.env.VITE_API;

const ClientsContext = createContext();

export function ClientProvider({ children }) {
  const { token, user } = useAuth();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user?.role !== "advisor" || !clientId || !token) {
      setClient(null);
      return;
    }

    async function loadClient() {
      try {
        const response = await fetch(`${API}/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load clients");
        }

        const clients = await response.json();
        const foundClient = clients.find(
          (currentClient) => currentClient.id === Number(clientId),
        );
        setClient(foundClient || null);
      } catch (error) {
        console.error(error);
        setClient(null);
      }
    }

    loadClient();
  }, [clientId, token, user?.role]);

  useEffect(() => {
    const targetClientId = clientId || user?.id;

    if (!targetClientId || !token) {
      setAdvisors([]);
      return;
    }

    async function loadAdvisors() {
      try {
        const response = await fetch(
          `${API}/clients/${targetClientId}/advisor`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load advisors");
        }

        const data = await response.json();
        setAdvisors(data);
      } catch (error) {
        console.error(error);
        setAdvisors([]);
      }
    }

    loadAdvisors();
  }, [clientId, token, user?.id]);

  useEffect(() => {
    const targetClientId = clientId || user?.id;
    if (!targetClientId) return;
    loadInvestments(targetClientId);
  }, [clientId, user, token]);

  useEffect(() => {
    if (investment !== null) {
      const updatedInvestment = investments.find(
        (inv) => inv.id === investment,
      );
      if (updatedInvestment) {
        fetch(`${API}/clients/${clientId}/investments/${investment}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: updatedInvestment.quantity }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update investment");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Investment updated:", data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [investment, clientId, token, investments]);

  useEffect(() => {
    const targetClientId = clientId || user?.id;

    if (!targetClientId || !token) {
      return;
    }

    async function loadGoals() {
      try {
        const response = await fetch(`${API}/clients/${targetClientId}/goals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load goals");
        }

        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error(error);
        setGoals([]);
      }
    }

    loadGoals();
  }, [clientId, user?.id, token]);

  useEffect(() => {
    const targetClientId = clientId || user?.id;

    if (!targetClientId || !token) {
      setRecommendations([]);
      return;
    }

    loadRecommendations(targetClientId);
  }, [clientId, user?.id, token]);

  const loadRecommendations = async (targetClientId) => {
    try {
      const response = await fetch(
        `${API}/recommendations?clientId=${targetClientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load recommendations");
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error(error);
      setRecommendations([]);
    }
  };

  const loadInvestments = async (targetClientId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API}/clients/${targetClientId}/investments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load investments");
      }

      const data = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error(error);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    client,
    setClient,
    investments,
    setInvestments,
    investment,
    setInvestment,
    loading,
    isAddInvestmentOpen,
    setIsAddInvestmentOpen,
    goals,
    setGoals,
    advisors,
    loadInvestments,
    recommendations,
    setRecommendations,
    loadRecommendations,
  };
  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
