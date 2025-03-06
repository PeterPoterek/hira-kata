"use client";

import kanaData from "@/data/kana.json";
import { useState, useEffect } from "react";
import useQuizStore from "@/store/quizStore";
import { motion, AnimatePresence } from "framer-motion";
import QuizButton from "@/components/quiz/QuizButton";

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
  const [, setCurrentGroup] = useState<string>("");
  const [, setCurrentScript] = useState<ScriptType>("hiragana");
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

    if (groupKeys.length === 0) {
      console.error("No group keys found for script type:", scriptType);
      return {
        char: { kana: "あ", romaji: "a" },
        groupKey: "vowels",
        scriptType: "hiragana",
      };
    }

    const randomGroupKey =
      groupKeys[Math.floor(Math.random() * groupKeys.length)];

    if (
      !groups[randomGroupKey] ||
      !Array.isArray(groups[randomGroupKey]) ||
      groups[randomGroupKey].length === 0
    ) {
      console.error(
        `Invalid group or empty array for key: ${randomGroupKey} in script: ${scriptType}`,
      );
      // fallback
      return {
        char: { kana: "あ", romaji: "a" },
        groupKey: "vowels",
        scriptType: "hiragana",
      };
    }

    const groupArr: KanaChar[] = groups[randomGroupKey];
    let newChar: KanaChar;

    if (randomGroupKey === "n" && groupArr.length === 1) {
      newChar = groupArr[0];
      if (
        prevChar?.romaji === newChar.romaji &&
        prevChar?.kana === newChar.kana
      ) {
        const otherKeys = groupKeys.filter(key => key !== "n");
        if (otherKeys.length > 0) {
          const otherKey =
            otherKeys[Math.floor(Math.random() * otherKeys.length)];
          const otherGroup = groups[otherKey];
          newChar = otherGroup[Math.floor(Math.random() * otherGroup.length)];
          return { char: newChar, groupKey: otherKey, scriptType };
        }
      }
    } else {
      do {
        newChar = groupArr[Math.floor(Math.random() * groupArr.length)];
      } while (
        newChar.romaji === prevChar?.romaji &&
        newChar.kana === prevChar?.kana
      );
    }

    return { char: newChar, groupKey: randomGroupKey, scriptType };
  };

  const getRandomChoices = (
    correctChar: KanaChar,
    groupName: string,
    scriptType: ScriptType,
  ) => {
    const groups = getGroups(scriptType);

    if (correctChar.romaji === "n") {
      if (scriptType === "hiragana") {
        const options = ["ん", "の", "へ"];
        setChoices(
          mode === "romaji-to-kata"
            ? shuffleArray(options)
            : shuffleArray(["n", "no", "he"]),
        );
      } else if (scriptType === "katakana") {
        const options = ["ン", "ソ", "ノ"];
        setChoices(
          mode === "romaji-to-kata"
            ? shuffleArray(options)
            : shuffleArray(["n", "so", "no"]),
        );
      }
      return;
    }

    if (scriptType === "hiragana") {
      // hiragana edge cases
      if (correctChar.romaji === "wa") {
        const options = ["わ", "ね", "を"];
        setChoices(
          mode === "romaji-to-kata"
            ? shuffleArray(options)
            : shuffleArray(["wa", "ne", "wo"]),
        );
        return;
      } else if (correctChar.romaji === "wo") {
        const options = ["を", "と", "わ"];
        setChoices(
          mode === "romaji-to-kata"
            ? shuffleArray(options)
            : shuffleArray(["wo", "to", "wa"]),
        );
        return;
      }
    } else if (scriptType === "katakana") {
      // katakana edge cases
      if (correctChar.romaji === "wa" || correctChar.romaji === "wo") {
        const options = ["ワ", "ヲ", "フ"];
        setChoices(
          mode === "romaji-to-kata"
            ? shuffleArray(options)
            : shuffleArray(["wa", "wo", "fu"]),
        );
        return;
      }
    }

    if (!groups[groupName] || !Array.isArray(groups[groupName])) {
      console.error(`Invalid group: ${groupName} in script: ${scriptType}`);
      // fallback
      const fallbackChoices =
        mode === "romaji-to-kata"
          ? [correctChar.kana, "ア", "イ"]
          : [correctChar.romaji, "a", "i"];
      setChoices(shuffleArray(fallbackChoices));
      return;
    }

    const groupArr: KanaChar[] = groups[groupName];

    if (groupArr.length < 3) {
      let allChars: KanaChar[] = [];

      Object.values(groups).forEach(group => {
        if (Array.isArray(group)) {
          allChars = [...allChars, ...group];
        }
      });

      const otherChars = allChars.filter(
        item =>
          item.romaji !== correctChar.romaji && item.kana !== correctChar.kana,
      );

      const incorrectAnswers = otherChars
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(item => (mode === "romaji-to-kata" ? item.kana : item.romaji));

      const correctAnswer =
        mode === "romaji-to-kata" ? correctChar.kana : correctChar.romaji;

      setChoices(shuffleArray([correctAnswer, ...incorrectAnswers]));
      return;
    }

    const incorrectAnswers = groupArr
      .filter(item => item.romaji !== correctChar.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(item => (mode === "romaji-to-kata" ? item.kana : item.romaji));

    const correctAnswer =
      mode === "romaji-to-kata" ? correctChar.kana : correctChar.romaji;

    setChoices(shuffleArray([correctAnswer, ...incorrectAnswers]));
  };

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
      const keyIndex = Number.parseInt(event.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < choices.length) {
        checkAnswer(choices[keyIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [choices, maxProgress]);

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
            <div className="grid grid-cols-3 gap-4">
              {choices.map((char, index) => (
                <QuizButton
                  key={char + index}
                  char={char}
                  index={index}
                  onSelectAction={() => checkAnswer(char)}
                  isWrongState={answeredWrong}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
