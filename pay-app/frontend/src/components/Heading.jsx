export default function Heading({ children, className = '' }) {
  return (
    <h1
      className={
        'text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-2 ' +
        className
      }
    >
      {children}
    </h1>
  );
}
