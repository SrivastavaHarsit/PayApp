import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function RequireAuth() {
    const token = localStorage.getItem('payapp_token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <Outlet />;
}