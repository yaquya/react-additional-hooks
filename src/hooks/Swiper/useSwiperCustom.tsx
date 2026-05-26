// src/swiper/useSwiperCustom.ts
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

let swiperWarningShown = false;
let swiperAvailable = false;

/**
 * Проверка наличия Swiper
 */
const checkSwiperInstalled = async (): Promise<boolean> => {
  if (swiperAvailable) return true;

  try {
    await import("swiper");
    swiperAvailable = true;
    return true;
  } catch (e) {
    if (!swiperWarningShown && typeof window !== "undefined") {
      console.warn(e);
      console.warn(
        "[react-additional-hooks] Swiper is not installed. " +
          "To use useSwiperCustom hook, please install it:\n" +
          "npm install swiper\n" +
          "or\n" +
          "yarn add swiper\n" +
          "or\n" +
          "pnpm add swiper",
      );
      swiperWarningShown = true;
    }
    return false;
  }
};

export interface SwiperCustomReturn {
  swiperInitHandler: (initSwiperRef: SwiperType) => void;
  isSwiperInitialized: boolean;
  swiperDestroyHandler: () => void;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  activeSlideIndex: number;
  isEnd: boolean;
  isBeginning: boolean;
  setIsEnd: (value: boolean) => void;
  setIsBeginning: (value: boolean) => void;
  setActiveSlideIndex: (value: number) => void;
  nextSlideHandler: () => void;
  prevSlideHandler: () => void;
}

/**
 * Custom hook for Swiper slider management
 *
 * @requires swiper - Please install swiper: `npm install swiper`
 */
const useSwiperCustom = (): SwiperCustomReturn => {
  // Асинхронная проверка при монтировании
  useEffect(() => {
    checkSwiperInstalled();
  }, []);

  const swiperRef = useRef<SwiperType | null>(null);
  const [isSwiperInitialized, setIsSwiperInitialized] =
    useState<boolean>(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);

  const swiperInitHandler = useCallback((initSwiperRef: SwiperType) => {
    swiperRef.current = initSwiperRef;

    setTimeout(() => {
      setIsSwiperInitialized(true);
    }, 0);
  }, []);

  const swiperDestroyHandler = useCallback(() => {
    swiperRef.current = null;
    setIsSwiperInitialized(false);
    setActiveSlideIndex(0);
    setIsEnd(false);
    setIsBeginning(true);
  }, []);

  useEffect(() => {
    const swiperInstance = swiperRef.current;
    if (!swiperInstance || !isSwiperInitialized) return;

    const updateState = () => {
      setIsEnd(swiperInstance.isEnd);
      setIsBeginning(swiperInstance.isBeginning);
      setActiveSlideIndex(swiperInstance.realIndex);
    };

    swiperInstance.on("slideChange", updateState);
    swiperInstance.on("reachEnd", () => setIsEnd(true));
    swiperInstance.on("reachBeginning", () => setIsBeginning(true));
    swiperInstance.on("fromEdge", () => {
      setIsEnd(swiperInstance.isEnd);
      setIsBeginning(swiperInstance.isBeginning);
    });

    updateState();

    return () => {
      swiperInstance.off("slideChange", updateState);
      swiperInstance.off("reachEnd");
      swiperInstance.off("reachBeginning");
      swiperInstance.off("fromEdge");
    };
  }, [isSwiperInitialized]);

  const nextSlideHandler = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const prevSlideHandler = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  return {
    swiperInitHandler,
    isSwiperInitialized,
    swiperDestroyHandler,
    swiperRef,
    activeSlideIndex,
    isEnd,
    isBeginning,
    setIsEnd,
    setIsBeginning,
    setActiveSlideIndex,
    nextSlideHandler,
    prevSlideHandler,
  };
};

export { useSwiperCustom };
