/* Progreso, XP, racha, repaso espaciado (cajas de Leitner) e insignias. Todo en localStorage; exportable. */
window.FGD = window.FGD || {};
(function () {
  const KEY = "fgd-edir-v1";
  const DIAS_CAJA = [0, 1, 3, 7, 14, 30]; // caja 0 = nueva/fallada; cada acierto sube de caja y espacia más el repaso
  const NIVELES = [
    [0, "Aprendiz de datos"], [150, "Curioso de tablas"], [400, "Consultor junior"], [800, "Analista SQL"],
    [1400, "Domador de JOINs"], [2200, "Arquitecto de modelos"], [3200, "Maestro de datos"], [4500, "Leyenda FGD"],
  ];
  const INSIGNIAS = {
    primera: ["🌱", "Primer paso", "Completaste tu primera pregunta"],
    racha3: ["🔥", "Racha de 3", "3 días seguidos estudiando"],
    racha7: ["⚡", "Racha de 7", "Una semana sin faltar"],
    joiner: ["🔗", "Domador de JOINs", "10 aciertos en preguntas de JOIN"],
    sqlista: ["⌨️", "Manos al teclado", "Resolviste 10 retos escribiendo SQL"],
    modelador: ["🧩", "Modelador", "Dominas Semana 4 (80% en la semana)"],
    simulacro: ["🎯", "Sangre fría", "Terminaste un simulacro completo"],
    perfecto: ["💎", "Sin errores", "Simulacro con 90% o más"],
    repasador: ["🧠", "Memoria de acero", "50 repasos completados"],
    labero: ["🧪", "Rata de laboratorio", "Ejecutaste 25 consultas en el laboratorio"],
    gimnasio10: ["🏋️", "Gimnasio SQL", "Resolviste 10 retos"],
    gimnasio30: ["🥇", "Atleta del SQL", "Resolviste 30 retos"],
    gimnasio50: ["👑", "Maestro del SQL", "Resolviste todos los retos"],
    arquitecto: ["📐", "Arquitecto de datos", "Aprobaste 3 diseños en el taller de modelado"],
  };
  const hoy = () => new Date().toISOString().slice(0, 10);
  const dias = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const vacio = () => ({ xp: 0, racha: { ult: null, n: 0, mejor: 0 }, srs: {}, hechas: {}, insignias: {}, errores: [], recientes: [], retos: {}, taller: {}, dias: {}, sims: [], stats: { sql: 0, join: 0, lab: 0, repasos: 0 } });
  let S;
  try { S = Object.assign(vacio(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = vacio(); }
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const listeners = [];

  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .4s"; t.style.opacity = 0; setTimeout(() => t.remove(), 450); }, 2600);
  }
  function xpFlotante(n, ev) {
    const e = document.createElement("div"); e.className = "xpfloat"; e.textContent = "+" + n + " XP";
    const x = ev && ev.clientX ? ev.clientX : innerWidth / 2, y = ev && ev.clientY ? ev.clientY : innerHeight / 2;
    e.style.left = x - 30 + "px"; e.style.top = y - 20 + "px"; document.body.appendChild(e); setTimeout(() => e.remove(), 1000);
  }
  function nivel() {
    let i = 0; while (i + 1 < NIVELES.length && S.xp >= NIVELES[i + 1][0]) i++;
    const sig = NIVELES[i + 1];
    return { i: i + 1, nombre: NIVELES[i][1], desde: NIVELES[i][0], hasta: sig ? sig[0] : null, pct: sig ? (S.xp - NIVELES[i][0]) / (sig[0] - NIVELES[i][0]) : 1 };
  }
  function dar(clave) {
    if (S.insignias[clave]) return;
    S.insignias[clave] = hoy(); toast(INSIGNIAS[clave][0] + " Insignia: " + INSIGNIAS[clave][1]);
  }
  function tocarRacha() {
    const h = hoy(); S.dias[h] = (S.dias[h] || 0) + 1;
    if (S.racha.ult === h) return;
    S.racha.n = S.racha.ult === dias(h, -1) ? S.racha.n + 1 : 1; S.racha.ult = h; S.racha.mejor = Math.max(S.racha.mejor, S.racha.n);
    if (S.racha.n >= 3) dar("racha3"); if (S.racha.n >= 7) dar("racha7");
  }
  function xp(n, ev) {
    const antes = nivel().i; S.xp += n; tocarRacha(); xpFlotante(n, ev);
    if (nivel().i > antes) toast("⬆️ ¡Nivel " + nivel().i + ": " + nivel().nombre + "!");
    guardar(); listeners.forEach((f) => f());
  }
  // --- repaso espaciado ---
  function registrar(q, ok, ev) {
    const r = S.srs[q.id] || { caja: 0, due: hoy(), vistas: 0, fallos: 0 };
    r.vistas++; if (!ok) r.fallos++;
    r.caja = ok ? Math.min(r.caja + 1, DIAS_CAJA.length - 1) : 0;
    r.due = dias(hoy(), ok ? DIAS_CAJA[r.caja] : 0); S.srs[q.id] = r;
    if (ok) { xp(q.type === "sql" ? 15 : 10, ev); dar("primera"); } else { xp(2, ev);
      S.errores = S.errores.filter((e) => e.id !== q.id); S.errores.unshift({ id: q.id, fecha: hoy() }); S.errores = S.errores.slice(0, 80); }
    if (ok && q.type === "sql") { S.stats.sql++; if (S.stats.sql >= 10) dar("sqlista"); }
    if (ok && /join/i.test(q.topic || "")) { S.stats.join++; if (S.stats.join >= 10) dar("joiner"); }
    guardar();
  }
  const vencidas = () => Object.keys(S.srs).filter((id) => S.srs[id].due <= hoy());
  const dominada = (id) => (S.srs[id] ? S.srs[id].caja >= 3 : false);

  FGD.store = {
    get: () => S, guardar, hoy, nivel, xp, registrar, vencidas, dominada, dar, toast, INSIGNIAS, NIVELES,
    onChange: (f) => listeners.push(f),
    marcarLeccion(id, ev) { if (!S.hechas[id]) { S.hechas[id] = hoy(); xp(20, ev); } },
    marcarReto(id, nivel, ev) { if (S.retos[id]) return false; S.retos[id] = hoy(); xp([0, 15, 25, 40][nivel] || 15, ev); const n = Object.keys(S.retos).length; if (n >= 10) dar('gimnasio10'); if (n >= 30) dar('gimnasio30'); if (n >= (FGD.retos || []).length) dar('gimnasio50'); guardar(); return true; },
    marcarTaller(id, ev) { if (S.taller[id]) return false; S.taller[id] = hoy(); xp(60, ev); if (Object.keys(S.taller).length >= 3) dar('arquitecto'); guardar(); return true; },
    labRun() { S.stats.lab++; if (S.stats.lab >= 25) dar("labero"); guardar(); },
    exportar() { return JSON.stringify(S); },
    importar(txt) { try { S = Object.assign(vacio(), JSON.parse(txt)); guardar(); return true; } catch (e) { return false; } },
    reiniciar() { S = vacio(); guardar(); },
  };
})();
