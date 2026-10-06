const views = {
  inicio: ['La próxima jornada, de un vistazo.', 'Encuentros, goleadores y novedades de tus competiciones.', 'Centro de jornada de GRADA con datos de demostración'],
  clubes: ['Cada equipo tiene su identidad.', 'Plantillas, categorías y carnets desde la ficha de cada club.', 'Equipos de demostración organizados en el módulo Clubes'],
  partido: ['Todo lo que pasó en la cancha.', 'Marcador, acciones de jugadores, vocalía e informe en cada encuentro.', 'Página de detalles de un partido de demostración'],
  carnets: ['Una credencial a tu medida.', 'Modelos, dimensiones y campos que eliges antes de generar el PDF.', 'Selector de modelos de carnet, medidas y campos de impresión'],
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
const picture = document.querySelector('#gallery-image');
function selectView(tab, focus = false) {
  const [title, description, alt] = views[tab.dataset.view];
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  document.querySelector('#gallery-title').textContent = title;
  document.querySelector('#gallery-description').textContent = description;
  document.querySelector('#gallery-panel').setAttribute('aria-labelledby', tab.id);
  picture.src = `assets/${tab.dataset.view}.jpg`;
  picture.alt = alt;
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectView(tab));
  tab.addEventListener('keydown', event => {
    const target = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
    if (target !== undefined) { event.preventDefault(); selectView(tabs[target], true); }
  });
});
const dialog = document.querySelector('#image-dialog');
document.querySelector('.screenshot-button').addEventListener('click', () => {
  const expanded = document.querySelector('#dialog-image');
  expanded.src = picture.src; expanded.alt = picture.alt;
  dialog.showModal();
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
const config = window.GRADA_SALES || {};
let checkout;
try { checkout = new URL(config.checkoutUrl); } catch { /* Lanzamiento todavía sin oferta. */ }
if (checkout?.protocol === 'https:' && (checkout.hostname === 'hotmart.com' || checkout.hostname.endsWith('.hotmart.com'))) {
  const link = document.querySelector('#checkout');
  link.href = checkout.href;
  link.textContent = 'Comprar en Hotmart ↗';
  link.removeAttribute('aria-disabled'); link.removeAttribute('tabindex');
  document.querySelector('#availability').textContent = 'Completa tu compra en Hotmart.';
}
if (config.priceLabel) document.querySelector('#price-label').textContent = config.priceLabel;
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail || '')) {
  const link = document.querySelector('#support');
  link.href = `mailto:${config.supportEmail}`; link.textContent = config.supportEmail;
}
