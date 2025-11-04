import { Link } from 'react-router-dom';

export default function BottomWarning({ text, linkText, to }) {
  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      {text}{' '}
      <Link
        to={to}
        className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        {linkText}
      </Link>
    </div>
  );
}
