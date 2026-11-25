/*
 * dc-lite: motor pequeño que pinta los tableros del mockup fuera del lienzo de Claude.
 * Lee la plantilla (<x-dc>), corre la clase Component del <script type="text/x-dc">
 * y vuelve a pintar cada vez que cambia el estado. Solo para el mockup.
 */
(function () {
  'use strict';
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(s) { Object.assign(this.state, typeof s === 'function' ? s(this.state) : s); schedule(); }
  }
  window.DCLogic = DCLogic;

  const BOOL = new Set(['checked', 'selected', 'disabled', 'hidden', 'readonly', 'open', 'required', 'multiple']);
  const get = (scope, expr) => {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    return expr.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  };
  const single = (s) => { const m = /^\s*\{\{([^}]+)\}\}\s*$/.exec(s || ''); return m ? m[1] : null; };
  const interp = (s, scope) => s.replace(/\{\{([^}]+)\}\}/g, (_, e) => { const v = get(scope, e); return v == null ? '' : String(v); });
  const evName = (el, name) => {
    const n = name.slice(2).toLowerCase();
    if (n === 'change') {
      const t = (el.getAttribute('type') || '').toLowerCase();
      return el.tagName === 'SELECT' || t === 'checkbox' || t === 'radio' || t === 'file' ? 'change' : 'input';
    }
    return n;
  };

  function proc(node, scope, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    const kids = (n) => (n.tagName && n.tagName.toLowerCase() === 'template' ? n.content.childNodes : n.childNodes);
    const isFor = tag === 'sc-for' || (tag === 'template' && node.hasAttribute('data-sc-for'));
    const isIf = tag === 'sc-if' || (tag === 'template' && node.hasAttribute('data-sc-if'));
    if (isFor) {
      const list = get(scope, single(node.getAttribute('list')) || '') || [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((item, i) => { const s = Object.create(scope); s[as] = item; s.$index = i; kids(node).forEach((c) => proc(c, s, out)); });
      return;
    }
    if (isIf) {
      if (get(scope, single(node.getAttribute('value')) || '')) kids(node).forEach((c) => proc(c, scope, out));
      return;
    }
    const svg = node.namespaceURI === 'http://www.w3.org/2000/svg';
    const el = svg ? document.createElementNS(node.namespaceURI, node.tagName) : document.createElement(tag);
    let selValue = null;
    for (const a of node.attributes) {
      const name = a.name, ex = single(a.value);
      if (/^on[a-z]/i.test(name) && ex) {
        const fn = get(scope, ex);
        if (typeof fn === 'function') el.addEventListener(evName(node, name), (e) => fn(e));
        continue;
      }
      if (BOOL.has(name.toLowerCase()) && ex) {
        if (get(scope, ex)) { el.setAttribute(name, ''); try { el[name.toLowerCase()] = true; } catch (e) { /* nada */ } }
        continue;
      }
      const v = interp(a.value, scope);
      if (tag === 'template' && (name === 'data-sc-for' || name === 'data-sc-if')) continue;
      el.setAttribute(name, v);
      if (name === 'value' && tag === 'select') selValue = v;
      else if (name === 'value' && (tag === 'input' || tag === 'textarea')) el.value = v;
    }
    kids(node).forEach((c) => proc(c, scope, tag === 'template' ? el.content : el));
    if (tag === 'textarea' && el.textContent) el.value = el.textContent;
    if (selValue !== null) el.value = selValue;
    out.appendChild(el);
  }

  let host, tpl, inst, queued = false;
  const pathOf = (el) => { const p = []; while (el && el !== host) { const par = el.parentNode; if (!par) return null; p.unshift([...par.childNodes].indexOf(el)); el = par; } return el === host ? p : null; };
  const atPath = (p) => p.reduce((n, i) => (n ? n.childNodes[i] : null), host);
  function render() {
    queued = false;
    const act = document.activeElement;
    const p = act && host.contains(act) ? pathOf(act) : null;
    let s0 = null, s1 = null;
    try { if (act && 'selectionStart' in act) { s0 = act.selectionStart; s1 = act.selectionEnd; } } catch (e) { /* nada */ }
    const sx = window.scrollX, sy = window.scrollY;
    const frag = document.createDocumentFragment();
    const vals = inst.renderVals() || {};
    tpl.childNodes.forEach((c) => proc(c, vals, frag));
    host.replaceChildren(frag);
    window.scrollTo(sx, sy);
    if (p) {
      const n = atPath(p);
      if (n && n.focus) { n.focus({ preventScroll: true }); try { if (s0 !== null) n.setSelectionRange(s0, s1); } catch (e) { /* nada */ } }
    }
  }
  function schedule() { if (!host || queued) return; queued = true; Promise.resolve().then(render); }

  window.addEventListener('DOMContentLoaded', () => {
    if (window.__MK_FRAMED) return;
    const xdc = document.querySelector('x-dc');
    if (!xdc) return;
    const helmet = xdc.querySelector('helmet');
    if (helmet) { [...helmet.childNodes].forEach((n) => document.head.appendChild(n)); helmet.remove(); }
    tpl = document.createElement('div');
    [...xdc.childNodes].forEach((n) => tpl.appendChild(n));
    const sc = document.querySelector('script[data-dc-script]');
    let props = {};
    try {
      const def = JSON.parse(sc.getAttribute('data-props') || '{}');
      Object.keys(def).forEach((k) => { if (def[k] && typeof def[k] === 'object' && 'default' in def[k]) props[k] = def[k].default; });
    } catch (e) { props = {}; }
    const Component = new Function('DCLogic', sc.textContent + '\nreturn typeof Component !== "undefined" ? Component : null;')(DCLogic);
    host = document.createElement('div');
    host.className = 'dc-host';
    xdc.replaceWith(host);
    inst = Component ? new Component(props) : { state: {}, renderVals: () => ({}) };
    if (!inst.state) inst.state = {};
    render();
    document.dispatchEvent(new CustomEvent('dc:ready'));
  });
})();
