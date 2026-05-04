import { useNavigate } from 'react-router'
import './FinalResultPage.css'

type ScoreEntry = {
  id: string
  name: string
  score: number
}

const FINAL_SCORES: ScoreEntry[] = []

const PODIUM_SLOT_CLASS = ['podium-slot--second', 'podium-slot--first', 'podium-slot--third']
const PODIUM_PLACE = [2, 1, 3]

function FinalResultPage() {
  const navigate = useNavigate()
  const sorted = [...FINAL_SCORES].sort((a, b) => b.score - a.score)
  const podium = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  const orderedPodium = [podium[1], podium[0], podium[2]].filter(Boolean) as ScoreEntry[]

  return (
    <div className="final-page">
      <div className="final-page__container">
        <header className="final-header">
          <h1 className="final-header__title">Final Results</h1>
        </header>

        {sorted.length === 0 ? (
          <p className="final-page__empty">No scores to show.</p>
        ) : (
          <>
            <div className="podium">
              {orderedPodium.map((player, i) => (
                <div key={player.id} className={`podium-slot ${PODIUM_SLOT_CLASS[i]}`}>
                  <div className="podium-slot__name">{player.name}</div>
                  <div className="podium-slot__score">{player.score} pts</div>
                  <div className="podium-slot__block">#{PODIUM_PLACE[i]}</div>
                </div>
              ))}
            </div>

            {rest.length > 0 && (
              <div className="leaderboard">
                <h2 className="leaderboard__title">Leaderboard</h2>
                <ul className="leaderboard__list">
                  {rest.map((player, i) => (
                    <li key={player.id} className="leaderboard__row">
                      <span className="leaderboard__rank">{i + 4}</span>
                      <span className="leaderboard__name">{player.name}</span>
                      <span className="leaderboard__score">{player.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="final-actions">
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="final-button final-button--primary"
          >
            Play again
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="final-button final-button--ghost"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinalResultPage
