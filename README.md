# react-additional-hooks

[![npm version](https://badge.fury.io/js/react-additional-hooks.svg)](https://www.npmjs.com/package/react-additional-hooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of useful and reusable React hooks for everyday development. Supports TypeScript, SSR, and optimized for performance.

## 📦 Installation

```bash
npm install react-additional-hooks
# or
yarn add react-additional-hooks
# or
pnpm add react-additional-hooks
```

## 🎯 Features

- ✅ **TypeScript** — full type definitions included
- ✅ **SSR-ready** — safe server-side rendering
- ✅ **Zero dependencies** — only `react` in peer dependencies
- ✅ **Tree-shakeable** — import only what you need
- ✅ **Well tested** — each hook is covered by tests

## 🚀 Quick Start

```tsx
import {
  useToggle,
  useDebounce,
  useLocalStorage,
} from "react-additional-hooks";

function MyComponent() {
  const [isOpen, toggle] = useToggle(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <div>
      <button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>
      <input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <p>Searching for: {debouncedSearch}</p>
    </div>
  );
}
```

## 📖 API

### State Hooks

#### `useToggle`

Manages boolean state with convenient methods.

```tsx
const [isOpen, toggle, open, close, set] = useToggle(initialState?: boolean);

// Example
const [isModalOpen, toggleModal, openModal, closeModal] = useToggle(false);
```

#### `useCounter`

Counter with constraints and step support.

```tsx
const { count, increment, decrement, reset, set } = useCounter(
  initialValue?: number,
  options?: { min?: number; max?: number; step?: number }
);

// Example
const { count, increment, decrement } = useCounter(0, { min: 0, max: 10, step: 2 });
```

### Storage Hooks

#### `useLocalStorage`

Sync state with `localStorage`.

```tsx
const [value, setValue] = useLocalStorage<T>(key: string, initialValue: T);

// Example
const [user, setUser] = useLocalStorage<User>('user', { name: 'John', age: 30 });
```

#### `useSessionStorage`

Sync state with `sessionStorage`.

```tsx
const [value, setValue] = useSessionStorage<T>(key: string, initialValue: T);
```

### Optimization Hooks

#### `useDebounce`

Debounce a value.

```tsx
const debouncedValue = useDebounce<T>(value: T, delay: number);

// Example: search with delay
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);
```

#### `useThrottle`

Throttle a value.

```tsx
const throttledValue = useThrottle<T>(value: T, limit: number);

// Example: scroll tracking
const [scrollY, setScrollY] = useState(0);
const throttledScroll = useThrottle(scrollY, 100);
```

### Timer Hooks

#### `useInterval`

Interval with automatic cleanup.

```tsx
useInterval(callback: () => void, delay: number | null);

// Example: timer
const [seconds, setSeconds] = useState(0);
useInterval(() => setSeconds(s => s + 1), 1000);
```

#### `useTimeout`

Timeout with automatic cleanup.

```tsx
useTimeout(callback: () => void, delay: number | null);

// Example: hide notification after 3 seconds
useTimeout(() => setShowNotification(false), 3000);
```

### DOM Hooks

#### `useClickOutside`

Detect clicks outside an element.

```tsx
const ref = useClickOutside<T>(handler: () => void);

// Example: close modal when clicking outside
const modalRef = useClickOutside(() => setIsOpen(false));
return <div ref={modalRef}>Modal content</div>;
```

#### `useHover`

Track mouse hover state.

```tsx
const [ref, isHovered] = useHover<T>();

// Example
const [hoverRef, isHovered] = useHover();
return <div ref={hoverRef}>{isHovered ? "Hovering!" : "Not hovering"}</div>;
```

#### `useKeyPress`

Track key presses.

```tsx
const isPressed = useKeyPress(targetKey: string | string[]);

// Example
const isEscapePressed = useKeyPress('Escape');
const isCtrlCPressed = useKeyPress(['Control', 'c']);
```

#### `useMediaQuery`

Track CSS media query matches.

```tsx
const matches = useMediaQuery(query: string);

// Example
const isMobile = useMediaQuery('(max-width: 768px)');
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
```

### Responsive Design

#### `useBreakpoint`

Powerful hook for tracking breakpoints.

```tsx
const breakpoints = { sm: 640, md: 768, lg: 1024 };
const { sm, md, lg, width } = useBreakpoint(breakpoints, options?: UseBreakpointOptions);

// Example
function ResponsiveComponent() {
  const { sm, md, lg } = useBreakpoint({ sm: 640, md: 768, lg: 1024 });

  return (
    <>
      {sm && <MobileView />}
      {md && <TableView />}
      {lg && <DesktopView />}
    </>
  );
}
```

#### `useTailwindBreakpoint`

Pre-configured Tailwind CSS breakpoints.

```tsx
const { sm, md, lg, xl, '2xl': xxl, width } = useTailwindBreakpoint(options?: UseBreakpointOptions);
```

#### `BreakpointProvider` & `useBreakpointContext`

Context provider for performance optimization in deep component trees.

```tsx
// Root component
<BreakpointProvider breakpoints={breakpoints}>
  <App />
</BreakpointProvider>;

// Deep component
const { sm, md } = useBreakpointContext();
```

### Clipboard Hook

#### `useCopyToClipboard`

Copy text to clipboard.

```tsx
const [copiedText, copy] = useCopyToClipboard();

// Example
const [copied, copy] = useCopyToClipboard();
return <button onClick={() => copy("Text to copy")}>Copy</button>;
```

### Utility Hooks

#### `usePrevious`

Get the previous value.

```tsx
const prevValue = usePrevious<T>(value: T);

// Example
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

### Utility Hooks

#### `usePrevious`

Get the previous value.

#### `useTheme`

Multi-theme management with localStorage and system preference support.

```tsx
const { theme, themes, setTheme, isTheme, systemTheme } = useTheme({
  themes: ["light", "dark", "blue", "forest"] as const,
  defaultTheme: "light",
  storageKey: "app-theme",
  themeClassName: "theme",
  dataAttribute: "data-theme",
  onThemeChange: (newTheme) => console.log("Theme changed:", newTheme),
});

// Example
function ThemeSwitcher() {
  const { theme, themes, setTheme, isTheme } = useTheme({
    themes: ["light", "dark", "ocean", "sunset"],
    defaultTheme: "light",
  });

  return (
    <div className={`app theme-${theme}`}>
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={isTheme(t) ? "active" : ""}
        >
          {t}
        </button>
      ))}
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

**Options:**

| Option           | Type                      | Required | Description                                       |
| ---------------- | ------------------------- | -------- | ------------------------------------------------- |
| `themes`         | `readonly string[]`       | ✅       | List of available themes                          |
| `defaultTheme`   | `string`                  | ✅       | Default theme (must be in themes)                 |
| `storageKey`     | `string`                  | ❌       | localStorage key (default: 'theme')               |
| `useSystemTheme` | `boolean`                 | ❌       | Use system preference as fallback (default: true) |
| `themeClassName` | `string`                  | ❌       | CSS class prefix (adds `{prefix}-{theme}`)        |
| `dataAttribute`  | `string`                  | ❌       | Data attribute name                               |
| `onThemeChange`  | `(theme: string) => void` | ❌       | Callback when theme changes                       |

**Returns:**

| Property      | Type                         | Description              |
| ------------- | ---------------------------- | ------------------------ |
| `theme`       | `string`                     | Current active theme     |
| `themes`      | `readonly string[]`          | List of available themes |
| `setTheme`    | `(theme: string) => void`    | Set current theme        |
| `isTheme`     | `(theme: string) => boolean` | Check if theme is active |
| `systemTheme` | `'light' \| 'dark' \| null`  | System preference        |

**CSS Setup:**

```css
.theme-light {
  --bg: #ffffff;
  --text: #000000;
}
.theme-dark {
  --bg: #1a1a1a;
  --text: #ffffff;
}
.theme-blue {
  --bg: #e8f4f8;
  --text: #003366;
}

body {
  background-color: var(--bg);
  color: var(--text);
}
```

Hook for managing multiple themes (light, dark, custom themes) with localStorage and system preference support.

````tsx
const { theme, themes, setTheme, isTheme, systemTheme } = useTheme({
  themes: ['light', 'dark', 'blue', 'forest'] as const,
  defaultTheme: 'light',
  storageKey: 'app-theme',
  themeClassName: 'theme',      // adds class 'theme-dark', 'theme-blue', etc.
  dataAttribute: 'data-theme',  // adds data-theme="dark"
  onThemeChange: (newTheme) => console.log('Theme changed:', newTheme),
});

// Example
function ThemeSwitcher() {
  const { theme, themes, setTheme, isTheme } = useTheme({
    themes: ['light', 'dark', 'ocean', 'sunset'],
    defaultTheme: 'light',
  });

  return (
    <div className={`app theme-${theme}`}>
      {themes.map(t => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={isTheme(t) ? 'active' : ''}
        >
          {t}
        </button>
      ))}
      <p>Current theme: {theme}</p>
    </div>
  );
}

## 📦 Swiper Integration

The `useSwiperCustom` hook requires `swiper` to be installed separately:

```bash
npm install swiper
````

```tsx
import { useSwiperCustom } from "react-additional-hooks/swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function MySlider() {
  const { swiperInitHandler, activeSlideIndex, nextSlideHandler } =
    useSwiperCustom();

  return (
    <>
      <Swiper onSwiper={swiperInitHandler}>
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
      </Swiper>
      <button onClick={nextSlideHandler}>Next: {activeSlideIndex}</button>
    </>
  );
}
```

## 💡 Performance Tips

### 1. Use `useBreakpointContext` for deep component trees

```tsx
// ❌ Bad - each component creates its own handler
function Parent() {
  const { md } = useTailwindBreakpoint();
  return <Child />;
}

// ✅ Good - single handler for all
function Parent() {
  return (
    <BreakpointProvider breakpoints={tailwindBreakpoints}>
      <Child />
    </BreakpointProvider>
  );
}
```

### 2. Debounce expensive operations

```tsx
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // API call only after typing pauses
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

### 3. Lazy load Swiper hooks

```tsx
// Instead of direct import
import { useSwiperCustom } from "react-additional-hooks/swiper";

// Use dynamic import if Swiper isn't always needed
const { useSwiperCustom } = await import("react-additional-hooks/swiper");
```

## 🐛 Debugging

All hooks work with React DevTools out of the box. For custom debugging:

```tsx
function DebugComponent() {
  const { width } = useTailwindBreakpoint();

  useEffect(() => {
    console.log(`Window width changed to ${width}px`);
  }, [width]);

  return null;
}
```

## 🔧 Requirements

- React 16.8.0 or higher
- (Optional) Swiper 8.0.0 or higher for `useSwiperCustom`

## 📄 License

MIT

## 🤝 Contributing

PRs are welcome! Please ensure:

1. Code is covered by tests
2. TypeScript types are included
3. Documentation is updated
4. All linter checks pass

## 📚 Useful Links

- [React Hooks API](https://react.dev/reference/react)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Swiper Documentation](https://swiperjs.com/react)

---

⭐ Star the [GitHub repository](https://github.com/yaquya/react-additional-hooks) if you find this project useful!

```

```
