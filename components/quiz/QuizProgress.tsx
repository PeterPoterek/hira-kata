"use client"

import useQuizStore from "@/store/quizStore";

const QuizProgress = () => {
    const { progress, increase } = useQuizStore()

    return (
        <div>
            {progress}
        </div>
    );
};

export default QuizProgress;
