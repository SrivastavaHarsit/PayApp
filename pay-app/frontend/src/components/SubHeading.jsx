export default function Heading({ children, className = '' }) {
  return <h1 className={'text-4xl font-extrabold text-center ' + className}>{children}</h1>;
}
