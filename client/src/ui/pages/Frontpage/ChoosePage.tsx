import './auth.css';
import '../../colors.css';
import {useNavigate} from "react-router";
import {signin, signup} from "../pages.ts";

export default function LandingPage() {
    const navigator = useNavigate();
    return (
        <>
            {/* Ambient background */}
            <div className="auth-bg">
                <div className="auth-bg__orb auth-bg__orb--1" />
                <div className="auth-bg__orb auth-bg__orb--2" />
                <div className="auth-bg__orb auth-bg__orb--3" />
            </div>

            <div className="auth-page">
                <div className="auth-card">
                    {/* Brand */}
                    <div className="auth-brand">
                        <div className="auth-brand__mark">Q</div>
                        <span className="auth-brand__name">Quizora</span>
                    </div>

                    {/* Heading */}
                    <h1 className="auth-heading">Welcome back.</h1>
                    <p className="auth-subheading">
                        Jump in to create, play, and compete.
                    </p>

                    {/* Choices */}
                    <div className="auth-choice-group">
                        <button
                            className="auth-choice-btn auth-choice-btn--primary"
                            onClick={() => navigator(signin)}
                        >
                            Sign In
                            <span className="auth-choice-btn__arrow">→</span>
                        </button>

                        <button
                            className="auth-choice-btn"
                            onClick={() => navigator(signup)}
                        >
                            Create an Account
                            <span className="auth-choice-btn__arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}