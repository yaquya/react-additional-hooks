import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Типы для брейкпоинтов
export type BreakpointConfig = Record<string, number>;

export interface UseBreakpointOptions {
  /** Начальная ширина для SSR (по умолчанию: 0 - мобильная версия) */
  defaultWidth?: number;
  /** Задержка для debounce при ресайзе (по умолчанию: 0) */
  debounceMs?: number;
  /** Использовать throttling вместо debounce */
  useThrottle?: boolean;
  /** Задержка для throttle (по умолчанию: 100) */
  throttleMs?: number;
}

// Тип для значения контекста
type BreakpointContextValue<T> = {
  [K in keyof T]: boolean;
} & { width: number };

// Создаём контекст
const BreakpointContext = createContext<BreakpointContextValue<unknown> | null>(
  null,
);

// Пропсы провайдера
interface BreakpointProviderProps<
  T extends Record<string, number>,
> extends PropsWithChildren {
  breakpoints: T;
  options?: UseBreakpointOptions;
}

/**
 * Хук для отслеживания брейкпоинтов экрана
 * Работает без провайдера, используя глобальное состояние
 *
 * @param breakpoints - Объект с названиями брейкпоинтов и их значениями в пикселях
 * @param options - Дополнительные опции
 * @returns Объект с булевыми значениями для каждого брейкпоинта и текущей шириной
 *
 * @example
 * const breakpoints = {
 *   sm: 640,
 *   md: 768,
 *   lg: 1024,
 *   xl: 1280,
 *   '2xl': 1536
 * }
 *
 * const { sm, md, lg, width } = useBreakpoint(breakpoints)
 *
 * return (
 *   <div>
 *     {sm && <p>Мобильная версия</p>}
 *     {lg && <p>Десктопная версия</p>}
 *     <p>Текущая ширина: {width}px</p>
 *   </div>
 * )
 */
export function useBreakpoint<T extends Record<string, number>>(
  breakpoints: T,
  options: UseBreakpointOptions = {},
): {
  [K in keyof T]: boolean;
} & { width: number } {
  const {
    defaultWidth = 0,
    debounceMs = 0,
    useThrottle = false,
    throttleMs = 100,
  } = options;

  // Состояние для текущей ширины экрана
  const [width, setWidth] = useState<number>(defaultWidth);

  // Функция для расчета брейкпоинтов на основе ширины
  const getBreakpoints = useCallback(
    (currentWidth: number) => {
      const result = {} as { [K in keyof T]: boolean };

      for (const [key, value] of Object.entries(breakpoints)) {
        result[key as keyof T] = currentWidth >= value;
      }

      return result;
    },
    [breakpoints],
  );

  // Обработчик изменения размера с debounce/throttle
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;
    let lastRun = 0;
    let rafId: number;

    const handleResize = () => {
      // Используем requestAnimationFrame для оптимизации
      rafId = requestAnimationFrame(() => {
        const newWidth = window.innerWidth;
        setWidth((prevWidth) => {
          // Обновляем только если ширина действительно изменилась
          if (prevWidth !== newWidth) {
            return newWidth;
          }
          return prevWidth;
        });
      });
    };

    const handleResizeDebounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    };

    const handleResizeThrottled = () => {
      const now = Date.now();
      if (now - lastRun >= throttleMs) {
        lastRun = now;
        handleResize();
      }
    };

    const resizeHandler = useThrottle
      ? handleResizeThrottled
      : handleResizeDebounced;

    window.addEventListener("resize", resizeHandler);

    // Начальная установка ширины
    handleResize();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [debounceMs, useThrottle, throttleMs]);

  // Мемоизация результатов для оптимизации
  const breakpointState = useMemo(() => {
    const breakpointsResult = getBreakpoints(width);
    return {
      ...breakpointsResult,
      width,
    };
  }, [width, getBreakpoints]);

  return breakpointState;
}

/**
 * Упрощенная версия для стандартных брейкпоинтов Tailwind
 */
export const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useTailwindBreakpoint(options?: UseBreakpointOptions) {
  return useBreakpoint(tailwindBreakpoints, options);
}

/**
 * Провайдер для контекста брейкпоинтов (опционально)
 * Используйте если хотите передавать значения через контекст
 */
export function BreakpointProvider<T extends Record<string, number>>({
  children,
  breakpoints,
  options,
}: BreakpointProviderProps<T>) {
  const breakpointState = useBreakpoint(breakpoints, options);

  return (
    <BreakpointContext.Provider value={breakpointState}>
      {children}
    </BreakpointContext.Provider>
  );
}

/**
 * Хук для использования брейкпоинтов из контекста
 */
export function useBreakpointContext<T extends Record<string, number>>() {
  const context = useContext(BreakpointContext);
  if (!context) {
    throw new Error(
      "useBreakpointContext must be used within BreakpointProvider",
    );
  }
  return context as BreakpointContextValue<T>;
}
