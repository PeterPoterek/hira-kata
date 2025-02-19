import { create } from 'zustand'

interface QuizState {
    mode: "kata-to-romaji" | "romaji-to-kata"
    progress: number
    maxProgress: number
    incrementProgress: (amount: number) => void
    decrementProgress: (amount: number) => void
    resetProgress: () => void
    switchMode: () => void
    wrongGuesses: number
    incrementWrongGuesses: (amount: number) => void
}

const useQuizStore = create<QuizState>()((set) => ({
    mode: "romaji-to-kata",
    progress: 0,
    maxProgress: 5,
    wrongGuesses: 0,
    incrementProgress: (amount) => set((state) => ({
        progress: Math.min(state.progress + amount, state.maxProgress)
    })),
    decrementProgress: (amount) => set((state) => ({
        progress: Math.max(state.progress - amount, 0)
    })),
    resetProgress: () => set(() => ({
        mode: "romaji-to-kata",
        progress: 0,
        wrongGuesses: 0
    })),
    switchMode: () => set((state) => ({
        mode: state.mode === "kata-to-romaji" ? "romaji-to-kata" : "kata-to-romaji",
        progress: 0,
    })),
    incrementWrongGuesses: (amount) => set((state) => ({
        wrongGuesses: state.wrongGuesses + amount
    })),

}))

export default useQuizStore;