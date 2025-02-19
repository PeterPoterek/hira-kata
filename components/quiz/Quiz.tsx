"use client";

import hiragana from "@/data/hiragana.json";
import { useState, useEffect } from "react";
import useQuizStore from "@/store/quizStore";
import { motion, AnimatePresence } from "framer-motion";

interface HiraganaChar {
  kana: string;
  romaji: string;
}

const Quiz = () => {
  const [randomChar, setRandomChar] = useState<HiraganaChar | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [prevChar, setPrevChar] = useState<HiraganaChar | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const {
    progress,
    maxProgress,
    mode,
    incrementProgress,
    decrementProgress,
    switchMode,
    wrongGuesses,
    incrementWrongGuesses,
    resetProgress,
  } = useQuizStore();

  const getRandomHiraganaChar = () => {
    let newChar;
    do {
      newChar = hiragana[Math.floor(Math.random() * hiragana.length)];
    } while (newChar.romaji === prevChar?.romaji);
    return newChar;
  };

  const getRandomChoices = (correctChar: HiraganaChar) => {
    const incorrectAnswers = hiragana
      .filter(item => item !== correctChar)
      .slice(0, 4)
      .map(item => (mode === "romaji-to-kata" ? item.kana : item.romaji));

    const allChoices =
      mode === "romaji-to-kata"
        ? [correctChar.kana, ...incorrectAnswers]
        : [correctChar.romaji, ...incorrectAnswers];

    // Fisher-Yates Shuffle
    for (let i = allChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
    }
    setChoices(allChoices);
  };

  const generateQuestion = () => {
    if (mode === "completed") return;
    const newRandomChar = getRandomHiraganaChar();
    setRandomChar(newRandomChar);
    setPrevChar(newRandomChar);
    getRandomChoices(newRandomChar);
  };

  const checkAnswer = (char: string) => {
    if (!char || !randomChar) return;

    const isCorrect =
      mode === "romaji-to-kata"
        ? char === randomChar.kana
        : char === randomChar.romaji;

    if (isCorrect) {
      if (progress + 1 === maxProgress) {
        incrementProgress(1);

        setTimeout(() => {
          if (mode === "romaji-to-kata") {
            setTransitioning(true);
            setTimeout(() => {
              resetProgress();
              switchMode("kata-to-romaji");
              setTransitioning(false);
              generateQuestion();
            }, 1000);
          } else if (mode === "kata-to-romaji") {
            switchMode("completed");
          }
        }, 100); // delay to sure progress updates
      } else {
        incrementProgress(1);
        generateQuestion();
      }
    } else {
      if (progress > 0) {
        decrementProgress(1);
      }
      incrementWrongGuesses(1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentProgress = useQuizStore.getState().progress;
      if (currentProgress >= maxProgress) return;

      const keyIndex = parseInt(event.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < choices.length) {
        checkAnswer(choices[keyIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [choices, randomChar, maxProgress, mode]);

  useEffect(() => {
    generateQuestion();
  }, [mode]);

  if (mode === "completed") {
    const totalQuestions = maxProgress * 2; //2x so both modes
    const totalCorrect = totalQuestions - wrongGuesses;
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-xl">Accuracy: {accuracy}%</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {transitioning ? (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center"
        >
          Next Stage ✔
        </motion.div>
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-7xl">
            {mode === "romaji-to-kata" ? randomChar?.romaji : randomChar?.kana}
          </p>
          <div className="grid grid-cols-5 gap-2">
            {choices.map((char, index) => (
              <button
                onClick={() => checkAnswer(char)}
                className="w-[100px] h-[100px] text-4xl flex items-center justify-center border border-gray-500 rounded relative"
                key={index}
              >
                {char}
                <span className="absolute top-1 left-1 text-sm text-gray-500">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Quiz;
