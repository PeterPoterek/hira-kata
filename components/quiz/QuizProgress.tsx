"use client"

import useQuizStore from "@/store/quizStore"
import { Slider } from "@/components/ui/slider"

const QuizProgress = () => {
    const { progress, maxProgress } = useQuizStore()

    console.log(progress, maxProgress)
    return (
        <div className="w-full max-w-md mx-auto px-4 py-4">
            <Slider value={[progress]} max={maxProgress} step={1} className="w-full" />
            <div className="flex justify-center mt-2 text-sm text-muted-foreground">
                <span>
          {progress} / {maxProgress}
        </span>
            </div>
        </div>
    )
}

export default QuizProgress

