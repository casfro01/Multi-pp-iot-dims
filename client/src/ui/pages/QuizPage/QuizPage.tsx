import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAtom } from 'jotai'
import { ANSWER_VARIANTS, ANSWER_SHAPES } from '../../answerStyles'
import { commandSenderClient, quizClient, subClient } from '../../../core/api-clients'
import { LightCommands } from '../../../core/ServerAPI'
import type {
  BaseAnswerResponse,
  BaseQuestionResponse,
  QuizWithQuestionsResponse,
} from '../../../core/ServerAPI'

type AnswerRequest = {
  deviceId: string
  code: string
  answer: number
}
import {
  pinCodeAtom,
  playersAtom,
  selectedQuizAtom,
  sseClientAtom,
} from '../../../core/atoms/lobby'
import './QuizPage.css'

function mapButtonEventToAnswer(raw: any): AnswerRequest | null {
  const deviceId = raw?.deviceId ?? raw?.DeviceId ?? raw?.DeviceID
  const code = raw?.connectCode ?? raw?.ConnectCode ?? raw?.code ?? raw?.Code
  const buttonRaw = raw?.button ?? raw?.Button
  let answer: number | null = null

  // ButtonPressRequest.Button enum order:
  // Red = 0, Green = 1, Blue = 2, Yellow = 3
  if (typeof buttonRaw === 'number') {
    const answerByEnumNumber: Record<number, number> = {
      0: 0, // red -> answer index 0
      1: 3, // green -> answer index 3
      2: 1, // blue -> answer index 1
      3: 2, // yellow -> answer index 2
    }
    answer = answerByEnumNumber[buttonRaw] ?? null
  } else {
    const button = String(buttonRaw ?? '').toLowerCase()
    const answerByButtonName: Record<string, number> = {
      red: 0,
      green: 3,
      blue: 1,
      yellow: 2,
    }
    answer = answerByButtonName[button] ?? null
  }

  if (!deviceId || !code || answer == null) return null

  return {
    deviceId,
    code,
    answer,
  }
}

function QuizPage() {
  const navigate = useNavigate()
  const [pinCode] = useAtom(pinCodeAtom)
  const [players] = useAtom(playersAtom)
  const [sseClient] = useAtom(sseClientAtom)
  const [selectedQuiz] = useAtom(selectedQuizAtom)

  const [quiz, setQuiz] = useState<QuizWithQuestionsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<number, AnswerRequest[]>>({})
  const [revealedByQuestion, setRevealedByQuestion] = useState<Record<number, boolean>>({})
  const [scoresByDevice, setScoresByDevice] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!pinCode || !sseClient || !selectedQuiz?.id) {
      navigate('/categories', { replace: true })
    }
  }, [pinCode, sseClient, selectedQuiz, navigate])

  useEffect(() => {
    if (!selectedQuiz?.id) return
    let cancelled = false
    quizClient
      .getQuiz(selectedQuiz.id)
      .then((data) => {
        if (!cancelled) setQuiz(data)
      })
      .catch(() => {
        if (!cancelled) setError('Kunne ikke hente quizzen.')
      })
    return () => {
      cancelled = true
    }
  }, [selectedQuiz])

  const currentQuestion: BaseQuestionResponse | null = useMemo(() => {
    if (!quiz?.questions || quiz.questions.length === 0) return null
    return quiz.questions[currentIndex] ?? null
  }, [quiz, currentIndex])

  useEffect(() => {
    if (!sseClient || !pinCode) return
    console.log('[QuizPage] Subscribing to quiz answers', { pinCode })
    const unsubscribe = sseClient.listen<any>(
      async (connectionId) => {
        console.log('[QuizPage] Registering SubscribeToQuizAnswers', { connectionId, pinCode })
        await subClient.subscribeToQuizAnswers(connectionId, pinCode)
        return { group: pinCode, data: null }
      },
      (raw) => {
        console.log('[QuizPage] Raw SSE event received', raw)
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
        const answer = mapButtonEventToAnswer(parsed)
        console.log('[QuizPage] Parsed button -> answer mapping', { parsed, answer })
        if (!answer) return
        const qId = currentQuestion?.id
        if (qId == null) return
        setAnswersByQuestion((prev) => {
          const list = prev[qId] ?? []
          console.log('[QuizPage] Current tally before update', {
            questionId: qId,
            existingAnswers: list.length,
            incomingDeviceId: answer.deviceId,
          })
          if (list.some((a) => a.deviceId === answer.deviceId)) return prev
          const next = { ...prev, [qId]: [...list, answer] }
          console.log('[QuizPage] Tally updated', {
            questionId: qId,
            newAnswers: next[qId].length,
            expectedPlayers: players.length,
          })
          return next
        })
      },
    )
    return () => unsubscribe()
  }, [sseClient, pinCode, currentQuestion, players.length])

  const handleNext = () => {
    if (!quiz?.questions) return
    if (currentIndex + 1 >= quiz.questions.length) return
    setCurrentIndex((i) => i + 1)
  }

  const handleBackToLobby = () => navigate('/lobby')

  const total = quiz?.questions?.length ?? 0
  const currentQuestionId = currentQuestion?.id
  const tally = answersByQuestion[currentQuestionId ?? -1] ?? []
  const isLast = currentIndex + 1 >= total
  const isCurrentRevealed = currentQuestionId != null && revealedByQuestion[currentQuestionId]
  const allPlayersAnswered = players.length > 0 && tally.length >= players.length
  const correctAnswerIndex = (currentQuestion?.answers ?? []).findIndex((answer) => answer.correct)

  useEffect(() => {
    if (currentQuestionId == null || currentQuestion == null) return
    if (!allPlayersAnswered || revealedByQuestion[currentQuestionId]) return

    console.log('[QuizPage] Revealing question answers', {
      currentQuestionId,
      tally: tally.length,
      players: players.length,
      correctAnswerIndex,
    })
    setRevealedByQuestion((prev) => ({ ...prev, [currentQuestionId]: true }))

    const normalizeAnswer = (answer: number): number => {
      if (answer >= 1 && answer <= 4) return answer - 1
      return answer
    }

    setScoresByDevice((prev) => {
      const next = { ...prev }
      for (const reply of tally) {
        if (normalizeAnswer(reply.answer) === correctAnswerIndex) {
          next[reply.deviceId] = (next[reply.deviceId] ?? 0) + 1
        }
      }
      return next
    })

    void Promise.all(
      tally.map((reply) => {
        const isCorrect = normalizeAnswer(reply.answer) === correctAnswerIndex
        console.log('[QuizPage] Sending blink command', {
          deviceId: reply.deviceId,
          isCorrect,
          command: isCorrect ? LightCommands.GreenBlink : LightCommands.RedBlink,
        })
        return commandSenderClient.blink({
          deviceId: reply.deviceId,
          command: isCorrect ? LightCommands.GreenBlink : LightCommands.RedBlink,
        })
      }),
    ).catch(() => {
      // Ignore blink errors to keep quiz flow running.
    })
  }, [
    allPlayersAnswered,
    correctAnswerIndex,
    currentQuestion,
    currentQuestionId,
    revealedByQuestion,
    tally,
  ])

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-page__container">
          <div className="quiz-question">
            <h1 className="quiz-question__text">{error}</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="quiz-page">
        <div className="quiz-page__container">
          <div className="quiz-question">
            <h1 className="quiz-question__text">Loading question…</h1>
          </div>
        </div>
      </div>
    )
  }

  if (total > 0 && currentIndex === total - 1 && isCurrentRevealed) {
    const sortedPlayers = [...players].sort((a, b) => (scoresByDevice[b.id] ?? 0) - (scoresByDevice[a.id] ?? 0))
    return (
      <div className="quiz-page">
        <div className="quiz-page__container">
          <div className="quiz-question">
            <h1 className="quiz-question__text">Results</h1>
          </div>
          <div className="quiz-results">
            {sortedPlayers.map((player) => (
              <div key={player.id} className="quiz-results__row">
                <span>{player.name}</span>
                <span>{scoresByDevice[player.id] ?? 0}</span>
              </div>
            ))}
          </div>
          <div className="quiz-controls">
            <button type="button" onClick={handleBackToLobby} className="quiz-controls__back">
              Back to lobby
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-page">
      <div className="quiz-page__container">
        <div className="quiz-meta">
          <span>
            Question {currentIndex + 1} / {total}
          </span>
          <span>{players.length} connected</span>
        </div>

        <div className="quiz-question">
          <h1 className="quiz-question__text">{currentQuestion.content}</h1>
        </div>
        <div className="quiz-status">
          {allPlayersAnswered
            ? 'All players answered'
            : `Waiting for players... ${tally.length}/${players.length}`}
        </div>

        <div className="quiz-answers">
          {(currentQuestion.answers ?? []).slice(0, 4).map((answer: BaseAnswerResponse, idx) => {
            const variant = ANSWER_VARIANTS[idx % ANSWER_VARIANTS.length]
            const shape = ANSWER_SHAPES[idx % ANSWER_SHAPES.length]
            const isCorrect = isCurrentRevealed && answer.correct
            return (
              <div
                key={answer.id ?? idx}
                className={`quiz-answer quiz-answer--${variant}${isCorrect ? ' quiz-answer--correct' : ''}`}
              >
                <span className="quiz-answer__shape">{shape}</span>
                <span className="quiz-answer__text">{answer.content}</span>
              </div>
            )
          })}
        </div>

        <div className="quiz-controls">
          <button type="button" onClick={handleBackToLobby} className="quiz-controls__back">
            Back to lobby
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLast || !isCurrentRevealed}
            className="quiz-controls__next"
          >
            {isLast ? 'Last question' : 'Next question'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
