import { useAuth } from "../../context/AuthContext";
import Goals from "./Goals";
import Investments from "./Investments";
import Recommendations from "./Recommendations";
import Cash from "./Cash";
import { useClients } from "../../context/ClientsContext";
import AddInvestmentForm from "../advisor/AddInvestmentForm";
import { useParams } from "react-router";
import { AgCharts } from "ag-charts-react";
import {
  ModuleRegistry,
  PieSeriesModule,
  LegendModule,
} from "ag-charts-community";
import { getAge } from "../../utils/date";

ModuleRegistry.registerModules([PieSeriesModule, LegendModule]);

export default function ClientDashboard() {
  const { user } = useAuth();
  const { clientId } = useParams();
  const {
    client,
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
  } = useClients();

  const isAdvisor = user?.role === "advisor";
  const isClient = user?.role === "client";
  const clientAge = client ? getAge(client.dob) : null;

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
        fills: [
          "#004D40", // darkest teal
          "#00695C",
          "#00897B",
          "#26A69A",
          "#4DB6AC",
          "#80CBC4",
          "#B2DFDB", // lightest teal
        ],
        strokes: ["#ffffff"],
        strokeWidth: 1,
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
        <>
          <h1 className="text-2xl font-bold mb-4">
            {client?.firstName} {client?.lastName}, Age {clientAge}
          </h1>
        </>
      ) : (
        <h1 className="text-2xl font-bold mb-4">My portfolio</h1>
      )}
      {loading ? (
        <p>Loading investments...</p>
      ) : investments.length === 0 ? (
        <p>You have no investments yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <section className="space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Total value:{" "}
            </p>
            <p className="text-blue-900 text-3xl font-bold ">
              ${totalValue.toFixed(2)}
            </p>
          </section>
          <Goals />
          <div className="col-span-1 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <Investments
              isAdvisor={isAdvisor}
              handleQuantityChange={handleQuantityChange}
            />
            {isAdvisor && (
              <section className="col-span-1">
                <button
                  className="bg-blue-950 text-white px-4 py-2 rounded"
                  onClick={() => setIsAddInvestmentOpen(true)}
                >
                  Add Investment
                </button>
              </section>
            )}
            <Cash />
          </div>
          <section className="col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Chart:
            </p>
            <AgCharts options={options} />
          </section>
          <Recommendations />
        </div>
      )}
      {isAdvisor && isAddInvestmentOpen && (
        <AddInvestmentForm
          setIsAddInvestmentOpen={setIsAddInvestmentOpen}
          clientId={clientId}
          setInvestments={setInvestments}
        />
      )}
    </div>
  );
}
