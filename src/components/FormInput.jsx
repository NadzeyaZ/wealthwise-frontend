/** Reusable form input component */
export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <input
        type={type}
        name={name}
        required={required}
        className="border border-gray-200 rounded-lg px-4 py-3 text-slate-900 placeholder-gray-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 hover:border-gray-300 transition-colors"
        {...props}
      />
    </label>
  );
}
