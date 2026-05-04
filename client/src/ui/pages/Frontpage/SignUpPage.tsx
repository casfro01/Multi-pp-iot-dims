import { useState, type FormEvent } from 'react';
import './auth.css';
import '../../colors.css';
import {useNavigate} from "react-router";
import {main, signin, start} from "../pages.ts";


export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username.trim()) {
            setError('Please choose a username.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        // Simulate async register
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);

        setSuccess('Account created! Redirecting…');
        setTimeout(() => navigator(main), 1200);
    };

    return (
        <>
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

                    {/* Back */}
                    <button className="auth-back" onClick={() => navigator(start)}>
                        ← Back
                    </button>

                    {/* Heading */}
                    <h1 className="auth-heading">Create Account</h1>
                    <p className="auth-subheading">Join the game. It's free.</p>

                    {/* Feedback */}
                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">{success}</p>}

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signup-username">
                                Username
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="signup-username"
                                    className="auth-input"
                                    type="text"
                                    placeholder="pick_a_username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span className="auth-input-icon">@</span>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signup-password">
                                Password
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="signup-password"
                                    className="auth-input"
                                    type="password"
                                    placeholder="min. 6 characters"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="auth-input-icon">🔒</span>
                            </div>
                        </div>

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-footer">
                        Already have an account?{' '}
                        <button onClick={() => navigator(signin)}>Sign in</button>
                    </p>
                </div>
            </div>
        </>
    );
}