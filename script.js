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
    desc: 'Tu página con enlace directo a tus reseñas y la primera tarjeta ya programada. Es la base de todo lo demás.',
    price: 25,
    unit: 'once',
    required: true,
    taggable: true,
    tagHint: 'donde pides la reseña: barra, salida, junto al datáfono…',
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
    taggable: true,
    tagHint: 'una por mesa',
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

  /* ---- ciberseguridad ----
   * Dos pasos: un informe a precio cerrado y, a partir de lo que
   * aparezca en él, la implantación. Esta última no lleva precio en la
   * web a propósito: hasta ver el local no se sabe el alcance, y poner
   * una cifra antes de mirar es comprometerse a ciegas.
   */
  {
    id: 'informe',
    group: 'seguridad',
    name: 'Informe de seguridad',
    desc: 'Vamos a tu negocio y revisamos router, redes, TPV, dispositivos y cuentas. Te entregamos un informe escrito con todo lo que hay que arreglar, ordenado por urgencia y explicado sin tecnicismos.',
    price: 200,
    unit: 'once',
  },
  {
    id: 'implantacion',
    group: 'seguridad',
    name: 'Implantación de las medidas',
    desc: 'Dejamos resuelto lo que salga en el informe: separar la red de clientes del TPV, contraseñas, copias de seguridad y formación de tu equipo. El precio depende de lo que haya que hacer, así que se presupuesta al entregar el informe.',
    unit: 'quote',
  },
];

/* =========================================================
 * Etiquetas adicionales.
 *
 * El contenido (la carta, el wifi, las reseñas) es el mismo para
 * todas las etiquetas de un negocio: se configura una vez y se
 * replica. Lo único que cuesta por unidad es la tarjeta física, así
 * que a más cantidad, menos precio por etiqueta.
 *
 * Los tramos son ACUMULATIVOS: cada uno se aplica solo a las unidades
 * que caen dentro de él, como en un IRPF. Si se aplicara el precio del
 * último tramo a todas las unidades, pedir 16 etiquetas saldría más
 * barato que pedir 15, y ese salto absurdo obligaría al cliente a
 * pedir de más para pagar menos.
 *
 * La primera etiqueta va incluida en el servicio base, así que estos
 * tramos cuentan a partir de la segunda.
 * ========================================================= */

/*
 * Formatos físicos. El chip NFC es el mismo en todos; lo que cambia es
 * el soporte, y por eso el suplemento es fijo por unidad y NO baja con
 * el volumen: imprimir muchas tarjetas abarata la tarjeta, pero una
 * peana sigue costando lo que cuesta.
 */
const TAG_FORMATS = {
  pegatina: {
    name: 'Pegatina',
    desc: 'Adhesiva y discreta. Para el portacuentas, la barra o el cristal.',
    delta: -2,
  },
  tarjeta: {
    name: 'Tarjeta',
    desc: 'Tamaño tarjeta de crédito, rígida. La que se da en mano con la cuenta.',
    delta: 0,
  },
  soporte: {
    name: 'Soporte de mesa',
    desc: 'Peana rígida que se queda de pie en la mesa o el mostrador.',
    delta: 7,
  },
};

const TAG_TIERS = [
  { hasta: 4, precio: 6 },      // etiquetas 2 a 5
  { hasta: 14, precio: 5 },     // etiquetas 6 a 15
  { hasta: 29, precio: 4 },     // etiquetas 16 a 30
  { hasta: Infinity, precio: 3 }, // a partir de la 31
];

const MAX_TAGS = 200;

/** Coste de las etiquetas adicionales, aplicando los tramos por partes. */
function extraTagsCost(extras) {
  let restantes = Math.max(0, extras);
  let acumuladas = 0;
  let total = 0;

  for (const tramo of TAG_TIERS) {
    if (restantes <= 0) break;
    const cabenEnTramo = tramo.hasta - acumuladas;
    const enEsteTramo = Math.min(restantes, cabenEnTramo);
    total += enEsteTramo * tramo.precio;
    acumuladas += enEsteTramo;
    restantes -= enEsteTramo;
  }

  return total;
}

/** Precio por unidad de la siguiente etiqueta que se añada. */
function nextTagPrice(extras) {
  let acumuladas = 0;
  for (const tramo of TAG_TIERS) {
    if (extras < tramo.hasta) return tramo.precio;
    acumuladas = tramo.hasta;
  }
  return TAG_TIERS[TAG_TIERS.length - 1].precio;
}

/** Cuántas etiquetas más hacen falta para entrar en el siguiente tramo. */
function nextTierInfo(extras) {
  let acumuladas = 0;
  for (let i = 0; i < TAG_TIERS.length - 1; i++) {
    acumuladas = TAG_TIERS[i].hasta;
    if (extras < acumuladas) {
      return { faltan: acumuladas - extras, precio: TAG_TIERS[i + 1].precio };
    }
  }
  return null;
}

/*
 * Ajustes de texto por sector. Solo cambian el nombre y la descripción
 * de algunos servicios — los precios son los mismos para todos.
 */
const SECTORS = {
  gastronomia: {
    label: 'Gastronomía',
    cartaUnit: 'una por mesa',
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
    cartaUnit: 'recepción, sala de espera, cabinas…',
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
    cartaUnit: 'una por habitación',
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
    cartaUnit: 'mostrador, escaparate, probadores…',
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
 * `coveredBy` → servicio de Gertu que resuelve ese punto. Si está
 *               contratado, el punto cuenta como cubierto y deja de
 *               ser tarea del cliente.
 * ========================================================= */

const SECURITY_CHECKS = [
  {
    id: 'router',
    text: 'La contraseña de administración del router no es la que venía de fábrica.',
    why: 'Las claves por defecto de cada modelo están publicadas en internet.',
    coveredBy: 'implantacion',
    when: () => true,
  },
  {
    id: 'google-2fa',
    text: 'Tu ficha de Google Business tiene verificación en dos pasos activada.',
    why: 'Si te roban esa cuenta pierdes el control de tus reseñas y de tus datos en Google Maps.',
    coveredBy: 'implantacion',
    when: () => true,
  },
  {
    id: 'actualizaciones',
    text: 'Los dispositivos del local (TPV, tablet, ordenador) reciben actualizaciones.',
    why: 'La mayoría de ataques a comercios aprovechan fallos ya corregidos por el fabricante.',
    coveredBy: 'implantacion',
    when: () => true,
  },
  {
    id: 'personal',
    text: 'Tu equipo sabe reconocer un correo falso o una llamada de un falso proveedor.',
    why: 'El fraude al comercio pequeño casi siempre entra por una persona, no por un servidor.',
    coveredBy: 'implantacion',
    when: () => true,
  },
  {
    id: 'wifi-cifrado',
    text: 'El wifi usa cifrado WPA2 o WPA3, nunca WEP ni red abierta.',
    why: 'Vas a dar acceso a clientes: sin cifrado, cualquiera puede leer el tráfico de la red.',
    coveredBy: 'implantacion',
    when: ({ has }) => has('wifi'),
  },
  {
    id: 'wifi-invitados',
    text: 'La red de clientes está separada de la red del TPV y de la caja.',
    why: 'Es la medida más importante al abrir el wifi al público: aísla tus cobros del tráfico de invitados.',
    coveredBy: 'implantacion',
    when: ({ has }) => has('wifi'),
  },
  {
    id: 'tpv-aislado',
    text: 'El datáfono o TPV no comparte red con dispositivos personales del equipo.',
    why: 'En hostelería y tienda es donde pasan los cobros: cuanto más aislado, mejor.',
    coveredBy: 'implantacion',
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
    coveredBy: 'implantacion',
    when: ({ has }) => has('web') || has('catalogo'),
  },
  {
    id: 'panel-clave',
    text: 'El acceso al panel donde editas tu carta o catálogo tiene contraseña propia y fuerte.',
    why: 'Es lo que ven tus clientes: si alguien entra, puede cambiar precios o publicar lo que quiera.',
    coveredBy: 'implantacion',
    when: ({ has }) => has('catalogo') || has('web'),
  },
  {
    id: 'rgpd-huespedes',
    text: 'Los datos de registro de viajeros se guardan cifrados y se borran cuando toca.',
    why: 'El registro de huéspedes son datos personales con obligaciones legales concretas.',
    coveredBy: 'implantacion',
    when: ({ sector }) => sector === 'alojamientos',
  },
  {
    id: 'rgpd-fichas',
    text: 'Las fichas de clientes con datos de salud están bajo llave o cifradas.',
    why: 'Los datos de salud son categoría especial en el RGPD: exigen más protección que un nombre y un teléfono.',
    coveredBy: 'implantacion',
    when: ({ sector }) => sector === 'estetica',
  },
  {
    id: 'fotos-derechos',
    text: 'Las fotos que publicas son tuyas o tienes permiso para usarlas.',
    why: 'Usar fotos de bancos de imágenes sin licencia es la reclamación más habitual que recibe un comercio.',
    when: ({ has }) => has('fotos') || has('web') || has('catalogo'),
  },
];

const CONTACTO = 'hola@gertu.es';
const NOTA_IVA = 'Precios sin IVA.';
const VALIDEZ_DIAS = 30;

/* ---------- estado ---------- */

const selected = new Set(SERVICES.filter((s) => s.required).map((s) => s.id));
const securityDone = new Set();
let currentSector = 'gastronomia';
/*
 * Una cantidad por cada servicio que lleva etiqueta física: las de
 * reseñas y las de la carta son usos distintos y se piden en números
 * distintos (en un bar, dos de reseñas en la barra y una por mesa para
 * la carta). Cada servicio incluye ya su primera etiqueta.
 */
const tagCounts = { nfc: 1, catalogo: 1 };
const tagFormats = { nfc: 'tarjeta', catalogo: 'soporte' };

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

/** Servicios con etiqueta física que están seleccionados ahora mismo. */
function taggableServices() {
  return SERVICES.filter((s) => s.taggable && selected.has(s.id));
}

/** Etiquetas totales pedidas, sumando todos los usos. */
function totalTags() {
  return taggableServices().reduce((n, s) => n + tagCounts[s.id], 0);
}

/*
 * Etiquetas que se cobran aparte. Cada servicio incluye la primera, y
 * el descuento por volumen se calcula sobre el total del pedido: lo
 * que abarata la unidad es imprimir muchas, no en qué se usen.
 */
function extraTags() {
  return taggableServices().reduce((n, s) => n + Math.max(0, tagCounts[s.id] - 1), 0);
}

/** Suplementos de formato, que se cobran por unidad adicional. */
function formatSupplements() {
  return taggableServices().reduce(
    (sum, s) => sum + Math.max(0, tagCounts[s.id] - 1) * TAG_FORMATS[tagFormats[s.id]].delta,
    0
  );
}

/** Lo que suman las etiquetas adicionales: volumen más formato. */
function tagsCost() {
  return extraTagsCost(extraTags()) + formatSupplements();
}

function totals() {
  const chosen = selectedServices();
  return {
    once:
      chosen.filter((s) => s.unit === 'once').reduce((sum, s) => sum + s.price, 0) +
      tagsCost(),
    // Los servicios 'quote' se listan pero no suman: su importe aún no existe.
    month: chosen.filter((s) => s.unit === 'month').reduce((sum, s) => sum + s.price, 0),
  };
}

/** Puntos de seguridad que aplican a la configuración actual. */
function activeChecks() {
  return SECURITY_CHECKS.filter((check) => check.when({ has, sector: currentSector }));
}

/** Un punto lo cubre Gertu cuando el servicio que lo resuelve está contratado. */
function isCoveredByGertu(check) {
  return Boolean(check.coveredBy && selected.has(check.coveredBy));
}

function checkState(check) {
  if (isCoveredByGertu(check)) return 'gertu';
  return securityDone.has(check.id) ? 'done' : 'pending';
}

/* ---------- render: lista de servicios ---------- */

const listEl = document.getElementById('service-list');
const tabs = Array.from(document.querySelectorAll('.tab'));

/*
 * Selector de cantidad, uno por cada servicio con etiqueta física.
 * Va fuera del <label> a propósito: unos botones dentro de una
 * etiqueta asociada a la casilla harían que pulsarlos marcasen
 * también la casilla.
 */
function qtyMarkup(s) {
  const hint = s.id === 'catalogo' ? SECTORS[currentSector].cartaUnit : s.tagHint;

  return `
    <div class="qty">
      <div class="qty__row">
        <span class="qty__label">
          ¿Cuántas etiquetas?
          <em>${esc(hint)}</em>
        </span>
        <div class="qty__control">
          <button type="button" class="qty__btn" data-qty="${s.id}" data-step="-1"
            aria-label="Quitar una etiqueta">−</button>
          <input class="qty__input" type="number" id="qty-${s.id}" data-qty="${s.id}"
            inputmode="numeric" min="1" max="${MAX_TAGS}" value="${tagCounts[s.id]}"
            aria-label="Número de etiquetas de ${esc(s.name)}">
          <button type="button" class="qty__btn" data-qty="${s.id}" data-step="1"
            aria-label="Añadir una etiqueta">+</button>
        </div>
      </div>

      <fieldset class="formats">
        <legend class="formats__legend">¿En qué formato?</legend>
        ${Object.entries(TAG_FORMATS)
          .map(([key, f]) => {
            const activo = tagFormats[s.id] === key;
            const extra =
              f.delta === 0
                ? 'sin recargo'
                : `${f.delta > 0 ? '+' : '−'}${Math.abs(f.delta)} € / ud.`;
            return `
              <label class="format${activo ? ' format--on' : ''}" for="fmt-${s.id}-${key}">
                <input type="radio" id="fmt-${s.id}-${key}" name="fmt-${s.id}"
                  data-fmt="${s.id}" value="${key}" ${activo ? 'checked' : ''}>
                <span class="format__text">
                  <span class="format__name">${esc(f.name)} <em>${extra}</em></span>
                  <span class="format__desc">${esc(f.desc)}</span>
                </span>
              </label>`;
          })
          .join('')}
      </fieldset>
    </div>
  `;
}

/* Resumen del pedido de etiquetas: va una sola vez, porque el
   descuento se calcula sobre el total de todas juntas. */
function tagsSummaryMarkup() {
  return `
    <li class="tags-summary" id="tags-summary">
      <p class="tags-summary__detail" id="qty-detail" aria-live="polite"></p>
      <ul class="qty__tiers">
        <li><span>2 – 5</span> 6 € / ud.</li>
        <li><span>6 – 15</span> 5 € / ud.</li>
        <li><span>16 – 30</span> 4 € / ud.</li>
        <li><span>31 o más</span> 3 € / ud.</li>
      </ul>
    </li>
  `;
}

function serviceMarkup(raw) {
  const s = resolveService(raw, currentSector);
  const isOn = selected.has(s.id);

  let priceLabel;
  if (s.unit === 'month') priceLabel = `${euros(s.price)}<span>/mes</span>`;
  else if (s.unit === 'quote') priceLabel = '<span class="service__quote">A presupuestar</span>';
  else priceLabel = euros(s.price);

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
      ${s.taggable && isOn ? qtyMarkup(s) : ''}
    </li>
  `;
}

/**
 * Texto de apoyo: qué se lleva en etiquetas y cuántas faltan para el
 * siguiente tramo. Se actualiza solo, sin repintar la lista, para no
 * perder el foco mientras se teclea la cantidad.
 */
function renderQtyDetail() {
  const detalle = document.getElementById('qty-detail');
  if (!detalle) return;

  const extras = extraTags();
  const desglose = taggableServices()
    .map(
      (s) =>
        `${tagCounts[s.id]} de ${s.id === 'catalogo' ? 'la carta' : 'reseñas'} ` +
        `en ${TAG_FORMATS[tagFormats[s.id]].name.toLowerCase()}`
    )
    .join(' + ');

  if (extras === 0) {
    detalle.textContent =
      `${totalTags()} ${totalTags() === 1 ? 'etiqueta' : 'etiquetas'} (${desglose}). ` +
      'La primera de cada servicio va incluida; a partir de ahí, 6 € cada una.';
    return;
  }

  const coste = tagsCost();
  const medio = (coste / extras).toFixed(2).replace('.', ',');
  const siguiente = nextTierInfo(extras);
  const suplemento = formatSupplements();

  const partes = [
    `${totalTags()} etiquetas en total (${desglose}).`,
    `${extras} ${extras === 1 ? 'se cobra aparte' : 'se cobran aparte'}: ` +
      `${euros(coste)} (${medio} € por etiqueta).`,
  ];

  if (suplemento !== 0) {
    partes.push(
      `Incluye ${suplemento > 0 ? '' : 'un ahorro de '}${euros(Math.abs(suplemento))} por el formato.`
    );
  }

  if (siguiente) {
    partes.push(`Con ${siguiente.faltan} más, las siguientes bajan a ${euros(siguiente.precio)}.`);
  }

  detalle.textContent = partes.join(' ');
}

function renderServices() {
  listEl.innerHTML = Object.entries(SERVICE_GROUPS)
    .map(([key, group]) => {
      const items = SERVICES.filter((s) => s.group === key).map(serviceMarkup).join('');
      // El resumen de etiquetas cierra el grupo NFC, que es donde están.
      const resumen = key === 'nfc' ? tagsSummaryMarkup() : '';
      return `
        <li class="services__group">
          <p class="services__group-title">${esc(group.label)}</p>
          <p class="services__group-desc">${esc(group.desc)}</p>
          <ul class="services__items">${items}${resumen}</ul>
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

  const extras = extraTags();
  const lineaEtiquetas = extras
    ? `<li class="summary__item">
         <span>${extras} ${extras === 1 ? 'etiqueta adicional' : 'etiquetas adicionales'}</span>
         <span class="summary__item-price">${euros(tagsCost())}</span>
       </li>`
    : '';

  summaryListEl.innerHTML =
    chosen
      .map(
        (s) => `
        <li class="summary__item">
          <span>${esc(s.name)}</span>
          <span class="summary__item-price">${s.unit === 'month' ? `${euros(s.price)}/mes` : euros(s.price)}</span>
        </li>`
      )
      .join('') + lineaEtiquetas;

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
      const covered = state === 'gertu';
      const servicio = covered ? resolveService(serviceById(check.coveredBy), currentSector) : null;

      return `
        <li class="check${covered ? ' check--gertu' : ''}">
          <label class="check__label" for="chk-${check.id}">
            <input class="check__box" type="checkbox" id="chk-${check.id}" value="${check.id}"
              ${state !== 'pending' ? 'checked' : ''} ${covered ? 'disabled' : ''}>
            <span class="check__text">
              <span class="check__main">${esc(check.text)}</span>
              ${
                covered
                  ? `<span class="check__gertu">Lo cubrimos nosotros con «${esc(servicio.name)}»</span>`
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
  const porGertu = checks.filter((c) => checkState(c) === 'gertu').length;
  const cubiertos = checks.length - pendientes.length;

  const partes = [`${cubiertos} de ${checks.length} cubiertos`];
  if (porGertu) partes.push(`${porGertu} con Gertu`);
  if (pendientes.length) {
    partes.push(`${pendientes.length} ${pendientes.length === 1 ? 'pendiente' : 'pendientes'}`);
  }

  checklistScoreEl.textContent = partes.join(' · ') + '.';
  checklistScoreEl.classList.toggle('checklist__score--ok', pendientes.length === 0);

  // La llamada a la acción solo tiene sentido si queda algo por resolver
  // y todavía no ha contratado la revisión.
  const mostrarCta = pendientes.length > 0 && !selected.has('informe');
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
  renderQtyDetail();
  renderSummary();
  renderChecklist();
}

/** Cambia la cantidad de un servicio sin repintar la lista entera. */
function setTagCount(id, valor) {
  if (!(id in tagCounts)) return;

  const n = Math.min(MAX_TAGS, Math.max(1, Math.round(Number(valor) || 1)));
  tagCounts[id] = n;

  const input = document.getElementById(`qty-${id}`);
  if (input && Number(input.value) !== n) input.value = n;

  renderQtyDetail();
  renderSummary();
}

/* ---------- interacción ---------- */

listEl.addEventListener('change', (event) => {
  const formato = event.target.closest('input[data-fmt]');
  if (formato) {
    tagFormats[formato.dataset.fmt] = formato.value;
    renderServices();
    renderQtyDetail();
    renderSummary();
    return;
  }

  const cantidad = event.target.closest('.qty__input');
  if (cantidad) {
    setTagCount(cantidad.dataset.qty, cantidad.value);
    return;
  }

  const input = event.target.closest('.service__check');
  if (!input) return;

  if (input.checked) selected.add(input.value);
  else selected.delete(input.value);

  // Si el servicio lleva etiquetas, aparece o desaparece su selector.
  if (serviceById(input.value)?.taggable) renderServices();

  renderQtyDetail();
  renderSummary();
  renderChecklist();
});

// Mientras se teclea, para que el precio acompañe sin esperar al blur.
listEl.addEventListener('input', (event) => {
  const campo = event.target.closest('.qty__input');
  if (campo) setTagCount(campo.dataset.qty, campo.value);
});

listEl.addEventListener('click', (event) => {
  const boton = event.target.closest('.qty__btn');
  if (!boton) return;
  const id = boton.dataset.qty;
  setTagCount(id, tagCounts[id] + Number(boton.dataset.step));
});

checklistEl.addEventListener('change', (event) => {
  const input = event.target.closest('.check__box');
  if (!input) return;

  if (input.checked) securityDone.add(input.value);
  else securityDone.delete(input.value);

  renderScore();
});

// "Que se ocupe Gertu": marca la revisión y lleva al configurador.
checklistCtaEl.querySelector('button').addEventListener('click', () => {
  selected.add('informe');
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

  const extras = extraTags();
  const filaEtiquetas = extras
    ? `<tr>
         <td>
           <strong>${extras} ${extras === 1 ? 'etiqueta NFC adicional' : 'etiquetas NFC adicionales'}</strong>
           <span>Mismo contenido en todas (${esc(SECTORS[currentSector].tagUnit)}).
             Precio por unidad según tramos de cantidad:
             ${(tagsCost() / extras).toFixed(2).replace('.', ',')} € de media.</span>
         </td>
         <td class="quote__cell-price">${euros(tagsCost())}</td>
       </tr>`
    : '';

  const filas =
    chosen
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
      .join('') + filaEtiquetas;

  const bloquePendientes = pendientes.length
    ? `
      <section class="quote__pending">
        <h2>Puntos de seguridad pendientes</h2>
        <ul>${pendientes.map((c) => `<li>${esc(c.text)}</li>`).join('')}</ul>
      </section>`
    : '';

  quoteEl.innerHTML = `
    <header class="quote__head">
      <p class="quote__brand">Gertu</p>
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
      <p>¿Lo hablamos? Escríbenos a <strong>${esc(CONTACTO)}</strong> · Gertu, Vitoria-Gasteiz</p>
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
  const asunto = negocio ? `Presupuesto Gertu — ${negocio}` : 'Presupuesto Gertu';

  window.location.href =
    `mailto:${CONTACTO}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(buildEmailBody())}`;
}

/*
 * "Descargar y enviar": el cliente se guarda el PDF y a Gertu le llega
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
  const porGertu = checks.filter((c) => checkState(c) === 'gertu');

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

  const extras = extraTags();
  if (extras) {
    lineas.push(`- ${extras} etiquetas adicionales: ${euros(tagsCost())}`);
  }
  lineas.push('');
  lineas.push(`Etiquetas en total: ${totalTags()}`);
  taggableServices().forEach((s) => {
    lineas.push(`  · ${s.id === 'catalogo' ? 'Carta' : 'Reseñas'}: ${tagCounts[s.id]} en ${TAG_FORMATS[tagFormats[s.id]].name.toLowerCase()}`);
  });
  lineas.push(`Total pago único: ${euros(once)}`);
  if (month > 0) lineas.push(`Cuota mensual: ${euros(month)}/mes`);

  lineas.push('', '--- DIAGNÓSTICO DE SEGURIDAD ---');
  lineas.push(`Cubiertos: ${checks.length - pendientes.length} de ${checks.length}`);

  if (porGertu.length) {
    lineas.push('', 'Cubiertos con servicios de Gertu:');
    porGertu.forEach((c) => lineas.push(`- ${c.text}`));
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
  const yaVista = sessionStorage.getItem('gertu-intro') === 'visto';
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yaVista || sinMovimiento) {
    intro.remove();
  } else {
    document.body.classList.add('is-intro');
    sessionStorage.setItem('gertu-intro', 'visto');

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
