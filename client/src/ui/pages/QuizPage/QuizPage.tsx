import { useParams } from 'react-router'
import type { AnswerVariant } from '../../answerStyles'
import './QuizPage.css'

type Answer = {
  id: number
  text: string
  variant: AnswerVariant
  shape: string
}

type Question = {
  index: number
  total: number
  text: string
  answers: Answer[]
}

function QuizPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const question: Question | null = null
  const secondsLeft = 0

  if (!question) {
    return (
      <div className="quiz-page">
        <div className="quiz-page__container">
          <div className="quiz-meta">
            <span>Session {sessionId}</span>
          </div>
          <div className="quiz-question">
            <h1 className="quiz-question__text">Loading question…</h1>
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
            Question {question.index} / {question.total}
          </span>
          <span>Session {sessionId}</span>
        </div>

        <div className="quiz-question">
          <h1 className="quiz-question__text">{question.text}</h1>
        </div>

        <div className="quiz-timer">{secondsLeft}</div>

        <div className="quiz-answers">
          {question.answers.map((answer) => (
            <div key={answer.id} className={`quiz-answer quiz-answer--${answer.variant}`}>
              <span className="quiz-answer__shape">{answer.shape}</span>
              <span className="quiz-answer__text">{answer.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizPage
