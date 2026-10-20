# FGD-Edir

Plataforma web personal de Edir para estudiar **Fundamentos de Gestión de Datos** (Big Data y Ciencia de Datos). HTML/CSS/JS puro, sin build, publicada en GitHub Pages. Hoy cubre semanas 1–4 (examen Pa1); debe crecer a las 16 semanas y a otros cursos.

## Reglas del proyecto
- Responder en español, breve. Edir es principiante en programación: explicar con claridad.
- No mencionar institución ni docentes en la web ni en el repositorio (solo "Edir" si hace falta). No subir PPT, PDF, libros ni el .zip: el contenido es **propio y mejorado**.
- Los datos son 100 % ficticios (Chasqui Tech, Café Yaku). Nunca datos reales de estudiantes ni de ninguna institución.
- No construir, mover ni borrar nada grande sin aprobación de Edir; primero planificar.
- Diseño: paleta propia "cuaderno nocturno" (azul noche con puntos, crema, ámbar/turquesa/coral). Nada de morado/degradado típico de IA. Skills de diseño en `.claude/skills/` (emil-design-eng, mobile-native, break-ui, find-animation-opportunities).

## Estructura
- `index.html` carga todo con `<script>` clásicos (funciona también con doble clic, salvo sql.js que viene de CDN).
- `content/` — **aquí se agrega material**: `ref.js` (fichas de comandos), `lecciones.js` (semanas y lecciones con bloques), `preguntas.js` (banco: M opción múltiple, S SQL, O ordenar), `datasets.js` (GENERADO).
- `js/` — `app.js` (router y vistas), `store.js` (XP, racha, repaso espaciado Leitner, insignias; localStorage), `sqlrunner.js` (sql.js), `diagrams.js` (diagramas interactivos).
- `datos/` — CSV y .db para Colab (GENERADOS).
- `scripts/generar_datos.py` regenera `datos/` y `content/datasets.js` (semilla fija). `scripts/extraer_sql.js` + validar con Python comprueba que toda consulta del contenido corre.

## Cómo agregar una semana nueva
1. Añadir la semana en `FGD.semanas` y sus lecciones en `FGD.lecciones` (`content/lecciones.js`).
2. Añadir fichas en `ref.js` y preguntas en `preguntas.js` (ids `"5-01"`…; campo `sem`).
3. Si hace falta otra base de datos, agregarla en `generar_datos.py` y correrlo.
4. Validar: `node scripts/extraer_sql.js salida.json` y ejecutar cada consulta con sqlite3.

## Ejecutar local
`python -m http.server 8791` dentro de esta carpeta y abrir http://127.0.0.1:8791 (si el navegador no recarga el CSS, forzar recarga).

## Estado
Ver `docs/ESTADO_Y_PENDIENTES.md`.
