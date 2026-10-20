# FGD-Edir — estado y pendientes

Actualizado: 2026-10-20

## Hecho
- Web completa semanas 1–4: 16 lecciones, 67 fichas de referencia, 130 preguntas (opción múltiple, ordenar, escribir SQL), 12 diagramas interactivos.
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
