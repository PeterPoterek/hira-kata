"use client"

import hiragana from "@/data/hiragana.json"
import { useState, useEffect } from "react";


interface hiraganaChar {
    kana: string;
    romaji: string;
}



const Quiz = () => {
    const [randomChar, setRandomChar] = useState<hiraganaChar | null>(null)

    const getRandomHiraganaChar = () => {
        return  hiragana[Math.floor(Math.random() * hiragana.length)]
    }

    const romajiToHiragana = (event: React.MouseEvent<HTMLButtonElement>) => {
      const romajiChar=  event.currentTarget.textContent

        alert(romajiChar)
    }


    useEffect(() => {
        setRandomChar(getRandomHiraganaChar())
    }, []);
    return (
        <div className={"flex items-center justify-center h-full "}>
            <div className={"flex flex-col"}>

                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-4xl"}>{`${randomChar?.romaji}`}</p>
                </div>

                <div>
                    {hiragana.map((char: hiraganaChar, index: number) => {
                        return <button onClick={romajiToHiragana} className={"w-[100px] h-[100px] text-4xl"} key={index}>{`${char.kana}`}</button>
                    })}
                </div>

            </div>
        </div>
    );
};

export default Quiz;
