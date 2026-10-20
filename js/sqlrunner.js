/* Motor SQL en el navegador (sql.js = SQLite compilado a WebAssembly) + utilidades de código/tablas. */
window.FGD = window.FGD || {};
(function () {
  const CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/";
  let SQLp = null; const dbs = {};
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function motor() {
    if (!SQLp) SQLp = window.initSqlJs({ locateFile: (f) => CDN + f });
    return SQLp;
  }
  async function db(nombre) {
    if (dbs[nombre]) return dbs[nombre];
    const SQL = await motor(); const d = new SQL.Database(); const ds = FGD.datasets[nombre];
    d.exec(ds.ddl); d.exec(ds.datos); dbs[nombre] = d; return d;
  }
  async function reiniciar(nombre) { delete dbs[nombre]; return db(nombre); }
  // ejecuta una o varias sentencias; devuelve el resultado de la última que produzca filas
  async function correr(nombre, sql, copia) {
    let d = await db(nombre);
    try {
      if (copia) { const SQL = await motor(); const c = new SQL.Database(d.export()); try { return empaquetar(c.exec(sql), c); } finally { c.close(); } }
      return empaquetar(d.exec(sql), d);
    } catch (e) { return { error: String(e.message || e) }; }
  }
  function empaquetar(res, d) {
    if (!res.length) { const n = d.getRowsModified(); return { cols: [], rows: [], msg: "Listo. Filas afectadas: " + n }; }
    const r = res[res.length - 1]; return { cols: r.columns, rows: r.values };
  }
  // compara resultados (como conjuntos; con orden estricto si ordenado=true)
  const norm = (v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v);
  const firma = (rows) => rows.map((r) => JSON.stringify(r.map(norm)));
  function iguales(a, b, ordenado) {
    if (a.error || b.error) return false;
    if (a.cols.length !== b.cols.length || a.rows.length !== b.rows.length) return false;
    const fa = firma(a.rows), fb = firma(b.rows);
    if (!ordenado) { fa.sort(); fb.sort(); }
    return fa.every((x, i) => x === fb[i]);
  }
  function tabla(res, maxf) {
    if (res.error) return `<div class="errbox">⚠ ${esc(res.error)}</div>`;
    if (res.msg) return `<div class="okbox">${esc(res.msg)}</div>`;
    const lim = maxf || 200, filas = res.rows.slice(0, lim);
    return `<div class="res"><table><thead><tr>${res.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>` +
      filas.map((r) => "<tr>" + r.map((v) => (v === null ? `<td class="null">NULL</td>` : `<td>${esc(v)}</td>`)).join("") + "</tr>").join("") +
      `</tbody></table></div><div class="muted" style="font-size:13px;margin-top:6px">${res.rows.length} fila(s)${res.rows.length > lim ? " · mostrando " + lim : ""}</div>`;
  }
  // resaltado de sintaxis SQL / Python sencillo
  const KW = "SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|DISTINCT|AS|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|USING|UNION|ALL|CREATE|TABLE|VIEW|INSERT|INTO|VALUES|UPDATE|SET|DELETE|DROP|PRIMARY KEY|FOREIGN KEY|REFERENCES|DEFAULT|CHECK|UNIQUE|CASE|WHEN|THEN|ELSE|END|ASC|DESC|EXISTS|INTEGER|TEXT|REAL|NUMERIC|BLOB|VARCHAR|COMMIT|ROLLBACK|BEGIN|GRANT|REVOKE|import|from|def|return|for|in|print|as";
  const reKW = new RegExp("\\b(" + KW + ")\\b", "gi");
  function resaltar(src) {
    const toks = []; const L = "abcdefghij";
    const guard = (h) => "\u0001" + String(toks.push(h) - 1).replace(/\d/g, (d) => L[d]) + "\u0002";
    let s = esc(src);
    s = s.replace(/(--[^\n]*|#[^\n]*)/g, (m) => guard(`<span class="cm">${m}</span>`));
    s = s.replace(/('(?:[^']|'')*'|"(?:[^"\\]|\\.)*")/g, (m) => guard(`<span class="st">${m}</span>`));
    s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="nu">$1</span>');
    s = s.replace(/\b([A-Za-z_][A-Za-z0-9_.]*)\(/g, '<span class="fn">$1</span>(');
    s = s.replace(reKW, (m) => (/^(import|from|def|return|for|in|print|as)$/i.test(m) && m !== m.toLowerCase() ? m : `<span class="kw">${m}</span>`));
    return s.replace(/\u0001([a-j]+)\u0002/g, (_, i) => toks[+i.replace(/./g, (c) => L.indexOf(c))]);
  }
  function bloque(src, titulo, extra) {
    return `<div class="code"><div class="bar2"><span>${esc(titulo || "")}</span><span class="sp"></span>${extra || ""}<button class="btn sm" data-copy>Copiar</button></div><pre><code>${resaltar(src)}</code></pre></div>`;
  }
  FGD.sql = { db, correr, reiniciar, iguales, tabla, resaltar, bloque, esc };
})();
