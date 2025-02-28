"use client";

import kanaData from "@/data/kana.json";
import { useState, useEffect } from "react";
import useQuizStore from "@/store/quizStore";
import { motion, AnimatePresence } from "framer-motion";

interface KanaChar {
  kana: string;
  romaji: string;
}

const Quiz = () => {
  const [randomChar, setRandomChar] = useState<KanaChar | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [prevChar, setPrevChar] = useState<KanaChar | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [answeredWrong, setAnsweredWrong] = useState(false);

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

  const getKanaList = () => {
    const scriptType = mode === "romaji-to-kata" ? "hiragana" : "katakana";
    return Object.values(kanaData[0][scriptType]).flat();
  };

  const getRandomKanaChar = () => {
    const kanaList = getKanaList();
    let newChar;
    do {
      newChar = kanaList[Math.floor(Math.random() * kanaList.length)];
    } while (newChar.romaji === prevChar?.romaji);
    return newChar;
  };

  const getRandomChoices = (correctChar: KanaChar) => {
    const kanaList = getKanaList();
    const incorrectAnswers = kanaList
      .filter(item => item.romaji !== correctChar.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
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
    const newRandomChar = getRandomKanaChar();
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
      incrementProgress(1);
      setAnsweredWrong(false);
      if (progress + 1 === maxProgress) {
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
        }, 100);
      } else {
        generateQuestion();
      }
    } else {
      if (!answeredWrong) {
        incrementWrongGuesses(1);
        setAnsweredWrong(true);
      }
      if (progress > 0) decrementProgress(1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (useQuizStore.getState().progress >= maxProgress) return;
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
    const totalQuestions = maxProgress * 2;
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
    <div className="flex items-center justify-center min-h-screen">
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
            <p className="text-7xl mb-4">
              {mode === "romaji-to-kata"
                ? randomChar?.romaji
                : randomChar?.kana}
            </p>
            <div className="grid grid-cols-3 gap-2">
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
    </div>
  );
};

export default Quiz;
