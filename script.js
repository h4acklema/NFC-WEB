'use strict';

/* =========================================================
 * Catálogo de servicios.
 *
 * SERVICES es la única fuente de verdad de precios: las casillas, el
 * total en vivo, el presupuesto en PDF y el correo se generan todos
 * desde aquí. Para cambiar un precio, cámbialo solo en este array.
 *
 * group: agrupa las casillas bajo un encabezado en el configurador
 * unit:  'once'  → pago único, suma al total inicial
 *        'month' → cuota mensual, se muestra aparte
 * ========================================================= */

const SERVICE_GROUPS = {
  nfc: {
    label: 'Digitalización NFC',
    desc: 'La tarjeta y todo lo que puede hacer por ti.',
  },
  seguridad: {
    label: 'Ciberseguridad',
    desc: 'Lo que protege el negocio que acabas de digitalizar.',
  },
};

const SERVICES = [
  /* ---- digitalización NFC ---- */
  {
    id: 'nfc',
    group: 'nfc',
    name: 'Etiqueta NFC + reseñas en Google',
    desc: 'La tarjeta física programada y tu página con enlace directo a tus reseñas. Es la base de todo lo demás.',
    price: 25,
    unit: 'once',
    required: true,
  },
  {
    id: 'wifi',
    group: 'nfc',
    name: 'Wifi para tus clientes',
    desc: 'Conexión automática en Android. En iPhone, la red y la clave aparecen listas para copiar, sin teclearlas.',
    price: 20,
    unit: 'once',
  },
  {
    id: 'catalogo',
    group: 'nfc',
    name: 'Carta digital',
    desc: 'Tu carta con precios, editable siempre que quieras sin volver a imprimir nada.',
    price: 30,
    unit: 'once',
  },
  {
    id: 'web',
    group: 'nfc',
    name: 'Web completa para tu negocio',
    desc: '¿Todavía no tienes web? Te montamos una, con tus servicios, horario, ubicación y contacto. Tuya, sin plantillas de terceros.',
    price: 180,
    unit: 'once',
  },
  {
    id: 'diseno',
    group: 'nfc',
    name: 'Diseño exclusivo de la tarjeta',
    desc: 'Tarjeta NFC con tu logo, tus colores y tu marca, en lugar del modelo estándar.',
    price: 45,
    unit: 'once',
  },
  {
    id: 'fotos',
    group: 'nfc',
    name: 'Sesión de fotos',
    desc: 'Vamos a tu local y hacemos las fotos para tu carta o tu web. Si ya tienes fotos propias, no lo necesitas.',
    price: 60,
    unit: 'once',
  },
  {
    id: 'mantenimiento',
    group: 'nfc',
    name: 'Mantenimiento y cambios ilimitados',
    desc: 'Nos ocupamos nosotros de tus actualizaciones siempre que las necesites. Sin permanencia, te das de baja cuando quieras.',
    price: 12,
    unit: 'month',
  },

  /* ---- ciberseguridad ---- */
  {
    id: 'auditoria',
    group: 'seguridad',
    name: 'Revisión de seguridad del local',
    desc: 'Vamos a tu negocio, revisamos router, red, dispositivos y cuentas, y te dejamos un informe con lo que hay que arreglar y en qué orden.',
    price: 90,
    unit: 'once',
  },
  {
    id: 'wifiseguro',
    group: 'seguridad',
    name: 'Wifi seguro con red de invitados',
    desc: 'Configuramos una red para clientes separada de la del TPV y la caja, con cifrado actual y contraseña de administración propia.',
    price: 70,
    unit: 'once',
  },
  {
    id: 'formacion',
    group: 'seguridad',
    name: 'Formación al equipo',
    desc: 'Una sesión práctica con tu personal: correos falsos, estafas del falso proveedor, contraseñas y qué hacer si algo se tuerce.',
    price: 60,
    unit: 'once',
  },
  {
    id: 'backups',
    group: 'seguridad',
    name: 'Copias de seguridad automáticas',
    desc: 'Dejamos configuradas copias de tu web y tus datos, y comprobamos que se pueden restaurar de verdad.',
    price: 50,
    unit: 'once',
  },
  {
    id: 'vigilancia',
    group: 'seguridad',
    name: 'Vigilancia y soporte de seguridad',
    desc: 'Revisamos cada mes que todo siga actualizado y al día, y nos tienes a mano si sospechas de algo. Sin permanencia.',
    price: 19,
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
 * `when`      → bajo qué circunstancias aplica el punto, según los
 *               servicios marcados y el sector. La lista se rehace
 *               cada vez que cambia la configuración.
 * `coveredBy` → servicio de TOKA que resuelve ese punto. Si está
 *               contratado, el punto cuenta como cubierto y deja de
 *               ser tarea del cliente.
 * ========================================================= */

const SECURITY_CHECKS = [
  {
    id: 'router',
    text: 'La contraseña de administración del router no es la que venía de fábrica.',
    why: 'Las claves por defecto de cada modelo están publicadas en internet.',
    coveredBy: 'auditoria',
    when: () => true,
  },
  {
    id: 'google-2fa',
    text: 'Tu ficha de Google Business tiene verificación en dos pasos activada.',
    why: 'Si te roban esa cuenta pierdes el control de tus reseñas y de tus datos en Google Maps.',
    coveredBy: 'auditoria',
    when: () => true,
  },
  {
    id: 'actualizaciones',
    text: 'Los dispositivos del local (TPV, tablet, ordenador) reciben actualizaciones.',
    why: 'La mayoría de ataques a comercios aprovechan fallos ya corregidos por el fabricante.',
    coveredBy: 'vigilancia',
    when: () => true,
  },
  {
    id: 'personal',
    text: 'Tu equipo sabe reconocer un correo falso o una llamada de un falso proveedor.',
    why: 'El fraude al comercio pequeño casi siempre entra por una persona, no por un servidor.',
    coveredBy: 'formacion',
    when: () => true,
  },
  {
    id: 'wifi-cifrado',
    text: 'El wifi usa cifrado WPA2 o WPA3, nunca WEP ni red abierta.',
    why: 'Vas a dar acceso a clientes: sin cifrado, cualquiera puede leer el tráfico de la red.',
    coveredBy: 'wifiseguro',
    when: ({ has }) => has('wifi'),
  },
  {
    id: 'wifi-invitados',
    text: 'La red de clientes está separada de la red del TPV y de la caja.',
    why: 'Es la medida más importante al abrir el wifi al público: aísla tus cobros del tráfico de invitados.',
    coveredBy: 'wifiseguro',
    when: ({ has }) => has('wifi'),
  },
  {
    id: 'tpv-aislado',
    text: 'El datáfono o TPV no comparte red con dispositivos personales del equipo.',
    why: 'En hostelería y tienda es donde pasan los cobros: cuanto más aislado, mejor.',
    coveredBy: 'wifiseguro',
    when: ({ sector }) => sector === 'gastronomia' || sector === 'tiendas',
  },
  {
    id: 'web-https',
    text: 'Tu web carga por HTTPS y el certificado se renueva solo.',
    why: 'Sin HTTPS, el navegador marca tu web como "no segura" y Google te penaliza.',
    coveredBy: 'web',
    when: ({ has }) => has('web'),
  },
  {
    id: 'web-backup',
    text: 'Existe una copia de seguridad que se puede restaurar.',
    why: 'Una copia que nunca se ha probado no es una copia de seguridad.',
    coveredBy: 'backups',
    when: ({ has }) => has('web') || has('catalogo'),
  },
  {
    id: 'panel-clave',
    text: 'El acceso al panel donde editas tu carta o catálogo tiene contraseña propia y fuerte.',
    why: 'Es lo que ven tus clientes: si alguien entra, puede cambiar precios o publicar lo que quiera.',
    coveredBy: 'auditoria',
    when: ({ has }) => has('catalogo') || has('web'),
  },
  {
    id: 'rgpd-huespedes',
    text: 'Los datos de registro de viajeros se guardan cifrados y se borran cuando toca.',
    why: 'El registro de huéspedes son datos personales con obligaciones legales concretas.',
    coveredBy: 'auditoria',
    when: ({ sector }) => sector === 'alojamientos',
  },
  {
    id: 'rgpd-fichas',
    text: 'Las fichas de clientes con datos de salud están bajo llave o cifradas.',
    why: 'Los datos de salud son categoría especial en el RGPD: exigen más protección que un nombre y un teléfono.',
    coveredBy: 'auditoria',
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

function serviceById(id) {
  return SERVICES.find((s) => s.id === id);
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

/** Un punto lo cubre TOKA cuando el servicio que lo resuelve está contratado. */
function isCoveredByToka(check) {
  return Boolean(check.coveredBy && selected.has(check.coveredBy));
}

function checkState(check) {
  if (isCoveredByToka(check)) return 'toka';
  return securityDone.has(check.id) ? 'done' : 'pending';
}

/* ---------- render: lista de servicios ---------- */

const listEl = document.getElementById('service-list');
const tabs = Array.from(document.querySelectorAll('.tab'));

function serviceMarkup(raw) {
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
}

function renderServices() {
  listEl.innerHTML = Object.entries(SERVICE_GROUPS)
    .map(([key, group]) => {
      const items = SERVICES.filter((s) => s.group === key).map(serviceMarkup).join('');
      return `
        <li class="services__group">
          <p class="services__group-title">${esc(group.label)}</p>
          <p class="services__group-desc">${esc(group.desc)}</p>
          <ul class="services__items">${items}</ul>
        </li>
      `;
    })
    .join('');
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
const checklistCtaEl = document.getElementById('checklist-cta');

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
    .map((check) => {
      const state = checkState(check);
      const covered = state === 'toka';
      const servicio = covered ? resolveService(serviceById(check.coveredBy), currentSector) : null;

      return `
        <li class="check${covered ? ' check--toka' : ''}">
          <label class="check__label" for="chk-${check.id}">
            <input class="check__box" type="checkbox" id="chk-${check.id}" value="${check.id}"
              ${state !== 'pending' ? 'checked' : ''} ${covered ? 'disabled' : ''}>
            <span class="check__text">
              <span class="check__main">${esc(check.text)}</span>
              ${
                covered
                  ? `<span class="check__toka">Lo cubrimos nosotros con «${esc(servicio.name)}»</span>`
                  : `<span class="check__why">${esc(check.why)}</span>`
              }
            </span>
          </label>
        </li>`;
    })
    .join('');

  renderScore();
}

function renderScore() {
  const checks = activeChecks();
  const pendientes = checks.filter((c) => checkState(c) === 'pending');
  const porToka = checks.filter((c) => checkState(c) === 'toka').length;
  const cubiertos = checks.length - pendientes.length;

  const partes = [`${cubiertos} de ${checks.length} cubiertos`];
  if (porToka) partes.push(`${porToka} con TOKA`);
  if (pendientes.length) {
    partes.push(`${pendientes.length} ${pendientes.length === 1 ? 'pendiente' : 'pendientes'}`);
  }

  checklistScoreEl.textContent = partes.join(' · ') + '.';
  checklistScoreEl.classList.toggle('checklist__score--ok', pendientes.length === 0);

  // La llamada a la acción solo tiene sentido si queda algo por resolver
  // y todavía no ha contratado la revisión.
  const mostrarCta = pendientes.length > 0 && !selected.has('auditoria');
  checklistCtaEl.hidden = !mostrarCta;
  if (mostrarCta) {
    checklistCtaEl.querySelector('.checklist__cta-text').textContent =
      pendientes.length === 1
        ? 'Te queda 1 punto por resolver. Podemos ocuparnos nosotros.'
        : `Te quedan ${pendientes.length} puntos por resolver. Podemos ocuparnos nosotros.`;
  }
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

// "Que se ocupe TOKA": marca la revisión y lleva al configurador.
checklistCtaEl.querySelector('button').addEventListener('click', () => {
  selected.add('auditoria');
  update();
  document.getElementById('packs').scrollIntoView({ behavior: 'smooth' });
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
const emailInput = document.getElementById('email');

function buildQuote() {
  const chosen = selectedServices();
  const { once, month } = totals();
  const negocio = businessInput.value.trim();
  const pendientes = activeChecks().filter((c) => checkState(c) === 'pending');

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

  const bloquePendientes = pendientes.length
    ? `
      <section class="quote__pending">
        <h2>Puntos de seguridad pendientes</h2>
        <ul>${pendientes.map((c) => `<li>${esc(c.text)}</li>`).join('')}</ul>
      </section>`
    : '';

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

    ${bloquePendientes}

    <footer class="quote__foot">
      <p>${esc(NOTA_IVA)} Presupuesto válido hasta el ${esc(caduca)}.</p>
      <p>
        Documento orientativo y no vinculante, generado automáticamente a partir de los
        servicios seleccionados. El precio final y el alcance se acuerdan por escrito antes
        de la contratación. Los puntos de seguridad proceden de una autoevaluación y no
        constituyen una auditoría.
      </p>
      <p>¿Lo hablamos? Escríbenos a <strong>${esc(CONTACTO)}</strong> · TOKA, Vitoria-Gasteiz</p>
    </footer>
  `;
}

/* ---------- envío por correo ----------
 * Web estática: no hay servidor que reciba el formulario, así que se
 * compone un mailto con el presupuesto y el diagnóstico ya escritos y
 * se abre el cliente de correo del usuario. Si algún día se despliega
 * en Netlify, aquí es donde entraría Netlify Forms.
 */

const form = document.getElementById('contact-form');
const emailContactoInput = document.getElementById('email-contacto');
const telInput = document.getElementById('telefono');
const mensajeInput = document.getElementById('mensaje');
const formStatus = document.getElementById('form-status');
const summaryStatus = document.getElementById('summary-status');
const descargarEnviarBtn = document.getElementById('descargar-enviar');

/** Los dos campos de email son el mismo dato: se mantienen sincronizados. */
[[emailInput, emailContactoInput], [emailContactoInput, emailInput]].forEach(([origen, destino]) => {
  origen.addEventListener('input', () => {
    if (destino.value !== origen.value) destino.value = origen.value;
  });
});

function abrirCorreo() {
  const negocio = businessInput.value.trim();
  const asunto = negocio ? `Presupuesto TOKA — ${negocio}` : 'Presupuesto TOKA';

  window.location.href =
    `mailto:${CONTACTO}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(buildEmailBody())}`;
}

/*
 * "Descargar y enviar": el cliente se guarda el PDF y a TOKA le llega
 * la misma configuración por correo, para que ninguno de los dos
 * pierda el hilo. El correo se abre con un pequeño retraso porque
 * window.print() bloquea la pestaña hasta que se cierra el diálogo.
 */
descargarEnviarBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();

  if (!email || !emailInput.checkValidity()) {
    summaryStatus.textContent = 'Escribe tu email y así podemos responderte al presupuesto.';
    summaryStatus.classList.add('summary__note--error');
    emailInput.focus();
    return;
  }

  summaryStatus.classList.remove('summary__note--error');

  buildQuote();
  window.print();

  setTimeout(() => {
    abrirCorreo();
    summaryStatus.textContent = 'PDF descargado. Ahora se abre tu correo con la copia para nosotros.';
  }, 600);
});

function buildEmailBody() {
  const { once, month } = totals();
  const negocio = businessInput.value.trim();
  const checks = activeChecks();
  const pendientes = checks.filter((c) => checkState(c) === 'pending');
  const porToka = checks.filter((c) => checkState(c) === 'toka');

  const lineas = [];

  if (mensajeInput.value.trim()) {
    lineas.push(mensajeInput.value.trim(), '');
  }

  lineas.push('--- MI CONFIGURACIÓN ---');
  if (negocio) lineas.push(`Negocio: ${negocio}`);
  lineas.push(`Sector: ${SECTORS[currentSector].label}`);
  if (emailInput.value.trim()) lineas.push(`Email: ${emailInput.value.trim()}`);
  if (telInput.value.trim()) lineas.push(`Teléfono: ${telInput.value.trim()}`);
  lineas.push('');

  selectedServices().forEach((s) => {
    lineas.push(`- ${s.name}: ${s.unit === 'month' ? `${euros(s.price)}/mes` : euros(s.price)}`);
  });
  lineas.push('');
  lineas.push(`Total pago único: ${euros(once)}`);
  if (month > 0) lineas.push(`Cuota mensual: ${euros(month)}/mes`);

  lineas.push('', '--- DIAGNÓSTICO DE SEGURIDAD ---');
  lineas.push(`Cubiertos: ${checks.length - pendientes.length} de ${checks.length}`);

  if (porToka.length) {
    lineas.push('', 'Cubiertos con servicios de TOKA:');
    porToka.forEach((c) => lineas.push(`- ${c.text}`));
  }

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

  const email = emailContactoInput.value.trim();
  if (!email || !emailContactoInput.checkValidity()) {
    formStatus.textContent = 'Necesitamos un email válido para poder responderte.';
    formStatus.classList.add('contact-form__note--error');
    emailContactoInput.focus();
    return;
  }

  const consentimiento = document.getElementById('consentimiento');
  if (!consentimiento.checked) {
    formStatus.textContent = 'Necesitamos que aceptes la política de privacidad para poder tratar tus datos.';
    formStatus.classList.add('contact-form__note--error');
    consentimiento.focus();
    return;
  }

  formStatus.classList.remove('contact-form__note--error');
  abrirCorreo();
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

    // Son 5 segundos: quien no quiera esperarlos puede saltárselos.
    intro.addEventListener('click', cerrar);
    document.addEventListener('keydown', cerrar, { once: true });

    // Red de seguridad por si el animationend no llega.
    setTimeout(cerrar, 6000);
  }
}

/* ---------- arranque ---------- */

update();
