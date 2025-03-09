"use client";

import Quiz from "@/components/quiz/Quiz";
import Selection from "@/components/selection/Selection";
import useQuizStore from "@/store/quizStore";

const page = () => {
  const { mode } = useQuizStore();

  if (mode === "selection") {
    return (
      <Selection
        onComplete={selectedRows => {
          console.log(selectedRows);
        }}
      />
    );
  } else {
    return <Quiz />;
  }
};

export default page;
