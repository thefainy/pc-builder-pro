// Простые и аккуратные SVG иконки
interface IconProps {
  className?: string;
}

const createIcon = (paths: string | string[], viewBox = "0 0 24 24") => 
  ({ className = "w-5 h-5" }: IconProps) => (
    <svg 
      className={className} 
      viewBox={viewBox} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {Array.isArray(paths) ? 
        paths.map((path, i) => <path key={i} d={path} />) : 
        <path d={paths} />
      }
    </svg>
  );

export const Icons = {
  // Компоненты ПК
  Cpu: createIcon("M9 3h6l2 2v14l-2 2H9l-2-2V5l2-2zM9 9h6M9 15h6"),
  Gpu: createIcon("M2 8h20v8H2zM6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M6 16v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"),
  Ram: createIcon("M3 6h18v12H3zM7 9v6M11 9v6M15 9v6M17 9v6"),
  Storage: createIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"),
  Psu: createIcon("M13 2L3 14h9l-1 8 10-12h-9l1-8z"),
  Motherboard: createIcon("M4 4h16v16H4zM8 8h8v8H8zM6 6h2v2H6zM16 6h2v2h-2zM6 16h2v2H6zM16 16h2v2h-2z"),
  Settings: createIcon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"),
  
  // Навигация
  Monitor: createIcon("M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM4 4h8v8H4V4zM22 18v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M8 20l4-4 4 4"),
  Search: createIcon("M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"),
  Menu: createIcon(["M4 6h16", "M4 12h16", "M4 18h16"]),
  Close: createIcon(["M18 6L6 18", "M6 6l12 12"]),
  Reset: createIcon("M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"),
  Back: createIcon("M19 12H5m7-7l-7 7 7 7"),
  Filter: createIcon("M22 3H2l8 9.46V19l4 2v-8.54L22 3z"),
  
  // Пользователь
  User: createIcon("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"),
  Lock: createIcon("M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"),
  Mail: createIcon("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5"),
  Eye: createIcon("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"),
  EyeOff: createIcon([
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z",
    "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z",
    "M14.12 14.12a3 3 0 1 1-4.24-4.24",
    "M1 1l22 22"
  ]),
  
  // Покупки
  Cart: createIcon("M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"),
  Star: createIcon("M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"),
  Heart: createIcon("M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"),
  
  // Действия
  Plus: createIcon(["M12 5v14", "M5 12h14"]),
  Minus: createIcon("M5 12h14"),
  Check: createIcon("M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"),
  Warning: createIcon("M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"),
  Info: createIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01"),
  Error: createIcon("M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"),
  
  // Аналитика
  Chart: createIcon("M18 20V10M12 20V4M6 20v-6"),
  
  // Финансы  
  Money: createIcon("M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"),
  
  // Дополнительные
  Bookmark: createIcon("M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"),
  Share: createIcon("M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13")
};

// Экспортируем отдельные иконки для удобства
export const {
  Cpu, Gpu, Ram, Storage, Psu, Monitor, Search, Menu, Close, Reset, 
  User, Lock, Mail, Eye, EyeOff, Back, Cart, Star, Filter, Plus, 
  Minus, Check, Warning, Info, Error, Chart, Settings, Heart, 
  Bookmark, Share, Money
} = Icons;

export default Icons;