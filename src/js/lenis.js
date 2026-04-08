/**
 * Smooth Scroll — Lenis + GSAP integration
 *
 * Lenis provides physics-based smooth scrolling. GSAP's ticker
 * drives its animation loop so both libraries share one rAF cycle.
 * ScrollTrigger is synced to Lenis's virtual scroll position via
 * the 'scroll' event — without this, ScrollTrigger reads the native
 * scrollY which lags behind Lenis's eased position.
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Singleton Lenis instance shared across all modules. */
let lenis;

export function initLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Keep ScrollTrigger in sync with Lenis's virtual scroll position
  lenis.on('scroll', ScrollTrigger.update);

  // Use GSAP's ticker to drive Lenis — one shared animation loop
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP's built-in lag smoothing; Lenis handles this
  gsap.ticker.lagSmoothing(0);

  // Intercept all anchor clicks so Lenis handles smooth scrolling
  // instead of browser-native instant-jump or CSS scroll-behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return; // Logo / home link — scroll to top

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      // Offset accounts for the sticky navbar height
      lenis.scrollTo(target, { offset: -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70) });
    });
  });

  return lenis;
}

/** Expose the instance so other modules can call lenis.on() etc. */
export function getLenis() {
  return lenis;
}
