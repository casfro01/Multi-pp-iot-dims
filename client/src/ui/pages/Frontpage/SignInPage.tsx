import { useState, type FormEvent } from 'react';
import './auth.css';
import '../../colors.css';
import {main, signup, start} from "../pages.ts";
import {useNavigate} from "react-router";

export default function SignInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigator = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in both fields.');
            return;
        }

        setLoading(true);
        // Simulate async auth
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);

        // Replace with real auth logic
        navigator(main);
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
                    <h1 className="auth-heading">Sign In</h1>
                    <p className="auth-subheading">Good to see you again.</p>

                    {/* Error */}
                    {error && <p className="auth-error">{error}</p>}

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signin-username">
                                Username
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="signin-username"
                                    className="auth-input"
                                    type="text"
                                    placeholder="your_username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span className="auth-input-icon">@</span>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signin-password">
                                Password
                            </label>
                            <div className="auth-input-wrap">
                                <input
                                    id="signin-password"
                                    className="auth-input"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
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
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-footer">
                        No account yet?{' '}
                        <button onClick={() => navigator(signup)}>Sign up</button>
                    </p>
                </div>
            </div>
        </>
    );
}