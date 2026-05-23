import "./LinkDevice.css"
import {ANSWER_COLORS, ANSWER_SHAPES} from '../../answerStyles.ts'
import {useState} from "react";
import {useLinkDevicePage} from "./useLinkDevice.ts";

// ── Sub-components ────────────────────────────────────────────────────────────

function Background() {
    return (
        <div className="ld-bg">
            <div className="ld-bg__orb ld-bg__orb--1" />
            <div className="ld-bg__orb ld-bg__orb--2" />
            <div className="ld-bg__orb ld-bg__orb--3" />
        </div>
    )
}

/** Renders the 12-digit code as individual coloured tiles */
function CodeDisplay({ code }: { code: string }) {
    return (
        <div className="ld-code-display" role="text" aria-label={`Link code: ${code}`}>
            {code.split('').map((digit, i) => (
                <div
                    key={i}
                    className="ld-code-digit"
                    data-val={digit}
                    style={{ color: ANSWER_COLORS[Number(digit) - 1] }}
                >
                    {ANSWER_SHAPES[Number(digit) - 1]}
                </div>
            ))}
        </div>
    )
}

// ── Step views ────────────────────────────────────────────────────────────────

interface NameStepProps {
    onSubmit: (name: string) => void
    loading: boolean
    error: string | null
}

function NameStep({ onSubmit, loading, error }: NameStepProps) {
    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) return
        onSubmit(trimmed)
    }

    return (
        <>
            <h1 className="ld-heading">Link a device</h1>
            <p className="ld-subheading">
                Give your device a display name — you'll see it in the host dashboard.
            </p>

            {error && <div className="ld-error" role="alert">{error}</div>}

            <form className="ld-form" onSubmit={handleSubmit}>
                <div className="ld-field">
                    <label className="ld-label" htmlFor="ld-device-name">
                        Device name
                    </label>
                    <div className="ld-input-wrap">
                        <span className="ld-input-icon" aria-hidden="true">📺</span>
                        <input
                            id="ld-device-name"
                            className="ld-input"
                            type="text"
                            placeholder="Lars Larsen"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={40}
                            autoComplete="off"
                            autoFocus
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="ld-submit"
                    disabled={loading || !name.trim()}
                >
                    {loading ? (
                        <>
                            <span className="ld-spinner" />
                            Generating code…
                        </>
                    ) : (
                        'Get link code →'
                    )}
                </button>
            </form>
        </>
    )
}

interface CodeStepProps {
    code: string
    displayName: string
    onBack: () => void
}

function CodeStep({ code, displayName, onBack }: CodeStepProps) {
    return (
        <>
            <button className="ld-back" onClick={onBack} type="button">
                ← Back
            </button>

            <h1 className="ld-heading">Enter this code</h1>
            <p className="ld-subheading">
                On your device, open the link page and type in the code below.
            </p>

            <div className="ld-code-section">
                <span className="ld-code-label">Your link code</span>
                <CodeDisplay code={code} />
            </div>

            <div className="ld-divider">
                <div className="ld-divider__line" />
                <span className="ld-divider__text">waiting for device</span>
                <div className="ld-divider__line" />
            </div>

            <div className="ld-waiting">
                <div className="ld-waiting__dots">
                    <div className="ld-waiting__dot" />
                    <div className="ld-waiting__dot" />
                    <div className="ld-waiting__dot" />
                </div>
                <p className="ld-waiting__text">
                    Waiting for <strong>{displayName}</strong> to connect…
                </p>
            </div>
        </>
    )
}

interface SuccessStepProps {
    displayName: string
}

function SuccessStep({ displayName }: SuccessStepProps) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div className="ld-success-icon">✓</div>
            <h1 className="ld-heading" style={{ textAlign: 'center' }}>Device linked!</h1>
            <p className="ld-subheading" style={{ textAlign: 'center' }}>
                <strong style={{ color: 'var(--color-secondary)' }}>{displayName}</strong> has
                been successfully linked. Redirecting…
            </p>
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LinkDevice() {
    const {
        state,
        handleNameSubmit,
        handleBack
    } = useLinkDevicePage();

    // ── Render ──

    return (
        <>
            <Background />

            <div className="ld-page">
                <div className="ld-card">
                    {/* Brand shown only on name step */}
                    {state.step === 'name' && (
                        <div className="ld-brand">
                            <div className="ld-brand__mark">Q</div>
                            <span className="ld-brand__name">Quizora</span>
                        </div>
                    )}

                    {state.step === 'name' && (
                        <NameStep
                            onSubmit={handleNameSubmit}
                            loading={state.loading}
                            error={state.error}
                        />
                    )}

                    {state.step === 'code' && state.code && (
                        <CodeStep
                            code={state.code}
                            displayName={state.displayName}
                            onBack={handleBack}
                        />
                    )}

                    {state.step === 'success' && (
                        <SuccessStep displayName={state.displayName} />
                    )}
                </div>
            </div>
        </>
    )
}