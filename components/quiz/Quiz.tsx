"use client"

import hiragana from "@/data/hiragana.json"
import { useState, useEffect } from "react";


interface HiraganaChar  {
    kana: string;
    romaji: string;
}



const Quiz = () => {
    const [randomChar, setRandomChar] = useState<HiraganaChar | null>(null)
    const [choices, setChoices] = useState<string[]>([]);
    const [prevChar, setPrevChar] = useState<HiraganaChar | null>(null);



    const getRandomHiraganaChar = () => {
      let newChar;

      do{
          newChar = hiragana[Math.floor(Math.random() * hiragana.length)];
      }

      while(newChar.romaji === prevChar?.romaji);
      return newChar;

    }

    const getRandomChoices = (correctChar: HiraganaChar ) => {
        const incorrectAnswers = hiragana
            .filter((item) => item.kana !== correctChar.kana)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((item) => item.kana);

        const allChoices = [correctChar.kana, ...incorrectAnswers];
        setChoices(allChoices.sort(() => Math.random() - 0.5));
    }

    const generateQuestion = () =>{
        const newRandomChar = getRandomHiraganaChar();
        setRandomChar(newRandomChar);
        setPrevChar(newRandomChar);

        getRandomChoices(newRandomChar);
    }


    const checkAnswer=(char: string) =>{
        if(!char) return false;

        if(char === randomChar?.kana){
            alert(`True ✔ ${char}:${randomChar?.kana}`);
            generateQuestion();
        }
        else {
            alert(`False ❌ ${char}:${randomChar?.kana}`)
        }
    }


    useEffect(() => {
        generateQuestion();

    }, []);

    return (
        <div className={"flex items-center justify-center h-full "}>
            <div className={"flex flex-col"}>

                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-4xl"}>{`${randomChar?.romaji}`}</p>
                </div>

                <div>
                    {choices.map((char, index) => (
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                                checkAnswer(e.currentTarget.textContent ?? "")
                            }
                            className={"w-[100px] h-[100px] text-4xl"}
                            key={index}
                        >
                            {char}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Quiz;
