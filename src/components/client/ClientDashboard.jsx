import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "client") return;

    async function loadInvestments() {
      try {
        const response = await fetch(`${API}/investments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load investments");
        }

        const data = await response.json();
        setInvestments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInvestments();
  }, [user, token]);

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

  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My portfolio</h1>
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
            <p className="bg-gray-300">My goals: </p>
          </section>
          <table className="col-span-2">
            <thead className="bg-gray-300">
              <tr>
                <th>Name</th>
                <th>Asset Class</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            {investments.map((investment) => (
              <tbody>
                <tr key={investment.id}>
                  <td>
                    <strong>{investment.name}</strong>
                  </td>
                  <td>{investment.asset_class.replace(/_/g, " ")}</td>
                  <td>{investment.quantity}</td>
                  <td>${investment.unit_price}</td>
                </tr>
              </tbody>
            ))}
          </table>
          <section className="col-span-2">
            <p className="bg-gray-300">Chart: </p>
            <AgCharts options={options} />
          </section>
          <section className="col-span-2">
            <p className="bg-gray-300">Recommendations from my advisor: </p>
          </section>
        </div>
      )}
    </div>
  );
}
