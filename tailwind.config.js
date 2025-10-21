/** @type {import('tailwindcss').Config} */

const palette = {
  background: "var(--background)",
  "background-dark": "var(--background-dark)",
  foreground: "var(--foreground)",
  meta: "var(--meta)",
  primary: "var(--primary)",
  "primary-transparent": "var(--primary-transparent)",
  selection: "var(--selection)",
  secondary: "var(--secondary)",
  "secondary-transparent": "var(--secondary-transparent)",
  tertiary: "var(--tertiary)",
  "tertiary-transparent": "var(--tertiary-transparent)",
};

const templateGrid = (size) =>
  Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => {
      const columns = index + 1;
      return [`${columns}-${size}`, `repeat(${columns}, ${size})`];
    }),
  );

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,md,mdx}", "./public/**/*.html"],
  theme: {
    extend: {
      borderColor: palette,
      borderWidth: { under: "3.55px" },
      colors: palette,
      fill: palette,
      gridTemplateColumns: {
        ...templateGrid("auto"),
        ...templateGrid("min-content"),
        "auto-fit": "repeat(auto-fit, minmax(0, 1fr))",
        "auto-fill": "repeat(auto-fill, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        ...templateGrid("auto"),
        ...templateGrid("min-content"),
        "auto-fit": "repeat(auto-fit, minmax(0, 1fr))",
        "auto-fill": "repeat(auto-fill, minmax(0, 1fr))",
      },
      maxHeight: {
        100: "25rem",
        120: "50rem",
        130: "75rem",
        140: "100rem",
      },
      maxWidth: {
        xxs: "18rem",
        xxxs: "14rem",
        xxxxs: "10rem",
      },
      screens: {
        xxxs: "320px",
        xxs: "375px",
        xs: "420px",
      },
      stroke: palette,
    },
    fontFamily: {
      sans: ["var(--font-inter)", "Inter", "sans-serif"],
      mdNichrome: ["var(--font-md-nichrome)", "MD Nichrome", "serif"],
      inter: ["var(--font-inter)", "Inter", "sans-serif"],
    },
    zIndex: {
      hidden: -1,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      20: 20,
      25: 25,
      30: 30,
      40: 40,
      50: 50,
      75: 75,
      100: 100,
      auto: "auto",
    },
  },
};
