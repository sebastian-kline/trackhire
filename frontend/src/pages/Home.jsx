import { Link } from "react-router-dom";
import "./Home.css";
import {useEffect, useState} from "react";

function Home() {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        function checkAuth() {
            setIsLoggedIn(!!localStorage.getItem("token"));
        }

        checkAuth();

        window.addEventListener("authChange", checkAuth);

        return () => {
            window.removeEventListener("authChange", checkAuth);
        };
    }, []);

    return (
        <div className="home-container">
            <div className="background-orb orb-one"></div>
            <div className="background-orb orb-two"></div>
            <div className="background-grid"></div>

            <main className="home-content">
                <div className="home-badge">
                    Simple. Organized. Built for your job search.
                </div>

                <h1>
                    Track your job search in one clean workspace.
                </h1>

                <p>
                    Organize applications, update statuses, save notes, and keep your job hunt moving without messy spreadsheets.
                </p>

                <div className="home-buttons">
                    <Link
                        to={isLoggedIn ? "/dashboard" : "/register"}
                        className="primary-btn"
                    >
                        {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                    </Link>

                    {!isLoggedIn && (
                        <Link to="/login" className="secondary-btn">
                            Log In
                        </Link>
                    )}
                </div>

                <div className="preview-card wide-preview-card">
                    <div className="preview-header">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className="preview-row preview-dashboard-row header">
                        <p>Company</p>
                        <p>Position</p>
                        <p>Status</p>
                        <p>Location</p>
                        <p>Date Applied</p>
                        <p>Salary</p>
                        <p>Industry</p>
                        <p>Contact</p>
                        <p>Source</p>
                        <p>Notes</p>
                    </div>

                    <div className="preview-row preview-dashboard-row">
                        <p>Google</p>
                        <p>Software Engineer</p>
                        <span className="status-pill applied">Applied</span>
                        <p>Boston, MA</p>
                        <p>2026-04-29</p>
                        <p>$95,000</p>
                        <p>Technology</p>
                        <p>Bob Smith</p>
                        <p>LinkedIn</p>
                        <p>Follow-up sent</p>
                    </div>

                    <div className="preview-row preview-dashboard-row">
                        <p>Duolingo</p>
                        <p>Junior Developer</p>
                        <span className="status-pill interviewing">Interviewing</span>
                        <p>Remote</p>
                        <p>2026-04-22</p>
                        <p>$85,000</p>
                        <p>EdTech</p>
                        <p>Sarah Jones</p>
                        <p>Referral</p>
                        <p>Phone screen next week</p>
                    </div>

                    <div className="preview-row preview-dashboard-row">
                        <p>PNC</p>
                        <p>Application Analyst</p>
                        <span className="status-pill accepted">Accepted</span>
                        <p>Pittsburgh, PA</p>
                        <p>2026-04-12</p>
                        <p>$78,000</p>
                        <p>Finance</p>
                        <p>Recruiter</p>
                        <p>Company site</p>
                        <p>Offer received</p>
                    </div>
                </div>

                <footer className="home-footer">
                    <Link to="/terms">Terms</Link>
                    <span>·</span>
                    <Link to="/privacy">Privacy Policy</Link>
                </footer>

            </main>
        </div>
    );
}

export default Home;