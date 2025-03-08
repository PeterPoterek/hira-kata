"use client";

import { Button } from "@/components/ui/button";
import useQuizStore from "@/store/quizStore";

const Selection = () => {
  const { switchMode } = useQuizStore();

  return (
    <div>
      <h1>Selection</h1>
      <Button variant="outline" onClick={() => switchMode("romaji-to-kata")}>
        Play
      </Button>
    </div>
  );
};

export default Selection;
