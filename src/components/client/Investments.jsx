import { useClients } from "../../context/ClientsContext";
export default function Investments({ isAdvisor, handleQuantityChange }) {
  const { investments } = useClients();

  return (
    <table className="col-span-1 w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
            Name
          </th>
          <th className="text-left text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
            Asset Class
          </th>
          <th className="text-right text-xs font-medium uppercase tracking-widest text-gray-500 pb-3 pr-4">
            Quantity
          </th>
          <th className="text-right text-xs font-medium uppercase tracking-widest text-gray-500 pb-3">
            Unit Price
          </th>
        </tr>
      </thead>
      {isAdvisor ? (
        <tbody>
          {investments
            .filter((inv) => inv.asset_class !== "cash")
            .map((investment) => (
              <tr
                key={investment.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
              >
                <td className="py-4 pr-4">
                  <strong className="font-medium text-slate-900">
                    {investment.name}
                  </strong>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-600 capitalize">
                  {investment.asset_class.replace(/_/g, " ")}
                </td>
                <td className="py-4 pr-4 text-right">
                  <input
                    className="text-right border border-gray-200 rounded-lg px-3 py-2 w-24 text-sm text-slate-900 tabular-nums outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 hover:border-gray-300 transition-colors"
                    type="number"
                    min="0"
                    value={investment.quantity}
                    onChange={(e) =>
                      handleQuantityChange(investment.id, e.target.value)
                    }
                  />
                </td>
                <td className="py-4 text-right text-sm text-gray-700 tabular-nums">
                  ${investment.unit_price}
                </td>
              </tr>
            ))}
        </tbody>
      ) : (
        <tbody>
          {investments
            .filter((inv) => inv.asset_class !== "cash")
            .map((investment) => (
              <tr
                key={investment.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
              >
                <td className="py-4 pr-4">
                  <strong className="font-medium text-slate-900">
                    {investment.name}
                  </strong>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-600 capitalize">
                  {investment.asset_class.replace(/_/g, " ")}
                </td>
                <td className="py-4 pr-4 text-right text-sm text-gray-700 tabular-nums">
                  {investment.quantity}
                </td>
                <td className="py-4 text-right text-sm text-gray-700 tabular-nums">
                  ${investment.unit_price}
                </td>
              </tr>
            ))}
        </tbody>
      )}
    </table>
  );
}
