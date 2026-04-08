/**
 * Application entry point
 *
 * Import order is significant:
 *  1. CSS — Vite injects styles from the import graph
 *  2. Lenis — must initialise before ScrollTrigger animations
 *     so the scroll position source is correct from the start
 *  3. Scroll animations — GSAP ScrollTrigger reads Lenis position
 *  4. Navbar — attaches to the Lenis scroll event
 *  5. Hamburger — independent, no ordering requirement
 *  6. Contact form — independent, no ordering requirement
 */

import './styles/main.css';

import { initLenis } from './js/lenis.js';
import { initScrollAnimations } from './js/scroll-animations.js';
import { initNavbar } from './js/navbar.js';
import { initHamburger } from './js/hamburger.js';
import { initContactForm } from './js/contact-form.js';

initLenis();
initScrollAnimations();
initNavbar();
initHamburger();
initContactForm();
