import { Navigate, Outlet, useLocation } from "react-router-dom";
import { paths } from  "../path.js";
import { useAuth } from "./useAuth.js"

export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p>Checking session...</p>;
    }

    if(user === null) {
        return <Navigate to={paths.login} replace state={{ from: location }} />;
    }

    return <Outlet />;
}