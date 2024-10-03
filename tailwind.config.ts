import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
  darkMode: "selector",
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      ...colors,
      primary: "#b1bae8",
      primary_20: "#bac1eb",
      primary_40: "#c3c9ed",
      primary_60: "#cbd1f0",
      primary_80: "#d4d8f2",
      primary_100: "#dde0f5",
      dark: "#1d1b1b",
      dark_20: "#323030",
      dark_40: "#484646",
      dark_60: "#5f5e5e",
      dark_80: "#787777",
      dark_100: "#919090",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
