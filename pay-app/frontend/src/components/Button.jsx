export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={
        'w-full rounded-xl px-4 py-3 font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
