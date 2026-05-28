import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAtom } from 'jotai'
import { ANSWER_VARIANTS, ANSWER_SHAPES } from '../../answerStyles'
import { quizClient, subClient } from '../../../core/api-clients'
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

function mapAnswer(raw: any): AnswerRequest {
  return {
    deviceId: raw.DeviceId,
    code: raw.Code,
    answer: raw.Answer,
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
    const unsubscribe = sseClient.listen<AnswerRequest | string>(
      async (connectionId) => {
        await subClient.subscribeToQuizAnswers(connectionId, pinCode)
        return { group: 'quizAnswer' + pinCode, data: null }
      },
      (raw) => {
        const answer: AnswerRequest = typeof raw === 'string' ? mapAnswer(JSON.parse(raw)) : raw
        const qId = currentQuestion?.id
        if (qId == null) return
        setAnswersByQuestion((prev) => {
          const list = prev[qId] ?? []
          if (list.some((a) => a.deviceId === answer.deviceId)) return prev
          return { ...prev, [qId]: [...list, answer] }
        })
      },
    )
    return () => unsubscribe()
  }, [sseClient, pinCode, currentQuestion])

  const handleNext = () => {
    if (!quiz?.questions) return
    if (currentIndex + 1 >= quiz.questions.length) return
    setCurrentIndex((i) => i + 1)
  }

  const handleBackToLobby = () => navigate('/lobby')

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

  const total = quiz.questions?.length ?? 0
  const tally = answersByQuestion[currentQuestion.id ?? -1] ?? []
  const isLast = currentIndex + 1 >= total

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

        <div className="quiz-timer">{tally.length}</div>

        <div className="quiz-answers">
          {(currentQuestion.answers ?? []).slice(0, 4).map((answer: BaseAnswerResponse, idx) => {
            const variant = ANSWER_VARIANTS[idx % ANSWER_VARIANTS.length]
            const shape = ANSWER_SHAPES[idx % ANSWER_SHAPES.length]
            return (
              <div key={answer.id ?? idx} className={`quiz-answer quiz-answer--${variant}`}>
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
            disabled={isLast}
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
