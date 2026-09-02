// ============ SAFETY NET + AOS INIT ============
if (typeof AOS === 'undefined') {
  document.querySelectorAll('[data-aos]').forEach(el => el.removeAttribute('data-aos'));
} else {
  AOS.init({ duration: 700, once: true, offset: 80 });
}

// ============ HEADER SCROLL EFFECT ============
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ============ MOBILE MENU ============
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');

function openMobileMenu() {
  mobileNav.classList.add('active');
  mobileNavOverlay.classList.add('active');
  burger.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileNav.classList.remove('active');
  mobileNavOverlay.classList.remove('active');
  burger.classList.remove('active');
  document.body.style.overflow = '';
}
burger.addEventListener('click', () => {
  mobileNav.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
});
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileMenu);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileMenu);
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

// ============ LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('[data-lightbox]').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
  });
});
function closeLightbox() { lightbox.classList.remove('active'); }
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ============ OPEN/CLOSED STATUS ============
const hoursSchedule = {
  0: null,
  1: { open: 8, close: 18 },
  2: { open: 8, close: 18 },
  3: { open: 8, close: 18 },
  4: { open: 8, close: 18 },
  5: { open: 8, close: 18 },
  6: { open: 8, close: 14 },
};

function updateOpenStatus() {
  const now = new Date();
  const schedule = hoursSchedule[now.getDay()];
  const hour = now.getHours() + now.getMinutes() / 60;
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('statusText');

  if (!schedule) {
    statusDot.classList.add('closed');
    statusText.textContent = 'Zamknięte · Otwieramy w poniedziałek o 8:00';
    return;
  }
  const isOpen = hour >= schedule.open && hour < schedule.close;
  if (isOpen) {
    statusDot.classList.remove('closed');
    statusText.textContent = `Otwarte teraz · Zamykamy o ${schedule.close}:00`;
  } else {
    statusDot.classList.add('closed');
    statusText.textContent = `Zamknięte · Otwieramy o ${schedule.open}:00`;
  }
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);

// ============ SMOOTH SCROLL OFFSET ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ SERVICE TABS (statyczne, bez API) ============
const serviceTabs = document.querySelectorAll('.service-tab-btn');
const serviceItems = document.querySelectorAll('.service-item');

serviceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;
    serviceTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    serviceItems.forEach(item => {
      const show = category === 'wszystkie' || item.dataset.category === category;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ============ STATS COUNTER (animacja przy scrollu) ============
const statNumbers = document.querySelectorAll('.stat__num');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;

  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateStats();
    });
  }, { threshold: 0.4 });
  observer.observe(statsBar);
}
