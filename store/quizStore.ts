import { create } from "zustand";

interface QuizState {
  progress: number;
  maxProgress: number;
  mode: "selection" | "romaji-to-kata" | "kata-to-romaji" | "completed";
  wrongGuesses: number;
  incrementProgress: (by: number) => void;
  decrementProgress: (by: number) => void;
  incrementWrongGuesses: (by: number) => void;
  resetProgress: () => void;
  switchMode: (newMode: QuizState["mode"]) => void;
}

const useQuizStore = create<QuizState>()(set => ({
  progress: 0,
  maxProgress: 5,
  mode: "selection",
  wrongGuesses: 0,
  incrementProgress: by => set(state => ({ progress: state.progress + by })),
  decrementProgress: by =>
    set(state => ({ progress: Math.max(state.progress - by, 0) })),
  incrementWrongGuesses: by =>
    set(state => ({ wrongGuesses: state.wrongGuesses + by })),
  resetProgress: () => set({ progress: 0 }),
  switchMode: newMode => set({ mode: newMode }),
}));

export default useQuizStore;
