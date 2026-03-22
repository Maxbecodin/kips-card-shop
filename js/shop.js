/* =========================================================
   KIP'S CARD SHOP — shop.js
   Product category filter + sort
   ========================================================= */

(function () {
  'use strict';

  /* --- Category Filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products   = document.querySelectorAll('.product-card');
  const countEl    = document.querySelector('.filter-count');

  function updateCount(cat) {
    if (!countEl) return;
    let visible = 0;
    products.forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) visible++;
    });
    countEl.textContent = `${visible} item${visible !== 1 ? 's' : ''}`;
  }

  function setFilter(cat) {
    filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === cat));

    products.forEach((card, i) => {
      const match = cat === 'all' || card.dataset.cat === cat;
      if (match) {
        card.style.display = '';
        // Re-trigger reveal animation with stagger
        card.classList.remove('visible');
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 40);
      } else {
        card.style.display = 'none';
      }
    });

    updateCount(cat);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.cat));
  });

  // Check for URL param
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam) {
    setFilter(catParam);
  } else {
    updateCount('all');
  }

  /* --- Add to Cart (visual feedback only) --- */
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.style.background = 'rgba(34,197,94,0.15)';
      btn.style.color = '#86efac';
      btn.style.borderColor = 'rgba(34,197,94,0.3)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 1800);
    });
  });

  /* --- Inquire button --- */
  document.querySelectorAll('.btn-inquire').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = 'contact.html';
    });
  });

  /* --- Card hover: 3D tilt effect --- */
  products.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * -6;  // max 6deg
      const tiltY  = ((x - cx) / cx) *  6;

      card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'box-shadow 0.1s ease, border-color 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });

  // Apply perspective to grid for tilt to work properly
  const grid = document.querySelector('.product-grid');
  if (grid) grid.style.perspective = '1200px';

})();
