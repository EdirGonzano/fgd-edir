/* FGD-Edir · aplicación (router + vistas). Sin frameworks: HTML/JS puro. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const { store, sql } = FGD;
  const esc = sql.esc;
  const main = () => $("#main");
  const hoy = store.hoy;
  const REPO = "https://raw.githubusercontent.com/EdirGonzano/fgd-edir/main/datos/";
  const ico = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13"/></svg>',
    ref: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4 20h16L14 9V3"/></svg>',
    rep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5"/></svg>',
    sim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>',
    err: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>',
    colab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>',
    gym: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h4a3 3 0 013 3V14M7 10v4a3 3 0 003 3h4"/></svg>',
    me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
  };

  /* ------------------------------------------------------------ colores por tema */
  const CAT_COLOR = { dato: "var(--sky)", leer: "var(--teal)", resumir: "var(--gold)", unir: "var(--coral)", agrupar: "var(--orange)", sub: "var(--fuchsia)", ddl: "var(--mint)", dml: "var(--rose)", model: "var(--lavender)", py: "var(--cyan)", func: "var(--cyan)", vent: "var(--pink)", nulo: "var(--peach)", metodo: "var(--olive)", otros: "var(--rose)" };
  const CICLO = ["var(--amber)", "var(--teal)", "var(--coral)", "var(--lavender)", "var(--mint)", "var(--rose)", "var(--sky)", "var(--gold)", "var(--fuchsia)", "var(--orange)", "var(--cyan)", "var(--lime)"];
  const TOPIC_COLOR = (t) => { let h = 0; for (const c of String(t || "x")) h = (h * 31 + c.charCodeAt(0)) >>> 0; return CICLO[h % CICLO.length]; };
  const tono = (c) => `style="--c:${c}"`;
  /* ------------------------------------------------------------ utilidades */
  const barra = (pct, cls) => `<div class="bar ${cls || ""}"><i style="width:${Math.round(Math.min(1, Math.max(0, pct)) * 100)}%"></i></div>`;
  const barajar = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dom = (sem) => { const qs = FGD.preguntas.filter((q) => q.sem === sem); return qs.length ? qs.filter((q) => store.dominada(q.id)).length / qs.length : 0; };
  const leccionesDe = (n) => FGD.lecciones.filter((l) => l.sem === n);
  const progSem = (n) => { const ls = leccionesDe(n), S = store.get(); const l = ls.filter((x) => S.hechas[x.id]).length / (ls.length || 1); return { lec: l, dom: dom(n), tot: (l + dom(n)) / 2 }; };
  const copiaAlPortapapeles = (t) => { try { navigator.clipboard.writeText(t); store.toast("Copiado ✔"); } catch (e) { store.toast("No se pudo copiar"); } };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]"); if (b) { const pre = b.closest(".code").querySelector("pre"); copiaAlPortapapeles(pre.textContent); }
  });

  /* ------------------------------------------------------------ shell */
  const RUTAS = [["#/", "Inicio", ico.home], ["#/semana/1", "Semanas", ico.book], ["#/ref", "Referencia rápida", ico.ref], ["#/lab", "Laboratorio SQL", ico.lab], ["#/retos", "Gimnasio de retos", ico.gym], ["#/taller", "Taller de modelado", ico.tool], ["#/repaso", "Repaso diario", ico.rep], ["#/simulacro", "Simulacro Pa1", ico.sim], ["#/errores", "Mis errores", ico.err], ["#/colab", "Puente a Colab", ico.colab], ["#/perfil", "Mi progreso", ico.me]];
  function shell() {
    document.body.innerHTML = `<div class="app"><aside class="side" id="side"><div class="brand"><i>FGD</i><div>FGD-Edir<small>Fundamentos de Gestión de Datos</small></div></div>
      <nav class="nav" id="nav"></nav><div class="me" id="me"></div></aside>
      <div><div class="topbar"><button class="burger" id="burger" aria-label="Menú">☰</button><b style="font-family:var(--head)">FGD-Edir</b><span class="sp"></span><span class="chip amber" id="xpchip"></span></div><main class="main" id="main"></main></div></div>`;
    $("#burger").onclick = () => $("#side").classList.toggle("open");
    $("#main").addEventListener("click", () => $("#side").classList.remove("open"));
    pintaNav();
  }
  function pintaNav() {
    const h = location.hash || "#/";
    $("#nav").innerHTML = RUTAS.map((r, i) => (r[0] === "#/semana/1" ? '<div class="sep">Estudiar</div>' : r[0] === "#/repaso" ? '<div class="sep">Practicar</div>' : r[0] === "#/errores" ? '<div class="sep">Tú</div>' : "") + `<a href="${r[0]}" class="${(h === r[0]) || (r[0] !== "#/" && h.startsWith(r[0].replace(/\/\d+$/, ""))) ? "on" : ""}">${r[2]}${r[1]}</a>`).join("");
    const n = store.nivel(), S = store.get();
    $("#me").innerHTML = `<div class="row"><b style="font-family:var(--head)">Nivel ${n.i}</b><span class="sp"></span><span class="chip amber">${S.xp} XP</span></div><div class="muted" style="font-size:13px;margin:2px 0 8px">${n.nombre}</div>${barra(n.pct, "amber")}<div class="row" style="margin-top:8px;font-size:13px"><span><span class="flame">🔥</span> <b>${S.racha.n}</b> día(s)</span><span class="sp"></span><span class="muted">${store.vencidas().length} por repasar</span></div>`;
    const c = $("#xpchip"); if (c) c.textContent = "Nv " + n.i + " · " + S.xp + " XP";
  }
  store.onChange(pintaNav);

  /* ------------------------------------------------------------ router */
  let limpiar = null;
  function ruta() {
    if (limpiar) { limpiar(); limpiar = null; }
    const h = (location.hash || "#/").slice(1).split("/").filter(Boolean);
    const v = h[0] || "inicio"; pintaNav();
    window.scrollTo(0, 0);
    ({ inicio: vInicio, semana: vSemana, leccion: vLeccion, ref: vRef, lab: vLab, repaso: vRepaso, practica: vPractica, simulacro: vSimulacro, retos: vRetos, reto: vReto, taller: vTaller, tarea: vTarea, errores: vErrores, colab: vColab, perfil: vPerfil }[v] || vInicio)(h.slice(1));
    $("#side").classList.remove("open");
  }

  /* ------------------------------------------------------------ INICIO */
  function vInicio() {
    const S = store.get(), n = store.nivel(), venc = store.vencidas().length, tot = FGD.preguntas.length;
    const dominadas = FGD.preguntas.filter((q) => store.dominada(q.id)).length;
    const hechoHoy = S.dias[hoy()] || 0;
    const sig = FGD.lecciones.find((l) => !S.hechas[l.id]);
    main().innerHTML = `<div class="kicker">Fundamentos de Gestión de Datos · Unidad 1</div>
      <h1 class="h1">Hola, Edir. Hoy se estudia con método.</h1>
      <p class="lead">Todo el curso (semanas 1–4) vive aquí: lecciones, cada comando con ejemplo, laboratorio SQL y repaso que no te deja olvidar.</p>
      <div class="hero">
        <div class="card mission"><div class="kicker">Misión de hoy</div><h2 style="font-size:24px;margin:6px 0">${venc ? venc + " repaso(s) esperándote" : "Tu primer reto del día"}</h2>
          <p class="muted">${hechoHoy ? `Ya sumaste ${hechoHoy} acción(es) hoy. ¡Mantén la racha!` : "Responde 8 preguntas (repasos + nuevas) y gana XP. Son ~6 minutos."}</p>
          <div class="row" style="margin-top:14px"><a class="btn primary" href="#/practica/mision">▶ Empezar misión</a>${sig ? `<a class="btn" href="#/leccion/${sig.id}">Continuar: ${esc(sig.titulo)}</a>` : ""}</div></div>
        <div class="card"><div class="grid g2"><div class="stat"><b class="tone" ${tono("var(--orange)")}><span class="flame">🔥</span> ${S.racha.n}</b><span>días de racha (mejor ${S.racha.mejor})</span></div><div class="stat"><b class="tone" ${tono("var(--gold)")}>${S.xp}</b><span>XP · Nivel ${n.i}</span></div><div class="stat"><b class="tone" ${tono("var(--mint)")}>${dominadas}/${tot}</b><span>preguntas dominadas</span></div><div class="stat"><b class="tone" ${tono("var(--cyan)")}>${venc}</b><span>repasos pendientes</span></div></div>
          <div class="muted" style="font-size:13px;margin:12px 0 6px">${n.nombre}${n.hasta ? " → faltan " + (n.hasta - S.xp) + " XP" : ""}</div>${barra(n.pct, "amber")}</div></div>
      <h2 class="h2">Tu camino</h2><div class="path">${FGD.semanas.map((w) => { const p = progSem(w.n); return `<a class="card hover wk" href="#/semana/${w.n}" style="color:inherit"><div class="n" style="background:${w.color}">${w.n}</div><div><h3>${esc(w.titulo)}</h3><p>${esc(w.resumen)}</p><div class="dim" style="font-size:12.5px;margin-top:2px">Caso: ${esc(w.caso)}</div></div><div style="min-width:150px"><div class="row" style="font-size:12.5px"><span class="muted">Lecciones</span><span class="sp"></span><b>${Math.round(p.lec * 100)}%</b></div>${barra(p.lec)}<div class="row" style="font-size:12.5px;margin-top:6px"><span class="muted">Dominio</span><span class="sp"></span><b>${Math.round(p.dom * 100)}%</b></div>${barra(p.dom, "amber")}</div></a>`; }).join("")}</div>
      <h2 class="h2">Atajos para el examen</h2>
      <div class="grid g3"><a class="card hover" href="#/ref" style="color:inherit"><b>🔎 Referencia rápida</b><p class="muted" style="margin-top:4px">Cada comando: qué hace, sintaxis, ejemplo y trampa típica. Busca en 2 segundos.</p></a>
        <a class="card hover" href="#/lab" style="color:inherit"><b>🧪 Laboratorio SQL</b><p class="muted" style="margin-top:4px">Escribe consultas y ve el resultado al instante, sin Colab.</p></a>
        <a class="card hover" href="#/simulacro" style="color:inherit"><b>🎯 Simulacro Pa1</b><p class="muted" style="margin-top:4px">45 minutos, una sola oportunidad, como el examen real.</p></a>
        <a class="card hover" href="#/retos" style="color:inherit"><b>🏋️ Gimnasio de retos</b><p class="muted" style="margin-top:4px">${FGD.retos.length} ejercicios de SQL con corrección automática. Aquí se aprende escribiendo.</p></a>
        <a class="card hover" href="#/taller" style="color:inherit"><b>📐 Taller de modelado</b><p class="muted" style="margin-top:4px">Diseña tablas desde reglas de negocio y la web revisa tus claves y relaciones.</p></a>
        <a class="card hover" href="#/leccion/c4-repaso" style="color:inherit"><b>🗺️ Mapa completo de SQL</b><p class="muted" style="margin-top:4px">Todo lo que dominas, qué lección lo explica y cómo cambia SQL en otros motores.</p></a></div>
      <div class="card" style="margin-top:14px"><b>Cómo usar esto sin olvidar</b><ol class="muted" style="margin:8px 0 0 20px"><li>Lee una lección y ejecuta cada ejemplo (cámbialo y rómpelo).</li><li>Haz la <b>misión diaria</b>: la web te vuelve a preguntar lo que fallaste a los 1, 3, 7 y 14 días.</li><li>Antes del examen: <b>simulacro</b> y repasa tu cuaderno de errores.</li></ol></div>`;
  }

  /* ------------------------------------------------------------ SEMANA */
  function vSemana(a) {
    const n = +a[0] || 1, w = FGD.semanas.find((x) => x.n === n), S = store.get(), p = progSem(n);
    main().innerHTML = `<div class="tabs" style="margin-bottom:14px">${FGD.semanas.map((x) => `<a class="tab ${x.n === n ? "on" : ""}" href="#/semana/${x.n}">Semana ${x.n}</a>`).join("")}</div>
      <div class="kicker" style="color:${w.color}">Semana ${n}</div><h1 class="h1">${esc(w.titulo)}</h1><p class="lead">${esc(w.resumen)}</p>
      <div class="row" style="margin:14px 0"><a class="btn primary" href="#/practica/s${n}">▶ Practicar semana ${n}</a><a class="btn" href="#/ref">Referencia rápida</a><span class="sp"></span><span class="chip">Dominio ${Math.round(p.dom * 100)}%</span></div>
      ${(() => { const tarjeta = (l, i) => `<a class="card hover" href="#/leccion/${l.id}" style="color:inherit;border-top:4px solid ${CICLO[(n * 3 + i) % CICLO.length]}"><div class="row"><span class="chip">${l.comp ? "Complemento" : i + 1}</span><span class="sp"></span>${S.hechas[l.id] ? '<span class="chip lime">✔ hecha</span>' : `<span class="chip">${l.min} min</span>`}</div><h3 style="margin:10px 0 4px;font-size:18px">${esc(l.titulo)}</h3><p class="muted" style="font-size:14px">${l.bloques.filter((b) => b.t === "try").length} ejemplos ejecutables · ${l.bloques.filter((b) => b.t === "diagram").length} diagramas</p></a>`;
        const base = leccionesDe(n).filter((l) => !l.comp), comp = leccionesDe(n).filter((l) => l.comp);
        return `<h2 class="h2 tone" style="--c:var(--amber)">Lo que se ve en clase</h2><div class="grid auto">${base.map(tarjeta).join("")}</div>` + (comp.length ? `<h2 class="h2 tone" style="--c:var(--mint)">Complementos para dominar SQL</h2><p class="muted" style="margin:-4px 0 12px">Lo que va más allá de la clase y que necesitarás en Big Data y Ciencia de Datos.</p><div class="grid auto">${comp.map((l, i) => tarjeta(l, i + 5)).join("")}</div>` : ""); })()}
      ${n === 4 ? `<div class="callout exam" style="margin-top:18px"><span class="ic">🎯</span><div><b>Pa1 abarca semanas 1 a 4</b>Prueba de aula de 45 minutos, una sola oportunidad. Cuando termines las 4 semanas, haz el <a href="#/simulacro">simulacro</a>.</div></div>` : ""}`;
  }

  /* ------------------------------------------------------------ LECCIÓN */
  let h2n = 0;
  function bloque(b) {
    const callout = (cls, ic, tit) => `<div class="callout ${cls}"><span class="ic">${ic}</span><div><b>${tit}</b>${b.h}</div></div>`;
    switch (b.t) {
      case "p": return `<div class="blk"><p>${b.h}</p></div>`;
      case "h2": return `<h2 class="h2 tone" ${tono(CICLO[(h2n++) % CICLO.length])}>${b.h}</h2>`;
      case "list": return `<div class="blk"><ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
      case "tip": return `<div class="blk">${callout("tip", "💡", "Truco")}</div>`;
      case "trap": return `<div class="blk">${callout("trap", "⚠️", "Cuidado")}</div>`;
      case "exam": return `<div class="blk">${callout("exam", "🎯", "Pregunta de examen")}</div>`;
      case "think": return `<div class="blk"><div class="callout think"><span class="ic">🤔</span><div><b>Piensa antes de ver</b>${b.h}<details class="reveal" style="margin-top:8px"><summary>Ver respuesta</summary><div style="margin-top:6px">${b.a}</div></details></div></div></div>`;
      case "code": return `<div class="blk">${sql.bloque(b.src, b.titulo)}</div>`;
      case "diagram": return `<div class="blk" data-diagram="${b.id}"></div>`;
      case "table": return `<div class="blk" style="overflow-x:auto"><table class="mini" style="font-size:14px;width:100%"><thead><tr>${b.head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "refs": return `<div class="blk"><div class="muted" style="font-size:13px;margin:14px 0 6px">📚 Ficha rápida de los comandos de esta lección:</div><div class="tags">${b.ids.map((id) => { const r = FGD.ref.find((x) => x.id === id); return r ? `<a class="chip tone" ${tono(CAT_COLOR[r.cat])} href="#/ref/${id}">${esc(r.n)}</a>` : ""; }).join("")}</div></div>`;
      case "try": return tryBlock(b);
    }
    return "";
  }
  let tryN = 0;
  function tryBlock(b) {
    const id = "t" + ++tryN;
    return `<div class="blk" data-try="${id}" data-db="${b.db}"><div class="code"><div class="bar2"><span>▶ ${esc(b.titulo || "Ejemplo")}</span><span class="sp"></span><span class="chip">${FGD.datasets[b.db].nombre}</span></div>
      <textarea class="ed" spellcheck="false" rows="${Math.min(12, b.sql.split("\n").length + 1)}" style="border:0;border-radius:0;width:100%">${esc(b.sql)}</textarea></div>
      <div class="row" style="margin:8px 0"><button class="btn sm primary" data-run>▶ Ejecutar</button><button class="btn sm" data-reset>↺ Original</button><a class="btn sm" data-lab href="#/lab">Abrir en laboratorio</a></div><div data-out></div></div>`;
  }
  function activaTry(root) {
    $$("[data-try]", root).forEach((w) => {
      const ta = $("textarea", w), orig = ta.value, db = w.dataset.db;
      const run = async () => { $("[data-out]", w).innerHTML = '<div class="muted">Ejecutando…</div>'; const r = await sql.correr(db, ta.value, true); $("[data-out]", w).innerHTML = sql.tabla(r, 30); store.labRun(); };
      $("[data-run]", w).onclick = run;
      $("[data-reset]", w).onclick = () => { ta.value = orig; };
      $("[data-lab]", w).onclick = () => { sessionStorage.setItem("fgd-lab", JSON.stringify({ db, sql: ta.value })); };
      ta.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } if (e.key === "Tab") { e.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2; } });
    });
    $$("[data-diagram]", root).forEach((d) => FGD.dibujar(d.dataset.diagram, d));
  }
  function vLeccion(a) {
    const l = FGD.lecciones.find((x) => x.id === a[0]); if (!l) return vInicio();
    const w = FGD.semanas.find((x) => x.n === l.sem), idx = FGD.lecciones.indexOf(l), prev = FGD.lecciones[idx - 1], next = FGD.lecciones[idx + 1], S = store.get();
    h2n = FGD.lecciones.indexOf(l);
    main().innerHTML = `<div class="lesson"><a class="muted" href="#/semana/${l.sem}">← Semana ${l.sem} · ${esc(w.titulo)}</a><div class="kicker" style="margin-top:10px;color:${w.color}">${l.comp ? "Complemento" : "Lección " + (leccionesDe(l.sem).filter((x) => !x.comp).indexOf(l) + 1)} · ${l.min} min</div><h1 class="h1">${esc(l.titulo)}</h1>
      ${l.bloques.map(bloque).join("")}
      <hr><div class="card"><b>¿Listo?</b> <span class="muted">Marca la lección y practica lo aprendido.</span><div class="row" style="margin-top:12px"><button class="btn primary" id="hecha">${S.hechas[l.id] ? "✔ Lección completada" : "✔ Marcar como hecha (+20 XP)"}</button><a class="btn" href="#/practica/s${l.sem}">Practicar semana ${l.sem}</a>${next ? `<a class="btn" href="#/leccion/${next.id}">Siguiente: ${esc(next.titulo)} →</a>` : ""}</div></div>${prev ? `<p style="margin-top:14px"><a class="muted" href="#/leccion/${prev.id}">← ${esc(prev.titulo)}</a></p>` : ""}</div>`;
    activaTry(main());
    $("#hecha").onclick = (e) => { store.marcarLeccion(l.id, e); e.target.textContent = "✔ Lección completada"; };
  }

  /* ------------------------------------------------------------ REFERENCIA */
  function vRef(a) {
    const foco = a[0]; let q = "", cat = "todas", sem = 0;
    const cats = FGD.categorias;
    main().innerHTML = `<div class="kicker">Estudia sin abrir PPT ni manuales</div><h1 class="h1">Referencia rápida</h1><p class="lead">Cada comando y concepto del curso: qué hace, sintaxis, ejemplo que puedes ejecutar y la trampa típica de examen.</p>
      <div class="sticky-top"><input type="search" id="q" placeholder="Buscar: JOIN, HAVING, 3FN, COUNT…" autocomplete="off"><div class="tabs" style="margin-top:10px" id="fsem"><button class="tab on" data-s="0">Todas</button>${[1, 2, 3, 4].map((s) => `<button class="tab" data-s="${s}">Sem ${s}</button>`).join("")}</div>
      <div class="tabs" style="margin-top:8px" id="fcat"><button class="tab on" data-c="todas">Todo</button>${Object.keys(cats).map((c) => `<button class="tab tone" ${tono(CAT_COLOR[c])} data-c="${c}">${cats[c]}</button>`).join("")}</div></div>
      <div class="muted" id="cnt" style="margin:6px 0 10px"></div><div class="ref" id="lista"></div>`;
    const lista = $("#lista");
    const card = (r) => `<details class="card refc tone" ${tono(CAT_COLOR[r.cat])} id="r-${r.id}" ${foco === r.id ? "open" : ""}><summary style="cursor:pointer;list-style:none"><div class="row"><h3>${esc(r.n)}</h3><span class="sp"></span><span class="chip">Sem ${r.sem}</span><span class="chip tone" ${tono(CAT_COLOR[r.cat])}>${cats[r.cat]}</span></div><div class="what">${esc(r.que)}</div></summary>
      <div class="syn">${esc(r.syn)}</div>${r.ej ? `<div data-try-ref="${r.id}">${sql.bloque(r.ej, "Ejemplo · " + FGD.datasets[r.db].nombre, `<button class="btn sm primary" data-prueba="${r.id}">▶ Ver resultado</button>`)}<div data-out></div></div>` : ""}
      <div class="callout tip" style="margin:10px 0 0"><span class="ic">💡</span><div><b>Cuándo / nota</b>${esc(r.nota)}</div></div><div class="callout trap" style="margin:8px 0 0"><span class="ic">⚠️</span><div><b>Trampa típica</b>${esc(r.trampa)}</div></div>
      ${r.ej ? `<div style="margin-top:10px"><a class="btn sm" data-lab-ref="${r.id}" href="#/lab">Abrir en laboratorio y editarlo</a></div>` : ""}</details>`;
    const pinta = () => {
      const t = q.toLowerCase().trim();
      const f = FGD.ref.filter((r) => (sem === 0 || r.sem === sem) && (cat === "todas" || r.cat === cat) && (!t || (r.n + " " + r.que + " " + r.syn + " " + r.nota).toLowerCase().includes(t)));
      lista.innerHTML = f.map(card).join("") || '<div class="card muted">Sin resultados. Prueba otra palabra.</div>';
      $("#cnt").textContent = f.length + " ficha(s)";
      $$("[data-prueba]", lista).forEach((b) => (b.onclick = async () => { const r = FGD.ref.find((x) => x.id === b.dataset.prueba); const out = $("[data-out]", b.closest("[data-try-ref]")); out.innerHTML = sql.tabla(await sql.correr(r.db, r.ej, true), 15); }));
      $$("[data-lab-ref]", lista).forEach((b) => (b.onclick = () => { const r = FGD.ref.find((x) => x.id === b.dataset.labRef); sessionStorage.setItem("fgd-lab", JSON.stringify({ db: r.db, sql: r.ej })); }));
    };
    $("#q").oninput = (e) => { q = e.target.value; pinta(); };
    $$("#fsem .tab").forEach((b) => (b.onclick = () => { sem = +b.dataset.s; $$("#fsem .tab").forEach((x) => x.classList.toggle("on", x === b)); pinta(); }));
    $$("#fcat .tab").forEach((b) => (b.onclick = () => { cat = b.dataset.c; $$("#fcat .tab").forEach((x) => x.classList.toggle("on", x === b)); pinta(); }));
    pinta();
    if (foco) setTimeout(() => { const e = $("#r-" + foco); if (e) { e.scrollIntoView({ block: "center" }); e.style.borderColor = "var(--amber)"; } }, 60);
  }

  /* ------------------------------------------------------------ LABORATORIO */
  function vLab() {
    const pre = (() => { try { return JSON.parse(sessionStorage.getItem("fgd-lab") || "null"); } catch (e) { return null; } })(); sessionStorage.removeItem("fgd-lab");
    let db = pre ? pre.db : "chasqui";
    const ejemplos = { chasqui: ["SELECT * FROM ventas LIMIT 10;", "SELECT sede, SUM(monto) AS ingreso FROM ventas GROUP BY sede;", "SELECT c.nombre, p.total FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente LIMIT 10;"], yaku: ["SELECT * FROM ventas_original;", "SELECT l.nombre, COUNT(*) FROM ventas v JOIN locales l ON v.id_local = l.id_local GROUP BY l.id_local;"] };
    main().innerHTML = `<div class="kicker">Practica sin miedo</div><h1 class="h1">Laboratorio SQL</h1><p class="lead">SQLite real corriendo en tu navegador. Escribe, ejecuta (Ctrl+Enter) y rompe cosas: puedes reiniciar la base cuando quieras.</p>
      <div class="grid" style="grid-template-columns:260px 1fr;gap:16px" id="labgrid"><div><div class="card"><b>Base de datos</b><select id="dbsel" style="margin:8px 0">${Object.keys(FGD.datasets).map((k) => `<option value="${k}" ${k === db ? "selected" : ""}>${FGD.datasets[k].nombre}</option>`).join("")}</select><div class="muted" style="font-size:13px" id="dbdesc"></div><div id="esq" style="margin-top:12px"></div><button class="btn sm" id="rst" style="margin-top:10px">↺ Reiniciar base</button></div></div>
      <div><textarea class="ed" id="ed" spellcheck="false" rows="9"></textarea><div class="row" style="margin:10px 0"><button class="btn primary" id="go">▶ Ejecutar (Ctrl+Enter)</button><span class="sp"></span><span class="muted" style="font-size:13px">Ejemplos:</span><span id="ejs" class="tags"></span></div><div id="out"></div></div></div>`;
    const ed = $("#ed");
    const esq = () => { const d = FGD.datasets[db]; $("#dbdesc").textContent = d.desc; $("#esq").innerHTML = Object.keys(d.tablas).map((t) => `<details style="margin:4px 0"><summary class="mono" style="cursor:pointer;color:var(--amber);font-size:14px">${t}</summary><div class="mono muted" style="font-size:12.5px;margin:4px 0 6px 12px;line-height:1.7">${d.tablas[t].map((c) => `<span data-ins="${c}" style="cursor:pointer">${c}</span>`).join("<br>")}</div></details>`).join("");
      $$("[data-ins]").forEach((s) => (s.onclick = () => { const p = ed.selectionStart; ed.value = ed.value.slice(0, p) + s.dataset.ins + ed.value.slice(ed.selectionEnd); ed.focus(); })); $("#ejs").innerHTML = ejemplos[db].map((e, i) => `<button class="chip" data-e="${i}" style="cursor:pointer">#${i + 1}</button>`).join(""); $$("[data-e]").forEach((b) => (b.onclick = () => { ed.value = ejemplos[db][+b.dataset.e]; })); };
    ed.value = pre ? pre.sql : ejemplos[db][0]; esq();
    const run = async () => { $("#out").innerHTML = '<div class="muted">Ejecutando…</div>'; $("#out").innerHTML = sql.tabla(await sql.correr(db, ed.value), 300); store.labRun(); };
    $("#go").onclick = run; ed.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } if (e.key === "Tab") { e.preventDefault(); const s = ed.selectionStart; ed.value = ed.value.slice(0, s) + "  " + ed.value.slice(ed.selectionEnd); ed.selectionStart = ed.selectionEnd = s + 2; } });
    $("#dbsel").onchange = (e) => { db = e.target.value; ed.value = ejemplos[db][0]; esq(); $("#out").innerHTML = ""; };
    $("#rst").onclick = async () => { await sql.reiniciar(db); store.toast("Base reiniciada"); };
    if (innerWidth < 900) $("#labgrid").style.gridTemplateColumns = "1fr";
  }

  /* ------------------------------------------------------------ MOTOR DE PREGUNTAS */
  let ses = null;
  /* Selección con VARIEDAD: prioriza vencidas y no vistas, evita lo visto hace poco, alterna temas y tipos de pregunta. */
  function seleccionar(pool, n) {
    const S = store.get(), rec = new Set((S.recientes || []).slice(-40));
    let cand = pool.filter((q) => !rec.has(q.id)); if (cand.length < n) cand = pool.slice();
    const score = (q) => { const r = S.srs[q.id]; return (r ? (r.due <= hoy() ? 3 : 0.5 - r.caja * 0.1) : 2) + Math.random() * 1.6; };
    let rest = cand.map((q) => [q, score(q)]).sort((a, b) => b[1] - a[1]).map((x) => x[0]); const out = [];
    while (out.length < n && rest.length) {
      const l1 = out[out.length - 1], l2 = out[out.length - 2];
      let i = rest.findIndex((q) => !(l1 && q.topic === l1.topic) && !(l1 && l2 && q.type === l1.type && q.type === l2.type));
      if (i < 0) i = 0; out.push(rest.splice(i, 1)[0]);
    }
    return out;
  }
  // convierte preguntas dinámicas (generadores) en preguntas concretas y calcula las respuestas ejecutando SQL
  const ctx = { run: async (db, q) => sql.correr(db, q, true) };
  async function materializar(q0) {
    let q = q0;
    if (q0.type === "gen") { const g = await q0.fn(ctx); q = Object.assign({ id: q0.id, sem: q0.sem, topic: q0.topic, dyn: true }, g); }
    else q = Object.assign({}, q0);
    if (q.type === "num" && q.ans === undefined) {
      const r = await sql.correr(q.db, q.code, true);
      q.ans = r.error ? null : q.calc === "rows" ? r.rows.length : (r.rows[0] ? Number(r.rows[0][0]) : null);
    }
    return q;
  }
  async function armarSesion(modo) {
    const S = store.get(), todas = FGD.preguntas;
    const venc = store.vencidas().map((id) => FGD.pregPorId[id]).filter(Boolean);
    let qs = [], titulo = "", sim = false;
    if (modo === "mision") { titulo = "Misión del día"; qs = seleccionar(venc, 4); qs = qs.concat(seleccionar(todas.filter((q) => !qs.includes(q)), 8 - qs.length)); }
    else if (modo === "repaso") { titulo = "Repaso espaciado"; qs = seleccionar(venc, 15); }
    else if (modo === "errores") { titulo = "Practicar mis errores"; qs = S.errores.map((e) => FGD.pregPorId[e.id]).filter(Boolean).slice(0, 15); }
    else if (modo[0] === "s" && !isNaN(modo.slice(1))) { const n = +modo.slice(1); titulo = "Práctica · Semana " + n; qs = seleccionar(todas.filter((q) => q.sem === n), 12); }
    else if (modo.startsWith("q:")) { titulo = "Pregunta suelta"; qs = modo.slice(2).split(",").map((id) => FGD.pregPorId[id]).filter(Boolean); }
    else if (modo === "simulacro") { titulo = "Simulacro Pa1"; sim = true; const pick = (n, k) => seleccionar(todas.filter((q) => q.sem === n), k); qs = [].concat(pick(1, 5), pick(2, 8), pick(3, 10), pick(4, 7)); qs = qs.map((q) => [q, Math.random()]).sort((a, b) => a[1] - b[1]).map((x) => x[0]); }
    qs = await Promise.all(qs.map(materializar)); qs = qs.filter((q) => !(q.type === "num" && q.ans === null));
    S.recientes = (S.recientes || []).concat(qs.map((q) => q.id)).slice(-80); store.guardar();
    return { modo, titulo, qs, i: 0, ok: 0, resp: [], sim, ini: Date.now(), limite: 45 * 60 };
  }
  async function vPractica(a) { main().innerHTML = '<div class="muted" style="padding:30px">Preparando preguntas…</div>'; ses = await armarSesion(a[0] || "mision"); if (!ses.qs.length) return sinPreguntas(ses.titulo); pintaPregunta(); }
  async function vRepaso() { ses = await armarSesion("repaso"); if (!ses.qs.length) { main().innerHTML = `<div class="kicker">Repaso diario</div><h1 class="h1">Nada que repasar hoy 🎉</h1><p class="lead">Cuando falles o completes preguntas, la web programará repasos a 1, 3, 7, 14 y 30 días. Mientras tanto, practica una semana.</p><div class="row" style="margin-top:16px"><a class="btn primary" href="#/practica/mision">Misión del día</a><a class="btn" href="#/semana/1">Ir a las semanas</a></div>`; return; } pintaPregunta(); }
  function vErrores() {
    const S = store.get(); const es = S.errores.map((e) => FGD.pregPorId[e.id]).filter(Boolean);
    main().innerHTML = `<div class="kicker">Aprender del error</div><h1 class="h1">Mis errores</h1><p class="lead">Las preguntas que fallaste, con su explicación. Los errores repetidos son los que más te enseñan.</p>${es.length ? `<div class="row" style="margin:14px 0"><a class="btn primary" href="#/practica/errores">▶ Practicar mis errores</a></div><div class="grid">${es.map((q) => `<div class="card"><div class="row"><span class="chip">Sem ${q.sem}</span><span class="chip">${({ sql: "SQL", order: "Ordenar", num: "Cálculo", fill: "Completar", match: "Relacionar", multi: "Selección múltiple", gen: "Dinámica" })[q.type] || "Opción múltiple"}</span><span class="sp"></span><span class="chip coral">${(S.srs[q.id] || {}).fallos || 1} fallo(s)</span></div><p style="margin:8px 0;font-weight:700">${esc(q.q)}</p><p class="muted" style="font-size:14px">${esc(q.why)}</p></div>`).join("")}</div>` : '<div class="card" style="margin-top:14px">Aún no hay errores registrados. ¡Bien! Practica una semana para ponerte a prueba.</div>'}`;
  }
  function sinPreguntas(t) { main().innerHTML = `<h1 class="h1">${esc(t)}</h1><div class="card">No hay preguntas para esta selección todavía.</div><p style="margin-top:12px"><a class="btn" href="#/">Volver</a></p>`; }

  function cabeceraSes() {
    const s = ses; return `<div class="row" style="margin-bottom:10px"><span class="kicker">${esc(s.titulo)}</span><span class="sp"></span>${s.sim ? `<span class="timer" id="tm"></span>` : ""}<span class="chip">${s.i + 1} / ${s.qs.length}</span></div>${barra(s.i / s.qs.length)}`;
  }
  function pintaPregunta() {
    const s = ses; if (s.i >= s.qs.length) return resultado();
    const q = s.qs[s.i]; const tipo = q.type;
    let cuerpo = "";
    if (tipo === "mcq") {
      const orden = barajar(q.opts.map((o, i) => i)); q._orden = orden;
      cuerpo = (q.code ? sql.bloque(q.code, "Consulta · " + (q.db ? FGD.datasets[q.db].nombre : "")) : "") + orden.map((oi, k) => `<button class="opt" data-o="${oi}"><span class="mono dim" style="margin-right:10px">${k + 1}</span>${esc(q.opts[oi])}</button>`).join("");
    } else if (tipo === "order") {
      q._sel = []; q._pool = barajar(q.items);
      cuerpo = `<div class="muted" style="font-size:14px">Toca los pasos en el orden correcto:</div><div class="pill-list" id="sel"></div><div class="pill-list" id="pool" style="border-style:solid;border-color:transparent;padding:0"></div><div class="row"><button class="btn sm" id="undo">↶ Deshacer</button><button class="btn primary" id="chk">Comprobar</button></div>`;
    } else if (tipo === "num") {
      cuerpo = (q.code ? sql.bloque(q.code, "Consulta · " + FGD.datasets[q.db].nombre) : "") + `<div class="row" style="margin-top:8px"><input type="text" id="num" inputmode="decimal" autocomplete="off" placeholder="Escribe tu respuesta (número)" style="max-width:280px"><button class="btn primary" id="chk">Comprobar</button></div>`;
    } else if (tipo === "multi") {
      q._ord = barajar(q.opts.map((o, i) => i)); q._sel = new Set();
      cuerpo = `<div class="muted" style="font-size:14px;margin-bottom:6px">Marca TODAS las que correspondan:</div>` + q._ord.map((oi) => `<button class="opt" data-m="${oi}">${esc(q.opts[oi])}</button>`).join("") + `<div class="row" style="margin-top:8px"><button class="btn primary" id="chk">Comprobar</button></div>`;
    } else if (tipo === "fill") {
      q._fill = q.blanks.map(() => null); q._pool = barajar(q.blanks.concat(q.extra || []));
      cuerpo = `<div class="muted" style="font-size:14px">Toca las palabras para completar los espacios (en orden):</div><div class="code"><pre id="fillcode" style="white-space:pre-wrap"></pre></div><div class="pill-list" id="pool" style="border-style:solid;border-color:transparent;padding:0"></div><div class="row"><button class="btn sm" id="undo">↶ Deshacer</button><button class="btn primary" id="chk">Comprobar</button></div>`;
    } else if (tipo === "match") {
      q._izq = q.pairs.map((p, i) => i); q._der = barajar(q.pairs.map((p, i) => i)); q._map = {}; q._cur = null;
      cuerpo = `<div class="muted" style="font-size:14px;margin-bottom:6px">Toca un elemento de la izquierda y luego su pareja de la derecha. Toca de nuevo para deshacer.</div><div class="vsplit"><div id="mizq"></div><div id="mder"></div></div><div class="row" style="margin-top:10px"><button class="btn primary" id="chk">Comprobar</button></div>`;
    } else {
      cuerpo = `<div class="row" style="margin-bottom:6px"><span class="chip sky">${FGD.datasets[q.db].nombre}</span><span class="muted" style="font-size:13px">Tablas: ${Object.keys(FGD.datasets[q.db].tablas).join(", ")}</span></div><textarea class="ed" id="ans" spellcheck="false" rows="5" placeholder="Escribe tu consulta SQL aquí…"></textarea>
      <div class="row" style="margin:10px 0"><button class="btn primary" id="chk">Comprobar</button><button class="btn sm" id="prev">▶ Probar mi consulta</button><button class="btn sm" id="hint">💡 Pista</button></div><div id="pv"></div>`;
    }
    main().innerHTML = `<div class="qwrap">${cabeceraSes()}<div class="row" style="margin-bottom:4px"><span class="chip tone" ${tono(TOPIC_COLOR(q.topic))}>${esc(q.topic || "")}</span><span class="chip">Sem ${q.sem}</span></div><div class="qtext">${esc(q.q)}</div>${cuerpo}<div id="fb"></div></div>`;
    if (s.sim) arrancaTimer();
    if (tipo === "mcq") $$(".opt").forEach((b) => (b.onclick = (e) => responde(q, +b.dataset.o === q.a, b, e)));
    else if (tipo === "order") ordenUI(q); else if (tipo === "num") numUI(q); else if (tipo === "multi") multiUI(q); else if (tipo === "fill") fillUI(q); else if (tipo === "match") matchUI(q); else sqlUI(q);
    const key = (e) => { if (e.key >= "1" && e.key <= "4" && tipo === "mcq" && !$(".opt.locked")) { const b = $$(".opt")[+e.key - 1]; if (b) b.click(); } if (e.key === "Enter" && $("#sig") && document.activeElement.tagName !== "TEXTAREA") $("#sig").click(); };
    document.addEventListener("keydown", key); const prev = limpiar; limpiar = () => { document.removeEventListener("keydown", key); if (ses && ses.timer) clearInterval(ses.timer); if (prev) prev(); };
  }
  function arrancaTimer() {
    const t = () => { const r = Math.max(0, ses.limite - Math.floor((Date.now() - ses.ini) / 1000)); const el = $("#tm"); if (el) { el.textContent = String(Math.floor(r / 60)).padStart(2, "0") + ":" + String(r % 60).padStart(2, "0"); el.classList.toggle("low", r < 300); } if (r === 0) { clearInterval(ses.timer); ses.i = ses.qs.length; resultado(); } };
    if (ses.timer) clearInterval(ses.timer); ses.timer = setInterval(t, 500); t();
  }
  function ordenUI(q) {
    const pinta = () => { $("#sel").innerHTML = q._sel.map((x) => `<span class="pill">${esc(x)}</span>`).join("") || '<span class="dim" style="padding:6px">Aún vacío…</span>';
      $("#pool").innerHTML = q._pool.filter((x) => !q._sel.includes(x)).map((x) => `<button class="pill" data-p="${esc(x)}">${esc(x)}</button>`).join("");
      $$("[data-p]").forEach((b) => (b.onclick = () => { q._sel.push(b.dataset.p); pinta(); })); };
    pinta(); $("#undo").onclick = () => { q._sel.pop(); pinta(); };
    $("#chk").onclick = (e) => { if (q._sel.length < q.items.length) return store.toast("Coloca todos los pasos"); const ok = q._sel.join("|") === q.items.join("|"); $("#chk").disabled = true; responde(q, ok, null, e, "Orden correcto: " + q.items.join(" → ")); };
  }
  function numUI(q) {
    const inp = $("#num"); inp.focus();
    const go = (e) => {
      const v = Number(String(inp.value).replace(",", ".").trim()); if (inp.value.trim() === "" || isNaN(v)) return store.toast("Escribe un número");
      const ok = q.round === 0 ? Math.round(v) === Math.round(q.ans) : Math.abs(v - q.ans) < 0.01;
      $("#chk").disabled = true; inp.disabled = true; responde(q, ok, null, e, "Respuesta correcta: " + (Math.round(q.ans * 100) / 100));
    };
    $("#chk").onclick = go; inp.addEventListener("keydown", (e) => { if (e.key === "Enter") go(e); });
  }
  function multiUI(q) {
    $$("[data-m]").forEach((b) => (b.onclick = () => { const k = +b.dataset.m; if (q._sel.has(k)) q._sel.delete(k); else q._sel.add(k); b.classList.toggle("sel", q._sel.has(k)); }));
    $("#chk").onclick = (e) => {
      if (!q._sel.size) return store.toast("Marca al menos una");
      const bien = new Set(q.a), ok = q._sel.size === bien.size && [...q._sel].every((k) => bien.has(k));
      $("#chk").disabled = true; $$("[data-m]").forEach((b) => { const k = +b.dataset.m; b.classList.add("locked"); b.classList.remove("sel"); if (bien.has(k)) b.classList.add("ok"); else if (q._sel.has(k)) b.classList.add("bad"); });
      responde(q, ok, null, e, "Correctas: " + q.a.map((k) => q.opts[k]).join(" · "));
    };
  }
  function fillUI(q) {
    const pinta = () => {
      let i = 0; const partes = q.code.split("___");
      $("#fillcode").innerHTML = partes.map((t, k) => sql.resaltar(t) + (k < q.blanks.length ? `<button class="slot ${q._fill[k] ? "full" : ""}" data-k="${k}">${q._fill[k] ? esc(q._fill[k]) : "&nbsp;&nbsp;&nbsp;&nbsp;"}</button>` : "")).join("");
      const usados = q._fill.filter(Boolean); const cont = {}; usados.forEach((u) => (cont[u] = (cont[u] || 0) + 1));
      $("#pool").innerHTML = q._pool.map((x) => { if (cont[x]) { cont[x]--; return ""; } return `<button class="pill" data-w="${esc(x)}">${esc(x)}</button>`; }).join("");
      $$("[data-w]").forEach((b) => (b.onclick = () => { const k = q._fill.indexOf(null); if (k >= 0) { q._fill[k] = b.dataset.w; pinta(); } }));
      $$("[data-k]").forEach((b) => (b.onclick = () => { q._fill[+b.dataset.k] = null; pinta(); }));
    };
    pinta(); $("#undo").onclick = () => { for (let k = q._fill.length - 1; k >= 0; k--) if (q._fill[k]) { q._fill[k] = null; break; } pinta(); };
    $("#chk").onclick = (e) => { if (q._fill.includes(null)) return store.toast("Completa todos los espacios"); const ok = q._fill.every((v, k) => v === q.blanks[k]); $("#chk").disabled = true; responde(q, ok, null, e, "Respuesta: " + q.blanks.join(" · ")); };
  }
  function matchUI(q) {
    const col = (k) => CICLO[k % CICLO.length];
    const pinta = () => {
      $("#mizq").innerHTML = q._izq.map((i) => { const par = q._map[i]; return `<button class="opt ${q._cur === i ? "sel" : ""}" data-i="${i}" style="${par !== undefined ? "border-color:" + col(i) : ""}">${par !== undefined ? `<span class="dot" style="--c:${col(i)}"></span>` : ""}${esc(q.pairs[i][0])}</button>`; }).join("");
      $("#mder").innerHTML = q._der.map((j) => { const dueno = Object.keys(q._map).find((k) => q._map[k] === j); return `<button class="opt" data-j="${j}" style="${dueno !== undefined ? "border-color:" + col(+dueno) : ""}">${dueno !== undefined ? `<span class="dot" style="--c:${col(+dueno)}"></span>` : ""}${esc(q.pairs[j][1])}</button>`; }).join("");
      $$("[data-i]").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; if (q._map[i] !== undefined) { delete q._map[i]; q._cur = null; } else q._cur = i; pinta(); }));
      $$("[data-j]").forEach((b) => (b.onclick = () => { const j = +b.dataset.j; const dueno = Object.keys(q._map).find((k) => q._map[k] === j); if (dueno !== undefined) { delete q._map[dueno]; pinta(); return; } if (q._cur === null) return store.toast("Primero toca un elemento de la izquierda"); q._map[q._cur] = j; q._cur = null; pinta(); }));
    };
    pinta();
    $("#chk").onclick = (e) => {
      if (Object.keys(q._map).length < q.pairs.length) return store.toast("Relaciona todos los elementos");
      const bien = q.pairs.map((p, i) => i).every((i) => q._map[i] === i), ok = bien;
      $("#chk").disabled = true; $$("[data-i],[data-j]").forEach((b) => b.classList.add("locked"));
      responde(q, ok, null, e, null, `<div class="muted" style="margin:10px 0 4px">Parejas correctas:</div><ul style="margin-left:20px">${q.pairs.map((p) => `<li><b>${esc(p[0])}</b> → ${esc(p[1])}</li>`).join("")}</ul>`);
    };
  }
  function sqlUI(q) {
    const ta = $("#ans"); ta.focus();
    ta.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); const p = ta.selectionStart; ta.value = ta.value.slice(0, p) + "  " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = p + 2; } if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); $("#chk").click(); } });
    $("#prev").onclick = async () => { $("#pv").innerHTML = sql.tabla(await sql.correr(q.db, ta.value, true), 20); };
    $("#hint").onclick = () => { $("#pv").innerHTML = `<div class="callout tip"><span class="ic">💡</span><div><b>Pista</b>${esc(q.hint)}</div></div>`; };
    $("#chk").onclick = async (e) => {
      $("#chk").disabled = true; const mio = await sql.correr(q.db, ta.value, true), sol = await sql.correr(q.db, q.solution, true);
      const ordenado = q.ordered || /order by/i.test(q.solution);
      const ok = sql.iguales(mio, sol, ordenado);
      responde(q, ok, null, e, null, `<div class="muted" style="margin:10px 0 4px">${ok ? "Tu resultado" : "Tu resultado"}</div>${sql.tabla(mio, 10)}${ok ? "" : `<div class="muted" style="margin:10px 0 4px">Resultado esperado</div>${sql.tabla(sol, 10)}`}<div class="muted" style="margin:10px 0 4px">Una solución posible</div>${sql.bloque(q.solution, "")}`);
    };
  }
  async function responde(q, ok, btn, ev, extra, extraHtml) {
    const s = ses; s.resp.push({ q, ok }); if (ok) s.ok++;
    if (s.sim) { store.registrar(q, ok, { clientX: -999, clientY: -999 }); s.i++; return pintaPregunta(); }
    store.registrar(q, ok, ev);
    if (q.type === "mcq") { $$(".opt").forEach((b) => { b.classList.add("locked"); if (+b.dataset.o === q.a) b.classList.add("ok"); }); if (btn && !ok) btn.classList.add("bad"); }
    let res = "";
    if ((q.type === "mcq" || q.type === "num") && q.code && q.db) res = `<div class="muted" style="margin:10px 0 4px">Resultado real de esa consulta:</div>` + sql.tabla(await sql.correr(q.db, q.code, true), 6);
    $("#fb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}"><b>${ok ? "✔ ¡Correcto!" : "✘ Casi…"}</b> <span>${esc(q.why)}</span>${extra ? `<div class="muted" style="margin-top:6px">${esc(extra)}</div>` : ""}${extraHtml || ""}${res}</div><div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn primary" id="sig">${s.i + 1 >= s.qs.length ? "Ver resultado" : "Siguiente"} ▶</button></div>`;
    $("#sig").onclick = () => { s.i++; pintaPregunta(); }; $("#sig").focus();
  }
  function resultado() {
    const s = ses; if (s.timer) clearInterval(s.timer);
    const tot = s.qs.length, pct = s.ok / tot, S = store.get();
    let xpExtra = 0;
    if (s.sim) { S.sims.push({ fecha: hoy(), ok: s.ok, tot, seg: Math.round((Date.now() - s.ini) / 1000) }); store.dar("simulacro"); if (pct >= 0.9) store.dar("perfecto"); xpExtra = Math.round(pct * 100); store.xp(xpExtra); }
    else if (pct === 1) { xpExtra = 20; store.xp(20); }
    if (dom(4) >= 0.8) store.dar("modelador");
    if (S.stats.repasos !== undefined && !s.sim) { S.stats.repasos += s.resp.length; if (S.stats.repasos >= 50) store.dar("repasador"); }
    store.guardar();
    const porSem = [1, 2, 3, 4].map((n) => { const r = s.resp.filter((x) => x.q.sem === n); return r.length ? [n, r.filter((x) => x.ok).length, r.length] : null; }).filter(Boolean);
    const falladas = s.resp.filter((x) => !x.ok);
    const msg = pct >= 0.9 ? "¡Dominio total! 🏆" : pct >= 0.7 ? "¡Muy bien! Sigue así." : pct >= 0.5 ? "Vas encaminado: repasa lo fallado." : "Buen comienzo: los errores enseñan más que los aciertos.";
    main().innerHTML = `<div class="qwrap"><div class="kicker">${esc(s.titulo)} · terminado</div><h1 class="h1">${s.ok} de ${tot} correctas (${Math.round(pct * 100)}%)</h1><p class="lead">${msg}${xpExtra ? " +" + xpExtra + " XP de bono." : ""}</p>${barra(pct)}
      ${s.sim ? `<div class="grid g4" style="margin-top:16px">${porSem.map((p) => `<div class="card stat"><b>${p[1]}/${p[2]}</b><span>Semana ${p[0]}</span></div>`).join("")}</div>` : ""}
      ${falladas.length ? `<h2 class="h2">Para repasar (${falladas.length})</h2><div class="grid">${falladas.map((x) => `<div class="card"><div class="row"><span class="chip">Sem ${x.q.sem}</span></div><p style="margin:8px 0;font-weight:700">${esc(x.q.q)}</p><p class="muted" style="font-size:14px">${esc(x.q.why)}</p></div>`).join("")}</div>` : '<div class="card" style="margin-top:16px">🎯 Sin errores. Las preguntas se volverán a programar para repaso espaciado.</div>'}
      <div class="row" style="margin-top:18px"><button class="btn primary" id="otra">Otra ronda</button><a class="btn" href="#/">Inicio</a><a class="btn" href="#/ref">Referencia rápida</a></div></div>`;
    $("#otra").onclick = async () => { main().innerHTML = '<div class="muted" style="padding:30px">Preparando preguntas…</div>'; ses = await armarSesion(s.modo); if (!ses.qs.length) return sinPreguntas(ses.titulo); pintaPregunta(); };
  }

  /* ------------------------------------------------------------ SIMULACRO */
  function vSimulacro() {
    const S = store.get(), hist = S.sims.slice(-5).reverse();
    main().innerHTML = `<div class="kicker">Prepárate como el examen real</div><h1 class="h1">Simulacro Pa1</h1><p class="lead">30 preguntas mezcladas de las semanas 1 a 4 (opción múltiple, ordenar y escribir SQL), <b>45 minutos</b>, una sola oportunidad y sin ver respuestas hasta el final.</p>
      <div class="grid g3" style="margin:16px 0"><div class="card stat"><b>30</b><span>preguntas</span></div><div class="card stat"><b>45:00</b><span>minutos</span></div><div class="card stat"><b>1</b><span>oportunidad</span></div></div>
      <div class="callout exam"><span class="ic">🎯</span><div><b>Consejo</b>Haz el simulacro cuando hayas leído las lecciones. Lo que falles volverá a salir en tus repasos automáticamente.</div></div>
      <div class="row" style="margin-top:18px"><a class="btn primary" href="#/practica/simulacro">▶ Empezar simulacro</a></div>
      ${hist.length ? `<h2 class="h2">Tus últimos simulacros</h2><div class="grid auto">${hist.map((h) => `<div class="card"><div class="stat"><b>${Math.round((h.ok / h.tot) * 100)}%</b><span>${h.fecha} · ${h.ok}/${h.tot} · ${Math.round(h.seg / 60)} min</span></div></div>`).join("")}</div>` : ""}`;
  }

  /* ------------------------------------------------------------ COLAB */
  function vColab() {
    const imp = `import sqlite3, pandas as pd\n\nBASE = "${REPO}"\nconexion = sqlite3.connect(":memory:")\n\nfor t in ["ventas", "clientes", "productos", "pedidos", "detalles_pedido"]:\n    df = pd.read_csv(BASE + f"chasqui_{t}.csv")\n    df.to_sql(t, conexion, index=False)\n\npd.read_sql_query("SELECT * FROM ventas LIMIT 5;", conexion)`;
    const imp2 = `import urllib.request, sqlite3, pandas as pd\n\nurl = "${REPO}chasqui_tech.db"\nurllib.request.urlretrieve(url, "chasqui_tech.db")\nconexion = sqlite3.connect("chasqui_tech.db")\n\npd.read_sql_query("SELECT name FROM sqlite_master WHERE type='table';", conexion)`;
    const yak = `import sqlite3, pandas as pd\n\nBASE = "${REPO}"\nconexion = sqlite3.connect(":memory:")\nfor t in ["categorias", "productos", "clientes", "locales", "ventas", "ventas_original"]:\n    pd.read_csv(BASE + f"yaku_{t}.csv").to_sql(t, conexion, index=False)\n\npd.read_sql_query("SELECT * FROM ventas_original LIMIT 5;", conexion)`;
    const andes = `import sqlite3, pandas as pd

BASE = "${REPO}"
conexion = sqlite3.connect(":memory:")
for t in ["departamentos", "empleados", "proyectos", "ventas"]:
    pd.read_csv(BASE + f"andes_{t}.csv").to_sql(t, conexion, index=False)

pd.read_sql_query("SELECT * FROM empleados LIMIT 5;", conexion)`;
    const pat = `consulta = """\nSELECT sede, SUM(monto) AS ingreso\nFROM ventas\nGROUP BY sede\nORDER BY ingreso DESC;\n"""\npd.read_sql_query(consulta, conexion)`;
    main().innerHTML = `<div class="kicker">Practica donde ya practicas</div><h1 class="h1">Puente a Google Colab</h1><p class="lead">Los mismos datos de esta web están en el repositorio como CSV y .db. Pega una celda en Colab y listo.</p>
      <div class="callout trap"><span class="ic">⚠️</span><div><b>Antes de usarlo</b>Los enlaces funcionan cuando el repositorio <code>EdirGonzano/fgd-edir</code> esté publicado en GitHub (carpeta <code>datos/</code>). Si cambias el nombre del repositorio, cambia <code>BASE</code>.</div></div>
      <h2 class="h2">1 · Chasqui Tech (semanas 2 y 3) — desde CSV</h2>${sql.bloque(imp, "Celda de Colab")}
      <h2 class="h2">2 · Chasqui Tech — descargando el archivo .db</h2>${sql.bloque(imp2, "Celda de Colab")}
      <h2 class="h2">3 · Café Yaku (semana 4)</h2>${sql.bloque(yak, "Celda de Colab")}
      <h2 class="h2">4 · Andes Soft (cierre de SQL: empleados, jefes, proyectos, ventas)</h2>${sql.bloque(andes, "Celda de Colab")}
      <h2 class="h2">5 · El patrón de la clase</h2><p class="muted">Escribe el SQL en una variable con comillas triples y muéstralo con pandas.</p>${sql.bloque(pat, "Patrón consulta + read_sql_query")}
      <h2 class="h2">Archivos disponibles</h2><div class="card muted" style="font-size:14px;line-height:1.9"><span class="mono">chasqui_ventas.csv · chasqui_clientes.csv · chasqui_productos.csv · chasqui_pedidos.csv · chasqui_detalles_pedido.csv · chasqui_tech.db<br>yaku_categorias.csv · yaku_productos.csv · yaku_clientes.csv · yaku_locales.csv · yaku_ventas.csv · yaku_ventas_original.csv · cafe_yaku.db<br>andes_departamentos.csv · andes_empleados.csv · andes_proyectos.csv · andes_ventas.csv · andes_soft.db</span></div>`;
  }

  /* ------------------------------------------------------------ PERFIL */
  function vPerfil() {
    const S = store.get(), n = store.nivel();
    const dias = []; for (let i = 27; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); dias.push(d.toISOString().slice(0, 10)); }
    main().innerHTML = `<div class="kicker">Tu progreso</div><h1 class="h1">Nivel ${n.i}: ${n.nombre}</h1><p class="lead">${S.xp} XP · racha actual ${S.racha.n} día(s) · mejor racha ${S.racha.mejor}</p>${barra(n.pct, "amber")}
      <h2 class="h2">Últimos 28 días</h2><div class="heat">${dias.map((d) => `<i class="${S.dias[d] > 3 ? "on" : S.dias[d] ? "mid" : ""}" title="${d}: ${S.dias[d] || 0}"></i>`).join("")}</div>
      <h2 class="h2">Dominio por semana</h2><div class="grid g4">${FGD.semanas.map((w) => { const p = progSem(w.n); return `<div class="card mcard"><b style="color:${w.color}">Semana ${w.n}</b><div class="muted" style="font-size:13px">${Math.round(p.dom * 100)}% dominada · ${Math.round(p.lec * 100)}% leída</div>${barra(p.dom, "amber")}</div>`; }).join("")}</div>
      <h2 class="h2">Insignias</h2><div class="grid auto" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">${Object.keys(store.INSIGNIAS).map((k) => { const i = store.INSIGNIAS[k], on = S.insignias[k]; return `<div class="card row" style="gap:12px"><div class="badge ${on ? "" : "off"}">${i[0]}</div><div><b>${i[1]}</b><div class="muted" style="font-size:13px">${i[2]}</div></div></div>`; }).join("")}</div>
      <h2 class="h2">Respaldo de tu progreso</h2><p class="muted">Tu progreso se guarda en este navegador. Descárgalo para no perderlo o pásalo a otro dispositivo.</p>
      <div class="row" style="margin-top:8px"><button class="btn" id="exp">⬇ Exportar</button><button class="btn" id="imp">⬆ Importar</button><button class="btn" id="rs" style="color:var(--coral)">Reiniciar todo</button></div><textarea id="box" style="margin-top:10px;display:none" rows="4" placeholder="Pega aquí tu respaldo y pulsa Importar de nuevo"></textarea>`;
    $("#exp").onclick = () => { const blob = new Blob([store.exportar()], { type: "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fgd-edir-progreso.json"; a.click(); };
    $("#imp").onclick = () => { const b = $("#box"); if (b.style.display === "none") { b.style.display = "block"; return; } store.importar(b.value) ? (store.toast("Progreso importado"), vPerfil()) : store.toast("Respaldo no válido"); };
    $("#rs").onclick = () => { if (confirm("¿Borrar TODO tu progreso? No se puede deshacer.")) { store.reiniciar(); vPerfil(); } };
  }

  /* ------------------------------------------------------------ GIMNASIO DE RETOS */
  const ESTRELLAS = (n) => "★".repeat(n) + "☆".repeat(3 - n), NIVEL_TXT = ["", "Calentamiento", "Entrenamiento", "Reto"];
  function vRetos() {
    const S = store.get(), hechos = FGD.retos.filter((r) => S.retos[r.id]).length, tot = FGD.retos.length;
    const sig = FGD.retos.find((r) => !S.retos[r.id]);
    main().innerHTML = `<div class="kicker">Aprende escribiendo SQL</div><h1 class="h1">Gimnasio de retos</h1><p class="lead">${tot} ejercicios con corrección automática: escribes la consulta, la web la ejecuta y la compara con la solución. Si te atascas, hay pista y solución comentada.</p>
      <div class="card" style="margin:14px 0"><div class="row"><b>${hechos} de ${tot} retos resueltos</b><span class="sp"></span>${sig ? `<a class="btn primary" href="#/reto/${sig.id}">▶ Siguiente reto</a>` : '<span class="chip lime">¡Completaste todos!</span>'}</div>${barra(hechos / tot)}</div>
      ${FGD.retosTemas.map(([k, nombre, color]) => { const rs = FGD.retos.filter((r) => r.tema === k); if (!rs.length) return ""; return `<h2 class="h2 tone" style="--c:${color}">${nombre} <span class="muted" style="font-size:14px;font-weight:600">· ${rs.filter((r) => S.retos[r.id]).length}/${rs.length}</span></h2><div class="grid auto">${rs.map((r) => `<a class="card hover tone" style="--c:${color};color:inherit;padding:14px 16px" href="#/reto/${r.id}"><div class="row"><span class="mono dim">${r.id.toUpperCase()}</span><span class="sp"></span><span style="color:var(--gold);letter-spacing:2px" title="${NIVEL_TXT[r.nivel]}">${ESTRELLAS(r.nivel)}</span></div><p style="margin:8px 0;font-size:14.5px;line-height:1.45">${esc(r.enun)}</p><div class="row"><span class="chip">${FGD.datasets[r.db].nombre}</span><span class="sp"></span>${S.retos[r.id] ? '<span class="chip lime">✔ resuelto</span>' : ""}</div></a>`).join("")}</div>`; }).join("")}`;
  }
  async function vReto(a) {
    const r = FGD.retos.find((x) => x.id === a[0]); if (!r) return vRetos();
    const idx = FGD.retos.indexOf(r), sig = FGD.retos[idx + 1], ant = FGD.retos[idx - 1], tema = FGD.retosTemas.find((t) => t[0] === r.tema), S = store.get();
    let intentos = 0;
    main().innerHTML = `<div class="qwrap" style="max-width:860px"><a class="muted" href="#/retos">← Gimnasio de retos</a>
      <div class="row" style="margin:10px 0 4px"><span class="chip tone" style="--c:${tema[2]}">${tema[1]}</span><span style="color:var(--gold);letter-spacing:2px">${ESTRELLAS(r.nivel)}</span><span class="chip">${NIVEL_TXT[r.nivel]}</span>${S.retos[r.id] ? '<span class="chip lime">✔ resuelto</span>' : ""}</div>
      <h1 class="h1" style="font-size:clamp(20px,3vw,28px)">${esc(r.enun)}</h1>
      <div class="card" style="margin:12px 0;padding:12px 14px"><div class="row" style="font-size:13.5px"><b>${FGD.datasets[r.db].nombre}</b><span class="muted">· tablas:</span>${Object.keys(FGD.datasets[r.db].tablas).map((t) => `<details style="display:inline-block"><summary class="chip" style="cursor:pointer;list-style:none">${t}</summary><div class="mono muted" style="font-size:12px;padding:6px 4px">${FGD.datasets[r.db].tablas[t].join("<br>")}</div></details>`).join("")}</div></div>
      <textarea class="ed" id="ans" spellcheck="false" rows="7" placeholder="Escribe tu SQL aquí… (Ctrl+Enter para comprobar)"></textarea>
      <div class="row" style="margin:10px 0"><button class="btn primary" id="chk">✔ Comprobar</button><button class="btn sm" id="prev">▶ Probar</button><button class="btn sm" id="hint">💡 Pista</button><button class="btn sm" id="sol" style="display:none">👁 Ver solución</button></div><div id="pv"></div><div id="fb"></div>
      <div class="row" style="margin-top:16px">${ant ? `<a class="btn sm" href="#/reto/${ant.id}">← ${ant.id.toUpperCase()}</a>` : ""}<span class="sp"></span>${sig ? `<a class="btn sm" id="next" href="#/reto/${sig.id}">${sig.id.toUpperCase()} →</a>` : ""}</div></div>`;
    const ta = $("#ans"); ta.focus();
    ta.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); const p = ta.selectionStart; ta.value = ta.value.slice(0, p) + "  " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = p + 2; } if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); $("#chk").click(); } });
    const ejecutar = (txt) => sql.correr(r.db, r.check ? txt.replace(/;\s*$/, "") + ";\n" + r.check : txt, true);
    $("#prev").onclick = async () => { $("#pv").innerHTML = sql.tabla(await ejecutar(ta.value), 20); store.labRun(); };
    $("#hint").onclick = () => { $("#pv").innerHTML = `<div class="callout tip"><span class="ic">💡</span><div><b>Pista</b>${esc(r.pista)}</div></div>`; };
    const mostrarSol = async () => { const sol = await ejecutar(r.sol); $("#pv").innerHTML = `<div class="muted" style="margin:6px 0">Una solución posible</div>${sql.bloque(r.sol.replace(/; /g, ";\n"), "")}<div class="muted" style="margin:8px 0 4px">Su resultado${r.check ? " (estado final)" : ""}</div>${sql.tabla(sol, 8)}`; };
    $("#sol").onclick = mostrarSol;
    $("#chk").onclick = async (e) => {
      if (!ta.value.trim()) return store.toast("Escribe tu consulta primero");
      $("#chk").disabled = true; const mio = await ejecutar(ta.value), sol = await ejecutar(r.sol); $("#chk").disabled = false; intentos++;
      const ok = sql.iguales(mio, sol, r.ordered || /order by/i.test(r.sol));
      if (ok) { const nuevo = store.marcarReto(r.id, r.nivel, e); $("#fb").innerHTML = `<div class="feedback ok"><b>✔ ¡Correcto!</b> ${nuevo ? "Reto resuelto." : "Ya lo habías resuelto."}</div>`; await mostrarSol(); }
      else {
        const motivo = mio.error ? "Tu SQL tiene un error: " + mio.error : mio.cols.length !== sol.cols.length ? `Devolviste ${mio.cols.length} columna(s) y se esperaban ${sol.cols.length}.` : mio.rows.length !== sol.rows.length ? `Devolviste ${mio.rows.length} fila(s) y se esperaban ${sol.rows.length}.` : "Tienes el número correcto de filas y columnas, pero algunos valores (o el orden) no coinciden.";
        $("#fb").innerHTML = `<div class="feedback bad"><b>✘ Aún no.</b> ${esc(motivo)}<div class="muted" style="margin-top:6px">Usa «Probar» para ver tu resultado, «Pista» si te atascas.</div></div>`;
        if (intentos >= 2) $("#sol").style.display = "";
      }
    };
  }

  /* ------------------------------------------------------------ TALLER DE MODELADO */
  function erDeSpec(spec) {
    const W = 190, GX = 80, GY = 36, nombres = Object.keys(spec.tablas), nivel = {};
    const niv = (n, vis) => { if (nivel[n] !== undefined) return nivel[n]; const refs = Object.values(spec.tablas[n].fk || {}).filter((x) => x !== n); nivel[n] = refs.length ? 1 + Math.max(...refs.map((x) => niv(x))) : 0; return nivel[n]; };
    nombres.forEach((n) => niv(n));
    const alto = {}, tablas = []; const colores = [C_SKY, C_TEAL, C_AMBER, C_CORAL, C_LAV, C_MINT];
    nombres.forEach((n, i) => { const l = nivel[n]; const y = alto[l] || 20; alto[l] = y + 30 + spec.tablas[n].cols.length * 22 + GY;
      const ts = spec.tablas[n]; tablas.push({ n, x: 20 + l * (W + GX), y, c: colores[i % colores.length], cols: ts.cols.map((c) => [c, ts.pk.includes(c) ? "PK" : (ts.fk || {})[c] ? "FK" : ""]) }); });
    const pos = Object.fromEntries(tablas.map((t) => [t.n, t])), enlaces = [];
    nombres.forEach((b) => Object.entries(spec.tablas[b].fk || {}).forEach(([col, ref]) => {
      const A = pos[ref], B = pos[b]; if (!A || !B) return;
      const ia = Math.max(0, spec.tablas[ref].cols.indexOf(spec.tablas[ref].pk[0])), ib = spec.tablas[b].cols.indexOf(col);
      if (A.x < B.x) enlaces.push({ a: ref, ia, sa: "r", b, ib, sb: "l", mx: (A.x + W + B.x) / 2 });
      else if (A.x > B.x) enlaces.push({ a: ref, ia, sa: "l", b, ib, sb: "r", mx: (B.x + W + A.x) / 2 });
      else enlaces.push({ a: ref, ia, sa: "r", b, ib, sb: "r", mx: A.x + W + 34 });
    }));
    const ancho = (Math.max(...Object.values(nivel)) + 1) * (W + GX) + 30, altoMax = Math.max(...Object.values(alto)) + 10;
    return FGD.erSVG(tablas, enlaces, ancho, altoMax);
  }
  const C_SKY = "#4db8ff", C_TEAL = "#00c2b8", C_AMBER = "#ffb400", C_CORAL = "#ff5a4e", C_LAV = "#b6a0ff", C_MINT = "#5ce1a5";
  async function revisarTaller(t, ddl) {
    const d = await sql.vacia(), out = [];
    try { d.exec("PRAGMA foreign_keys = ON;"); d.exec(ddl); out.push([true, "Tu código SQL se ejecuta sin errores"]); } catch (e) { d.close(); return [[false, "Error de SQL: " + e.message]]; }
    const val = (q) => (d.exec(q)[0] || { values: [] }).values;
    const tablas = val("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").map((v) => v[0].toLowerCase());
    for (const [tn, ts] of Object.entries(t.spec.tablas)) {
      if (!tablas.includes(tn)) { out.push([false, `Falta la tabla «${tn}»`]); continue; }
      const info = val(`PRAGMA table_info(${tn})`), cols = info.map((r) => r[1].toLowerCase()), faltan = ts.cols.filter((c) => !cols.includes(c));
      out.push([!faltan.length, faltan.length ? `«${tn}»: faltan las columnas ${faltan.join(", ")}` : `«${tn}»: tiene las columnas esperadas`]);
      const pk = info.filter((r) => r[5] > 0).map((r) => r[1].toLowerCase()).sort().join(), pkEsp = ts.pk.slice().sort().join();
      out.push([pk === pkEsp, pk === pkEsp ? `«${tn}»: clave primaria correcta (${ts.pk.join(", ")})` : `«${tn}»: la clave primaria debería ser (${ts.pk.join(", ")})`]);
      const fkl = val(`PRAGMA foreign_key_list(${tn})`);
      for (const [col, ref] of Object.entries(ts.fk || {})) { const ok = fkl.some((r) => r[3].toLowerCase() === col && r[2].toLowerCase() === ref); out.push([ok, ok ? `«${tn}.${col}» apunta a «${ref}»` : `«${tn}.${col}» debe ser clave foránea hacia «${ref}»`]); }
      const uCols = val(`PRAGMA index_list(${tn})`).filter((r) => r[2] === 1).map((r) => val(`PRAGMA index_info(${r[1]})`).map((x) => x[2].toLowerCase()).sort().join());
      for (const u of ts.unique || []) { const k = u.slice().sort().join(), ok = uCols.includes(k) || pkEsp === k; out.push([ok, ok ? `«${tn}.${u.join(", ")}» es UNIQUE` : `«${tn}.${u.join(", ")}» debe ser UNIQUE`]); }
    }
    for (const p of t.spec.pruebas || []) {
      let evaluable = true; try { for (const s of p.setup || []) d.exec(s); } catch (e) { evaluable = false; }
      if (!evaluable) { out.push([null, p.desc + " — no se pudo evaluar (tus tablas no aceptaron los datos de prueba)"]); continue; }
      let fallo = false; try { d.exec(p.bad); } catch (e) { fallo = true; }
      out.push([fallo, p.desc + (fallo ? "" : " — tu diseño lo está permitiendo y no debería")]);
    }
    d.close(); return out;
  }
  function vTaller() {
    const S = store.get(), hechos = FGD.taller.filter((t) => S.taller[t.id]).length;
    main().innerHTML = `<div class="kicker">Diseña como profesional</div><h1 class="h1">Taller de modelado</h1><p class="lead">Te doy reglas de negocio; tú escribes el <code class="inline">CREATE TABLE</code>. La web <b>comprueba tu diseño</b>: tablas, columnas, claves primarias y foráneas, UNIQUE y que la base rechace datos inválidos.</p>
      <div class="card" style="margin:14px 0"><b>${hechos} de ${FGD.taller.length} diseños aprobados</b>${barra(hechos / FGD.taller.length)}</div>
      <div class="grid auto">${FGD.taller.map((t) => `<a class="card hover tone" style="--c:${t.color};color:inherit" href="#/tarea/${t.id}"><div class="row"><span class="mono dim">${t.id.toUpperCase()}</span><span class="sp"></span><span style="color:var(--gold);letter-spacing:2px">${ESTRELLAS(t.nivel)}</span></div><h3 style="margin:8px 0 4px">${esc(t.titulo)}</h3><p class="muted" style="font-size:14px">${Object.keys(t.spec.tablas).length} tablas · ${Object.values(t.spec.tablas).reduce((n, x) => n + Object.keys(x.fk || {}).length, 0)} claves foráneas</p>${S.taller[t.id] ? '<div class="chip lime" style="margin-top:8px">✔ aprobado</div>' : ""}</a>`).join("")}</div>
      <div class="callout tip" style="margin-top:18px"><span class="ic">💡</span><div><b>Antes de empezar</b>Repasa la lección <a href="#/leccion/c4-diseno">Cómo se diseña un modelo</a>: la receta de 8 pasos te sirve para todos los diseños.</div></div>`;
  }
  async function vTarea(a) {
    const t = FGD.taller.find((x) => x.id === a[0]); if (!t) return vTaller();
    const idx = FGD.taller.indexOf(t), sig = FGD.taller[idx + 1]; let intentos = 0;
    main().innerHTML = `<div class="qwrap" style="max-width:900px"><a class="muted" href="#/taller">← Taller de modelado</a>
      <div class="row" style="margin:10px 0 4px"><span class="chip tone" style="--c:${t.color}">${t.id.toUpperCase()}</span><span style="color:var(--gold);letter-spacing:2px">${ESTRELLAS(t.nivel)}</span></div>
      <h1 class="h1" style="font-size:clamp(22px,3vw,30px)">${esc(t.titulo)}</h1>
      <div class="card tone" style="--c:${t.color}"><b>Reglas de negocio</b><ul style="margin:8px 0 0 20px">${t.reglas.map((x) => `<li style="margin:5px 0">${x}</li>`).join("")}</ul></div>
      <p class="muted" style="margin:12px 0 6px">Tablas que debe tener tu diseño: <span class="mono" style="color:var(--amber)">${Object.keys(t.spec.tablas).join(" · ")}</span></p>
      <textarea class="ed" id="ddl" spellcheck="false" rows="14" placeholder="Escribe aquí tus CREATE TABLE (primero las tablas padre)…"></textarea>
      <div class="row" style="margin:10px 0"><button class="btn primary" id="chk">✔ Comprobar diseño</button><button class="btn sm" id="hint">💡 Pista</button><button class="btn sm" id="sol" style="display:none">👁 Ver una solución</button></div><div id="pv"></div><div id="fb"></div>
      <div class="row" style="margin-top:14px"><span class="sp"></span>${sig ? `<a class="btn sm" href="#/tarea/${sig.id}">${sig.id.toUpperCase()} →</a>` : ""}</div></div>`;
    const ta = $("#ddl"); ta.focus();
    ta.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); const p = ta.selectionStart; ta.value = ta.value.slice(0, p) + "  " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = p + 2; } });
    $("#hint").onclick = () => { $("#pv").innerHTML = `<div class="callout tip"><span class="ic">💡</span><div><b>Pista</b>${t.pista}</div></div>`; };
    const verSol = () => { $("#pv").innerHTML = `<div class="muted" style="margin:6px 0">Una solución posible</div>${sql.bloque(t.solucion, "DDL")}<div class="muted" style="margin:10px 0 4px">Su diagrama entidad-relación</div><div class="diagram">${erDeSpec(t.spec)}</div>`; };
    $("#sol").onclick = verSol;
    $("#chk").onclick = async (e) => {
      if (!ta.value.trim()) return store.toast("Escribe tu diseño primero");
      $("#chk").disabled = true; const res = await revisarTaller(t, ta.value); $("#chk").disabled = false; intentos++;
      const malos = res.filter((x) => x[0] === false).length, buenos = res.filter((x) => x[0] === true).length;
      const lista = res.map((x) => `<li style="margin:4px 0;list-style:none">${x[0] === true ? '<span style="color:var(--lime)">✔</span>' : x[0] === false ? '<span style="color:var(--coral)">✘</span>' : '<span class="dim">•</span>'} ${esc(x[1])}</li>`).join("");
      if (!malos) { const nuevo = store.marcarTaller(t.id, e); $("#fb").innerHTML = `<div class="feedback ok"><b>🏆 ¡Diseño aprobado!</b> ${nuevo ? "+60 XP." : ""}<ul style="margin:8px 0 0">${lista}</ul></div>`; verSol(); }
      else { $("#fb").innerHTML = `<div class="feedback bad"><b>Tu diseño cumple ${buenos} de ${buenos + malos} revisiones.</b><ul style="margin:8px 0 0">${lista}</ul></div>`; if (intentos >= 2) $("#sol").style.display = ""; }
    };
  }

  /* ------------------------------------------------------------ arranque */
  window.addEventListener("hashchange", ruta);
  window.addEventListener("DOMContentLoaded", () => { shell(); ruta(); });
})();
