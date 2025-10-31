export default function Avatar({ initials }) {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
      {initials}
    </div>
  );
}
