/* ============================================================
   HERO SLIDER — Enhanced with Ken Burns, smooth transitions
   ============================================================ */
(function() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  let current = 1; // Start at index 1 (second slide, which has is-active)
  let interval;
  let isTransitioning = false;
  const delay = 5000;

  // Create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === current) btn.classList.add('is-active');
    btn.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(btn);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function updateSlides() {
    if (isTransitioning) return;
    isTransitioning = true;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });

    setTimeout(() => { isTransitioning = false; }, 1200);
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    updateSlides();
  }

  function goToSlide(index) {
    current = index;
    updateSlides();
    resetInterval();
  }

  function startInterval() {
    interval = setInterval(nextSlide, delay);
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetInterval();
    }
  }, { passive: true });

  startInterval();
})();

/* ========================
   MOBILE MENU - Hamburger 
   ======================== */
(function() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobilePanel = document.getElementById('mobilePanel');

  if (!hamburger || !mobilePanel) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobilePanel.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close on link click
  mobilePanel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobilePanel.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });
})();

/* ======================================
   LIGHTBOX — Opens clicked gallery image
   ======================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(element) {
  const img = element.querySelector('img');
  if (!img || !lightbox || !lightboxImg) return;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* =============
   TESTIMONIALS 
   ============= */
(function() {
  const cards = document.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
})();

/* ============================================================
   SCROLL REVEAL — About points, service cards, gallery items
   ============================================================ */
(function() {
  const revealElements = document.querySelectorAll('.about-point, .service-card, .gallery-item, .location-row');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    revealObserver.observe(el);
  });

  // Add CSS class handler
  const style = document.createElement('style');
  style.textContent = '.is-revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
})();

/* ============
   BACK TO TOP
   ============ */
(function() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- Auto-update footer year ---------- */
document.getElementById('currentYear').textContent = new Date().getFullYear();

/* =======================
   HEADER SHADOW ON SCROLL
   ======================= */
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  });
})();


/* ============================================================
   LAZY MAP LOADING — Only load Google Maps when visible
   ============================================================ */
(function() {
  const mapFrame = document.getElementById('mapFrame');
  if (!mapFrame) return;

  const iframe = mapFrame.querySelector('iframe');
  if (!iframe || iframe.src) return; // Already loaded

  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const dataSrc = iframe.getAttribute('data-src');
        if (dataSrc) {
          iframe.src = dataSrc;
          iframe.removeAttribute('data-src');
        }
        mapObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0 });

  mapObserver.observe(mapFrame);
})();

/* ============================================================
   IMAGE LOADING OPTIMIZATION — Fade in images as they load
   ============================================================ */
(function() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!images.length) return;

  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — add fade-in as they enter viewport
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // If already loaded, just ensure opacity
          if (img.complete) {
            img.style.opacity = '1';
          } else {
            img.addEventListener('load', () => {
              img.style.opacity = '1';
            }, { once: true });
            img.addEventListener('error', () => {
              img.style.opacity = '1';
              img.style.background = '#ddd';
            }, { once: true });
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px', threshold: 0 });

    images.forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease';
      imgObserver.observe(img);
    });
  }
})();
