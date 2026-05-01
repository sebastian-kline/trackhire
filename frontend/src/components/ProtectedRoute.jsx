import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function ProtectedRoute({children}) {
    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/" replace />
    }

    try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            localStorage.removeItem("token");
            localStorage.removeItem("firstName");
            return <Navigate to="/login?expired=true" replace />;
        }
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        return <Navigate to="/login?expired=true" replace />;
    }

    return children;

}

export default ProtectedRoute;