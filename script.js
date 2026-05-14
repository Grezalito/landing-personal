/* =============================================
   ALAN GRIEVE — JavaScript
   Navbar · Canvas Geo · Scroll Animations · Menu
   ============================================= */

'use strict';

// ─── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ─── MOBILE MENU ─────────────────────────────────────────────
const menuToggle = document.getElementById('menu-toggle');
const navLinks   = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  });
});

// ─── SCROLL REVEAL (lightweight AOS) ─────────────────────────
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('aos-visible');
      }, i * 80);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => aosObserver.observe(el));

// ─── GEOMETRIC CANVAS — HERO ─────────────────────────────────
(function initHeroCanvas() {
  const canvas = document.getElementById('geo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, nodes, animId;
  const NODE_COUNT = 80;
  const MAX_DIST   = 160;
  const VIOLET     = '139, 92, 246';

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${VIOLET}, ${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${VIOLET}, 0.7)`;
      ctx.fill();

      // Move
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  function init() {
    cancelAnimationFrame(animId);
    resize();
    createNodes();
    draw();
  }

  window.addEventListener('resize', init, { passive: true });
  init();
})();

// ─── GEOMETRIC CANVAS — CTA ──────────────────────────────────
(function initCtaCanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, hexes, animId;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createHexes() {
    hexes = [];
    const cols = Math.ceil(w / 80) + 2;
    const rows = Math.ceil(h / 70) + 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        hexes.push({
          x: c * 75 + (r % 2 ? 38 : 0),
          y: r * 65,
          opacity: Math.random() * 0.4,
          speed: Math.random() * 0.004 + 0.002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function drawHex(x, y, size, alpha) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    hexes.forEach(h => {
      const alpha = h.opacity * (0.5 + 0.5 * Math.sin(t * h.speed * 100 + h.phase));
      drawHex(h.x, h.y, 28, alpha);
    });
    animId = requestAnimationFrame(draw);
  }

  function init() {
    cancelAnimationFrame(animId);
    resize();
    createHexes();
    draw();
  }

  window.addEventListener('resize', init, { passive: true });
  init();
})();

// ─── SMOOTH HOVER TILT on project cards ──────────────────────
document.querySelectorAll('.project-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ─── ACTIVE NAV LINK on scroll ───────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── COUNTER ANIMATION for stats ─────────────────────────────
function animateCounter(el, target, suffix, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const nums = statsSection.querySelectorAll('.stat-num');
      // +40%, 15+, 3x  
      animateCounter({ set textContent(v) { nums[0].innerHTML = v + '<span class="pct">%</span>'; } }, 40, '');
      animateCounter({ set textContent(v) { nums[1].innerHTML = v + '<span class="pct">+</span>'; } }, 15, '');
      statsObserver.disconnect();
    }
  }, { threshold: 0.8 });
  statsObserver.observe(statsSection);
}
