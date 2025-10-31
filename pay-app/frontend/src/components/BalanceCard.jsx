export default function BalanceCard({ amount }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">Your Balance</div>
      <div className="mt-1 text-2xl font-semibold">₹{amount}</div>
    </div>
  );
}
