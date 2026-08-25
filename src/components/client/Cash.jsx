import { useClients } from "../../context/ClientsContext";

export default function Cash() {
  const { investments } = useClients();
  return (
    <section>
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
  );
}
