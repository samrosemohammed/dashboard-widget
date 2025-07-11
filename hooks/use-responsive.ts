"use client";

import { useState, useEffect } from "react";

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

const breakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type Breakpoint = keyof BreakpointConfig;

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.md;
  const isTablet =
    windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;

  const isBreakpoint = (breakpoint: Breakpoint) => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  const getGridColumns = () => {
    if (windowSize.width < breakpoints.sm) return 1;
    if (windowSize.width < breakpoints.md) return 2;
    if (windowSize.width < breakpoints.lg) return 4;
    if (windowSize.width < breakpoints.xl) return 6;
    return 12;
  };

  const getWidgetSpan = (originalWidth: number) => {
    const maxColumns = getGridColumns();

    if (windowSize.width < breakpoints.sm) return 1;
    if (windowSize.width < breakpoints.md) return Math.min(2, originalWidth);
    if (windowSize.width < breakpoints.lg) return Math.min(4, originalWidth);
    if (windowSize.width < breakpoints.xl) return Math.min(6, originalWidth);

    return Math.min(maxColumns, originalWidth);
  };

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isBreakpoint,
    getGridColumns,
    getWidgetSpan,
  };
}
