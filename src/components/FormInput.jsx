/** Reusable form input component */
export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <label className="flex flex-col gap-1">
      {label}
      <input
        type={type}
        name={name}
        required={required}
        className="border border-gray-300 p-2 rounded"
        {...props}
      />
    </label>
  );
}
