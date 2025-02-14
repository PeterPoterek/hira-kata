import { create } from 'zustand'


interface QuizState {
    progress: number
    maxProgress: number
    incrementProgress: (amount: number) => void
    decrementProgress: (amount : number) => void
}

const useQuizStore = create<QuizState>()((set) => ({
    progress: 0,
    maxProgress: 5,
    incrementProgress: (amount ) => set((state) => ({ progress: state.progress + amount  })),
    decrementProgress: (amount ) => set((state) => ({ progress: state.progress - amount  })),
}))

export default useQuizStore;