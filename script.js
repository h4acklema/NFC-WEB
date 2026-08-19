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
    price: 24.99,
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
    price: 19.99,
    unit: 'once',
  },
  {
    id: 'catalogo',
    group: 'nfc',
    name: 'Carta digital',
    desc: 'Tu carta con precios, editable siempre que quieras sin volver a imprimir nada.',
    price: 29.99,
    unit: 'once',
    taggable: true,
    tagHint: 'una por mesa',
  },
  {
    id: 'web',
    group: 'nfc',
    name: 'Web completa para tu negocio',
    desc: '¿Todavía no tienes web? Te montamos una, con tus servicios, horario, ubicación y contacto. Tuya, sin plantillas de terceros.',
    price: 179.99,
    unit: 'once',
  },
  {
    id: 'diseno',
    group: 'nfc',
    name: 'Diseño exclusivo de la tarjeta',
    desc: 'Tarjeta NFC con tu logo, tus colores y tu marca, en lugar del modelo estándar.',
    price: 44.99,
    unit: 'once',
  },
  {
    id: 'fotos',
    group: 'nfc',
    name: 'Sesión de fotos',
    desc: 'Vamos a tu local y hacemos las fotos para tu carta o tu web. Si ya tienes fotos propias, no lo necesitas.',
    price: 39.99,
    unit: 'hour',
    hourly: true,
  },
  {
    id: 'mantenimiento',
    group: 'nfc',
    name: 'Mantenimiento y cambios ilimitados',
    desc: 'Nos ocupamos nosotros de tus actualizaciones siempre que las necesites. Sin permanencia, te das de baja cuando quieras.',
    price: 11.99,
    unit: 'month',
  },
  {
    id: 'resenas',
    group: 'nfc',
    name: 'Plan de reseñas',
    desc: 'La etiqueta trae reseñas; este plan hace que suban. Vigilamos las nuevas, te avisamos el mismo día si entra una negativa, te preparamos la respuesta (Google puntúa que respondas) y cada mes te pasamos un informe con cuántas llevas y cómo va tu nota.',
    price: 29.99,
    unit: 'month',
    featured: 'Lo que más mueve la aguja',
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
    price: 199.99,
    unit: 'once',
  },
  {
    id: 'implantacion',
    group: 'seguridad',
    name: 'Implantación de las medidas',
    desc: 'Dejamos resuelto lo que salga en el informe: separar la red de clientes del TPV, contraseñas, copias de seguridad y formación de tu equipo. Este es el punto de partida para un local normal; el importe final se ajusta al entregarte el informe, cuando ya sabemos qué hay.',
    price: 149.99,
    unit: 'from',
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
    tiers: [{ desde: 1, precio: 14.99 }],
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
const MAX_HOURS = 12;

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

const CONTACTO = 'gertuautomations@gmail.com';
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
/*
 * Cantidades por servicio Y por formato: un bar quiere el soporte en la
 * barra y además tarjetas para dar con la cuenta, así que no vale
 * obligar a elegir un solo formato por servicio.
 *
 * El primer soporte de cada servicio va incluido en su precio (los
 * 24,99 € del servicio de reseñas son ese soporte puesto), por eso
 * arranca en 1 y no se cobra.
 */
const FORMATO_INCLUIDO = 'soporte';

const tagCounts = {
  nfc: { soporte: 1, tarjeta: 0, pegatina: 0 },
  catalogo: { soporte: 1, tarjeta: 0, pegatina: 0 },
};

/* Servicios que se cobran por hora, con las horas estimadas de partida. */
const hourCounts = { fotos: 2 };

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

/** Soportes totales pedidos, sumando usos y formatos. */
function totalTags() {
  return taggableServices().reduce(
    (n, s) => n + Object.keys(TAG_FORMATS).reduce((m, fid) => m + tagCounts[s.id][fid], 0),
    0
  );
}

/** Importe de un servicio: por hora se multiplica por las horas estimadas. */
function lineTotal(s) {
  if (s.unit === 'hour') return redondea(s.price * hourCounts[s.id]);
  if (s.unit === 'quote') return 0;
  return s.price;
}

/** Si algún servicio es una estimación mínima, el total también lo es. */
function totalEsEstimado() {
  return selectedServices().some((s) => s.unit === 'from');
}

/** Para qué se usan los soportes de un servicio, con el nombre del sector. */
function tagPurpose(id) {
  if (id === 'nfc') return 'Reseñas en Google';
  return resolveService(serviceById(id), currentSector).name;
}

/** Unidades de un formato que se cobran: del incluido, la primera es gratis. */
function chargeableOf(sid, fid) {
  const n = tagCounts[sid][fid];
  return fid === FORMATO_INCLUIDO ? Math.max(0, n - 1) : n;
}

/** Lo que cuesta un formato dentro de un servicio. */
function costOf(sid, fid) {
  return formatCost(chargeableOf(sid, fid), TAG_FORMATS[fid].tiers);
}

/** Formatos de un servicio con alguna unidad pedida. */
function formatsWithUnits(sid) {
  return Object.keys(TAG_FORMATS).filter((fid) => tagCounts[sid][fid] > 0);
}

/** Unidades adicionales de un servicio, sumando formatos. */
function extraTagsOf(sid) {
  return Object.keys(TAG_FORMATS).reduce((n, fid) => n + chargeableOf(sid, fid), 0);
}

/** Unidades adicionales de todos los servicios juntos. */
function extraTags() {
  return taggableServices().reduce((n, s) => n + extraTagsOf(s.id), 0);
}

/** Lo que cuestan los soportes adicionales de un servicio. */
function tagsCostOf(sid) {
  return redondea(
    Object.keys(TAG_FORMATS).reduce((sum, fid) => sum + costOf(sid, fid), 0)
  );
}

/** Lo que suman los soportes adicionales de todo el pedido. */
function tagsCost() {
  return redondea(taggableServices().reduce((sum, s) => sum + tagsCostOf(s.id), 0));
}

function totals() {
  const chosen = selectedServices();
  return {
    // Los servicios 'quote' se listan pero no suman: su importe aún no existe.
    once: redondea(
      chosen
        .filter((s) => s.unit === 'once' || s.unit === 'from')
        .reduce((sum, s) => sum + s.price, 0) +
        chosen.filter((s) => s.unit === 'hour').reduce((sum, s) => sum + lineTotal(s), 0) +
        tagsCost()
    ),
    month: redondea(chosen.filter((s) => s.unit === 'month').reduce((sum, s) => sum + s.price, 0)),
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
 * Selector de soportes: una fila por formato con su propia cantidad,
 * porque un mismo servicio suele necesitar varios a la vez (el soporte
 * de la barra y las tarjetas que se dan con la cuenta).
 *
 * Va fuera del <label> a propósito: unos botones dentro de una etiqueta
 * asociada a la casilla harían que pulsarlos marcasen también la casilla.
 */
function qtyMarkup(s) {
  const hint = s.id === 'catalogo' ? SECTORS[currentSector].cartaUnit : s.tagHint;

  const filas = Object.entries(TAG_FORMATS)
    .map(([fid, f]) => {
      const n = tagCounts[s.id][fid];
      const incluido = fid === FORMATO_INCLUIDO;
      const desde = f.tiers[0].precio;
      const baja = f.tiers.length > 1 ? f.tiers[f.tiers.length - 1].precio : null;

      const precio = baja
        ? `${euros(desde)} / ud. · hasta ${euros(baja)} por volumen`
        : `${euros(desde)} / ud.`;

      const cobrado = chargeableOf(s.id, fid);

      return `
        <li class="fmt${n > 0 ? ' fmt--on' : ''}">
          <div class="fmt__info">
            <span class="fmt__name">${esc(f.name)}</span>
            <span class="fmt__price">${precio}${incluido ? ' · el primero incluido' : ''}</span>
            <span class="fmt__desc">${esc(f.desc)}</span>
          </div>
          <div class="fmt__side">
            <div class="qty__control">
              <button type="button" class="qty__btn" data-qty="${s.id}" data-fmt="${fid}"
                data-step="-1" aria-label="Quitar un ${esc(f.name)}">−</button>
              <input class="qty__input" type="number" id="qty-${s.id}-${fid}"
                data-qty="${s.id}" data-fmt="${fid}" inputmode="numeric"
                min="0" max="${MAX_TAGS}" value="${n}"
                aria-label="${esc(f.name)} para ${esc(tagPurpose(s.id))}">
              <button type="button" class="qty__btn" data-qty="${s.id}" data-fmt="${fid}"
                data-step="1" aria-label="Añadir un ${esc(f.name)}">+</button>
            </div>
            <span class="fmt__total">${cobrado > 0 ? euros(costOf(s.id, fid)) : '—'}</span>
          </div>
        </li>`;
    })
    .join('');

  return `
    <div class="qty">
      <p class="qty__label">
        ¿Qué soportes quieres?
        <em>${esc(hint)}</em>
      </p>
      <ul class="fmts">${filas}</ul>
      <p class="qty__detail" id="qty-detail-${s.id}" aria-live="polite"></p>
    </div>
  `;
}

/* Selector de horas para los servicios que se cobran por tiempo. */
function hoursMarkup(s) {
  return `
    <div class="qty">
      <div class="qty__row">
        <span class="qty__label">
          ¿Cuántas horas calculas?
          <em>es una estimación, se ajusta al reservar</em>
        </span>
        <div class="qty__control">
          <button type="button" class="qty__btn" data-hours="${s.id}" data-step="-1"
            aria-label="Quitar una hora">−</button>
          <input class="qty__input" type="number" id="hours-${s.id}" data-hours="${s.id}"
            inputmode="numeric" min="1" max="${MAX_HOURS}" value="${hourCounts[s.id]}"
            aria-label="Horas de ${esc(s.name)}">
          <button type="button" class="qty__btn" data-hours="${s.id}" data-step="1"
            aria-label="Añadir una hora">+</button>
        </div>
      </div>
      <p class="qty__detail" id="hours-detail-${s.id}" aria-live="polite"></p>
    </div>
  `;
}

function serviceMarkup(raw) {
  const s = resolveService(raw, currentSector);
  const isOn = selected.has(s.id);

  let priceLabel;
  if (s.unit === 'month') priceLabel = `${euros(s.price)}<span>/mes</span>`;
  else if (s.unit === 'hour') priceLabel = `${euros(s.price)}<span>/hora</span>`;
  else if (s.unit === 'from') priceLabel = `<span class="service__from">desde</span>${euros(s.price)}`;
  else if (s.unit === 'quote') priceLabel = '<span class="service__quote">A presupuestar</span>';
  else priceLabel = euros(s.price);

  return `
    <li class="service${s.required ? ' service--required' : ''}${s.featured ? ' service--featured' : ''}">
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
            ${s.featured ? `<span class="service__tag service__tag--star">${esc(s.featured)}</span>` : ''}
          </span>
          <span class="service__desc">${esc(s.desc)}</span>
        </span>
        <span class="service__price">${priceLabel}</span>
      </label>
      ${s.taggable && isOn ? qtyMarkup(s) : ''}
      ${s.hourly && isOn ? hoursMarkup(s) : ''}
    </li>
  `;
}

/**
 * Texto de apoyo de cada servicio: qué se lleva y cuántas unidades
 * faltan para que baje algún formato. Se actualiza sin repintar la
 * lista, para no perder el foco mientras se teclea la cantidad.
 */
function renderQtyDetail() {
  taggableServices().forEach((s) => {
    const detalle = document.getElementById(`qty-detail-${s.id}`);
    if (!detalle) return;

    const total = Object.keys(TAG_FORMATS).reduce((n, fid) => n + tagCounts[s.id][fid], 0);
    const coste = tagsCostOf(s.id);

    if (total === 0) {
      detalle.textContent = 'Sin soportes seleccionados para este servicio.';
      return;
    }

    const partes = [
      `${total} ${total === 1 ? 'soporte' : 'soportes'} para ${tagPurpose(s.id)}: ` +
        `${coste === 0 ? 'sin coste añadido' : euros(coste)}.`,
    ];

    // Solo se avisa del tramo del formato del que más unidades se piden.
    const conTramos = formatsWithUnits(s.id)
      .filter((fid) => TAG_FORMATS[fid].tiers.length > 1)
      .sort((a, b) => chargeableOf(s.id, b) - chargeableOf(s.id, a))[0];

    if (conTramos) {
      const siguiente = nextTierInfo(chargeableOf(s.id, conTramos), TAG_FORMATS[conTramos].tiers);
      if (siguiente) {
        partes.push(
          `Con ${siguiente.faltan} ${TAG_FORMATS[conTramos].name.toLowerCase()} más, ` +
            `todas bajan a ${euros(siguiente.precio)}.`
        );
      }
    }

    detalle.textContent = partes.join(' ');
  });
}

/** Texto de apoyo del selector de horas. */
function renderHoursDetail() {
  SERVICES.filter((s) => s.hourly && selected.has(s.id)).forEach((s) => {
    const detalle = document.getElementById(`hours-detail-${s.id}`);
    if (!detalle) return;
    const h = hourCounts[s.id];
    detalle.textContent =
      `${h} ${h === 1 ? 'hora' : 'horas'} × ${euros(s.price)} = ${euros(lineTotal(s))}.`;
  });
}

/** Cambia las horas de un servicio sin repintar la lista entera. */
function setHours(id, valor) {
  if (!(id in hourCounts)) return;

  const n = Math.min(MAX_HOURS, Math.max(1, Math.round(Number(valor) || 1)));
  hourCounts[id] = n;

  const input = document.getElementById(`hours-${id}`);
  if (input && Number(input.value) !== n) input.value = n;

  renderHoursDetail();
  renderSummary();
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
    .flatMap((s) =>
      Object.keys(TAG_FORMATS)
        .filter((fid) => chargeableOf(s.id, fid) > 0)
        .map((fid) => {
          const n = chargeableOf(s.id, fid);
          // "20 × Tarjeta para la cuenta" evita pluralizar el nombre.
          return `<li class="summary__item">
             <span>
               ${n} × ${esc(TAG_FORMATS[fid].name)}
               <em class="summary__for">para ${esc(tagPurpose(s.id))}</em>
             </span>
             <span class="summary__item-price">${euros(costOf(s.id, fid))}</span>
           </li>`;
        })
    )
    .join('');

  summaryListEl.innerHTML =
    chosen
      .map((s) => {
        // Si el servicio lleva soporte, se dice cuál va incluido en su precio.
        let nota = '';
        if (s.taggable) {
          nota = `<em class="summary__for">incluye 1 × ${esc(TAG_FORMATS[FORMATO_INCLUIDO].name)}</em>`;
        } else if (s.unit === 'from') {
          nota = '<em class="summary__for">estimación mínima, se ajusta tras el informe</em>';
        } else if (s.unit === 'hour') {
          nota = `<em class="summary__for">${hourCounts[s.id]} h × ${euros(s.price)}</em>`;
        } else if (s.unit === 'quote') {
          nota = '<em class="summary__for">se presupuesta tras el informe</em>';
        }

        let importe;
        if (s.unit === 'month') importe = `${euros(s.price)}/mes`;
        else if (s.unit === 'quote') importe = '—';
        else importe = euros(lineTotal(s));

        return `
        <li class="summary__item">
          <span>${esc(s.name)}${nota}</span>
          <span class="summary__item-price">${importe}</span>
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
  renderHoursDetail();
  renderSummary();
  renderChecklist();
}

/** Cambia la cantidad de un formato sin repintar la lista entera. */
function setTagCount(sid, fid, valor) {
  if (!tagCounts[sid] || !(fid in tagCounts[sid])) return;

  // El formato incluido no baja de 1: ese soporte va en el precio del servicio.
  const minimo = fid === FORMATO_INCLUIDO ? 1 : 0;
  const n = Math.min(MAX_TAGS, Math.max(minimo, Math.round(Number(valor) || 0)));
  tagCounts[sid][fid] = n;

  const input = document.getElementById(`qty-${sid}-${fid}`);
  if (input && Number(input.value) !== n) input.value = n;

  // El importe de la fila y su estado sí se refrescan al momento.
  const fila = input?.closest('.fmt');
  if (fila) {
    fila.classList.toggle('fmt--on', n > 0);
    const cobrado = chargeableOf(sid, fid);
    fila.querySelector('.fmt__total').textContent = cobrado > 0 ? euros(costOf(sid, fid)) : '—';
  }

  renderQtyDetail();
  renderSummary();
}

/* ---------- interacción ---------- */

listEl.addEventListener('change', (event) => {
  const horas = event.target.closest('input[data-hours]');
  if (horas) {
    setHours(horas.dataset.hours, horas.value);
    return;
  }

  const cantidad = event.target.closest('.qty__input');
  if (cantidad) {
    setTagCount(cantidad.dataset.qty, cantidad.dataset.fmt, cantidad.value);
    return;
  }

  const input = event.target.closest('.service__check');
  if (!input) return;

  if (input.checked) selected.add(input.value);
  else selected.delete(input.value);

  // Si el servicio lleva etiquetas, aparece o desaparece su selector.
  const cambiado = serviceById(input.value);
  if (cambiado?.taggable || cambiado?.hourly) renderServices();

  renderQtyDetail();
  renderHoursDetail();
  renderSummary();
  renderChecklist();
});

// Mientras se teclea, para que el precio acompañe sin esperar al blur.
listEl.addEventListener('input', (event) => {
  const campo = event.target.closest('.qty__input');
  if (!campo) return;
  if (campo.dataset.hours) setHours(campo.dataset.hours, campo.value);
  else setTagCount(campo.dataset.qty, campo.dataset.fmt, campo.value);
});

listEl.addEventListener('click', (event) => {
  const boton = event.target.closest('.qty__btn');
  if (!boton) return;

  if (boton.dataset.hours) {
    const id = boton.dataset.hours;
    setHours(id, hourCounts[id] + Number(boton.dataset.step));
    return;
  }

  const sid = boton.dataset.qty;
  const fid = boton.dataset.fmt;
  setTagCount(sid, fid, tagCounts[sid][fid] + Number(boton.dataset.step));
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

  const hoy = new Date();
  const fecha = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const caduca = new Date(hoy.getTime() + VALIDEZ_DIAS * 86400000).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const filaEtiquetas = taggableServices()
    .flatMap((s) =>
      Object.keys(TAG_FORMATS)
        .filter((fid) => chargeableOf(s.id, fid) > 0)
        .map((fid) => {
          const n = chargeableOf(s.id, fid);
          const f = TAG_FORMATS[fid];
          const coste = costOf(s.id, fid);
          return `<tr>
             <td>
               <strong>${n} × ${esc(f.name)} — ${esc(tagPurpose(s.id))}</strong>
               <span>${esc(f.desc)} Todos llevan el mismo contenido, así que se
                 configura una vez y se replica. ${euros(coste / n)} por unidad.</span>
             </td>
             <td class="quote__cell-price">${euros(coste)}</td>
           </tr>`;
        })
    )
    .join('');

  const filas =
    chosen
      .map(
        (s) => `
        <tr>
          <td>
            <strong>${esc(s.name)}</strong>
            <span>${esc(s.desc)}${
              s.taggable ? ` Incluye 1 × ${esc(TAG_FORMATS[FORMATO_INCLUIDO].name)}.` : ''
            }${
              s.unit === 'hour'
                ? ` Estimadas ${hourCounts[s.id]} h a ${euros(s.price)} la hora.`
                : ''
            }</span>
          </td>
          <td class="quote__cell-price">${
            s.unit === 'month'
              ? `${euros(s.price)}/mes`
              : s.unit === 'quote'
                ? 'A presupuestar'
                : euros(lineTotal(s))
          }</td>
        </tr>`
      )
      .join('') + filaEtiquetas;

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


    <footer class="quote__foot">
      <p>${esc(NOTA_IVA)} Presupuesto válido hasta el ${esc(caduca)}.</p>
      <p>
        Documento orientativo y no vinculante, generado automáticamente a partir de los
        servicios seleccionados. El precio final y el alcance se acuerdan por escrito antes
        de la contratación.
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

/*
 * Envío del formulario.
 *
 * En producción lo recoge Netlify Forms: se hace POST del propio
 * formulario por fetch, sin recargar la página, y el aviso llega al
 * correo configurado en Netlify sin que el visitante tenga que hacer
 * nada más.
 *
 * Fuera de Netlify (abriendo el archivo en local, o si el POST falla)
 * se recurre al programa de correo del visitante, para no perder el
 * contacto por un problema de infraestructura.
 */

function abrirCorreo() {
  const negocio = businessInput.value.trim();
  const asunto = negocio ? `Presupuesto Gertu — ${negocio}` : 'Presupuesto Gertu';

  window.location.href =
    `mailto:${CONTACTO}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(buildEmailBody())}`;
}

/** Vuelca el presupuesto en los campos ocultos que viajan con el formulario. */
function rellenarCamposOcultos() {
  const { once, month } = totals();
  document.getElementById('hidden-negocio').value = businessInput.value.trim();
  document.getElementById('hidden-total').value =
    `${euros(once)}${month > 0 ? ` + ${euros(month)}/mes` : ''}`;
  document.getElementById('hidden-presupuesto').value = buildEmailBody();
}

/*
 * Límite de envíos por navegador.
 *
 * No sustituye al filtro antispam de Netlify ni al reCAPTCHA, que son
 * los que paran a un bot de verdad: esto corta los envíos repetidos por
 * impaciencia o por un clic doble, que son la mayoría del ruido, y evita
 * que alguien vacíe la cuota mensual de formularios a base de recargar.
 */
const LIMITE_ENVIOS = 5;
const VENTANA_MINUTOS = 30;

function enviosRecientes() {
  try {
    const previos = JSON.parse(localStorage.getItem('gertu-envios') || '[]');
    const desde = Date.now() - VENTANA_MINUTOS * 60000;
    return previos.filter((fecha) => fecha > desde);
  } catch {
    return [];
  }
}

function puedeEnviar() {
  return enviosRecientes().length < LIMITE_ENVIOS;
}

function apuntaEnvio() {
  try {
    localStorage.setItem('gertu-envios', JSON.stringify([...enviosRecientes(), Date.now()]));
  } catch {
    // Si el navegador bloquea el almacenamiento, no se limita: mejor
    // dejar pasar un envío de más que perder un cliente real.
  }
}

async function enviarFormulario() {
  if (!puedeEnviar()) {
    throw new Error('limite');
  }

  rellenarCamposOcultos();

  const respuesta = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString(),
  });

  if (!respuesta.ok) throw new Error(`Netlify respondió ${respuesta.status}`);

  apuntaEnvio();
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

  summaryStatus.textContent = 'PDF descargado. Enviándonos la copia…';

  enviarFormulario()
    .then(() => {
      summaryStatus.textContent = 'PDF descargado y copia enviada. Te escribimos enseguida.';
    })
    .catch((error) => {
      if (error.message === 'limite') {
        summaryStatus.textContent = 'PDF descargado. Ya nos has enviado varias copias, no hace falta más.';
        return;
      }
      summaryStatus.textContent = 'PDF descargado. Ahora se abre tu correo con la copia para nosotros.';
      setTimeout(abrirCorreo, 400);
    });
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
    let importe;
    if (s.unit === 'month') importe = `${euros(s.price)}/mes`;
    else if (s.unit === 'quote') importe = 'a presupuestar';
    else if (s.unit === 'hour') importe = `${hourCounts[s.id]} h × ${euros(s.price)} = ${euros(lineTotal(s))}`;
    else importe = euros(s.price);
    lineas.push(`- ${s.name}: ${importe}`);
  });

  taggableServices().forEach((s) => {
    Object.keys(TAG_FORMATS).forEach((fid) => {
      const n = chargeableOf(s.id, fid);
      if (n) {
        lineas.push(
          `- ${n} × ${TAG_FORMATS[fid].name} — ${tagPurpose(s.id)}: ${euros(costOf(s.id, fid))}`
        );
      }
    });
  });

  lineas.push('');
  lineas.push(`Soportes en total: ${totalTags()}`);
  taggableServices().forEach((s) => {
    const detalle = formatsWithUnits(s.id)
      .map((fid) => `${tagCounts[s.id][fid]} × ${TAG_FORMATS[fid].name}`)
      .join(', ');
    if (detalle) lineas.push(`  · ${tagPurpose(s.id)}: ${detalle}`);
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
  formStatus.textContent = 'Enviando…';

  const boton = form.querySelector('.contact-form__cta');
  boton.disabled = true;

  enviarFormulario()
    .finally(() => {
      boton.disabled = false;
    })
    .then(() => {
      formStatus.textContent = '¡Recibido! Te respondemos en menos de 24 horas.';
      form.reset();
    })
    .catch((error) => {
      if (error.message === 'limite') {
        formStatus.textContent =
          'Ya nos has escrito varias veces. Estamos en ello: si es urgente, llámanos.';
        formStatus.classList.add('contact-form__note--error');
        return;
      }
      // Sin servidor detrás: al menos que el visitante pueda escribirnos.
      formStatus.textContent = 'Abriendo tu programa de correo para enviarlo.';
      abrirCorreo();
    });
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
