import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ANSWER_VARIANTS, ANSWER_SHAPES } from '../../answerStyles'
import './LobbyPage.css'

type Player = {
  id: string
  name: string
}

function parsePinCode(sessionId: string | undefined): number[] {
  if (!sessionId) return []
  return sessionId
    .split('')
    .filter((ch) => /[0-3]/.test(ch))
    .slice(0, 12)
    .map((ch) => Number(ch))
}

function LobbyPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [players] = useState<Player[]>([])

  const pinTiles = parsePinCode(sessionId)

  const handleStart = () => {
    navigate(`/quiz/${sessionId}`)
  }

  return (
    <div className="lobby-page">
      <div className="lobby-page__container">
        <div className="lobby-pin">
          <span className="lobby-pin__label">Game PIN</span>
          <div className="lobby-pin__code" aria-label="Color pin code">
            {pinTiles.map((idx, i) => (
              <div key={i} className={`lobby-pin__tile lobby-pin__tile--${ANSWER_VARIANTS[idx]}`}>
                <span className="lobby-pin__shape">{ANSWER_SHAPES[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lobby-players">
          <div className="lobby-players__head">
            <h2 className="lobby-players__title">
              Players<span className="lobby-players__count">({players.length})</span>
            </h2>
            <button
              type="button"
              onClick={handleStart}
              disabled={players.length === 0}
              className="lobby-players__start"
            >
              Start Game
            </button>
          </div>

          {players.length === 0 ? (
            <div className="lobby-players__empty">Waiting for players to join…</div>
          ) : (
            <div className="lobby-players__grid">
              {players.map((player) => (
                <div key={player.id} className="lobby-player">
                  {player.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LobbyPage
