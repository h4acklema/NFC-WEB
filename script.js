'use strict';

/* =========================================================
 * Configurador de servicios.
 *
 * SERVICES es la única fuente de verdad de precios: la lista de
 * casillas, el total en vivo, el presupuesto en PDF y el correo se
 * generan todos desde aquí. Para cambiar un precio, cámbialo solo en
 * este array.
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

/* =========================================================
 * Diagnóstico de seguridad.
 *
 * Cada punto declara en `when` bajo qué circunstancias aplica, en
 * función de los servicios marcados y del sector elegido. La lista se
 * vuelve a montar cada vez que cambia la configuración, así que un
 * negocio solo ve lo que le afecta de verdad.
 *
 * when: ({ has, sector }) => boolean
 * ========================================================= */

const SECURITY_CHECKS = [
  {
    id: 'router',
    text: 'La contraseña de administración del router no es la que venía de fábrica.',
    why: 'Las claves por defecto de cada modelo están publicadas en internet.',
    when: () => true,
  },
  {
    id: 'google-2fa',
    text: 'Tu ficha de Google Business tiene verificación en dos pasos activada.',
    why: 'Si te roban esa cuenta pierdes el control de tus reseñas y de tus datos en Google Maps.',
    when: () => true,
  },
  {
    id: 'actualizaciones',
    text: 'Los dispositivos del local (TPV, tablet, ordenador) reciben actualizaciones.',
    why: 'La mayoría de ataques a comercios aprovechan fallos ya corregidos por el fabricante.',
    when: () => true,
  },
  {
    id: 'wifi-cifrado',
    text: 'El wifi usa cifrado WPA2 o WPA3, nunca WEP ni red abierta.',
    why: 'Vas a dar acceso a clientes: sin cifrado, cualquiera puede leer el tráfico de la red.',
    when: ({ has }) => has('wifi'),
  },
  {
    id: 'wifi-invitados',
    text: 'La red de clientes está separada de la red del TPV y de la caja.',
    why: 'Es la medida más importante al abrir el wifi al público: aísla tus cobros del tráfico de invitados.',
    when: ({ has }) => has('wifi'),
  },
  {
    id: 'tpv-aislado',
    text: 'El datáfono o TPV no comparte red con dispositivos personales del equipo.',
    why: 'En hostelería y tienda es donde pasan los cobros: cuanto más aislado, mejor.',
    when: ({ sector }) => sector === 'gastronomia' || sector === 'tiendas',
  },
  {
    id: 'web-https',
    text: 'Tu web carga por HTTPS y el certificado se renueva solo.',
    why: 'Sin HTTPS, el navegador marca tu web como "no segura" y Google te penaliza.',
    when: ({ has }) => has('web'),
  },
  {
    id: 'web-backup',
    text: 'Existe una copia de seguridad de la web que se puede restaurar.',
    why: 'Una copia que nunca se ha probado no es una copia de seguridad.',
    when: ({ has }) => has('web'),
  },
  {
    id: 'panel-clave',
    text: 'El acceso al panel donde editas tu carta o catálogo tiene contraseña propia y fuerte.',
    why: 'Es lo que ven tus clientes: si alguien entra, puede cambiar precios o publicar lo que quiera.',
    when: ({ has }) => has('catalogo') || has('web'),
  },
  {
    id: 'rgpd-huespedes',
    text: 'Los datos de registro de viajeros se guardan cifrados y se borran cuando toca.',
    why: 'El registro de huéspedes son datos personales con obligaciones legales concretas.',
    when: ({ sector }) => sector === 'alojamientos',
  },
  {
    id: 'rgpd-fichas',
    text: 'Las fichas de clientes con datos de salud están bajo llave o cifradas.',
    why: 'Los datos de salud son categoría especial en el RGPD: exigen más protección que un nombre y un teléfono.',
    when: ({ sector }) => sector === 'estetica',
  },
  {
    id: 'fotos-derechos',
    text: 'Las fotos que publicas son tuyas o tienes permiso para usarlas.',
    why: 'Usar fotos de bancos de imágenes sin licencia es la reclamación más habitual que recibe un comercio.',
    when: ({ has }) => has('fotos') || has('web') || has('catalogo'),
  },
];

const CONTACTO = 'hola@toka.es';
const NOTA_IVA = 'Precios sin IVA.';
const VALIDEZ_DIAS = 30;

/* ---------- estado ---------- */

const selected = new Set(SERVICES.filter((s) => s.required).map((s) => s.id));
const securityDone = new Set();
let currentSector = 'gastronomia';

/* ---------- helpers ---------- */

const euros = (n) => `${n} €`;
const has = (id) => selected.has(id);

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

/** Puntos de seguridad que aplican a la configuración actual. */
function activeChecks() {
  return SECURITY_CHECKS.filter((check) => check.when({ has, sector: currentSector }));
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

/* ---------- render: diagnóstico de seguridad ---------- */

const checklistEl = document.getElementById('checklist-items');
const checklistContextEl = document.getElementById('checklist-context');
const checklistScoreEl = document.getElementById('checklist-score');

function renderChecklist() {
  const checks = activeChecks();

  // Un punto que deja de aplicar no debe seguir contando como hecho.
  const activeIds = new Set(checks.map((c) => c.id));
  securityDone.forEach((id) => {
    if (!activeIds.has(id)) securityDone.delete(id);
  });

  checklistContextEl.textContent =
    `${checks.length} puntos para un negocio de ${SECTORS[currentSector].label.toLowerCase()} ` +
    `con los servicios que has marcado.`;

  checklistEl.innerHTML = checks
    .map(
      (check) => `
        <li class="check">
          <label class="check__label" for="chk-${check.id}">
            <input class="check__box" type="checkbox" id="chk-${check.id}" value="${check.id}"
              ${securityDone.has(check.id) ? 'checked' : ''}>
            <span class="check__text">
              <span class="check__main">${esc(check.text)}</span>
              <span class="check__why">${esc(check.why)}</span>
            </span>
          </label>
        </li>`
    )
    .join('');

  renderScore();
}

function renderScore() {
  const total = activeChecks().length;
  const done = securityDone.size;
  const pending = total - done;

  checklistScoreEl.textContent =
    pending === 0
      ? `${done} de ${total}. Todo cubierto, buen trabajo.`
      : `${done} de ${total} cubiertos · ${pending} ${pending === 1 ? 'punto pendiente' : 'puntos pendientes'}.`;
  checklistScoreEl.classList.toggle('checklist__score--ok', pending === 0);
}

function update() {
  renderServices();
  renderSummary();
  renderChecklist();
}

/* ---------- interacción ---------- */

listEl.addEventListener('change', (event) => {
  const input = event.target.closest('.service__check');
  if (!input) return;

  if (input.checked) selected.add(input.value);
  else selected.delete(input.value);

  renderSummary();
  renderChecklist();
});

checklistEl.addEventListener('change', (event) => {
  const input = event.target.closest('.check__box');
  if (!input) return;

  if (input.checked) securityDone.add(input.value);
  else securityDone.delete(input.value);

  renderScore();
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

/* ---------- envío por correo ----------
 * Web estática: no hay servidor que reciba el formulario, así que se
 * compone un mailto con el presupuesto y el diagnóstico ya escritos y
 * se abre el cliente de correo del usuario. Si algún día se despliega
 * en Netlify, aquí es donde entraría Netlify Forms.
 */

const form = document.getElementById('contact-form');
const emailInput = document.getElementById('email');
const telInput = document.getElementById('telefono');
const mensajeInput = document.getElementById('mensaje');
const formStatus = document.getElementById('form-status');

function buildEmailBody() {
  const { once, month } = totals();
  const negocio = businessInput.value.trim();
  const checks = activeChecks();
  const pendientes = checks.filter((c) => !securityDone.has(c.id));

  const lineas = [];

  if (mensajeInput.value.trim()) {
    lineas.push(mensajeInput.value.trim(), '');
  }

  lineas.push('--- MI CONFIGURACIÓN ---');
  if (negocio) lineas.push(`Negocio: ${negocio}`);
  lineas.push(`Sector: ${SECTORS[currentSector].label}`);
  if (telInput.value.trim()) lineas.push(`Teléfono: ${telInput.value.trim()}`);
  lineas.push('');

  selectedServices().forEach((s) => {
    lineas.push(`- ${s.name}: ${s.unit === 'month' ? `${euros(s.price)}/mes` : euros(s.price)}`);
  });
  lineas.push('');
  lineas.push(`Total pago único: ${euros(once)}`);
  if (month > 0) lineas.push(`Cuota mensual: ${euros(month)}/mes`);

  lineas.push('', '--- DIAGNÓSTICO DE SEGURIDAD ---');
  lineas.push(`Cubiertos: ${securityDone.size} de ${checks.length}`);

  if (pendientes.length) {
    lineas.push('', 'Puntos pendientes:');
    pendientes.forEach((c) => lineas.push(`- ${c.text}`));
  } else {
    lineas.push('Sin puntos pendientes.');
  }

  return lineas.join('\n');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  if (!email || !emailInput.checkValidity()) {
    formStatus.textContent = 'Necesitamos un email válido para poder responderte.';
    formStatus.classList.add('contact-form__note--error');
    emailInput.focus();
    return;
  }

  formStatus.classList.remove('contact-form__note--error');

  const negocio = businessInput.value.trim();
  const asunto = negocio ? `Presupuesto TOKA — ${negocio}` : 'Presupuesto TOKA';

  window.location.href =
    `mailto:${CONTACTO}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(buildEmailBody())}`;

  formStatus.textContent = 'Abriendo tu programa de correo con todo escrito. Solo tienes que darle a enviar.';
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

/* ---------- cortinilla de entrada ----------
 * La animación CSS ya deja la capa oculta al terminar, así que esto
 * solo bloquea el scroll mientras dura y luego la retira del DOM.
 * Se muestra una vez por pestaña para no repetirla al volver atrás.
 */

const intro = document.getElementById('intro');

if (intro) {
  const yaVista = sessionStorage.getItem('toka-intro') === 'visto';
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yaVista || sinMovimiento) {
    intro.remove();
  } else {
    document.body.classList.add('is-intro');
    sessionStorage.setItem('toka-intro', 'visto');

    const cerrar = () => {
      document.body.classList.remove('is-intro');
      intro.remove();
    };

    intro.addEventListener('animationend', (event) => {
      if (event.animationName === 'introOut') cerrar();
    });

    // Red de seguridad por si el animationend no llega.
    setTimeout(cerrar, 3000);
  }
}

/* ---------- arranque ---------- */

update();
