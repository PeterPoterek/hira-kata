import { create } from 'zustand'


interface QuizState {
    progress: number
    increase: (by: number) => void
}

const useQuizStore = create<QuizState>()((set) => ({
    progress: 0,
    increase: (by) => set((state) => ({ progress: state.progress + by })),
}))

export default useQuizStore;