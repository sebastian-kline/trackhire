import {useEffect, useState} from "react";
import {login} from "../services/authService.js";
import {Link, useNavigate} from "react-router-dom";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Login logic
    async function handleLogin(e) {
        e.preventDefault();

        try {
            const data = await login(email, password);

            // Save the token
            localStorage.setItem("token", data.token);
            localStorage.setItem("firstName", data.firstName);

            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            if(error.email || error.password) { // If not a validation error, then set the error to invalid email/password
                setErrors(error);
            } else {
                setErrors({
                    general: "Invalid email or password.",
                });
            }
        }
    }

    // If user is already logged in, don't show login page again
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Log in</h1>
                <p>Welcome back to TrackHire.</p>

                <form onSubmit={handleLogin}>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value); setErrors({})}}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setErrors({})}}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}

                    {errors.general && <p className="error-text">{errors.general}</p>}
                    <button type="submit">Login</button>
                </form>

                <div className="auth-link">
                    <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    )

}

export default Login;