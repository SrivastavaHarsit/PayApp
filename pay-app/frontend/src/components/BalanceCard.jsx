export default function BalanceCard({ amount }) {
  return (
    <div className="rounded-xl border bg-gradient-to-r from-white to-gray-50 p-4 shadow-sm hover:shadow-md transition">
      <div className="text-sm text-gray-500">Your Balance</div>
      <div className={`mt-1 text-2xl font-semibold ${amount < 1000 ? 'text-red-600' : 'text-green-600'}`}>
  ₹{amount}
</div>

    </div>
  );
}
