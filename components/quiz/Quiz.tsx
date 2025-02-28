"use client";

import kanaData from "@/data/kana.json";
import { useState, useEffect } from "react";
import useQuizStore from "@/store/quizStore";
import { motion, AnimatePresence } from "framer-motion";

interface KanaChar {
  kana: string;
  romaji: string;
}

interface KanaGroups {
  [groupName: string]: KanaChar[];
}

type ScriptType = "hiragana" | "katakana";

const Quiz = () => {
  const [randomChar, setRandomChar] = useState<KanaChar | null>(null);
  const [currentGroup, setCurrentGroup] = useState<string>("");
  const [currentScript, setCurrentScript] = useState<ScriptType>("hiragana");
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

  const getGroups = (scriptType: ScriptType): KanaGroups => {
    return kanaData[0][scriptType];
  };

  const getRandomKanaChar = (): {
    char: KanaChar;
    groupKey: string;
    scriptType: ScriptType;
  } => {
    const scriptType: ScriptType =
      Math.random() < 0.5 ? "hiragana" : "katakana";
    const groups = getGroups(scriptType);
    const groupKeys = Object.keys(groups);
    const randomGroupKey =
      groupKeys[Math.floor(Math.random() * groupKeys.length)];
    const groupArr: KanaChar[] = groups[randomGroupKey];
    let newChar: KanaChar;
    do {
      newChar = groupArr[Math.floor(Math.random() * groupArr.length)];
    } while (newChar.romaji === prevChar?.romaji);
    return { char: newChar, groupKey: randomGroupKey, scriptType };
  };

  const getRandomChoices = (
    correctChar: KanaChar,
    groupName: string,
    scriptType: ScriptType,
  ) => {
    const groups = getGroups(scriptType);
    const groupArr: KanaChar[] = groups[groupName];
    const incorrectAnswers = groupArr
      .filter(item => item.romaji !== correctChar.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(item => (mode === "romaji-to-kata" ? item.kana : item.romaji));

    const correctAnswer =
      mode === "romaji-to-kata" ? correctChar.kana : correctChar.romaji;
    const allChoices = [correctAnswer, ...incorrectAnswers];

    // Fisher-Yates Shuffle
    for (let i = allChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
    }
    setChoices(allChoices);
  };

  const generateQuestion = () => {
    if (mode === "completed") return;
    const { char: newRandomChar, groupKey, scriptType } = getRandomKanaChar();
    setRandomChar(newRandomChar);
    setPrevChar(newRandomChar);
    setCurrentGroup(groupKey);
    setCurrentScript(scriptType);
    getRandomChoices(newRandomChar, groupKey, scriptType);
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
    return () => window.removeEventListener("keydown", handleKeyDown);
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
