"use client";
import MoonSvg from "assets/moon.svg";
import { Button } from "components/Button";
import { useLocalStorage } from "hooks/useLocalStorage";
import { z } from "zod";

export const Header: React.FC = () => {
  const [theme, setTheme] = useLocalStorage({
    key: "theme",
    schema: z.union([z.literal("light"), z.literal("dark")]),
  });

  const toggleTheme = () => {
    if (
      theme !== "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      console.log("set light");
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <header>
      <Button className="p-2.5" onClick={toggleTheme}>
        <MoonSvg />
      </Button>
    </header>
  );
};
