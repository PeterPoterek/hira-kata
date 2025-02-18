"use client"

import hiragana from "@/data/hiragana.json"
import { useState, useEffect } from "react";
import useQuizStore from "@/store/quizStore";


interface HiraganaChar  {
    kana: string;
    romaji: string;
}



const Quiz = () => {
    const [randomChar, setRandomChar] = useState<HiraganaChar | null>(null)
    const [choices, setChoices] = useState<string[]>([]);
    const [prevChar, setPrevChar] = useState<HiraganaChar | null>(null);

    const {progress, maxProgress,  mode, incrementProgress, decrementProgress, switchMode, wrongGuesses, incrementWrongGuesses} = useQuizStore()



    const getRandomHiraganaChar = () => {
      let newChar;

      do {
          newChar = hiragana[Math.floor(Math.random() * hiragana.length)];
      }

      //To make sure its different every time
      while(newChar.romaji === prevChar?.romaji);
      return newChar;

    }

    const getRandomChoices = (correctChar: HiraganaChar) => {
        const incorrectAnswers = hiragana
            .filter((item) => item !== correctChar)
            .slice(0, 4)
            .map((item) => mode === "romaji-to-hiragana" ? item.kana : item.romaji);

        const allChoices = mode === "romaji-to-hiragana"
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
        const newRandomChar = getRandomHiraganaChar();
        if (newRandomChar.kana !== prevChar?.kana) {
            setRandomChar(newRandomChar);
        }
        setPrevChar(newRandomChar);
        getRandomChoices(newRandomChar);
    }

    const checkAnswer = (char: string) => {
        if (!char || !randomChar || progress >= maxProgress) return;

        const isCorrect = mode === "romaji-to-hiragana"
            ? char === randomChar.kana
            : char === randomChar.romaji;

        if (isCorrect) {
            if (progress + 1 === maxProgress) {
                alert(`Next stage ✔`);
                incrementProgress(1);
                switchMode();
                generateQuestion();
            } else {
                incrementProgress(1);
                generateQuestion();
            }
        } else if (progress > 0) {
            decrementProgress(1);
            incrementWrongGuesses(1)
        }
    }


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (progress >= maxProgress) return;

            const keyIndex = parseInt(event.key, 10) - 1;
            if (keyIndex >= 0 && keyIndex < choices.length) {
                checkAnswer(choices[keyIndex]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [choices, randomChar, progress, maxProgress]);

    useEffect(() => {
        generateQuestion();
    }, [mode]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <p className="text-7xl">
                    {mode === "romaji-to-hiragana" ? randomChar?.romaji: randomChar?.kana}</p>
                <div className="grid grid-cols-5 gap-2">
                    {choices.map((char, index) => (
                        <button
                            onClick={() => checkAnswer(char)}
                            className="w-[100px] h-[100px] text-4xl flex items-center justify-center border border-gray-500 rounded relative"
                            key={index}
                        >
                            {char}
                            <span className="absolute top-1 left-1 text-sm text-gray-500">{index + 1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default Quiz;
