Вот полная документация в формате Markdown для вашего хука:

````markdown
# useBreakpoint - Hook для адаптивного дизайна

Мощный и гибкий React хук для отслеживания брейкпоинтов экрана с поддержкой SSR, оптимизацией производительности и контекстным провайдером.

## 🚀 Быстрый старт

### Базовое использование

```tsx
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";

function ResponsiveComponent() {
  const breakpoints = {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  };

  const { mobile, tablet, desktop, wide, width } = useBreakpoint(breakpoints);

  return (
    <div>
      <p>Текущая ширина: {width}px</p>
      {mobile && <div>Мобильная версия</div>}
      {tablet && <div>Планшетная версия</div>}
      {desktop && <div>Десктопная версия</div>}
      {wide && <div>Широкий экран</div>}
    </div>
  );
}
```

### Tailwind CSS брейкпоинты

```tsx
import { useTailwindBreakpoint } from "@/shared/hooks/useBreakpoint";

function TailwindComponent() {
  const { sm, md, lg, xl, "2xl": xxl, width } = useTailwindBreakpoint();

  return (
    <div className="p-4">
      <div className="text-sm md:text-base lg:text-lg">
        Текущая ширина: {width}px
      </div>
      {sm && <div className="block md:hidden">Мобильное меню</div>}
      {lg && <div className="hidden md:block">Десктопное меню</div>}
    </div>
  );
}
```

## 📖 API

### `useBreakpoint(breakpoints, options)`

Основной хук для отслеживания брейкпоинтов.

#### Параметры

| Параметр      | Тип                      | Описание                                                    |
| ------------- | ------------------------ | ----------------------------------------------------------- |
| `breakpoints` | `Record<string, number>` | Объект с названиями брейкпоинтов и их значениями в пикселях |
| `options`     | `UseBreakpointOptions`   | Дополнительные опции (опционально)                          |

#### Опции `UseBreakpointOptions`

| Опция          | Тип       | По умолчанию | Описание                                |
| -------------- | --------- | ------------ | --------------------------------------- |
| `defaultWidth` | `number`  | `0`          | Начальная ширина для SSR                |
| `debounceMs`   | `number`  | `0`          | Задержка для debounce при ресайзе       |
| `useThrottle`  | `boolean` | `false`      | Использовать throttling вместо debounce |
| `throttleMs`   | `number`  | `100`        | Задержка для throttle                   |

#### Возвращаемое значение

Объект, содержащий:

- Все ключи из `breakpoints` с булевыми значениями (true если текущая ширина >= брейкпоинта)
- Поле `width` с текущей шириной окна в пикселях

### `useTailwindBreakpoint(options)`

Упрощенная версия со стандартными брейкпоинтами Tailwind CSS.

```tsx
const {
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
  width,
} = useTailwindBreakpoint({
  debounceMs: 150, // опционально
  useThrottle: true,
  throttleMs: 100,
});
```

### `BreakpointProvider` и `useBreakpointContext`

Провайдер для передачи состояния брейкпоинтов через контекст (оптимизирует производительность в глубоких деревьях компонентов).

```tsx
import {
  BreakpointProvider,
  useBreakpointContext,
} from "@/shared/hooks/useBreakpoint";

// В корневом компоненте
function App() {
  const breakpoints = { sm: 640, md: 768, lg: 1024 };

  return (
    <BreakpointProvider breakpoints={breakpoints}>
      <DeepComponent />
    </BreakpointProvider>
  );
}

// В глубоко вложенном компоненте
function DeepComponent() {
  const { sm, md, lg } = useBreakpointContext();

  return (
    <div>
      {sm && <MobileLayout />}
      {lg && <DesktopLayout />}
    </div>
  );
}
```

## 💡 Примеры использования

### 1. Оптимизация с debounce

```tsx
function OptimizedComponent() {
  const breakpoints = { sm: 640, md: 768, lg: 1024 };
  const { md, width } = useBreakpoint(breakpoints, {
    debounceMs: 150, // Задержка при ресайзе
  });

  return <div>{md && <ExpensiveComponent />}</div>;
}
```

### 2. Условная загрузка компонентов

```tsx
function LazyLoadingComponent() {
  const { lg } = useTailwindBreakpoint();
  const [HeavyComponent, setHeavyComponent] = useState(null);

  useEffect(() => {
    if (lg) {
      import("./HeavyComponent").then((module) => {
        setHeavyComponent(() => module.HeavyComponent);
      });
    }
  }, [lg]);

  return (
    <div>
      {lg && HeavyComponent && <HeavyComponent />}
      {!lg && <MobileVersion />}
    </div>
  );
}
```

### 3. Комбинирование с CSS-in-JS

```tsx
function StyledComponent() {
  const { md, lg } = useTailwindBreakpoint();

  const styles = {
    container: {
      padding: md ? "20px" : "10px",
      display: lg ? "grid" : "block",
      gridTemplateColumns: lg ? "repeat(3, 1fr)" : "1fr",
    },
  };

  return <div style={styles.container}>Адаптивный контент</div>;
}
```

### 4. Медиа-запросы для конкретных фич

```tsx
function FeatureComponent() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isHighContrast = useMediaQuery("(prefers-contrast: high)");
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");
  const isPrint = useMediaQuery("print");

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      {isTouchDevice && <TouchOptimizedControls />}
      {isPrint && <PrintableVersion />}
    </div>
  );
}
```

## ⚡️ Оптимизация производительности

### 1. Используйте `useBreakpointContext` для глубоких деревьев

```tsx
// ❌ Плохо - каждый компонент создаёт свой обработчик
function Parent() {
  const { md } = useTailwindBreakpoint();
  return <Child />;
}

function Child() {
  const { md } = useTailwindBreakpoint(); // Создаёт новый обработчик
  return <div>{md && "Visible"}</div>;
}

// ✅ Хорошо - один обработчик на всех
function Parent() {
  return (
    <BreakpointProvider breakpoints={tailwindBreakpoints}>
      <Child />
    </BreakpointProvider>
  );
}

function Child() {
  const { md } = useBreakpointContext(); // Использует существующий обработчик
  return <div>{md && "Visible"}</div>;
}
```

### 2. Debounce для ресурсоёмких операций

```tsx
function HeavyComponent() {
  const { width } = useBreakpoint(breakpoints, {
    debounceMs: 300, // Не обновляется при каждом пикселе ресайза
  });

  useEffect(() => {
    // Тяжёлые вычисления только после паузы в ресайзе
    recalculateLayout(width);
  }, [width]);
}
```

## 🎯 Рекомендации

### Стандартные брейкпоинты (Tailwind)

```tsx
const breakpoints = {
  sm: 640, // Телефоны в ландшафте, планшеты
  md: 768, // Планшеты
  lg: 1024, // Ноутбуки
  xl: 1280, // Десктопы
  "2xl": 1536, // Широкие мониторы
};
```

### Паттерны использования

```tsx
// Мобильный-first подход
const { sm, md, lg } = useTailwindBreakpoint();

// Базовый контент для всех
return (
  <>
    {/* Мобильная версия */}
    {sm && !md && <MobileComponent />}

    {/* Планшетная версия */}
    {md && !lg && <TabletComponent />}

    {/* Десктопная версия */}
    {lg && <DesktopComponent />}
  </>
);
```

## 🐛 Отладка

```tsx
function DebugComponent() {
  const { width } = useTailwindBreakpoint();
  const breakpoints = { sm: 640, md: 768, lg: 1024 };
  const active = useBreakpoint(breakpoints);

  return (
    <div className="fixed bottom-2 right-2 bg-black text-white p-2 text-xs">
      Width: {width}px
      <pre>{JSON.stringify(active, null, 2)}</pre>
    </div>
  );
}
```

## 📋 TypeScript

Хук полностью типизирован и поддерживает автодополнение:

```tsx
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const; // 'as const' для строгой типизации

// Тип возвращаемого значения:
// { sm: boolean, md: boolean, lg: boolean, width: number }
const { sm, md, lg, width } = useBreakpoint(breakpoints);
```

## ⚠️ Важно

1. **SSR поддержка**: Хук безопасно работает на сервере с `defaultWidth = 0`
2. **Производительность**: Использует `requestAnimationFrame` для оптимизации
3. **Сборка мусора**: Все обработчики корректно удаляются при размонтировании
4. **Адаптивность**: Не требует перезагрузки страницы при изменении размера окна

## 📚 Похожие решения

- `useMediaQuery` - для произвольных медиа-запросов
- `useTailwindBreakpoint` - для Tailwind CSS
- `useBreakpointContext` - для контекстного доступа
- `BreakpointProvider` - для оптимизации глубоких деревьев

```

Эта документация включает:
- 📖 Полное описание API
- 💡 Практические примеры
- ⚡️ Советы по оптимизации
- 🐛 Отладку
- 📋 TypeScript поддержку
- ⚠️ Важные замечания
```
````
