import { Link } from 'react-router-dom';

export default function AppBar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semibold">Payments App</Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hello, User</span>
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  );
}
