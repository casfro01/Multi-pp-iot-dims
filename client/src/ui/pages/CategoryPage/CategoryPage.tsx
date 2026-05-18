import { useNavigate } from 'react-router'
import './CategoryPage.css'
import { type BaseQuizResponse } from '../../../core/ServerAPI'
import { useCallback, useEffect, useState } from 'react'
import { quizClient } from '../../../core/api-clients'

function CategoryPage() {
  const [quizzes, setQuizzes] = useState<BaseQuizResponse[]>([])
  const navigate = useNavigate()

  const fetchQuizzes = useCallback(async () => {
    try {
      const data = await quizClient.getQuizzes()

      const enriched = data.map((quiz: BaseQuizResponse) => ({
        ...quiz,
        id: quiz.id ?? 0,
      }))

      setQuizzes(enriched)
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
    }
  }, [])

  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  const handleSelect = (category: BaseQuizResponse) => {
    navigate(`/lobby`, {
      state: { category },
    })
  }

  return (
    <div className="category-page">
      <div className="category-page__container">
        <header className="category-page__header">
          <h1 className="category-page__title">Choose a Category</h1>
        </header>

        {quizzes.length === 0 ? (
          <p className="category-page__empty">No categories available.</p>
        ) : (
          <div className="category-page__grid">
            {quizzes.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category)}
                className="category-card"
              >
                <h2 className="category-card__name">{category.name}</h2>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage

