/* СибСтрой38 — landing JS
   Mobile nav, FAQ accordion, sliders (renders + plans), blueprints lightbox,
   Yandex Forms iframe loader.
*/

(function () {
  'use strict';

  // ---------- Mobile nav ----------
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.navbar nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.textContent = nav.classList.contains('open') ? 'Закрыть' : 'Меню';
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        navToggle.textContent = 'Меню';
      }
    });
  }

  // ---------- Slider factory ----------
  function initSlider(rootSel, slideSel, prevSel, nextSel, counterSel, opts) {
    const root = document.querySelector(rootSel);
    if (!root) return;
    const slides = root.querySelectorAll(slideSel);
    if (!slides.length) return;
    const prevBtn = root.querySelector(prevSel);
    const nextBtn = root.querySelector(nextSel);
    const counter = root.querySelector(counterSel);

    let current = 0;
    function show(i) {
      current = ((i % slides.length) + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
      if (counter) {
        counter.textContent =
          String(current + 1).padStart(2, '0') + ' / ' +
          String(slides.length).padStart(2, '0');
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', () => { show(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { show(current + 1); resetAuto(); });
    show(0);

    let timer = null;
    function startAuto() {
      if (!opts || !opts.auto) return;
      if (timer) return;
      timer = setInterval(() => show(current + 1), opts.interval || 6000);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    function resetAuto() { stopAuto(); startAuto(); }

    if (opts && opts.auto) {
      root.addEventListener('mouseenter', stopAuto);
      root.addEventListener('mouseleave', startAuto);
      startAuto();
    }
  }

  initSlider('.gallery', '.gallery-slide',
             '.gallery-controls .prev', '.gallery-controls .next',
             '.gallery-counter',
             { auto: true, interval: 6000 });

  initSlider('.plans-gallery', '.plans-slide',
             '.plans-controls .prev', '.plans-controls .next',
             '.plans-counter',
             { auto: false });

  // ---------- Stages carousel (slide + clickable timeline) ----------
  const stagesRoot = document.querySelector('[data-stages]');
  if (stagesRoot) {
    const slides = stagesRoot.querySelectorAll('.stage-slide');
    const dots = stagesRoot.querySelectorAll('.stage-dot');
    const counter = stagesRoot.querySelector('.stages-counter');
    const prevBtn = stagesRoot.querySelector('.stages-buttons .prev');
    const nextBtn = stagesRoot.querySelector('.stages-buttons .next');
    const total = slides.length;
    let idx = 0;

    function showStage(i) {
      idx = ((i % total) + total) % total;
      slides.forEach((s, k) => s.classList.toggle('active', k === idx));
      dots.forEach((d, k) => {
        const on = k === idx;
        d.classList.toggle('active', on);
        d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (counter) {
        counter.textContent =
          String(idx + 1).padStart(2, '0') + ' / ' +
          String(total).padStart(2, '0');
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => showStage(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showStage(idx + 1));
    dots.forEach((d) => {
      d.addEventListener('click', () => {
        const i = parseInt(d.dataset.index, 10);
        if (!Number.isNaN(i)) showStage(i);
      });
    });
    stagesRoot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { showStage(idx - 1); }
      else if (e.key === 'ArrowRight') { showStage(idx + 1); }
    });

    showStage(0);
  }

  // ---------- FAQ — single-open accordion ----------
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ---------- Blueprints — генерация плиток + lightbox ----------
  const BLUEPRINTS = [
    { src: 'img/process/process-02.webp', label: 'АР · визуализация (3D)' },
    { src: 'img/process/process-10.webp', label: 'АР · фасад' },
    { src: 'img/process/process-20.webp', label: 'АР · фасад В-А, отметки' },
    { src: 'img/process/process-01.webp', label: 'АР · кладочный план несущих стен' },
    { src: 'img/process/process-05.webp', label: 'АР · кладочный план перегородок' },
    { src: 'img/process/process-15.webp', label: 'АР · ведомость окон и дверей' },
    { src: 'img/process/process-03.webp', label: 'АР · лист 03' },
    { src: 'img/process/process-04.webp', label: 'АР · лист 04' },
    { src: 'img/process/process-06.webp', label: 'АР · лист 06' },
    { src: 'img/process/process-07.webp', label: 'АР · лист 07' },
    { src: 'img/process/process-08.webp', label: 'АР · лист 08' },
    { src: 'img/process/process-09.webp', label: 'АР · лист 09' },
    { src: 'img/process/process-11.webp', label: 'АР · лист 11' },
    { src: 'img/process/process-12.webp', label: 'АР · лист 12' },
    { src: 'img/process/process-13.webp', label: 'АР · лист 13' },
    { src: 'img/process/process-14.webp', label: 'АР · лист 14' },
    { src: 'img/process/process-16.webp', label: 'АР · лист 16' },
    { src: 'img/process/process-17.webp', label: 'АР · лист 17' },
    { src: 'img/process/process-18.webp', label: 'АР · лист 18' },
    { src: 'img/process/process-19.webp', label: 'АР · лист 19' },
  ];

  function pad2(n) { return String(n).padStart(2, '0'); }

  const grid = document.getElementById('blueprints-grid');
  if (grid) {
    BLUEPRINTS.forEach((b, idx) => {
      const tile = document.createElement('div');
      tile.className = 'blueprint-tile';
      tile.dataset.index = String(idx);

      const num = document.createElement('span');
      num.className = 'blueprint-num';
      num.textContent = pad2(idx + 1) + ' / ' + pad2(BLUEPRINTS.length);
      tile.appendChild(num);

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = b.src;
      img.alt = b.label;
      tile.appendChild(img);

      grid.appendChild(tile);
    });

    const lb = document.getElementById('lightbox');
    const lbImg = lb && lb.querySelector('.lightbox-img');
    const lbCap = lb && lb.querySelector('.lightbox-caption');
    const lbCnt = lb && lb.querySelector('.lightbox-counter');
    const lbClose = lb && lb.querySelector('.lightbox-close');
    const lbPrev = lb && lb.querySelector('.lightbox-prev');
    const lbNext = lb && lb.querySelector('.lightbox-next');
    let lbIndex = 0;

    function openLightbox(i) {
      if (!lb) return;
      lbIndex = ((i % BLUEPRINTS.length) + BLUEPRINTS.length) % BLUEPRINTS.length;
      const b = BLUEPRINTS[lbIndex];
      lbImg.src = b.src;
      lbImg.alt = b.label;
      lbCap.textContent = b.label;
      lbCnt.textContent = pad2(lbIndex + 1) + ' / ' + pad2(BLUEPRINTS.length);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      if (!lb) return;
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    grid.addEventListener('click', (e) => {
      const tile = e.target.closest('.blueprint-tile');
      if (!tile) return;
      openLightbox(parseInt(tile.dataset.index, 10));
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => openLightbox(lbIndex - 1));
    if (lbNext) lbNext.addEventListener('click', () => openLightbox(lbIndex + 1));
    if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
      else if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
    });
  }

  // ---------- Yandex Forms iframe loader ----------
  // Загружаем iframe только если ID формы уже подставлен (не плейсхолдер).
  document.querySelectorAll('iframe[data-yandex-form-src]').forEach((ifr) => {
    const src = ifr.getAttribute('data-yandex-form-src');
    if (src && src.indexOf('REPLACE_WITH_YOUR_FORM_ID') === -1) {
      ifr.src = src;
      const note = ifr.parentElement && ifr.parentElement.querySelector('.form-placeholder-note');
      if (note) note.style.display = 'none';
    }
  });
})();
