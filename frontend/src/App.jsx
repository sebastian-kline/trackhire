import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import {useEffect} from "react";
import {jwtDecode} from "jwt-decode";

function SessionWatcher() {
    useEffect(() => {
        function checkToken() {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp * 1000 <= Date.now();

                if (isExpired) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("firstName");
                    window.location.href = "/login?expired=true";
                }
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("firstName");
                window.location.href = "/login?expired=true";
            }
        }

        checkToken();

        const interval = setInterval(checkToken, 5000);

        return () => clearInterval(interval);
    }, []);

    return null;
}

function App() {

    return (
        <BrowserRouter>
            <SessionWatcher />
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route
                    path="/dashboard"
                    element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
