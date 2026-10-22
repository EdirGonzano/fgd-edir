// Extrae todas las consultas del contenido a JSON para validarlas con Python/sqlite3
const fs = require("fs"), vm = require("vm"), path = require("path");
const ctx = { window: {} }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ["datasets", "ref", "lecciones", "preguntas", "preguntas2"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "content", f + ".js"), "utf8"), ctx);
const out = [];
ctx.FGD.ref.forEach((r) => r.ej && out.push({ src: "ref:" + r.id, db: r.db, sql: r.ej }));
ctx.FGD.lecciones.forEach((l) => l.bloques.forEach((b, i) => b.t === "try" && out.push({ src: "lec:" + l.id + "#" + i, db: b.db, sql: b.sql })));
ctx.FGD.preguntas.forEach((q) => { if (q.type === "num" && q.code) out.push({ src: "num:" + q.id, db: q.db, sql: q.code }); if (q.type === "sql") out.push({ src: "q:" + q.id, db: q.db, sql: q.solution }); if (q.code) out.push({ src: "qcode:" + q.id, db: q.db, sql: q.code }); });
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log(out.length, "consultas;", ctx.FGD.preguntas.length, "preguntas;", ctx.FGD.ref.length, "fichas;", ctx.FGD.lecciones.length, "lecciones");
