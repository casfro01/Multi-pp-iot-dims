import { type FormEvent } from 'react';
import '../Auth.css';
import '../../../colors.css';
import {useNavigate} from "react-router";
import {main, signin, start} from "../../pages.ts";
import {useCreateUser} from "./useSignUpPage.ts";


export default function SignUpPage() {
    const navigator = useNavigate();
    const {
        username,
        password,
        error,
        loading,
        success,
        setUsername,
        setPassword,
        createUser,
    } = useCreateUser();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createUser().then(r => {
            if (r) setTimeout(() => navigator(main), 600);
        })
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