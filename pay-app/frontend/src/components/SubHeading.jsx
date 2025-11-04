export default function SubHeading({ children, className = '' }) {
  return (
    <p
      className={
        'text-center text-gray-600 text-base font-medium mb-6 ' + className
      }
    >
      {children}
    </p>
  );
}
