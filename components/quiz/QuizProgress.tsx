"use client";

import useQuizStore from "@/store/quizStore";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

const QuizProgress = () => {
  const { progress, maxProgress, mode, wrongGuesses } = useQuizStore();

  const progressPercentage = (progress / maxProgress) * 100;

  const getProgressColor = () => {
    if (progressPercentage < 30) return "text-red-500";
    if (progressPercentage < 70) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium">
          {mode === "romaji-to-kata"
            ? "Romaji to Kana"
            : mode === "kata-to-romaji"
              ? "Kana to Romaji"
              : "Completed"}
        </span>
        <span className="text-sm text-muted-foreground">
          Wrong guesses: {wrongGuesses}
        </span>
      </div>

      <div className="relative">
        <Slider value={[progress]} max={maxProgress} step={1} />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-sm text-muted-foreground">0</span>
        <motion.span
          className={`text-sm font-medium ${getProgressColor()}`}
          key={progress}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          {progress} / {maxProgress}
        </motion.span>
        <span className="text-sm text-muted-foreground">{maxProgress}</span>
      </div>
    </div>
  );
};

export default QuizProgress;
