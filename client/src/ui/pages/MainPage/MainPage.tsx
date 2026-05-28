import './Main.css'
import {useNavigate} from "react-router";

function Background() {
    return (
        <div className="mp-bg">
            <div className="mp-bg__orb mp-bg__orb--1" />
            <div className="mp-bg__orb mp-bg__orb--2" />
            <div className="mp-bg__orb mp-bg__orb--3" />
        </div>
    )
}

export default function MainPage() {
    const navigate = useNavigate()

    return (
        <>
            <Background />

            <div className="mp-page">
                <div className="mp-card">

                    <div className="mp-brand">
                        <div className="mp-brand__mark">K</div>
                        <span className="mp-brand__name">Kahoot!</span>
                    </div>

                    <h1 className="mp-heading">What's next?</h1>
                    <p className="mp-subheading">Choose an action to get started.</p>

                    <div className="mp-actions">
                        <button
                            className="mp-btn mp-btn--primary"
                            onClick={() => navigate('/categories')}
                        >
                            <div className="mp-btn__left">
                                <span className="mp-btn__icon">🎯</span>
                                <div className="mp-btn__label">
                                    <span className="mp-btn__title">Choose Category</span>
                                    <span className="mp-btn__desc">Pick a quiz topic to play</span>
                                </div>
                            </div>
                            <span className="mp-btn__arrow">→</span>
                        </button>

                        <button
                            className="mp-btn"
                            onClick={() => navigate('/linkdevice')}
                        >
                            <div className="mp-btn__left">
                                <span className="mp-btn__icon">📺</span>
                                <div className="mp-btn__label">
                                    <span className="mp-btn__title">Link device</span>
                                    <span className="mp-btn__desc">Connect a display to this session</span>
                                </div>
                            </div>
                            <span className="mp-btn__arrow">→</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}