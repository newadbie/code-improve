"use client";
import { cn } from "utils/cn";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "dark" | "transparent";
}

export const Button: React.FC<Props> = ({
  children,
  variant = "dark",
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none",
        {
          "p-0": variant === "transparent",
          "bg-dark_80 hover:bg-dark_100 focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700":
            variant === "dark",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
