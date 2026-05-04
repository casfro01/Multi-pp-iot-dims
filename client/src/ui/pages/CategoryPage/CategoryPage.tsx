import { useNavigate } from 'react-router'
import './CategoryPage.css'

type Category = {
  id: string
  name: string
  description: string
  questionCount: number
}

const CATEGORIES: Category[] = []

function CategoryPage() {
  const navigate = useNavigate()

  const handleSelect = (category: Category) => {
    const sessionId = Array.from({ length: 12 }, () => Math.floor(Math.random() * 4)).join('')
    navigate(`/lobby/${sessionId}`, { state: { category } })
  }

  return (
    <div className="category-page">
      <div className="category-page__container">
        <header className="category-page__header">
          <h1 className="category-page__title">Choose a Category</h1>
        </header>

        {CATEGORIES.length === 0 ? (
          <p className="category-page__empty">No categories available.</p>
        ) : (
          <div className="category-page__grid">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category)}
                className="category-card"
              >
                <h2 className="category-card__name">{category.name}</h2>
                <p className="category-card__desc">{category.description}</p>
                <span className="category-card__badge">{category.questionCount} questions</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
