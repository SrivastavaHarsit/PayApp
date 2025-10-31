export default function Input({ label, ...props }) {
  return (
    <label className="block w-full">
      {label && <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>}
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/20"
        {...props}
      />
    </label>
  );
}
