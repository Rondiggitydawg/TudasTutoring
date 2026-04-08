/**
 * Contact form — validation and submission
 *
 * Validates required fields before submitting.
 * On success, fades the form out with GSAP and reveals a
 * friendly confirmation message. All animation goes through
 * GSAP to keep the animation system consistent across the page.
 *
 * Replace the simulated success handler with your real form
 * endpoint (e.g. Formspree, Netlify Forms, or a backend API).
 */

import gsap from 'gsap';

export function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const success = document.getElementById('formSuccess');

  if (!validateForm(form)) return;

  // ── Replace this block with your real submission logic ──────
  // e.g. fetch('/api/contact', { method: 'POST', body: new FormData(form) })
  //       .then(() => showSuccess(form, success));
  showSuccess(form, success);
}

/** Returns true if all required fields have a value. */
function validateForm(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach((field) => {
    // Handle checkboxes (subjects) separately
    if (field.type === 'checkbox' && field.name === 'subject') {
      const subjectCheckboxes = form.querySelectorAll('input[name="subject"]');
      const checkedSubjects = Array.from(subjectCheckboxes).filter(cb => cb.checked);
      if (checkedSubjects.length === 0) {
        markError(field);
        valid = false;
      }
    } else if (!field.value.trim()) {
      markError(field);
      valid = false;
    }
  });

  return valid;
}

function markError(field) {
  if (field.type === 'checkbox' && field.name === 'subject') {
    // For checkboxes, mark the container
    const container = field.closest('.subject-checkboxes');
    if (container) {
      container.classList.add('field-error');
      // Clear error state when any checkbox is clicked
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          container.classList.remove('field-error');
        }, { once: true });
      });
    }
  } else {
    field.classList.add('field-error');
    // Clear error state once the user starts correcting the field
    field.addEventListener(
      'input',
      () => field.classList.remove('field-error'),
      { once: true },
    );
  }
}

function showSuccess(form, success) {
  gsap.to(form, {
    opacity: 0,
    y: -10,
    duration: 0.35,
    ease: 'power2.in',
    onComplete() {
      form.style.display = 'none';
      success.style.display = 'block';
      gsap.from(success, { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out' });
    },
  });
}
