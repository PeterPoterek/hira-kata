"use client"

import useQuizStore from "@/store/quizStore";

const QuizProgress = () => {
    const { progress } = useQuizStore()

    return (
        <div className={"flex items-center justify-center"}>
            <span className={"text-6xl"}>{progress}</span>
        </div>
    );
};

export default QuizProgress;
