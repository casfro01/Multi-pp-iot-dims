export const ANSWER_VARIANTS = ['red', 'blue', 'yellow', 'green'] as const
export type AnswerVariant = (typeof ANSWER_VARIANTS)[number]

export const ANSWER_SHAPES = ['▲', '◆', '●', '■'] as const

export const ANSWER_COLORS = [
  'var(--answer-red)',
  'var(--answer-blue)',
  'var(--answer-yellow)',
  'var(--answer-green)',
] as const
