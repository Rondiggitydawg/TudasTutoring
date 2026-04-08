/**
 * Scroll Animations — GSAP + ScrollTrigger
 *
 * Replaces the original CSS IntersectionObserver reveal system.
 * Elements animate in by semantic class, not by a generic .reveal
 * marker, making the HTML cleaner and the animation intent explicit.
 *
 * Pattern:
 *  - Hero section: timeline on page load (no scroll trigger)
 *  - Other sections: ScrollTrigger with once:true (no re-trigger on scroll-up)
 *  - Grid children: stagger animations on the parent container
 *  - Stat counters: number animation driven by ScrollTrigger onEnter
 *  - Hero blob: subtle parallax scrubbed to scroll position
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  heroEntrance();
  sectionReveals();
  staggerGroups();
  statCounters();
  heroParallax();
}

// ── Hero entrance (plays immediately on page load) ───────────
function heroEntrance() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.15,
  });

  tl.from('.hero-badge',   { opacity: 0, y: 16, duration: 0.5 })
    .from('.hero-heading',  { opacity: 0, y: 28, duration: 0.65 }, '-=0.25')
    .from('.hero-sub',      { opacity: 0, y: 20, duration: 0.55 }, '-=0.35')
    .from('.hero-ctas',     { opacity: 0, y: 16, duration: 0.5  }, '-=0.35')
    .from('.hero-visual',   { opacity: 0, x: 36, duration: 0.75 }, '-=0.55');
}

// ── Per-section scroll reveals ───────────────────────────────
function sectionReveals() {
  const defaults = { ease: 'power3.out', duration: 0.65 };

  // About
  gsap.from('.about-heading', {
    ...defaults,
    opacity: 0,
    y: 24,
    scrollTrigger: trigger('.about-heading'),
  });

  gsap.from('.about-text', {
    ...defaults,
    opacity: 0,
    y: 24,
    delay: 0.1,
    scrollTrigger: trigger('.about-text'),
  });

  // Section head-wraps (heading + sub copy per section)
  document.querySelectorAll('.section-head-wrap').forEach((el) => {
    gsap.from(el.querySelectorAll('.section-heading, .section-sub'), {
      ...defaults,
      opacity: 0,
      y: 24,
      stagger: 0.1,
      scrollTrigger: trigger(el),
    });
  });

  // Location
  gsap.from('.location-icon-wrap', {
    ...defaults,
    opacity: 0,
    scale: 0.85,
    scrollTrigger: trigger('.location-icon-wrap'),
  });

  gsap.from('.location-title, .location-text, .location-pills', {
    ...defaults,
    opacity: 0,
    y: 24,
    stagger: 0.1,
    scrollTrigger: trigger('.location-content'),
  });

  // Contact headings
  gsap.from('.contact-heading, .contact-sub', {
    ...defaults,
    opacity: 0,
    y: 24,
    stagger: 0.12,
    scrollTrigger: trigger('.contact-head'),
  });

  gsap.from('.contact-form-wrap', {
    ...defaults,
    opacity: 0,
    y: 32,
    scrollTrigger: trigger('.contact-form-wrap'),
  });
}

// ── Stagger groups (grids, lists) ────────────────────────────
function staggerGroups() {
  const groups = [
    { container: '.subjects-grid',    selector: '.subject-card',     stagger: 0.07 },
    { container: '.testimonials-grid', selector: '.testimonial-card', stagger: 0.1  },
    { container: '.pricing-grid',     selector: '.pricing-card',     stagger: 0.12 },
    { container: '.about-stats',      selector: '.stat-card',        stagger: 0.1  },
    { container: '.steps-wrapper',    selector: '.step',             stagger: 0.15 },
  ];

  groups.forEach(({ container, selector, stagger }) => {
    const parent = document.querySelector(container);
    if (!parent) return;

    gsap.from(parent.querySelectorAll(selector), {
      opacity: 0,
      y: 32,
      duration: 0.6,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: parent,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

// ── Animated stat counters ───────────────────────────────────
function statCounters() {
  document.querySelectorAll('.stat-num').forEach((el) => {
    const raw = el.dataset.target;
    const suffix = el.dataset.suffix ?? '';
    if (!raw) return;

    const end = parseInt(raw, 10);
    const proxy = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(proxy, {
          value: end,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(proxy.value) + suffix;
          },
        });
      },
    });
  });
}

// ── Hero blob parallax ───────────────────────────────────────
function heroParallax() {
  gsap.to('.hero-blob', {
    y: 90,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

// ── Helper: standard ScrollTrigger config ────────────────────
function trigger(element, start = 'top 88%') {
  return {
    trigger: element,
    start,
    once: true,
  };
}
