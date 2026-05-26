import { useCallback, useEffect, useState } from "react";

export type Theme = string;

export interface UseThemeOptions {
  /** Ключ для localStorage (по умолчанию: 'theme') */
  storageKey?: string;
  /** Список доступных тем */
  themes: readonly Theme[];
  /** Тема по умолчанию */
  defaultTheme: Theme;
  /** Использовать системную тему как fallback (только для определения темы по умолчанию) */
  useSystemTheme?: boolean;
  /** CSS класс, который добавляется к html элементу (будет {themeClassName}-{theme}) */
  themeClassName?: string;
  /** Атрибут для data-theme */
  dataAttribute?: string;
  /** Колбэк при изменении темы */
  onThemeChange?: (theme: Theme) => void;
}

export interface UseThemeReturn {
  /** Текущая тема */
  theme: Theme;
  /** Список доступных тем */
  themes: readonly Theme[];
  /** Установить тему */
  setTheme: (theme: Theme) => void;
  /** Проверить, активна ли тема */
  isTheme: (theme: Theme) => boolean;
  /** Системная тема (только 'light' или 'dark') */
  systemTheme: "light" | "dark" | null;
}

/**
 * Hook для управления темой с поддержкой кастомных тем, localStorage и системных настроек
 *
 * @param options - Опции конфигурации
 * @returns Объект с текущей темой и методами управления
 *
 * @example
 * ```tsx
 * const themes = ['light', 'dark', 'blue', 'forest'] as const;
 *
 * function ThemeSwitcher() {
 *   const { theme, themes, setTheme, isTheme } = useTheme({
 *     themes,
 *     defaultTheme: 'light',
 *     storageKey: 'app-theme',
 *   });
 *
 *   return (
 *     <div>
 *       {themes.map(t => (
 *         <button
 *           key={t}
 *           onClick={() => setTheme(t)}
 *           className={isTheme(t) ? 'active' : ''}
 *         >
 *           {t}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme({
 *   themes: ['light', 'dark', 'midnight'],
 *   defaultTheme: 'light',
 *   themeClassName: 'theme', // добавит класс 'theme-light', 'theme-dark' и т.д.
 *   dataAttribute: 'data-theme',
 * });
 * ```
 */
export function useTheme(options: UseThemeOptions): UseThemeReturn {
  const {
    storageKey = "theme",
    themes,
    defaultTheme,
    useSystemTheme = true,
    themeClassName,
    dataAttribute,
    onThemeChange,
  } = options;

  // Валидация: defaultTheme должен быть в themes
  if (!themes.includes(defaultTheme)) {
    throw new Error(
      `useTheme: defaultTheme "${defaultTheme}" must be one of themes: ${themes.join(", ")}`,
    );
  }

  const [systemTheme, setSystemTheme] = useState<"light" | "dark" | null>(null);

  // Функция для получения начальной темы
  const getInitialTheme = useCallback((): Theme => {
    if (typeof window === "undefined") return defaultTheme;

    // 1. Проверяем localStorage
    const stored = localStorage.getItem(storageKey);
    if (stored && themes.includes(stored)) {
      return stored;
    }

    // 2. Проверяем системные настройки (только для маппинга на тему по умолчанию)
    if (useSystemTheme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const systemPreferred = prefersDark ? "dark" : "light";

      // Если системная тема совпадает с какой-то из доступных, используем её
      if (themes.includes(systemPreferred)) {
        return systemPreferred;
      }
    }

    // 3. Fallback
    return defaultTheme;
  }, [storageKey, themes, useSystemTheme, defaultTheme]);

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Отслеживание системной темы
  useEffect(() => {
    if (!useSystemTheme || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [useSystemTheme]);

  // Обновление DOM при изменении темы
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Удаляем все классы темы, если используется themeClassName
    if (themeClassName) {
      // Удаляем все классы, начинающиеся с themeClassName-
      const existingThemeClasses = Array.from(root.classList).filter((cls) =>
        cls.startsWith(`${themeClassName}-`),
      );
      existingThemeClasses.forEach((cls) => {
        root.classList.remove(cls);
      });

      // Добавляем новый класс
      root.classList.add(`${themeClassName}-${theme}`);
    }

    // Обновляем data-атрибут
    if (dataAttribute) {
      root.setAttribute(dataAttribute, theme);
    }

    // Обновляем localStorage
    localStorage.setItem(storageKey, theme);

    // Вызываем колбэк
    onThemeChange?.(theme);
  }, [theme, storageKey, themeClassName, dataAttribute, onThemeChange]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (!themes.includes(newTheme)) {
        console.warn(
          `useTheme: theme "${newTheme}" is not in available themes: ${themes.join(", ")}`,
        );
        return;
      }
      setThemeState(newTheme);
    },
    [themes],
  );

  const isTheme = useCallback(
    (checkTheme: Theme): boolean => {
      return theme === checkTheme;
    },
    [theme],
  );

  return {
    theme,
    themes,
    setTheme,
    isTheme,
    systemTheme,
  };
}
