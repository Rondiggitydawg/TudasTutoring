/**
 * Navbar behaviours
 *
 * 1. Scroll shadow — toggles the .scrolled class using Lenis's
 *    scroll event rather than native window.scroll, keeping it in
 *    sync with Lenis's virtual scroll position.
 *
 * 2. Active link highlight — uses ScrollTrigger to detect which
 *    section is in view and highlights the matching nav link.
 *    The .btn nav CTA is excluded from highlight logic.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis.js';

gsap.registerPlugin(ScrollTrigger);

export function initNavbar() {
  scrollShadow();
  activeLinks();
}

// ── Scroll shadow ────────────────────────────────────────────
function scrollShadow() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const lenis = getLenis();
  lenis.on('scroll', ({ scroll }) => {
    navbar.classList.toggle('scrolled', scroll > 20);
  });
}

// ── Active nav link highlight ─────────────────────────────────
function activeLinks() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)');

  document.querySelectorAll('section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle({ isActive }) {
        if (!isActive) return;
        const id = section.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      },
    });
  });
}
