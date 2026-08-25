import { useClients } from "../../context/ClientsContext";
export default function Investments({ isAdvisor, handleQuantityChange }) {
  const { investments } = useClients();

  return (
    <table className="w-full space-y-4">
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
                    min="0"
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
  );
}
