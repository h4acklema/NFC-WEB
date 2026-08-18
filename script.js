'use strict';

/* =========================================================
 * Datos de packs por sector.
 * Cada sector tiene 4 niveles: 3 packs de pago único y un
 * cuarto "Diseño exclusivo" con etiqueta personalizada y
 * cuota mensual. Cambiar aquí el contenido no requiere tocar
 * el HTML: las tarjetas se generan con renderCards().
 * ========================================================= */
const SECTORS = {
  gastronomia: [
    {
      name: 'Esencial',
      desc: 'Para empezar a sumar reseñas hoy mismo.',
      price: '39 €',
      priceNote: 'pago único',
      features: [
        'Etiqueta NFC física',
        'Enlace directo a reseñas de Google',
        'Microsite básico de tu negocio',
        'Código QR de respaldo',
      ],
    },
    {
      name: 'Conecta',
      desc: 'Reseñas + wifi sin contraseñas que teclear.',
      price: '69 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Esencial',
        'Conexión a wifi con un toque',
        'Panel para editar la red y clave',
      ],
    },
    {
      name: 'Completo',
      desc: 'Tu carta siempre actualizada, sin reimprimir.',
      price: '99 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Conecta',
        'Carta digital editable',
        'Disponible en ES / EU / EN',
        'Cambios de precios y platos ilimitados',
      ],
    },
    {
      name: 'Diseño exclusivo',
      desc: 'Etiqueta a juego con tu marca y soporte continuo.',
      price: '149 €',
      priceNote: 'pago único + 9 €/mes',
      badge: 'Más completo',
      features: [
        'Todo lo del pack Completo',
        'Etiqueta NFC con diseño personalizado',
        'Actualizaciones de contenido incluidas',
        'Soporte prioritario',
      ],
    },
  ],
  estetica: [
    {
      name: 'Esencial',
      desc: 'Consigue más reseñas tras cada cita.',
      price: '39 €',
      priceNote: 'pago único',
      features: [
        'Etiqueta NFC física',
        'Enlace directo a reseñas de Google',
        'Microsite básico de tu negocio',
        'Código QR de respaldo',
      ],
    },
    {
      name: 'Conecta',
      desc: 'Reseñas + wifi para la sala de espera.',
      price: '69 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Esencial',
        'Conexión a wifi con un toque',
        'Panel para editar la red y clave',
      ],
    },
    {
      name: 'Completo',
      desc: 'Catálogo de servicios y precios siempre al día.',
      price: '99 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Conecta',
        'Catálogo de servicios y precios editable',
        'Enlace directo a tu sistema de citas',
        'Cambios ilimitados',
      ],
    },
    {
      name: 'Diseño exclusivo',
      desc: 'Etiqueta a juego con tu marca y soporte continuo.',
      price: '149 €',
      priceNote: 'pago único + 9 €/mes',
      badge: 'Más completo',
      features: [
        'Todo lo del pack Completo',
        'Etiqueta NFC con diseño personalizado',
        'Actualizaciones de contenido incluidas',
        'Soporte prioritario',
      ],
    },
  ],
  alojamientos: [
    {
      name: 'Esencial',
      desc: 'Más reseñas al final de cada estancia.',
      price: '39 €',
      priceNote: 'pago único',
      features: [
        'Etiqueta NFC física',
        'Enlace directo a reseñas de Google',
        'Microsite básico de tu alojamiento',
        'Código QR de respaldo',
      ],
    },
    {
      name: 'Conecta',
      desc: 'Wifi al instante desde la entrada.',
      price: '69 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Esencial',
        'Conexión a wifi con un toque',
        'Panel para editar la red y clave',
      ],
    },
    {
      name: 'Completo',
      desc: 'Guía digital del huésped, siempre actualizada.',
      price: '99 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Conecta',
        'Guía del huésped editable (check-in, normas, recomendaciones)',
        'Disponible en ES / EU / EN',
        'Cambios ilimitados',
      ],
    },
    {
      name: 'Diseño exclusivo',
      desc: 'Etiqueta a juego con tu alojamiento y soporte continuo.',
      price: '149 €',
      priceNote: 'pago único + 9 €/mes',
      badge: 'Más completo',
      features: [
        'Todo lo del pack Completo',
        'Etiqueta NFC con diseño personalizado',
        'Actualizaciones de contenido incluidas',
        'Soporte prioritario',
      ],
    },
  ],
  tiendas: [
    {
      name: 'Esencial',
      desc: 'Convierte cada venta en una reseña.',
      price: '39 €',
      priceNote: 'pago único',
      features: [
        'Etiqueta NFC física',
        'Enlace directo a reseñas de Google',
        'Microsite básico de tu tienda',
        'Código QR de respaldo',
      ],
    },
    {
      name: 'Conecta',
      desc: 'Reseñas + wifi para tus clientes en tienda.',
      price: '69 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Esencial',
        'Conexión a wifi con un toque',
        'Panel para editar la red y clave',
      ],
    },
    {
      name: 'Completo',
      desc: 'Catálogo digital de productos, siempre al día.',
      price: '99 €',
      priceNote: 'pago único',
      features: [
        'Todo lo del pack Conecta',
        'Catálogo de productos editable',
        'Enlace a tu tienda online, si la tienes',
        'Cambios ilimitados',
      ],
    },
    {
      name: 'Diseño exclusivo',
      desc: 'Etiqueta a juego con tu marca y soporte continuo.',
      price: '149 €',
      priceNote: 'pago único + 9 €/mes',
      badge: 'Más completo',
      features: [
        'Todo lo del pack Completo',
        'Etiqueta NFC con diseño personalizado',
        'Actualizaciones de contenido incluidas',
        'Soporte prioritario',
      ],
    },
  ],
};

const cardsEl = document.getElementById('cards');
const tabs = Array.from(document.querySelectorAll('.tab'));

function renderCards(sectorKey) {
  const packs = SECTORS[sectorKey];
  if (!packs || !cardsEl) return;

  cardsEl.innerHTML = packs
    .map((pack) => {
      const isExclusive = pack.name === 'Diseño exclusivo';
      const badge = pack.badge
        ? `<span class="card__badge">${pack.badge}</span>`
        : '';
      const features = pack.features
        .map((f) => `<li class="card__feature">${f}</li>`)
        .join('');

      return `
        <article class="card${isExclusive ? ' card--exclusive' : ''}">
          ${badge}
          <h3 class="card__name">${pack.name}</h3>
          <p class="card__desc">${pack.desc}</p>
          <p class="card__price">${pack.price}</p>
          <p class="card__price-note">${pack.priceNote}</p>
          <ul class="card__features">${features}</ul>
          <div class="card__cta">
            <a href="#contacto" class="btn ${isExclusive ? 'btn--primary' : 'btn--ghost'}">Solicitar</a>
          </div>
        </article>
      `;
    })
    .join('');
}

function activateTab(tab) {
  tabs.forEach((t) => {
    const isActive = t === tab;
    t.classList.toggle('is-active', isActive);
    t.setAttribute('aria-selected', String(isActive));
    t.tabIndex = isActive ? 0 : -1;
  });

  if (cardsEl) cardsEl.setAttribute('aria-labelledby', tab.id);
  renderCards(tab.dataset.sector);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));

  tab.addEventListener('keydown', (event) => {
    let targetIndex = null;
    if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') targetIndex = 0;
    if (event.key === 'End') targetIndex = tabs.length - 1;

    if (targetIndex !== null) {
      event.preventDefault();
      const target = tabs[targetIndex];
      target.focus();
      activateTab(target);
    }
  });
});

if (tabs.length) {
  activateTab(tabs[0]);
}

/* ---------- menú móvil ---------- */

const navToggle = document.querySelector('.nav__toggle');
const navNav = document.querySelector('.nav__nav');

if (navToggle && navNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navNav.classList.contains('is-open')) {
      navNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}
