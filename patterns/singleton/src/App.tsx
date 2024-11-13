import React, { useEffect } from "react";
import { FThemeManager } from "./services/init";
import { useTheme } from "./hooks/use-theme";

function App() {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      console.log("dark mode");
      document.documentElement.classList.add("dark");
      console.log("dark mode", document.documentElement.classList);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${
          isDarkMode ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div
          className={`w-6 h-6 rounded-full transition-transform duration-300 transform ${
            isDarkMode ? "translate-x-8 bg-gray-100" : "translate-x-0 bg-white"
          }`}
        >
          {isDarkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}

export default App;
