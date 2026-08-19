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
    desc: 'Tu página con enlace directo a tus reseñas y el primer soporte ya programado y puesto. Es la base de todo lo demás.',
    price: 25,
    unit: 'once',
    required: true,
    taggable: true,
    tagHint: 'donde pides la reseña: mostrador, salida, con la cuenta…',
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
 * Soportes físicos.
 *
 * Cada formato tiene su propia escala: no es el mismo producto con un
 * recargo, son cosas distintas. Una peana de mostrador cuesta lo que
 * cuesta y se piden de una en una; las tarjetas que se dan con la
 * cuenta se piden a decenas y ahí sí compensa el volumen.
 *
 * El primer soporte de cada servicio va incluido en su precio: los
 * 25 € del servicio de reseñas son, precisamente, el soporte de
 * mostrador puesto y funcionando. Estas escalas cuentan a partir del
 * segundo.
 *
 * `desde` es la cantidad a partir de la cual se aplica ese precio a
 * TODAS las unidades adicionales, que es como se anuncia de cara al
 * cliente ("a partir de 25, todas a 5,99").
 * ========================================================= */

const TAG_FORMATS = {
  soporte: {
    name: 'Soporte de mostrador',
    desc: 'Peana rígida que se queda de pie en el mostrador o en la mesa. La que ve todo el mundo al entrar.',
    tiers: [{ desde: 1, precio: 15 }],
  },
  tarjeta: {
    name: 'Tarjeta para la cuenta',
    desc: 'Tamaño tarjeta de crédito. Para dar en mano al cobrar o dejar en el portacuentas.',
    tiers: [
      { desde: 1, precio: 7.99 },
      { desde: 10, precio: 6.99 },
      { desde: 25, precio: 5.99 },
    ],
  },
  pegatina: {
    name: 'Pegatina',
    desc: 'Adhesiva y discreta, para la barra, la mesa o el cristal.',
    tiers: [
      { desde: 1, precio: 5.99 },
      { desde: 10, precio: 4.99 },
      { desde: 25, precio: 3.99 },
    ],
  },
};

const MAX_TAGS = 200;

const redondea = (n) => Math.round(n * 100) / 100;

/** Precio por unidad que corresponde a esa cantidad. */
function tierPrice(cantidad, tiers) {
  let precio = tiers[0].precio;
  for (const t of tiers) {
    if (cantidad >= t.desde) precio = t.precio;
  }
  return precio;
}

/*
 * Coste de las unidades adicionales de un formato.
 *
 * El precio del tramo se aplica a todas las unidades, que es como lo
 * entiende el cliente, pero eso crea saltos absurdos: 9 tarjetas a
 * 7,99 son 71,91 € y 10 a 6,99 son 69,90, o sea que pedir menos
 * costaría más. Por eso nunca se cobra más de lo que costaría pedir la
 * cantidad del siguiente tramo: al cliente se le aplica siempre el
 * mejor precio posible.
 */
function formatCost(cantidad, tiers) {
  if (cantidad <= 0) return 0;

  let mejor = cantidad * tierPrice(cantidad, tiers);
  for (const t of tiers) {
    if (t.desde > cantidad) {
      mejor = Math.min(mejor, t.desde * t.precio);
    }
  }
  return redondea(mejor);
}

/** Cuántas unidades más hacen falta para que baje el precio. */
function nextTierInfo(cantidad, tiers) {
  for (const t of tiers) {
    if (t.desde > cantidad) {
      return { faltan: t.desde - cantidad, precio: t.precio };
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

const euros = (n) => {
  const v = redondea(n);
  return `${Number.isInteger(v) ? v : v.toFixed(2).replace('.', ',')} €`;
};
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

/** Para qué se usan los soportes de un servicio, con el nombre del sector. */
function tagPurpose(id) {
  if (id === 'nfc') return 'Reseñas en Google';
  return resolveService(serviceById(id), currentSector).name;
}

/** Unidades adicionales de un servicio: la primera va incluida. */
function extraTagsOf(id) {
  return Math.max(0, tagCounts[id] - 1);
}

/** Unidades adicionales de todos los servicios juntos. */
function extraTags() {
  return taggableServices().reduce((n, s) => n + extraTagsOf(s.id), 0);
}

/** Lo que cuestan las unidades adicionales de un servicio. */
function tagsCostOf(id) {
  return formatCost(extraTagsOf(id), TAG_FORMATS[tagFormats[id]].tiers);
}

/** Lo que suman los soportes adicionales de todo el pedido. */
function tagsCost() {
  return redondea(taggableServices().reduce((sum, s) => sum + tagsCostOf(s.id), 0));
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
            const desde = f.tiers[0].precio;
            const baja = f.tiers.length > 1 ? f.tiers[f.tiers.length - 1].precio : null;
            const extra = baja
              ? `${euros(desde)} / ud. · desde ${euros(baja)} por volumen`
              : `${euros(desde)} / ud.`;
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

      <p class="qty__detail" id="qty-detail-${s.id}" aria-live="polite"></p>
    </div>
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
 * Texto de apoyo de cada selector: lo que suman sus soportes y cuántos
 * faltan para que baje el precio. Se actualiza sin repintar la lista,
 * para no perder el foco mientras se teclea la cantidad.
 */
function renderQtyDetail() {
  taggableServices().forEach((s) => {
    const detalle = document.getElementById(`qty-detail-${s.id}`);
    if (!detalle) return;

    const formato = TAG_FORMATS[tagFormats[s.id]];
    const extras = extraTagsOf(s.id);

    if (extras === 0) {
      detalle.textContent =
        `El primero va incluido en el servicio. ` +
        `Cada uno de más: ${euros(formato.tiers[0].precio)}.`;
      return;
    }

    const coste = tagsCostOf(s.id);
    const medio = euros(coste / extras);
    const siguiente = nextTierInfo(extras, formato.tiers);

    const partes = [
      `${extras} × ${formato.name}: ${euros(coste)} (${medio} cada uno).`,
    ];

    if (siguiente) {
      partes.push(
        `Con ${siguiente.faltan} más, todos bajan a ${euros(siguiente.precio)}.`
      );
    }

    detalle.textContent = partes.join(' ');
  });
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

  const lineaEtiquetas = taggableServices()
    .filter((s) => extraTagsOf(s.id) > 0)
    .map((s) => {
      const n = extraTagsOf(s.id);
      // "29 × Tarjeta para la cuenta" evita tener que pluralizar el nombre.
      return `<li class="summary__item">
         <span>
           ${n} × ${esc(TAG_FORMATS[tagFormats[s.id]].name)}
           <em class="summary__for">para ${esc(tagPurpose(s.id))}</em>
         </span>
         <span class="summary__item-price">${euros(tagsCostOf(s.id))}</span>
       </li>`;
    })
    .join('');

  summaryListEl.innerHTML =
    chosen
      .map((s) => {
        // Si el servicio lleva soporte, se dice cuál va incluido en su precio.
        const incluido = s.taggable
          ? `<em class="summary__for">incluye 1 × ${esc(TAG_FORMATS[tagFormats[s.id]].name)}</em>`
          : '';
        return `
        <li class="summary__item">
          <span>${esc(s.name)}${incluido}</span>
          <span class="summary__item-price">${s.unit === 'month' ? `${euros(s.price)}/mes` : euros(s.price)}</span>
        </li>`;
      })
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

  const filaEtiquetas = taggableServices()
    .filter((s) => extraTagsOf(s.id) > 0)
    .map((s) => {
      const n = extraTagsOf(s.id);
      const f = TAG_FORMATS[tagFormats[s.id]];
      return `<tr>
         <td>
           <strong>${n} × ${esc(f.name)} — ${esc(tagPurpose(s.id))}</strong>
           <span>Además del que ya incluye el servicio. Todos llevan el mismo contenido,
             así que se configura una vez y se replica.
             ${euros(tagsCostOf(s.id) / n)} por unidad.</span>
         </td>
         <td class="quote__cell-price">${euros(tagsCostOf(s.id))}</td>
       </tr>`;
    })
    .join('');

  const filas =
    chosen
      .map(
        (s) => `
        <tr>
          <td>
            <strong>${esc(s.name)}</strong>
            <span>${esc(s.desc)}${
              s.taggable
                ? ` Incluye 1 × ${esc(TAG_FORMATS[tagFormats[s.id]].name)}.`
                : ''
            }</span>
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

  taggableServices().forEach((s) => {
    const n = extraTagsOf(s.id);
    if (n) {
      lineas.push(`- ${n} × ${TAG_FORMATS[tagFormats[s.id]].name} — ${tagPurpose(s.id)}: ${euros(tagsCostOf(s.id))}`);
    }
  });
  lineas.push('');
  lineas.push(`Soportes en total: ${totalTags()}`);
  taggableServices().forEach((s) => {
    lineas.push(
      `  · ${tagPurpose(s.id)}: ${tagCounts[s.id]} ` +
      `en ${TAG_FORMATS[tagFormats[s.id]].name.toLowerCase()}`
    );
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
