import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {register} from "../services/authService.js";
import "./Auth.css"

function Register() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Register Account logic
    async function handleRegister(e) {
        e.preventDefault();

        try {
            const data = await register(firstName, lastName, email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("firstName", data.firstName);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setErrors(error);
        }

    }

    // If user is already logged in, don't show register page
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);

    return (

        <div className="auth-page">
            <div className="auth-card">
                <h1>Create account</h1>
                <p>Start tracking your job search in one place.</p>

                <form onSubmit={handleRegister}>
                    <input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => {setFirstName(e.target.value); setErrors({})}}
                    />
                    <input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => {setLastName(e.target.value); setErrors({})}}
                    />
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
                    <button type="submit">Create Account</button>
                </form>

                <div className="auth-link">
                    <Link to="/login">Already have an account? Log in</Link>
                </div>
            </div>
        </div>
    )

}

export default Register;