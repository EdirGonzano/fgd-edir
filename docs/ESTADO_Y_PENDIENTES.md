# FGD-Edir — estado y pendientes

Actualizado: 2026-10-20

## Hecho
- Web completa semanas 1–4: 16 lecciones, 76 fichas de referencia, ~227 preguntas fijas + 13 generadores dinámicos (el dato y la respuesta cambian y se calculan ejecutando SQL), 12 diagramas interactivos.
- Laboratorio SQL en el navegador (sql.js) con 2 bases ficticias; ejemplos ejecutables en cada lección.
- Gamificación: XP, niveles, racha, insignias, misión diaria, repaso espaciado (cajas 1-3-7-14-30 días), cuaderno de errores, simulacro Pa1 de 45 min.
- Puente a Colab (CSV y .db en `datos/`).
- Todas las consultas del contenido validadas con sqlite3.

## Pendientes sugeridos
- Revisar con Edir el texto de cada lección frente a lo que dijo la docente; ajustar énfasis.
- Más preguntas por tema (sobre todo SQL escrito) y simulacros alternos.
- Semana 5 en adelante (pandas, limpieza, regresión, K-Means…) y notebooks `.ipynb` de práctica en `datos/`.
- Modo claro, modo "enfoque" (una pregunta a pantalla completa) y atajos de teclado en el laboratorio.
- Repaso por voz/tarjetas flash de conceptos de la semana 1.

## Lecciones aprendidas
- Si el CSS parece no actualizarse en el navegador, forzar recarga (el servidor local cachea).
- En `.app` usar `minmax(0,1fr)` y `min-width:0` en hijos de grid: evita desbordes horizontales en móvil.

## Actualización 2026-10-21
- Preguntas variadas: tipos opción múltiple, SQL escrito, ordenar, completar (fill), relacionar (match), selección múltiple, cálculo numérico (num) y preguntas "bug" (encuentra el error). Los generadores (`content/preguntas2.js`, ids `g-*`) crean variantes nuevas en cada sesión.
- Selección con variedad (`seleccionar` en `js/app.js`): evita lo visto en las últimas ~40 preguntas, alterna temas y tipos, prioriza vencidas y no vistas.
- Paleta ampliada (13 acentos) con color por categoría/tema (`--c`, clase `.tone`).
- Resumen personal de labs S3–S4: `FGD_resumen_labs_S3_S4.md` (no se sube a GitHub: está en .gitignore).
- Probar una pregunta suelta: `#/practica/q:3-54,g-wh`.
- Aprendizaje al escribir JS desde Python: cuidar que `\n` dentro de cadenas se escriba como barra invertida + n (chr(92)+'n'); mejor usar la herramienta Edit/Write.
