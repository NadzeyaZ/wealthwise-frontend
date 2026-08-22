import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddInvestment from "../advisor/AddInvestment";
import { useParams } from "react-router";
import { AgCharts } from "ag-charts-react";
import {
  ModuleRegistry,
  PieSeriesModule,
  LegendModule,
} from "ag-charts-community";

ModuleRegistry.registerModules([PieSeriesModule, LegendModule]);

const API = import.meta.env.VITE_API;

export default function ClientDashboard() {
  const { user, token } = useAuth();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);

  const isAdvisor = user?.role === "advisor";

  useEffect(() => {
    const targetClientId = clientId || user?.id;

    if (!targetClientId) return;

    async function loadInvestments() {
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
    }

    loadInvestments();
  }, [clientId, user, token]);

  useEffect(() => {
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
          (client) => client.id === parseInt(clientId),
        );
        setClient(foundClient || null);
      } catch (error) {
        console.error(error);
        setClient(null);
      }
    }

    loadClient();
  }, [clientId, token]);

  const totalValue = investments.reduce(
    (acc, investment) => acc + investment.quantity * investment.unit_price,
    0,
  );

  const investmentsByAssetClass = investments.reduce((acc, investment) => {
    const key = investment.asset_class.replace(/_/g, " ");
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += investment.quantity * investment.unit_price;
    return acc;
  }, {});

  const pieChartData = Object.entries(investmentsByAssetClass).map(
    ([asset, amount]) => ({ asset, amount }),
  );

  const options = {
    data: pieChartData,
    title: { text: "Portfolio Composition" },
    series: [
      {
        type: "pie",
        angleKey: "amount",
        legendItemKey: "asset",
      },
    ],
  };

  const handleQuantityChange = (id, newQuantity) => {
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, quantity: Number(newQuantity) } : inv,
      ),
    );
    setInvestment(id);
  };

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

  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      {isAdvisor && (
        <button
          className=" text-blue-500 underline mb-4"
          onClick={() => window.history.back()}
        >
          Back to my clients
        </button>
      )}
      {isAdvisor ? (
        <h1 className="text-2xl font-bold mb-4">
          {client?.firstName} {client?.lastName} Dashboard
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-4">My portfolio</h1>
      )}
      {loading ? (
        <p>Loading investments...</p>
      ) : investments.length === 0 ? (
        <p>You have no investments yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <section className="space-y-4">
            <p className="bg-gray-300">Total value: </p>
            <p className="text-blue-900 text-3xl font-bold ">
              ${totalValue.toFixed(2)}
            </p>
          </section>
          <section>
            {isAdvisor ? (
              <p className="bg-gray-300">Client's goals: </p>
            ) : (
              <p className="bg-gray-300">My goals: </p>
            )}
          </section>
          <table className="col-span-2">
            <thead className="bg-gray-300">
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Asset Class</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Unit Price</th>
              </tr>
            </thead>
            {isAdvisor ? (
              <tbody>
                {investments
                  .filter((inv) => inv.asset_class !== "cash")
                  .map((investment) => (
                    <tr key={investment.id}>
                      <td>
                        <strong>{investment.name}</strong>
                      </td>
                      <td>{investment.asset_class.replace(/_/g, " ")}</td>
                      <td>
                        <input
                          className="text-center border border-gray-300 rounded px-2 my-1 w-40"
                          type="number"
                          value={investment.quantity}
                          onChange={(e) =>
                            handleQuantityChange(investment.id, e.target.value)
                          }
                        />
                      </td>
                      <td>${investment.unit_price}</td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody>
                {investments
                  .filter((inv) => inv.asset_class !== "cash")
                  .map((investment) => (
                    <tr key={investment.id}>
                      <td>
                        <strong>{investment.name}</strong>
                      </td>
                      <td>{investment.asset_class.replace(/_/g, " ")}</td>
                      <td>{investment.quantity}</td>
                      <td>${investment.unit_price}</td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
          {isAdvisor && (
            <section className="col-span-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsAddInvestmentOpen(true)}
              >
                Add Investment
              </button>
            </section>
          )}
          <section className="col-span-2">
            <p className="bg-gray-300">Cash: </p>
            <p className="text-blue-900 text-xl font-bold ">
              $
              {investments
                .filter((inv) => inv.asset_class === "cash")
                .reduce(
                  (acc, investment) =>
                    acc + investment.quantity * investment.unit_price,
                  0,
                )
                .toFixed(2)}
            </p>
          </section>
          <section className="col-span-2">
            <p className="bg-gray-300">Chart: </p>
            <AgCharts options={options} />
          </section>
          <section className="col-span-2">
            {isAdvisor ? (
              <p>Recommendations:</p>
            ) : (
              <p className="bg-gray-300">Recommendations from advisor: </p>
            )}
          </section>
        </div>
      )}
      {isAdvisor && isAddInvestmentOpen && (
        <AddInvestment
          setIsAddInvestmentOpen={setIsAddInvestmentOpen}
          clientId={clientId}
          setInvestments={setInvestments}
        />
      )}
    </div>
  );
}
