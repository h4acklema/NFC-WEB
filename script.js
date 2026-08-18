'use strict';

/* =========================================================
 * Configurador de servicios.
 *
 * SERVICES es la única fuente de verdad de precios: la lista de
 * casillas, el total en vivo y el presupuesto en PDF se generan
 * todos desde aquí. Para cambiar un precio, cámbialo solo en este
 * array.
 *
 * unit: 'once'  → pago único, suma al total inicial
 *       'month' → cuota mensual, se muestra aparte
 * ========================================================= */

const SERVICES = [
  {
    id: 'nfc',
    name: 'Etiqueta NFC + reseñas en Google',
    desc: 'La tarjeta física programada y tu página con enlace directo a tus reseñas. Es la base de todo lo demás.',
    price: 25,
    unit: 'once',
    required: true,
  },
  {
    id: 'wifi',
    name: 'Wifi para tus clientes',
    desc: 'Conexión automática en Android. En iPhone, la red y la clave aparecen listas para copiar, sin teclearlas.',
    price: 20,
    unit: 'once',
  },
  {
    id: 'catalogo',
    name: 'Carta digital',
    desc: 'Tu carta con precios, editable siempre que quieras sin volver a imprimir nada.',
    price: 30,
    unit: 'once',
  },
  {
    id: 'web',
    name: 'Web completa para tu negocio',
    desc: '¿Todavía no tienes web? Te montamos una, con tus servicios, horario, ubicación y contacto. Tuya, sin plantillas de terceros.',
    price: 180,
    unit: 'once',
  },
  {
    id: 'diseno',
    name: 'Diseño exclusivo de la tarjeta',
    desc: 'Tarjeta NFC con tu logo, tus colores y tu marca, en lugar del modelo estándar.',
    price: 45,
    unit: 'once',
  },
  {
    id: 'fotos',
    name: 'Sesión de fotos',
    desc: 'Vamos a tu local y hacemos las fotos para tu carta o tu web. Si ya tienes fotos propias, no lo necesitas.',
    price: 60,
    unit: 'once',
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento y cambios ilimitados',
    desc: 'Nos ocupamos nosotros de tus actualizaciones siempre que las necesites. Sin permanencia, te das de baja cuando quieras.',
    price: 12,
    unit: 'month',
  },
];

/*
 * Ajustes de texto por sector. Solo cambian el nombre y la descripción
 * de algunos servicios — los precios son los mismos para todos.
 */
const SECTORS = {
  gastronomia: {
    label: 'Gastronomía',
    overrides: {
      catalogo: {
        name: 'Carta digital',
        desc: 'Tu carta con precios y alérgenos, editable siempre que quieras sin volver a imprimir nada.',
      },
      fotos: {
        desc: 'Vamos a tu local y fotografiamos tus platos para la carta. Si ya tienes fotos propias, no lo necesitas.',
      },
    },
  },
  estetica: {
    label: 'Estética',
    overrides: {
      catalogo: {
        name: 'Catálogo de servicios',
        desc: 'Tus tratamientos y precios, editables siempre que quieras.',
      },
      fotos: {
        desc: 'Vamos a tu local y fotografiamos el espacio y tus tratamientos. Si ya tienes fotos propias, no lo necesitas.',
      },
    },
  },
  alojamientos: {
    label: 'Alojamientos',
    overrides: {
      catalogo: {
        name: 'Guía del huésped',
        desc: 'Check-in, normas de la casa y recomendaciones de la zona, editables siempre que quieras.',
      },
      fotos: {
        desc: 'Vamos a tu alojamiento y fotografiamos habitaciones y zonas comunes. Si ya tienes fotos propias, no lo necesitas.',
      },
    },
  },
  tiendas: {
    label: 'Tiendas',
    overrides: {
      catalogo: {
        name: 'Catálogo de productos',
        desc: 'Tus productos y precios, editables siempre que quieras.',
      },
      fotos: {
        desc: 'Vamos a tu tienda y fotografiamos tus productos para el catálogo. Si ya tienes fotos propias, no lo necesitas.',
      },
    },
  },
};

const CONTACTO = 'hola@toka.es';
const NOTA_IVA = 'Precios sin IVA.';
const VALIDEZ_DIAS = 30;

/* ---------- estado ---------- */

const selected = new Set(SERVICES.filter((s) => s.required).map((s) => s.id));
let currentSector = 'gastronomia';

/* ---------- helpers ---------- */

const euros = (n) => `${n} €`;

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Devuelve el servicio con los textos del sector activo aplicados. */
function resolveService(service, sectorKey) {
  const override = SECTORS[sectorKey].overrides[service.id];
  return override ? { ...service, ...override } : service;
}

function selectedServices() {
  return SERVICES.filter((s) => selected.has(s.id)).map((s) => resolveService(s, currentSector));
}

function totals() {
  const chosen = selectedServices();
  return {
    once: chosen.filter((s) => s.unit === 'once').reduce((sum, s) => sum + s.price, 0),
    month: chosen.filter((s) => s.unit === 'month').reduce((sum, s) => sum + s.price, 0),
  };
}

/* ---------- render: lista de servicios ---------- */

const listEl = document.getElementById('service-list');
const tabs = Array.from(document.querySelectorAll('.tab'));

function renderServices() {
  listEl.innerHTML = SERVICES.map((raw) => {
    const s = resolveService(raw, currentSector);
    const isOn = selected.has(s.id);
    const priceLabel = s.unit === 'month' ? `${euros(s.price)}<span>/mes</span>` : euros(s.price);

    return `
      <li class="service${s.required ? ' service--required' : ''}">
        <label class="service__label" for="svc-${s.id}">
          <input
            class="service__check"
            type="checkbox"
            id="svc-${s.id}"
            value="${s.id}"
            ${isOn ? 'checked' : ''}
            ${s.required ? 'disabled' : ''}>
          <span class="service__text">
            <span class="service__name">
              ${esc(s.name)}
              ${s.required ? '<span class="service__tag">Siempre incluido</span>' : ''}
            </span>
            <span class="service__desc">${esc(s.desc)}</span>
          </span>
          <span class="service__price">${priceLabel}</span>
        </label>
      </li>
    `;
  }).join('');
}

/* ---------- render: resumen en vivo ---------- */

const summaryListEl = document.getElementById('summary-list');
const summaryOnceEl = document.getElementById('summary-once');
const summaryMonthEl = document.getElementById('summary-month');
const summaryMonthRow = document.getElementById('summary-month-row');

function renderSummary() {
  const chosen = selectedServices();
  const { once, month } = totals();

  summaryListEl.innerHTML = chosen
    .map(
      (s) => `
        <li class="summary__item">
          <span>${esc(s.name)}</span>
          <span class="summary__item-price">${s.unit === 'month' ? `${euros(s.price)}/mes` : euros(s.price)}</span>
        </li>`
    )
    .join('');

  summaryOnceEl.textContent = euros(once);
  summaryMonthEl.textContent = `${euros(month)}/mes`;
  summaryMonthRow.hidden = month === 0;
}

function update() {
  renderServices();
  renderSummary();
}

/* ---------- interacción ---------- */

listEl.addEventListener('change', (event) => {
  const input = event.target.closest('.service__check');
  if (!input) return;

  if (input.checked) selected.add(input.value);
  else selected.delete(input.value);

  renderSummary();
});

function activateTab(tab) {
  currentSector = tab.dataset.sector;

  tabs.forEach((t) => {
    const isActive = t === tab;
    t.setAttribute('aria-selected', String(isActive));
    t.tabIndex = isActive ? 0 : -1;
  });

  update();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));

  tab.addEventListener('keydown', (event) => {
    let target = null;
    if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabs.length - 1;

    if (target !== null) {
      event.preventDefault();
      tabs[target].focus();
      activateTab(tabs[target]);
    }
  });
});

/* ---------- presupuesto en PDF ----------
 * Se rellena .quote y se llama a window.print(): la hoja de estilos
 * de impresión oculta la web y deja solo el presupuesto, así el
 * navegador lo guarda como PDF sin necesidad de librerías externas.
 */

const quoteEl = document.getElementById('quote');
const businessInput = document.getElementById('negocio');
const pdfButton = document.getElementById('generar-pdf');

function buildQuote() {
  const chosen = selectedServices();
  const { once, month } = totals();
  const negocio = businessInput.value.trim();

  const hoy = new Date();
  const fecha = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const caduca = new Date(hoy.getTime() + VALIDEZ_DIAS * 86400000).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const filas = chosen
    .map(
      (s) => `
        <tr>
          <td>
            <strong>${esc(s.name)}</strong>
            <span>${esc(s.desc)}</span>
          </td>
          <td class="quote__cell-price">${s.unit === 'month' ? `${euros(s.price)}/mes` : euros(s.price)}</td>
        </tr>`
    )
    .join('');

  quoteEl.innerHTML = `
    <header class="quote__head">
      <p class="quote__brand">TOKA</p>
      <p class="quote__meta">Presupuesto · ${esc(fecha)}</p>
    </header>

    <h1 class="quote__title">Presupuesto${negocio ? ` para ${esc(negocio)}` : ''}</h1>
    <p class="quote__sector">Sector: ${esc(SECTORS[currentSector].label)}</p>

    <table class="quote__table">
      <thead>
        <tr><th>Servicio</th><th class="quote__cell-price">Precio</th></tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>

    <div class="quote__totals">
      <p class="quote__total"><span>Total pago único</span> <strong>${euros(once)}</strong></p>
      ${month > 0 ? `<p class="quote__total quote__total--month"><span>Después</span> <strong>${euros(month)}/mes</strong></p>` : ''}
    </div>

    <footer class="quote__foot">
      <p>${esc(NOTA_IVA)} Presupuesto válido hasta el ${esc(caduca)}.</p>
      <p>¿Lo hablamos? Escríbenos a <strong>${esc(CONTACTO)}</strong> · TOKA, Vitoria-Gasteiz</p>
    </footer>
  `;
}

pdfButton.addEventListener('click', () => {
  buildQuote();
  window.print();
});

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

/* ---------- arranque ---------- */

update();
