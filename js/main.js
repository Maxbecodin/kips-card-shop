/* =========================================================
   KIP'S CARD SHOP — main.js
   Nav scroll state, intersection observer, hamburger
   ========================================================= */

(function () {
  'use strict';

  /* --- NAV: scroll state --- */
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scroll-progress');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* --- Scroll progress bar --- */
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? window.scrollY / docHeight : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }

  /* --- Hamburger menu --- */
  const hamburger  = document.querySelector('.hamburger');
  const navLinks   = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
          !hamburger.contains(e.target) &&
          !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* --- Active nav link based on current page --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Intersection Observer: Scroll Reveals --- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal (one-shot animation)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function observeReveals() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => revealObserver.observe(el));
  }

  /* --- Stat counter animation --- */
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const start  = performance.now();

          function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(eased * target);
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));
  }

  /* --- Scroll event (debounced via RAF) --- */
  let rafPending = false;
  function onScroll() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        updateNav();
        updateScrollProgress();
        rafPending = false;
      });
    }
  }

  /* --- Newsletter form --- */
  function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn   = form.querySelector('button[type="submit"]');
        if (!input || !input.value.trim()) return;

        // Simulate submission
        const originalText = btn.textContent;
        btn.textContent = 'Subscribed ✓';
        btn.style.background = '#22c55e';
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          input.disabled = false;
          btn.disabled = false;
        }, 3000);
      });
    });
  }

  /* --- Contact form --- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Message Sent ✓';
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  /* --- Smooth link transitions --- */
  function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Only internal .html links
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
          window.location.href = href;
        }, 200);
      });
    });

    // Fade in on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    updateScrollProgress();
    observeReveals();
    animateCounters();
    initNewsletter();
    initContactForm();
    initPageTransitions();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

})();
