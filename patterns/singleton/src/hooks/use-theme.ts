import { useEffect, useState } from "react";
import { FThemeManager } from "../services/init";
import type { Theme } from "../services/type";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(FThemeManager.getTheme());

  useEffect(() => {
    const unsubscribe = FThemeManager.subscribe((newTheme) => {
      setTheme(newTheme);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    theme,
    isDarkMode: theme === "dark",
    toggleTheme: () => FThemeManager.toggleTheme(),
    setTheme: (newTheme: Theme) => FThemeManager.setTheme(newTheme),
  };
};
