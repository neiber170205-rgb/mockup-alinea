/*
 * Marco de celular para las vistas móviles cuando se abren en computador.
 */
(function () {
  'use strict';
  const BASE = new URL('../../', document.currentScript.src);
  const url = (p) => new URL(p, BASE).href;
  const EMBED = window.name === 'mk-embed';

  const meta = document.querySelector('meta[name="mk-width"]');
  const PHONE = !EMBED && meta && meta.content === '390' && window.innerWidth >= 700;
  if (PHONE) window.__MK_FRAMED = true;

  function phoneFrame() {
    document.body.className = 'mk-phone-page';
    document.body.innerHTML = '<div class="mk-phone"><iframe name="mk-embed" title="' + document.title + '" src="' + location.pathname + '"></iframe></div>'
      + '<p class="mk-phone-tip">Vista de celular. En un celular de verdad se ve a pantalla completa.</p>';
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = url('assets/css/mockup.css');
    document.head.appendChild(css);
  }

  if (EMBED) document.documentElement.classList.add('mk-embed');
  window.addEventListener('DOMContentLoaded', () => { if (PHONE) phoneFrame(); });
})();
