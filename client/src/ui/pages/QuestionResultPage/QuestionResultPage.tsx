import { useNavigate, useParams } from 'react-router'
import { ANSWER_COLORS } from '../../answerStyles'
import './QuestionResultPage.css'

type QuestionResult = {
  correctId: number
  answerLabels: string[]
  responseCounts: number[]
}

function QuestionResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const result: QuestionResult | null = null

  const handleNext = () => {
    navigate(`/quiz/${sessionId}/final`)
  }

  if (!result) {
    return (
      <div className="qresult-page">
        <div className="qresult-page__container">
          <p>Loading results…</p>
        </div>
      </div>
    )
  }

  const totalResponses = result.responseCounts.reduce((sum, n) => sum + n, 0)
  const maxResponses = Math.max(...result.responseCounts)

  return (
    <div className="qresult-page">
      <div className="qresult-page__container">
        <header className="qresult-header">
          <h1 className="qresult-header__title">
            Correct answer:{' '}
            <span className="qresult-header__answer">{result.answerLabels[result.correctId]}</span>
          </h1>
        </header>

        <div className="qresult-chart">
          <h2 className="qresult-chart__title">Answer distribution</h2>
          <div className="qresult-chart__bars">
            {result.answerLabels.map((label, i) => {
              const count = result.responseCounts[i]
              const height = maxResponses === 0 ? 0 : (count / maxResponses) * 100
              return (
                <div
                  key={i}
                  className={`qresult-bar ${i === result.correctId ? 'qresult-bar--correct' : ''}`}
                >
                  <span className="qresult-bar__count">{count}</span>
                  <div
                    className="qresult-bar__fill"
                    style={{ background: ANSWER_COLORS[i], height: `${height}%` }}
                  />
                  <span className="qresult-bar__label">{label}</span>
                </div>
              )
            })}
          </div>
          <p className="qresult-chart__total">{totalResponses} responses</p>
        </div>

        <div className="qresult-actions">
          <button type="button" onClick={handleNext} className="qresult-button">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionResultPage
