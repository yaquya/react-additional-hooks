"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

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
 *
 * @example
 * ```tsx
 * import { useSwiperCustom } from 'react-additional-hooks/swiper';
 * import { Swiper, SwiperSlide } from 'swiper/react';
 * import 'swiper/css';
 *
 * function MySlider() {
 *   const { swiperInitHandler, activeSlideIndex, nextSlideHandler } = useSwiperCustom();
 *
 *   return (
 *     <>
 *       <Swiper onSwiper={swiperInitHandler}>
 *         <SwiperSlide>Slide 1</SwiperSlide>
 *         <SwiperSlide>Slide 2</SwiperSlide>
 *       </Swiper>
 *       <button onClick={nextSlideHandler}>Next: {activeSlideIndex}</button>
 *     </>
 *   );
 * }
 * ```
 */
const useSwiperCustom = (): SwiperCustomReturn => {
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
