/* =========================================================
   KIP'S CARD SHOP — hero.js
   Scroll-scrubbed video: sealed pack → exploded cards
   Hero section is 300vh. Sticky panel is 100vh.
   Scrollable distance inside hero = 200vh.
   ========================================================= */
(function () {
  'use strict';

  const video = document.getElementById('hero-video');
  if (!video) return;

  // Pause immediately — we drive currentTime manually
  video.pause();

  function getProgress() {
    // Total scrollable distance inside the hero = 200vh
    const maxScroll = window.innerHeight * 2;
    const p = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    return p;
  }

  let lastP = -1;
  let rafId = null;
  let ready = false;

  function scrub() {
    if (!ready) { rafId = null; return; }
    const p = getProgress();
    if (Math.abs(p - lastP) < 0.001) { rafId = null; return; }
    lastP = p;

    // Set video frame
    video.currentTime = p * video.duration;

    // Hero text fades out and drifts up as video plays
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const fade = Math.max(1 - p * 3, 0);
      heroContent.style.opacity   = String(fade);
      heroContent.style.transform = `translateY(${-p * 40}px)`;
    }

    // Scroll indicator fades fast
    const si = document.querySelector('.scroll-indicator');
    if (si) si.style.opacity = String(Math.max(1 - p * 6, 0));

    rafId = null;
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(scrub);
  }

  // Wait for enough data to seek
  video.addEventListener('loadedmetadata', () => {
    ready = true;
    video.currentTime = 0;
    scrub();
  });

  // Also trigger on canplay in case metadata already loaded
  video.addEventListener('canplay', () => {
    ready = true;
    scrub();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', scrub);

  // Force load
  video.load();
})();
