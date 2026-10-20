/* Diagramas interactivos. Cada uno: FGD.diagramas[id](contenedor). Colores de la paleta; texto siempre legible. */
window.FGD = window.FGD || {};
(function () {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const C = { amber: "#ffb400", teal: "#00c2b8", coral: "#ff5a4e", lime: "#a6e22e", violet: "#8e6bff", sky: "#4db8ff", orange: "#ff8f3f", panel: "#142640", bg: "#0a1424", text: "#f4f1ea", muted: "#a9b8ce", line: "#35588a" };
  // tabla pequeña HTML. filas: array de arrays; opt.cls[i] clase por fila; opt.cell[i][j] clase por celda
  function mt(cols, rows, opt) {
    opt = opt || {};
    return `<table class="mini"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>` +
      rows.map((r, i) => `<tr class="${(opt.cls && opt.cls[i]) || ""}">${r.map((v) => (v === null ? `<td class="n">NULL</td>` : `<td>${esc(v)}</td>`)).join("")}</tr>`).join("") + `</tbody></table>`;
  }
  const D = (FGD.diagramas = {});
  const caja = (h, cap) => `<div class="diagram">${h}${cap ? `<div class="cap">${cap}</div>` : ""}</div>`;

  /* ---------- DIKW ---------- */
  D.dikw = (el) => {
    el.innerHTML = caja(`<svg viewBox="0 0 720 300" role="img" aria-label="Pirámide dato, información, conocimiento">
      <g font-family="Figtree,sans-serif">
      <polygon points="360,14 470,100 250,100" fill="${C.amber}"/><text x="360" y="82" text-anchor="middle" font-weight="800" font-size="17" fill="#1b1300">Conocimiento</text>
      <polygon points="250,108 470,108 560,192 160,192" fill="${C.teal}"/><text x="360" y="157" text-anchor="middle" font-weight="800" font-size="18" fill="#00201e">Información</text>
      <polygon points="160,200 560,200 650,284 70,284" fill="${C.sky}"/><text x="360" y="249" text-anchor="middle" font-weight="800" font-size="18" fill="#04202f">Dato</text>
            </g></svg>
      <div class="grid g3" style="margin-top:10px">
        <div class="card" style="border-color:${C.sky}"><b style="color:${C.sky}">Dato</b><br>500 ventas registradas en octubre en Lima Norte.</div>
        <div class="card" style="border-color:${C.teal}"><b style="color:${C.teal}">Información</b><br>Las ventas crecieron +20 % respecto al mes anterior en esa región.</div>
        <div class="card" style="border-color:${C.amber}"><b style="color:${C.amber}">Conocimiento</b><br>Conviene invertir más en publicidad en Lima Norte en el cuarto trimestre.</div>
      </div>`, "Cada escalón agrega valor. Convertir datos en conocimiento accionable es el trabajo del científico de datos.");
  };

  /* ---------- tipos de datos ---------- */
  D.tipos = (el) => {
    const col = (c, t, d, items, ico) => `<div class="card" style="border-top:4px solid ${c}"><div style="font-size:26px">${ico}</div><h3 style="color:${c};margin:4px 0">${t}</h3><p class="muted" style="font-size:14px">${d}</p><ul class="muted" style="margin:8px 0 0 18px;font-size:14px">${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
    el.innerHTML = caja(`<div class="grid g3">` +
      col(C.teal, "Estructurados", "Filas y columnas fijas. Viven en bases relacionales.", ["Tablas SQL", "Hojas de Excel", "Registros transaccionales"], "▦") +
      col(C.amber, "Semiestructurados", "Tienen etiquetas, pero no un esquema rígido de tabla.", ["JSON y XML", "Correos electrónicos", "Logs del sistema"], "{ }") +
      col(C.coral, "No estructurados", "Sin formato predefinido. ≈ 80 % de los datos del mundo.", ["Imágenes y videos", "Textos y publicaciones", "Audio y llamadas"], "▶") + `</div>`);
  };

  /* ---------- ciclo de vida ---------- */
  D.ciclo = (el) => {
    const pasos = [["Captura", C.sky, "Se genera o recolecta el dato (formulario, sensor, app)."], ["Almacenamiento", C.teal, "Se guarda en una base de datos o archivo."], ["Limpieza", C.coral, "Se corrigen nulos, duplicados y errores. ¡La etapa que más tiempo toma!"], ["Análisis", C.amber, "Se consulta, resume y modela."], ["Decisión", C.lime, "El resultado orienta una acción de negocio."]];
    el.innerHTML = caja(`<div class="row" style="justify-content:center;gap:6px">` + pasos.map((p, i) => `<button class="btn" data-i="${i}" style="border-color:${p[1]};min-width:120px;justify-content:center"><b style="color:${p[1]}">${i + 1}</b> ${p[0]}</button>${i < 4 ? `<span class="dim">➜</span>` : ""}`).join("") + `</div>
      <div class="callout tip" style="margin-top:12px"><span class="ic">💡</span><div><b>Toca una etapa</b><span class="ciclo-t">Los ingenieros de datos dedican hasta ~80 % del tiempo a las 3 primeras etapas.</span></div></div>`, "Un error en la limpieza compromete todo lo que viene después.");
    el.querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", () => { const p = pasos[+b.dataset.i]; el.querySelector(".ciclo-t").textContent = p[0] + ": " + p[2]; }));
  };

  /* ---------- anatomía de una tabla ---------- */
  D.tabla = (el) => {
    const cols = ["venta_id", "sede", "producto", "monto"], filas = [[1, "Piura", "Laptop 14 pulgadas", 2256], [2, "Piura", "Monitor 24 pulgadas", 637], [3, "Trujillo", "Teclado mecánico", 346], [4, "Lima", "Mouse inalámbrico", 159]];
    el.innerHTML = caja(`<div class="row" style="margin-bottom:10px"><button class="tab on" data-m="fila">Fila = registro</button><button class="tab" data-m="col">Columna = campo</button><button class="tab" data-m="pk">Clave primaria (PK)</button><button class="tab" data-m="cel">Celda = valor</button></div>
      <div style="overflow-x:auto"><table class="mini tb" style="font-size:14px"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${filas.map((r, i) => `<tr>${r.map((v, j) => `<td data-r="${i}" data-c="${j}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <div class="callout tip" style="margin-top:12px"><span class="ic">💡</span><div><b>Tabla: ventas</b><span class="tb-t"></span></div></div>`);
    const t = el.querySelector(".tb-t"), tds = [...el.querySelectorAll("td")];
    const txt = { fila: "Una FILA es un registro: un hecho completo (aquí, una venta con todos sus datos).", col: "Una COLUMNA es un campo o atributo: una característica con el mismo tipo en todas las filas (sede, monto…).", pk: "La clave primaria (venta_id) identifica de forma única cada fila. No se repite ni es NULL.", cel: "Una CELDA es el cruce de una fila y una columna: un solo valor, por ejemplo 'Lima'." };
    const pinta = (m) => { tds.forEach((d) => { d.style.background = ""; d.style.color = ""; }); tds.forEach((d) => {
      const r = +d.dataset.r, c = +d.dataset.c;
      if ((m === "fila" && r === 1) || (m === "col" && c === 1) || (m === "pk" && c === 0) || (m === "cel" && r === 3 && c === 1)) { d.style.background = m === "pk" ? "#ffb40044" : "#00c2b844"; d.style.color = "#fff"; } });
      t.textContent = txt[m]; };
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { el.querySelectorAll("[data-m]").forEach((x) => x.classList.toggle("on", x === b)); pinta(b.dataset.m); }));
    pinta("fila");
  };

  /* ---------- sublenguajes ---------- */
  D.sublenguajes = (el) => {
    const S = [["DQL", "Consultar", "SELECT", C.sky, "Leer datos"], ["DML", "Manipular datos", "INSERT · UPDATE · DELETE", C.teal, "Cambiar registros"], ["DDL", "Definir estructura", "CREATE · ALTER · DROP", C.amber, "Crear/cambiar tablas"], ["DCL", "Controlar permisos", "GRANT · REVOKE", C.coral, "Quién puede qué (no en SQLite)"]];
    el.innerHTML = caja(`<div class="grid g4">${S.map((s) => `<div class="card" style="border-top:4px solid ${s[3]}"><div class="mono" style="font-size:26px;font-weight:800;color:${s[3]}">${s[0]}</div><b>${s[1]}</b><div class="mono" style="font-size:12.5px;color:${C.muted};margin:6px 0">${s[2]}</div><div class="muted" style="font-size:13.5px">${s[4]}</div></div>`).join("")}</div>`, "Truco: Q = Query (consulta), M = Manipulation, D = Definition, C = Control.");
  };

  /* ---------- ER genérico (SVG) ---------- */
  function er(tablas, enlaces, w, h) {
    const W = 190, HH = 30, RH = 22, pos = {};
    tablas.forEach((t) => (pos[t.n] = t));
    const cy = (t, i) => t.y + HH + i * RH + RH / 2;
    let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Diagrama entidad-relación"><g font-family="Figtree,sans-serif">`;
    enlaces.forEach((l) => {
      const a = pos[l.a], b = pos[l.b], ya = cy(a, l.ia), yb = cy(b, l.ib), xa = l.sa === "r" ? a.x + W : a.x, xb = l.sb === "r" ? b.x + W : b.x;
      const mx = l.mx != null ? l.mx : (xa + xb) / 2;
      s += `<polyline points="${xa},${ya} ${mx},${ya} ${mx},${yb} ${xb},${yb}" fill="none" stroke="${C.line}" stroke-width="2.2"/>`;
      const dxa = l.sa === "r" ? 8 : -8, dxb = l.sb === "r" ? 8 : -8;
      s += `<circle cx="${xa + dxa * 1.7}" cy="${ya - 11}" r="9" fill="${C.amber}"/><text x="${xa + dxa * 1.7}" y="${ya - 7}" text-anchor="middle" font-size="12" font-weight="800" fill="#1b1300">1</text>`;
      s += `<circle cx="${xb + dxb * 1.7}" cy="${yb - 11}" r="9" fill="${C.teal}"/><text x="${xb + dxb * 1.7}" y="${yb - 7}" text-anchor="middle" font-size="12" font-weight="800" fill="#00201e">N</text>`;
    });
    tablas.forEach((t) => {
      s += `<rect x="${t.x}" y="${t.y}" width="${W}" height="${HH + t.cols.length * RH}" rx="10" fill="${C.panel}" stroke="${t.c}" stroke-width="2"/>`;
      s += `<path d="M${t.x},${t.y + 10} a10,10 0 0 1 10,-10 h${W - 20} a10,10 0 0 1 10,10 v${HH - 10} h-${W} z" fill="${t.c}"/><text x="${t.x + W / 2}" y="${t.y + 20}" text-anchor="middle" font-size="14.5" font-weight="800" fill="#10151c">${esc(t.n)}</text>`;
      t.cols.forEach((c, i) => {
        const y = t.y + HH + i * RH;
        s += `<text x="${t.x + 12}" y="${y + 15}" font-size="13" font-family="JetBrains Mono,monospace" fill="${C.text}">${esc(c[0])}</text>`;
        if (c[1]) s += `<rect x="${t.x + W - 38}" y="${y + 4}" width="28" height="15" rx="5" fill="${c[1] === "PK" ? C.amber : C.teal}"/><text x="${t.x + W - 24}" y="${y + 15}" text-anchor="middle" font-size="10" font-weight="800" fill="#10151c">${c[1]}</text>`;
      });
    });
    return s + `</g></svg>`;
  }
  const K = (n, k) => [n, k || ""];
  D["er-chasqui"] = (el) => {
    const t = [
      { n: "clientes", x: 20, y: 20, c: C.sky, cols: [K("id_cliente", "PK"), K("nombre"), K("ciudad"), K("fecha_registro")] },
      { n: "pedidos", x: 290, y: 20, c: C.teal, cols: [K("id_pedido", "PK"), K("id_cliente", "FK"), K("fecha_pedido"), K("total")] },
      { n: "detalles_pedido", x: 560, y: 20, c: C.amber, cols: [K("id_detalle", "PK"), K("id_pedido", "FK"), K("id_producto", "FK"), K("cantidad"), K("precio_unitario")] },
      { n: "productos", x: 560, y: 215, c: C.coral, cols: [K("id_producto", "PK"), K("nombre"), K("categoria"), K("precio")] },
    ];
    const l = [{ a: "clientes", ia: 0, sa: "r", b: "pedidos", ib: 1, sb: "l", mx: 250 }, { a: "pedidos", ia: 0, sa: "r", b: "detalles_pedido", ib: 1, sb: "l", mx: 520 }, { a: "productos", ia: 0, sa: "r", b: "detalles_pedido", ib: 2, sb: "r", mx: 780 }];
    el.innerHTML = caja(er(t, l, 800, 340), "Un cliente (1) tiene muchos pedidos (N); un pedido tiene muchos detalles; cada detalle apunta a un producto. <b>detalles_pedido</b> es la tabla intermedia de la relación N:M pedido ↔ producto.");
  };
  D["er-yaku"] = (el) => {
    const t = [
      { n: "clientes", x: 20, y: 130, c: C.sky, cols: [K("id_cliente", "PK"), K("nombre"), K("distrito")] },
      { n: "ventas", x: 300, y: 118, c: C.amber, cols: [K("id_venta", "PK"), K("fecha"), K("id_cliente", "FK"), K("id_producto", "FK"), K("id_local", "FK"), K("cantidad"), K("metodo_pago")] },
      { n: "productos", x: 580, y: 130, c: C.teal, cols: [K("id_producto", "PK"), K("nombre"), K("id_categoria", "FK"), K("precio_unitario")] },
      { n: "categorias", x: 580, y: 10, c: C.violet, cols: [K("id_categoria", "PK"), K("nombre")] },
      { n: "locales", x: 20, y: 290, c: C.coral, cols: [K("id_local", "PK"), K("nombre"), K("distrito")] },
    ];
    const l = [{ a: "clientes", ia: 0, sa: "r", b: "ventas", ib: 2, sb: "l", mx: 255 }, { a: "locales", ia: 0, sa: "r", b: "ventas", ib: 4, sb: "l", mx: 255 }, { a: "productos", ia: 0, sa: "l", b: "ventas", ib: 3, sb: "r", mx: 535 }, { a: "categorias", ia: 0, sa: "r", b: "productos", ib: 2, sb: "r", mx: 792 }];
    el.innerHTML = caja(er(t, l, 820, 410), "<b>ventas</b> es la tabla central (tabla de hechos): tiene 3 claves foráneas. El amarillo «1» marca el lado de la PK; el turquesa «N», el lado de la FK.");
  };

  /* ---------- cardinalidad ---------- */
  D.cardinalidad = (el) => {
    const fila = (tit, color, izq, der, lineas, nota) => {
      let s = `<svg viewBox="0 0 520 ${Math.max(izq.length, der.length) * 38 + 20}" style="min-width:420px"><g font-family="Figtree,sans-serif" font-size="14" font-weight="700">`;
      lineas.forEach(([a, b]) => (s += `<line x1="170" y1="${a * 38 + 28}" x2="350" y2="${b * 38 + 28}" stroke="${color}" stroke-width="2.4"/>`));
      izq.forEach((t, i) => (s += `<rect x="10" y="${i * 38 + 10}" width="160" height="32" rx="9" fill="${C.panel}" stroke="${color}"/><text x="90" y="${i * 38 + 31}" text-anchor="middle" fill="${C.text}">${t}</text>`));
      der.forEach((t, i) => (s += `<rect x="350" y="${i * 38 + 10}" width="160" height="32" rx="9" fill="${C.panel}" stroke="${color}"/><text x="430" y="${i * 38 + 31}" text-anchor="middle" fill="${C.text}">${t}</text>`));
      return `<div class="card"><div class="row"><span class="chip" style="color:${color};border-color:${color}">${tit}</span><span class="muted" style="font-size:14px">${nota}</span></div><div style="overflow-x:auto">${s}</g></svg></div>`;
    };
    el.innerHTML = caja(`<div class="grid">` +
      fila("1 : 1", C.sky, ["Persona 1", "Persona 2"], ["DNI A", "DNI B"], [[0, 0], [1, 1]], "Una persona, un DNI") +
      fila("1 : N", C.teal, ["Cliente Ana", "Cliente Luis"], ["Venta 1", "Venta 2", "Venta 3"], [[0, 0], [0, 1], [1, 2]], "Un cliente, muchas ventas · la FK va en el lado N") +
      fila("N : M", C.coral, ["Pedido 1", "Pedido 2"], ["Producto A", "Producto B", "Producto C"], [[0, 0], [0, 1], [1, 1], [1, 2]], "Se rompe con una tabla intermedia (detalles_pedido)") + `</div>`);
  };

  /* ---------- orden de ejecución ---------- */
  D.ejecucion = (el) => {
    const P = [["FROM", C.sky, "Primero se elige la(s) tabla(s) y se resuelven los JOIN."], ["WHERE", C.teal, "Se descartan filas que no cumplen la condición."], ["GROUP BY", C.amber, "Se agrupan las filas restantes."], ["HAVING", C.orange, "Se descartan grupos que no cumplen (aquí sí valen SUM, COUNT…)."], ["SELECT", C.lime, "Recién ahora se calculan las columnas y alias."], ["ORDER BY", C.violet, "Se ordena el resultado (aquí sí ves los alias)."], ["LIMIT", C.pink || "#f472b6", "Por último, se corta a n filas."]];
    el.innerHTML = caja(`<div class="muted" style="font-size:13px;margin-bottom:6px">SE ESCRIBE →</div><div class="row" style="gap:6px;margin-bottom:12px">${["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"].map((x) => `<span class="pill">${x}</span>`).join("")}</div>
      <div class="muted" style="font-size:13px;margin-bottom:6px">SE EJECUTA → <span class="dim">(toca cada fase)</span></div><div class="row" style="gap:6px">${P.map((p, i) => `<button class="pill" data-i="${i}" style="border-color:${p[1]};color:${p[1]}">${i + 1} · ${p[0]}</button>`).join("")}</div>
      <div class="callout tip" style="margin-top:12px"><span class="ic">💡</span><div><b>Fase</b><span class="ej-t">Toca una fase para ver qué hace.</span></div></div>`);
    el.querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", () => { const p = P[+b.dataset.i]; el.querySelector(".ej-t").textContent = p[0] + ": " + p[2]; }));
  };

  /* ---------- JOIN interactivo ---------- */
  D.join = (el) => {
    const A = [[1, "Ana"], [2, "Luis"], [3, "Rosa"]], B = [[2, "Pedido 101"], [3, "Pedido 102"], [3, "Pedido 103"], [4, "Pedido 104"]];
    const tipos = { INNER: "INNER JOIN", LEFT: "LEFT JOIN", RIGHT: "RIGHT JOIN", FULL: "FULL OUTER JOIN" };
    const desc = { INNER: "Solo filas con pareja en A y en B.", LEFT: "Todo A; de B solo lo que coincide (sin pareja → NULL).", RIGHT: "Todo B; de A solo lo que coincide (sin pareja → NULL).", FULL: "Todo A y todo B, con o sin pareja." };
    el.innerHTML = caja(`<div class="joinpick">${Object.keys(tipos).map((k, i) => `<button class="tab ${i === 1 ? "on" : ""}" data-j="${k}">${tipos[k]}</button>`).join("")}</div>
      <div class="vsplit"><div><b class="muted">A · clientes (izquierda)</b><div class="ta"></div></div><div><b class="muted">B · pedidos (derecha)</b><div class="tb"></div></div></div>
      <svg class="venn" viewBox="0 0 260 110" style="max-width:260px;margin:10px auto 0;min-width:0"></svg>
      <div class="callout exam" style="margin:6px 0"><span class="ic">🧮</span><div><b class="jt">LEFT JOIN</b><span class="jd"></span><div class="mono" style="margin-top:6px;font-size:13px;color:#ffd878">FROM A <span class="jn">LEFT JOIN</span> B ON A.id = B.id_a</div></div></div>
      <b class="muted">Resultado</b><div class="tr"></div>`, "Amarillo = fila conservada sin pareja · Turquesa = fila con pareja · Rojo = NULL · Tenue = fila descartada.");
    const sel = (k) => {
      const filas = [], usadaB = new Set();
      A.forEach((a, ia) => { const ms = B.map((b, ib) => [b, ib]).filter(([b]) => b[0] === a[0]);
        if (ms.length) ms.forEach(([b, ib]) => { filas.push({ r: [a[0], a[1], b[0], b[1]], t: "ok" }); usadaB.add(ib); });
        else if (k === "LEFT" || k === "FULL") filas.push({ r: [a[0], a[1], null, null], t: "keep" }); });
      if (k === "RIGHT" || k === "FULL") B.forEach((b, ib) => { if (!usadaB.has(ib)) filas.push({ r: [null, null, b[0], b[1]], t: "keep" }); });
      if (k === "RIGHT") filas.sort((x, y) => (x.r[2] || 0) - (y.r[2] || 0));
      return filas;
    };
    const pinta = (k) => {
      const f = sel(k), okA = new Set(), okB = new Set(), keepA = new Set(), keepB = new Set();
      f.forEach((x) => { if (x.t === "ok") { A.forEach((a, i) => a[0] === x.r[0] && okA.add(i)); B.forEach((b, i) => b[0] === x.r[2] && b[1] === x.r[3] && okB.add(i)); }
        else { A.forEach((a, i) => x.r[0] === a[0] && keepA.add(i)); B.forEach((b, i) => x.r[2] === b[0] && b[1] === x.r[3] && keepB.add(i)); } });
      const cl = (i, ok, keep) => (ok.has(i) ? "hl" : keep.has(i) ? "keep" : "miss");
      el.querySelector(".ta").innerHTML = mt(["id_cliente", "nombre"], A, { cls: A.map((_, i) => cl(i, okA, keepA)) });
      el.querySelector(".tb").innerHTML = mt(["id_cliente", "pedido"], B, { cls: B.map((_, i) => cl(i, okB, keepB)) });
      el.querySelector(".tr").innerHTML = mt(["A.id_cliente", "A.nombre", "B.id_cliente", "B.pedido"], f.map((x) => x.r), { cls: f.map((x) => (x.t === "ok" ? "hl" : "keep")) });
      el.querySelector(".jt").textContent = tipos[k]; el.querySelector(".jn").textContent = tipos[k]; el.querySelector(".jd").textContent = desc[k];
      const fill = (a, b) => `fill="${C.teal}" fill-opacity="${a}"`;
      const left = k === "LEFT" || k === "FULL", right = k === "RIGHT" || k === "FULL";
      el.querySelector(".venn").innerHTML = `<g font-family="Figtree,sans-serif" font-weight="800" font-size="14"><circle cx="100" cy="55" r="44" ${fill(left ? 0.55 : 0.1)} stroke="${C.sky}" stroke-width="2"/><circle cx="160" cy="55" r="44" ${fill(right ? 0.55 : 0.1)} stroke="${C.amber}" stroke-width="2"/>
        <path d="M130,18 a44,44 0 0 1 0,74 a44,44 0 0 1 0,-74z" fill="${C.teal}" fill-opacity="0.95"/><text x="70" y="60" text-anchor="middle" fill="${C.text}">A</text><text x="190" y="60" text-anchor="middle" fill="${C.text}">B</text></g>`;
    };
    el.querySelectorAll("[data-j]").forEach((b) => b.addEventListener("click", () => { el.querySelectorAll("[data-j]").forEach((x) => x.classList.toggle("on", x === b)); pinta(b.dataset.j); }));
    pinta("LEFT");
  };

  /* ---------- GROUP BY paso a paso ---------- */
  D.groupby = (el) => {
    const R = [["Lima", "Web", 1200], ["Piura", "Tienda", 800], ["Lima", "Tienda", 400], ["Piura", "Web", 2500], ["Arequipa", "Web", 300], ["Lima", "Web", 1800], ["Arequipa", "Tienda", 900], ["Piura", "Web", 1500]];
    const pasos = [
      ["1 · FROM ventas", "Partimos con todas las filas de la tabla."],
      ["2 · WHERE canal = 'Web'", "WHERE descarta filas sueltas: se van las de Tienda."],
      ["3 · GROUP BY sede", "Las filas se juntan en un grupo por cada sede."],
      ["4 · HAVING SUM(monto) >= 2000", "HAVING descarta grupos: Arequipa (300) no alcanza."],
      ["5 · SELECT sede, SUM(monto)", "Se calcula el resumen de cada grupo que sobrevivió."],
    ];
    let p = 0;
    const colorSede = { Lima: C.sky, Piura: C.amber, Arequipa: C.coral };
    const dibuja = () => {
      let h = "";
      const web = R.filter((r) => r[1] === "Web");
      if (p <= 1) {
        h = `<table class="mini"><thead><tr><th>sede</th><th>canal</th><th>monto</th></tr></thead><tbody>${R.map((r) => `<tr style="${p === 1 && r[1] !== "Web" ? "opacity:.25;text-decoration:line-through" : ""}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table>`;
      } else {
        const g = {}; web.forEach((r) => (g[r[0]] = (g[r[0]] || []).concat([r[2]])));
        h = `<div class="grid g3">` + Object.keys(g).map((s) => {
          const sum = g[s].reduce((a, b) => a + b, 0), fuera = p >= 3 && sum < 2000;
          return `<div class="card" style="border-color:${colorSede[s]};${fuera ? "opacity:.25;" : ""}transition:opacity .4s"><b style="color:${colorSede[s]}">${s}</b><div class="mono muted" style="font-size:13px;margin:6px 0">${g[s].join(" + ")}</div>${p >= 4 ? `<div class="mono" style="font-size:20px;font-weight:800">${fuera ? "—" : "SUM = " + sum}</div>` : ""}${fuera ? `<div class="chip coral">descartado por HAVING</div>` : ""}</div>`;
        }).join("") + `</div>`;
      }
      el.querySelector(".gb").innerHTML = h;
      el.querySelector(".gp").innerHTML = `<b style="color:${C.amber}">${pasos[p][0]}</b><br><span class="muted">${pasos[p][1]}</span>`;
      el.querySelector("[data-prev]").disabled = p === 0; el.querySelector("[data-next]").disabled = p === pasos.length - 1;
    };
    el.innerHTML = caja(`<div class="mono" style="font-size:13px;color:#ffd878;background:#081120;border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin-bottom:10px;white-space:pre">SELECT sede, SUM(monto)\nFROM ventas\nWHERE canal = 'Web'\nGROUP BY sede\nHAVING SUM(monto) &gt;= 2000;</div>
      <div class="gb"></div><div class="gp" style="margin-top:10px"></div>
      <div class="stepper"><button class="btn sm" data-prev>◀ Atrás</button><button class="btn sm primary" data-next>Siguiente paso ▶</button></div>`);
    el.querySelector("[data-prev]").onclick = () => { p = Math.max(0, p - 1); dibuja(); };
    el.querySelector("[data-next]").onclick = () => { p = Math.min(pasos.length - 1, p + 1); dibuja(); };
    dibuja();
  };

  /* ---------- normalización paso a paso ---------- */
  D.norm = (el) => {
    const E = [
      { t: "Punto de partida: una tabla desordenada", ok: "",
        h: mt(["id_pedido", "productos", "id_cliente", "nombre_cliente", "distrito"], [[1, "Pan, Jugo", 1, "Ana Torres", "Los Olivos"], [2, "Café", 1, "Ana Torres", "Los Olivos"], [3, "Pan", 2, "Luis Ramos", "Comas"]]),
        n: "Problemas: 'Pan, Jugo' son DOS valores en una celda (no atómico) y los datos de Ana se repiten en cada pedido." },
      { t: "1FN: un valor por celda", ok: "1FN",
        h: mt(["id_pedido", "id_producto", "nombre_producto", "id_cliente", "nombre_cliente", "distrito"], [[1, 1, "Pan", 1, "Ana Torres", "Los Olivos"], [1, 2, "Jugo", 1, "Ana Torres", "Los Olivos"], [2, 3, "Café", 1, "Ana Torres", "Los Olivos"], [3, 1, "Pan", 2, "Luis Ramos", "Comas"]]),
        n: "Ahora cada celda tiene un solo valor. La clave es compuesta: (id_pedido, id_producto). Pero nombre_producto depende solo de id_producto (parte de la clave)." },
      { t: "2FN: quitar dependencias parciales", ok: "2FN",
        h: `<div class="vsplit"><div><b class="muted">detalle_pedido</b>${mt(["id_pedido", "id_producto", "id_cliente", "nombre_cliente", "distrito"], [[1, 1, 1, "Ana Torres", "Los Olivos"], [1, 2, 1, "Ana Torres", "Los Olivos"], [2, 3, 1, "Ana Torres", "Los Olivos"], [3, 1, 2, "Luis Ramos", "Comas"]])}</div><div><b class="muted">productos (nueva)</b>${mt(["id_producto", "nombre_producto"], [[1, "Pan"], [2, "Jugo"], [3, "Café"]])}</div></div>`,
        n: "nombre_producto se movió a su propia tabla: depende de TODA su clave. Aún queda: nombre_cliente y distrito dependen de id_cliente, que no es la clave (dependencia transitiva)." },
      { t: "3FN: quitar dependencias transitivas", ok: "3FN",
        h: `<div class="vsplit"><div><b class="muted">pedidos</b>${mt(["id_pedido", "id_producto", "id_cliente"], [[1, 1, 1], [1, 2, 1], [2, 3, 1], [3, 1, 2]])}<b class="muted">productos</b>${mt(["id_producto", "nombre_producto"], [[1, "Pan"], [2, "Jugo"], [3, "Café"]])}</div><div><b class="muted">clientes (nueva)</b>${mt(["id_cliente", "nombre_cliente", "distrito"], [[1, "Ana Torres", "Los Olivos"], [2, "Luis Ramos", "Comas"]])}</div></div>`,
        n: "Ahora si Ana cambia de distrito se corrige UNA fila. Cada dato vive en un solo lugar: la clave, toda la clave y nada más que la clave." },
    ];
    let p = 0;
    const dibuja = () => {
      el.querySelector(".nb").innerHTML = `<div class="row" style="margin-bottom:8px">${E.map((e, i) => `<span class="chip ${i === p ? "amber" : i < p ? "lime" : ""}">${i === 0 ? "Inicio" : e.ok}</span>`).join('<span class="dim">➜</span>')}</div><h4 style="margin-bottom:8px">${E[p].t}</h4><div style="overflow-x:auto">${E[p].h}</div><div class="callout tip" style="margin-top:12px"><span class="ic">💡</span><div>${E[p].n}</div></div>`;
      el.querySelector("[data-prev]").disabled = p === 0; el.querySelector("[data-next]").disabled = p === E.length - 1;
    };
    el.innerHTML = caja(`<div class="nb"></div><div class="stepper"><button class="btn sm" data-prev>◀ Atrás</button><button class="btn sm primary" data-next>Normalizar un paso más ▶</button></div>`);
    el.querySelector("[data-prev]").onclick = () => { p--; dibuja(); };
    el.querySelector("[data-next]").onclick = () => { p++; dibuja(); };
    dibuja();
  };

  FGD.dibujar = (id, el) => (D[id] ? D[id](el) : (el.textContent = "(diagrama " + id + ")"));
})();
