export default function Button({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) {
  const base =
    'w-full rounded-xl px-4 py-3 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98] shadow-sm hover:shadow-md focus:ring-gray-400',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
