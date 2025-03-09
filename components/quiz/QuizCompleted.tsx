import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import useQuizStore from "@/store/quizStore";

interface QuizCompletedProps {
  generateQuestion: () => void;
}

const QuizCompleted = ({ generateQuestion }: QuizCompletedProps) => {
  const { maxProgress, wrongGuesses, switchMode, resetProgress } =
    useQuizStore();

  const totalQuestions = maxProgress * 2;
  const totalCorrect = totalQuestions - wrongGuesses;
  const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card text-card-foreground rounded-xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-2">Quiz Completed!</h1>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            className="relative mx-auto w-32 h-32 mb-4"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeOpacity="0.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${accuracy * 2.83}, 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{accuracy}%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="grid grid-cols-2 gap-4 text-center mb-6"
          >
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-2xl font-bold">{totalCorrect}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Wrong Answers</p>
              <p className="text-2xl font-bold">{wrongGuesses}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Time Spent</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={() => {
                resetProgress();
                switchMode("romaji-to-kata");
                generateQuestion();
              }}
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-refresh-cw"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Try Again
            </Button>
            <Button
              onClick={() => switchMode("selection")}
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-home"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizCompleted;
