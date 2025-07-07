
/// <reference types="vite/client" />

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    clarity: (...args: any[]) => void;
  }
}

// Extend PerformanceEntry for Web Vitals
interface PerformanceEntryWithValue extends PerformanceEntry {
  value?: number;
}

export {};
