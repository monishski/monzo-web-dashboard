"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import type { ButtonProps } from "@/components/atoms";
import { Button } from "@/components/atoms";

type ThemeButtonProps = ButtonProps;

export function ThemeButton(props: ThemeButtonProps): React.JSX.Element {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: -20, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
