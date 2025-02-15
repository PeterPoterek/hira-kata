import { create } from 'zustand'

interface QuizState {
    mode: "hiragana-to-romaji" | "romaji-to-hiragana"
    progress: number
    maxProgress: number
    incrementProgress: (amount: number) => void
    decrementProgress: (amount: number) => void
    resetProgress: () => void
    switchMode: () => void
}

const useQuizStore = create<QuizState>()((set) => ({
    mode: "romaji-to-hiragana",
    progress: 0,
    maxProgress: 5,
    incrementProgress: (amount) => set((state) => ({
        progress: Math.min(state.progress + amount, state.maxProgress)
    })),
    decrementProgress: (amount) => set((state) => ({
        progress: Math.max(state.progress - amount, 0)
    })),
    resetProgress: () => set(() => ({
        mode: "romaji-to-hiragana",
        progress: 0
    })),
    switchMode: () => set((state) => ({
        mode: state.mode === "hiragana-to-romaji" ? "romaji-to-hiragana" : "hiragana-to-romaji",
        progress: 0,
    })),
}))

export default useQuizStore;