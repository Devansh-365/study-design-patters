import type { Theme } from "./type";

export default class ThemeManager {
  private static instance: ThemeManager;
  private theme: Theme = "light";
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    if (!ThemeManager.instance) {
      ThemeManager.instance = this;
    }
    return ThemeManager.instance;
  }

  setTheme(theme: Theme) {
    this.theme = theme;
  }

  getTheme() {
    return this.theme;
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.notifyListeners();
  }

  public subscribe(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.theme));
  }
}
