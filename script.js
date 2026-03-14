/* ==========================================
   JHALIM BEAUTY — script.js
   1. Navbar: scroll shadow + mobile toggle
   2. Reveal on scroll
   3. Service filters
   4. Promotions carousel
   5. Contact form validation
========================================== */

/* ─── 1. NAVBAR ─── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// Cierra el menú al hacer clic en un enlace (mobile)
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});


/* ─── 2. REVEAL ON SCROLL ─── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Pequeño delay escalonado para elementos hermanos
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));


/* ─── 3. SERVICE FILTERS ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Activa botón
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Muestra / oculta tarjetas
    serviceCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ─── 4. PROMOTIONS CAROUSEL ─── */
const track = document.getElementById('promosTrack');
const cards = track ? track.querySelectorAll('.promo-card') : [];
const dotsContainer = document.getElementById('promosDots');
let currentPromo = 0;

function buildDots() {
  if (!dotsContainer) return;
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('promos__dot');
    dot.setAttribute('aria-label', `Promoción ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToPromo(i));
    dotsContainer.appendChild(dot);
  });
}

function goToPromo(index) {
  currentPromo = index;
  const cardWidth = cards[0].offsetWidth + 24; // ancho + gap
  track.style.transform = `translateX(-${currentPromo * cardWidth}px)`;

  dotsContainer.querySelectorAll('.promos__dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentPromo);
  });
}

document.getElementById('promoNext')?.addEventListener('click', () => {
  goToPromo((currentPromo + 1) % cards.length);
});
document.getElementById('promoPrev')?.addEventListener('click', () => {
  goToPromo((currentPromo - 1 + cards.length) % cards.length);
});

buildDots();

// Recalcula posición si cambia el tamaño de ventana
window.addEventListener('resize', () => goToPromo(currentPromo));


/* ─── 5. CONTACT FORM VALIDATION ─── */
const form = document.getElementById('contactForm');

const validators = {
  nombre: {
    el: document.getElementById('nombre'),
    error: document.getElementById('nombreError'),
    validate: (v) => v.trim().length >= 3 ? '' : 'Ingresa tu nombre completo.',
  },
  telefono: {
    el: document.getElementById('telefono'),
    error: document.getElementById('telefonoError'),
    validate: (v) => /^[\d\s\-+()]{8,15}$/.test(v.trim()) ? '' : 'Ingresa un teléfono válido.',
  },
  servicio: {
    el: document.getElementById('servicio'),
    error: document.getElementById('servicioError'),
    validate: (v) => v !== '' ? '' : 'Selecciona un servicio.',
  },
  fecha: {
    el: document.getElementById('fecha'),
    error: document.getElementById('fechaError'),
    validate: (v) => {
      if (!v) return 'Selecciona una fecha.';
      if (new Date(v) < new Date()) return 'La fecha debe ser futura.';
      return '';
    },
  },
};

function validateField(key) {
  const { el, error, validate } = validators[key];
  const msg = validate(el.value);
  error.textContent = msg;
  el.classList.toggle('error', msg !== '');
  return msg === '';
}

// Validación en tiempo real al salir del campo
Object.keys(validators).forEach(key => {
  validators[key].el.addEventListener('blur', () => validateField(key));
  validators[key].el.addEventListener('input', () => {
    if (validators[key].el.classList.contains('error')) validateField(key);
  });
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const allValid = Object.keys(validators).every(validateField);
  if (!allValid) return;

  // Simulación de envío exitoso
  // En producción: reemplazar con fetch() a tu backend o enlace a WhatsApp
  const nombre = validators.nombre.el.value.trim();
  const servicio = validators.servicio.el.value;
  const fecha = validators.fecha.el.value;

  const whatsappMsg = encodeURIComponent(
    `Hola, soy ${nombre} y quisiera agendar ${servicio} el ${fecha}. ¿Tienen disponibilidad?`
  );

  // Abre WhatsApp con los datos del formulario
  window.open(`https://wa.me/521XXXXXXXXXX?text=${whatsappMsg}`, '_blank');

  // Muestra mensaje de éxito y resetea
  document.getElementById('formSuccess').classList.add('visible');
  form.reset();
  setTimeout(() => {
    document.getElementById('formSuccess').classList.remove('visible');
  }, 5000);
});
