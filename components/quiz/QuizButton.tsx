"use client";

import { motion } from "framer-motion";

interface QuizButtonProps {
  char: string;
  index: number;
  onClick: () => void;
  isWrongState: boolean;
}

export const QuizButton = ({
  char,
  index,
  onClick,
  isWrongState,
}: QuizButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      key={char + index}
      className={`w-[100px] h-[100px] text-4xl flex items-center justify-center rounded-xl relative overflow-hidden
        ${isWrongState ? "hover:bg-red-100 dark:hover:bg-red-950/30" : "hover:bg-primary/10"} 
        transition-colors duration-200 shadow-md`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <motion.div
        className="absolute inset-0 bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 rounded-xl"
        initial={{ borderRadius: "0.75rem" }}
        whileHover={{ borderRadius: "1rem" }}
        transition={{ duration: 0.2 }}
      />

      <motion.span
        className="relative z-10 font-bold"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {char}
      </motion.span>

      <motion.span
        className="absolute top-2 left-2 text-sm font-medium px-2 py-0.5 bg-primary/10 rounded-md"
        whileHover={{ scale: 1.1 }}
      >
        {index + 1}
      </motion.span>
    </motion.button>
  );
};
