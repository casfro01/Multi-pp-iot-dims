import { atom } from 'jotai'
import type { BaseQuizResponse } from '../ServerAPI'
import type { StateleSSEClient } from '../SseClientSecure'

export type Player = {
  id: string
  name: string
}

export const pinCodeAtom = atom<string>('')
export const playersAtom = atom<Player[]>([])
export const sseClientAtom = atom<StateleSSEClient | null>(null)
export const selectedQuizAtom = atom<BaseQuizResponse | null>(null)
