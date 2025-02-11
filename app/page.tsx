import hiragana from "@/data/hiragana.json"


interface hiraganaChar {
    kana: string;
    romaji: string;
}

const Page = () => {

    console.log(hiragana);

    const getRandomHiraganaChar = () => {
       return  hiragana[Math.floor(Math.random() * hiragana.length)]
    }



    return (
        <div className={"flex items-center justify-center h-full "}>
            <div className={"flex flex-col"}>

                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-4xl"}>{`${getRandomHiraganaChar().romaji}`}</p>
                </div>

                <div>
                    {hiragana.map((char: hiraganaChar,index: number )=>{
                        return <button  className={"w-[100px] h-[100px] text-4xl"} key={index}>{`${char.kana}`}</button>
                    })}
                </div>


            </div>
        </div>
    );
};

export default Page;
