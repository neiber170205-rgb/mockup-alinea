/*
 * Navegación del mockup: botón "Pantallas" con el mapa de todo el mockup,
 * marco de celular para las vistas móviles y recuerdo del rol escogido.
 */
(function () {
  'use strict';
  const BASE = new URL('../../', document.currentScript.src);
  const url = (p) => new URL(p, BASE).href;
  const params = new URLSearchParams(location.search);
  const EMBED = params.has('embed');

  const GROUPS = window.MOCKUP_GROUPS = [
    { id: 'admin', name: 'Administrador del club', who: 'Laura Ríos', items: [
      ['club/Admin-Inicio.html', 'Inicio'], ['club/Admin-Jugadoras.html', 'Jugadoras'], ['club/Admin-Asistencia.html', 'Asistencia'],
      ['club/Admin-Pagos.html', 'Pagos'], ['club/Admin-Avisos.html', 'Avisos'], ['club/Admin-Inscripciones.html', 'Inscripciones'],
      ['club/Admin-Grupos.html', 'Grupos y horarios'], ['club/Admin-Torneos.html', 'Torneos'], ['club/Admin-Galeria.html', 'Galería'],
      ['club/Admin-Reportes.html', 'Reportes'], ['club/Admin-Configuracion.html', 'Configuración'],
      ['alinea/Club-Marca.html', 'Marca y deporte'], ['alinea/Club-Suscripcion.html', 'Suscripción a Alinea'],
      ['club/Movil-Inicio.html', 'Inicio en el celular'], ['club/Movil-Jugadoras.html', 'Jugadoras en el celular'], ['club/Movil-Pagos.html', 'Pagos en el celular']] },
    { id: 'entrenador', name: 'Entrenador', who: 'Carlos Ibarra', items: [
      ['club/Entrenador-Inicio.html', 'Inicio'], ['club/Entrenador-Asistencia.html', 'Tomar asistencia'], ['club/Entrenador-Grupo.html', 'Mi grupo'],
      ['club/Entrenador-Avisar.html', 'Avisar'], ['club/Entrenador-Convocatoria.html', 'Convocatoria']] },
    { id: 'acudiente', name: 'Acudiente', who: 'Martha Rojas', items: [
      ['alinea/Familia-Inicio.html', 'Inicio de la familia (varios clubes)'], ['club/Acudiente-Inicio.html', 'Inicio en Black Panthers'],
      ['club/Acudiente-Pagos.html', 'Pagos'], ['club/Acudiente-Torneos.html', 'Torneos'], ['club/Acudiente-Carne.html', 'Carné'],
      ['club/Acudiente-Avisos.html', 'Avisos'], ['club/Acudiente-Perfil.html', 'Perfil']] },
    { id: 'jugador', name: 'Jugadora', who: 'Valentina Rojas', items: [
      ['club/Deportista-Inicio.html', 'Inicio'], ['club/Deportista-Perfil.html', 'Perfil']] },
    { id: 'docs', name: 'Documentos del club', items: [
      ['club/Doc-Carne.html', 'Carné de la deportista'], ['club/Doc-Correos.html', 'Correos a las familias'], ['club/Doc-Factura.html', 'Comprobante de pago en PDF']] },
    { id: 'publico', name: 'Página pública del club', items: [
      ['club/Main.html', 'Página de Black Panthers'], ['club/Login.html', 'Ingreso anterior del club']] },
    { id: 'consola', name: 'Consola d2b (súper admin)', who: 'Neiber Araque', items: [
      ['alinea/D2B-Login.html', 'Ingreso a la consola'], ['alinea/D2B-Inicio.html', 'Inicio'], ['alinea/D2B-Clubes.html', 'Clubes'],
      ['alinea/D2B-Wompi.html', 'Wompi y comprobantes del club'], ['alinea/D2B-Cobros.html', 'Cobros'], ['alinea/D2B-Planes.html', 'Planes'],
      ['alinea/Club-Registro.html', 'Registro de un club nuevo']] },
    { id: 'marca', name: 'Marca Alinea', items: [
      ['alinea/Roles.html', 'Roles de Alinea'], ['alinea/Cancha-final.html', 'Logo final'], ['alinea/Main.html', 'Los 5 estilos de logo'],
      ['alinea/Cancha.html', 'Estilo Cancha'], ['alinea/Formacion.html', 'Estilo Formación'], ['alinea/Filas.html', 'Estilo Filas'],
      ['alinea/Linea.html', 'Estilo Línea'], ['alinea/Escudo.html', 'Estilo Escudo']] },
  ];

  const here = location.pathname.replace(/\/+$/, '');
  const isHere = (p) => here.endsWith('/' + p) || here.endsWith(p);
  const rol = localStorage.getItem('alinea-mockup-rol');

  const meta = document.querySelector('meta[name="mk-width"]');
  const PHONE = !EMBED && meta && meta.content === '390' && window.innerWidth >= 700 && window.self === window.top;
  if (PHONE) window.__MK_FRAMED = true;

  function phoneFrame() {
    document.body.className = 'mk-phone-page';
    document.body.innerHTML = '<div class="mk-phone"><iframe title="' + document.title + '" src="' + location.pathname + '?embed=1"></iframe></div>'
      + '<p class="mk-phone-tip">Vista de celular. En un celular de verdad se ve a pantalla completa.</p>';
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = url('assets/css/mockup.css');
    document.head.appendChild(css);
  }

  function nav() {
    if (EMBED || window.self !== window.top) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = url('assets/css/mockup.css');
    document.head.appendChild(css);
    const box = document.createElement('div');
    box.className = 'mk-nav';
    const groups = GROUPS.map((g) => '<section class="mk-g' + (g.id === rol ? ' mk-g-on' : '') + '"><h3>' + g.name + (g.who ? ' <small>' + g.who + '</small>' : '') + '</h3><ul>'
      + g.items.map(([p, t]) => '<li><a href="' + url(p) + '"' + (isHere(p) ? ' aria-current="page"' : '') + '>' + t + '</a></li>').join('') + '</ul></section>').join('');
    box.innerHTML = '<button type="button" class="mk-btn" aria-expanded="false" aria-controls="mk-panel">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>'
      + '<span>Pantallas</span></button>'
      + '<div class="mk-panel" id="mk-panel" role="dialog" aria-label="Pantallas del mockup" hidden>'
      + '<div class="mk-head"><b>Mockup Alinea</b><button type="button" class="mk-x" aria-label="Cerrar">×</button></div>'
      + '<div class="mk-links"><a href="' + url('index.html') + '">Cambiar de rol</a><a href="' + url('mapa.html') + '">Ver el mapa completo</a></div>'
      + groups + '<p class="mk-note">Mockup navegable con datos de prueba. Nada se guarda.</p></div>';
    document.body.appendChild(box);
    const btn = box.querySelector('.mk-btn'), panel = box.querySelector('.mk-panel');
    const set = (open) => { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open) panel.querySelector('a').focus(); };
    btn.addEventListener('click', () => set(panel.hidden));
    box.querySelector('.mk-x').addEventListener('click', () => { set(false); btn.focus(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  }

  if (EMBED) document.documentElement.classList.add('mk-embed');
  window.addEventListener('DOMContentLoaded', () => { if (PHONE) phoneFrame(); nav(); });
})();
