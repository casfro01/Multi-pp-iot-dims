import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAtom } from 'jotai'
import { ANSWER_VARIANTS, ANSWER_SHAPES } from '../../answerStyles'
import { StateleSSEClient } from '../../../core/SseClientSecure'
import { subClient } from '../../../core/api-clients'
import { tokenAtom } from '../../../core/atoms/token'
import './LobbyPage.css'
import {mapToPairingPayload, type PairingPayload} from "../../../core/Types/PairingPayload.ts";
import type {Player} from "../../../core/Types/Player.ts";

function parsePinCode(code: string | undefined): number[] {
  if (!code) return []
  return code
    .split('')
    .filter((ch) => /[1-4]/.test(ch))
    .slice(0, 12)
    .map((ch) => Number(ch) - 1)
}

function LobbyPage() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([])
  const [pinCode, setPinCode] = useState<string>('')
  const [token] = useAtom(tokenAtom)

  const pinTiles = parsePinCode(pinCode)

  useEffect(() => {
    const sseClient = new StateleSSEClient('/api/Subscriber/sse', 'connected', token)
    const unsubscribe = sseClient.listen<PairingPayload | string>(
      async (connectionId) => {
        const code = await subClient.subscribeToDeviceConnection(connectionId)
        console.log(code);
        setPinCode(code)
        return { group: 'deviceJoin' + code, data: null }
      },
      (raw) => {
        const pairing: PairingPayload = typeof raw === 'string' ? mapToPairingPayload(JSON.parse(raw)): raw
        setPlayers((prev) =>
          prev.some((p) => p.id === pairing.DeviceId)
            ? prev
            : [...prev, { id: pairing.DeviceId, name: pairing.DisplayName }],
        )
                console.log(players)
      },
    )
    return () => {
      unsubscribe()
      sseClient.disconnect()
    }
  }, [token])

  const handleStart = () => {
    navigate(`/quiz/${pinCode}`)
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