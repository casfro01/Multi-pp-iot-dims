import { type FormEvent } from 'react';
import '../Auth.css';
import '../../../colors.css';
import {main, signup, start} from "../../pages.ts";
import {useNavigate} from "react-router";
import {useSignInPage} from "./useSignIn.ts";

export default function SignInPage() {
    const {
        setUsername,
        setPassword,
        username,
        password,
        error,
        loading,
        loginAsync
    } = useSignInPage();

    const navigator = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await loginAsync().then(r => {
            if (r) navigator(main);
        });
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