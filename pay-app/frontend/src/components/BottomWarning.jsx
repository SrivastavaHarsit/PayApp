import { Link } from 'react-router-dom';

export default function BottomWarning({ text, linkText, to }) {
  return (
    <div className="mt-4 text-center text-sm">
      {text} <Link className="text-gray-900 underline" to={to}>{linkText}</Link>
    </div>
  );
}
