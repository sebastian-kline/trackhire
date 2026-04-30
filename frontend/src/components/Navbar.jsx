import {Link, useNavigate} from "react-router-dom";
import "../index.css";

function Navbar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("firstName")

        window.dispatchEvent(new Event("authChange"));

        navigate("/");
    }

    return (
        <div className="navbar">
            <div className="nav-left">
                <Link to="/">TrackHire</Link>
            </div>

            <div className="nav-right">
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

        </div>
    );

}

export default Navbar;