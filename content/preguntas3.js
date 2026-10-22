/* Preguntas de los complementos de SQL (funciones, NULL, CASE, autounión, EXISTS/CTE, ventanas, diseño, DDL, DML,
   transacciones, Python) + generadores dinámicos. Se suma a FGD.preguntas. */
window.FGD = window.FGD || {};
(function () {
  const Q = FGD.preguntas;
  const M = (id, sem, topic, q, opts, a, why, code, db) => Q.push({ id, sem, topic, type: "mcq", q, opts, a, why, code, db });
  const S = (id, sem, topic, q, db, solution, hint, why, ordered) => Q.push({ id, sem, topic, type: "sql", q, db, solution, hint, why, ordered: !!ordered });
  const N = (id, sem, topic, q, db, code, calc, why, round) => Q.push({ id, sem, topic, type: "num", q, db, code, calc, why, round });
  const F = (id, sem, topic, q, code, blanks, extra, why) => Q.push({ id, sem, topic, type: "fill", q, code, blanks, extra, why });
  const X = (id, sem, topic, q, pairs, why) => Q.push({ id, sem, topic, type: "match", q, pairs, why });
  const U = (id, sem, topic, q, opts, a, why) => Q.push({ id, sem, topic, type: "multi", q, opts, a, why });

  /* ============ Funciones de texto, número y fecha (sem 2) ============ */
  N("c2-01", 2, "funcion", "¿Qué número devuelve?", "andes", "SELECT LENGTH('Cusco');", "cell", "LENGTH cuenta caracteres.");
  N("c2-02", 2, "funcion", "¿Qué número devuelve? (recuerda: la primera posición es la 1)", "andes", "SELECT INSTR('correo@andes.pe', '@');", "cell", "INSTR da la posición del primer @.");
  M("c2-03", 2, "funcion", "¿Qué devuelve esta consulta?", ["Cus", "usc", "Cusc", "sco"], 0, "SUBSTR(texto, inicio, largo): empieza en la posición 1 y toma 3 caracteres.", "SELECT SUBSTR('Cusco', 1, 3);", "andes");
  M("c2-04", 2, "funcion", "¿Qué devuelve?", ["Ana Paz", "AnaPaz", "Ana, Paz", "NULL"], 0, "|| une textos; aquí se agregó un espacio entre ambos.", "SELECT 'Ana' || ' ' || 'Paz';", "andes");
  M("c2-05", 2, "nulo", "¿Qué devuelve?", ["NULL", "Ana", "Ana ", "Error"], 0, "Si una parte de la concatenación es NULL, todo el resultado es NULL.", "SELECT 'Ana' || NULL;", "andes");
  N("c2-06", 2, "funcion", "¿Qué número devuelve?", "andes", "SELECT CAST('15' AS INTEGER) + 5;", "cell", "CAST convierte el texto en número para poder sumar.");
  M("c2-07", 2, "funcion", "¿Por qué conviene guardar las fechas como AAAA-MM-DD?", ["Porque se ordenan y comparan bien como texto", "Porque SQLite exige ese formato siempre", "Porque ocupa menos espacio", "Porque así no se pueden borrar"], 0, "El formato ISO ordena cronológicamente aun siendo texto.");
  N("c2-08", 2, "funcion", "¿Cuántos empleados ingresaron en 2023?", "andes", "SELECT COUNT(*) FROM empleados WHERE strftime('%Y', fecha_ingreso) = '2023';", "cell", "strftime('%Y', fecha) extrae el año como texto.");
  N("c2-09", 2, "funcion", "¿Cuántas ventas se hicieron en abril de 2026?", "andes", "SELECT COUNT(*) FROM ventas WHERE strftime('%Y-%m', fecha) = '2026-04';", "cell", "'%Y-%m' deja año y mes.");
  M("c2-10", 2, "funcion", "Para dividir sin perder decimales entre dos enteros se escribe…", ["100.0 * parte / total", "100 * parte / total", "parte // total", "ROUND(parte / total)"], 0, "Con un decimal en la operación, SQLite hace división real; con enteros haría división entera.");
  X("c2-11", 2, "funcion", "Relaciona cada función con su resultado:", [["UPPER('lima')", "LIMA"], ["LENGTH('lima')", "4"], ["REPLACE('a-b', '-', '/')", "a/b"], ["TRIM('  hola ')", "hola"]], "Funciones de texto básicas.");
  F("c2-12", 2, "funcion", "Completa para obtener el dominio del correo (lo que sigue al @):", "SELECT ___(correo, ___(correo, '@') + 1)\nFROM empleados;", ["SUBSTR", "INSTR"], ["LENGTH", "REPLACE"], "INSTR encuentra el @ y SUBSTR corta desde la posición siguiente.");
  M("c2-13", 2, "bug", "Un ordenamiento por fecha sale desordenado. ¿Cuál es la causa más probable?", ["Las fechas se guardaron como '21/10/2026' (no ISO)", "Falta DISTINCT", "El WHERE está mal", "Falta un JOIN"], 0, "En formato DD/MM/AAAA el orden alfabético no coincide con el cronológico.");

  /* ============ NULL (sem 2) ============ */
  N("c2-14", 2, "nulo", "¿Qué número devuelve?", "andes", "SELECT COUNT(*) - COUNT(correo) FROM empleados;", "cell", "Filas menos valores no nulos = cantidad de NULL.");
  M("c2-15", 2, "nulo", "¿Qué devuelve COALESCE(NULL, NULL, 7, 9)?", ["7", "9", "NULL", "16"], 0, "COALESCE entrega el primer valor que no es NULL.");
  M("c2-16", 2, "nulo", "¿Para qué sirve x / NULLIF(y, 0)?", ["Evitar la división entre cero", "Redondear", "Convertir NULL en 0", "Ordenar"], 0, "NULLIF devuelve NULL si y vale 0, y x / NULL da NULL en vez de error.");
  M("c2-17", 2, "nulo", "Una columna tiene los valores 10, NULL, 20. ¿Cuánto da AVG(col)?", ["15", "10", "30", "NULL"], 0, "AVG ignora el NULL: (10 + 20) / 2.");
  M("c2-18", 2, "nulo", "WHERE ciudad <> 'Lima' ¿incluye las filas con ciudad NULL?", ["No: NULL <> 'Lima' es desconocido", "Sí: NULL es distinto de Lima", "Solo si hay ORDER BY", "Depende del motor"], 0, "WHERE solo deja pasar lo verdadero; NULL <> 'Lima' es desconocido.");
  M("c2-19", 2, "nulo", "NULL OR TRUE da…", ["TRUE", "FALSE", "NULL", "Error"], 0, "Si una parte del OR es verdadera, el resultado es verdadero.");
  M("c2-20", 2, "nulo", "NULL AND FALSE da…", ["FALSE", "TRUE", "NULL", "Error"], 0, "Si una parte del AND es falsa, el resultado es falso.");
  N("c2-21", 2, "nulo", "¿Cuántas filas devuelve? (cuenta bien los NULL)", "andes", "SELECT * FROM empleados WHERE correo IS NULL OR id_jefe IS NULL;", "rows", "Se suman las filas con correo NULL y las que no tienen jefe.");
  S("c2-22", 2, "nulo", "Muestra el nombre de cada empleado y su id_jefe, mostrando 0 cuando no tenga jefe (usa IFNULL o COALESCE).", "andes", "SELECT nombre, COALESCE(id_jefe, 0) FROM empleados;", "COALESCE(id_jefe, 0)", "COALESCE reemplaza el NULL por 0.");

  /* ============ CASE y agregación condicional (sem 3) ============ */
  N("c3-01", 3, "case", "¿Cuántos empleados quedan con nivel 'Dirección' (sueldo >= 5000)?", "andes", "SELECT COUNT(*) FROM (SELECT CASE WHEN sueldo >= 5000 THEN 'Dirección' WHEN sueldo >= 3500 THEN 'Senior' ELSE 'Base' END AS nivel FROM empleados) WHERE nivel = 'Dirección';", "cell", "CASE se evalúa en orden y se queda con la primera condición verdadera.");
  M("c3-02", 3, "case", "En un CASE sin ELSE, las filas que no cumplen ninguna condición devuelven…", ["NULL", "0", "Cadena vacía", "Error"], 0, "Sin ELSE, el valor por omisión es NULL.");
  M("c3-03", 3, "case", "¿Qué calcula SUM(CASE WHEN canal = 'Web' THEN 1 ELSE 0 END)?", ["La cantidad de ventas Web", "La suma de montos Web", "La cantidad de canales", "El promedio de ventas"], 0, "Suma 1 por cada fila Web: equivale a contarlas.", "SELECT sede, SUM(CASE WHEN canal = 'Web' THEN 1 ELSE 0 END) FROM ventas GROUP BY sede;", "chasqui");
  F("c3-04", 3, "case", "Completa el CASE:", "SELECT nombre,\n  ___ WHEN sueldo >= 5000 THEN 'Alto'\n       WHEN sueldo >= 3500 THEN 'Medio'\n       ___ 'Bajo'\n  ___ AS nivel\nFROM empleados;", ["CASE", "ELSE", "END"], ["IF", "THEN"], "CASE … WHEN … THEN … ELSE … END.");
  N("c3-05", 3, "case", "¿Cuántas filas devuelve? (una por departamento)", "andes", "SELECT id_depto, SUM(CASE WHEN ciudad = 'Cusco' THEN 1 ELSE 0 END) AS en_cusco FROM empleados GROUP BY id_depto;", "rows", "GROUP BY deja una fila por departamento.");
  M("c3-06", 3, "case", "¿Por qué se escribe 100.0 * … y no 100 * … al calcular porcentajes?", ["Con enteros SQLite haría división entera y perdería decimales", "Porque 100 no es válido", "Porque así ordena mejor", "Para que sea más rápido"], 0, "Un decimal fuerza la división real.");

  /* ============ JOIN adicionales (sem 3) ============ */
  M("c3-07", 3, "join", "¿Qué hace esta consulta?", ["Lista a cada empleado con el nombre de su jefe", "Lista a cada jefe con sus ventas", "Une empleados con departamentos", "Calcula el promedio por jefe"], 0, "Es una autounión: empleados se usa dos veces (e = empleado, j = jefe).", "SELECT e.nombre, j.nombre AS jefe\nFROM empleados e\nLEFT JOIN empleados j ON e.id_jefe = j.id_emp;", "andes");
  N("c3-08", 3, "join", "¿Cuántas filas devuelve esta autounión (LEFT JOIN)?", "andes", "SELECT e.nombre, j.nombre FROM empleados e\nLEFT JOIN empleados j ON e.id_jefe = j.id_emp;", "rows", "LEFT JOIN conserva todos los empleados, incluso los que no tienen jefe.");
  N("c3-09", 3, "join", "¿Cuántas filas devuelve esta autounión (INNER JOIN)?", "andes", "SELECT e.nombre, j.nombre FROM empleados e\nINNER JOIN empleados j ON e.id_jefe = j.id_emp;", "rows", "Los 4 que no tienen jefe se descartan.");
  N("c3-10", 3, "join", "¿Cuántas filas devuelve este CROSS JOIN?", "andes", "SELECT d.nombre, p.nombre FROM departamentos d CROSS JOIN proyectos p;", "rows", "5 departamentos × 6 proyectos.");
  M("c3-11", 3, "join", "En un LEFT JOIN, ¿qué diferencia hay entre poner la condición p.estado = 'En curso' en el ON o en el WHERE?", ["En el ON se conservan todas las filas de A; en el WHERE se descartan las que no tienen pareja", "Ninguna", "En el WHERE es más rápido y da lo mismo", "En el ON da error"], 0, "El WHERE filtra después del JOIN y elimina las filas con NULL, convirtiéndolo en un INNER JOIN.");
  N("c3-12", 3, "join", "¿Qué número devuelve? (departamentos con proyectos EN CURSO, filtro en el WHERE)", "andes", "SELECT COUNT(*) FROM (SELECT d.id_depto FROM departamentos d LEFT JOIN proyectos p ON d.id_depto = p.id_depto WHERE p.estado = 'En curso' GROUP BY d.id_depto);", "cell", "El WHERE descarta a los departamentos sin proyectos en curso.");
  N("c3-13", 3, "join", "¿Qué número devuelve? (el mismo conteo, pero con el filtro en el ON)", "andes", "SELECT COUNT(*) FROM (SELECT d.id_depto FROM departamentos d LEFT JOIN proyectos p ON d.id_depto = p.id_depto AND p.estado = 'En curso' GROUP BY d.id_depto);", "cell", "Con el filtro en el ON se conservan los 5 departamentos.");
  M("c3-14", 3, "join", "JOIN … USING (id_depto) requiere que…", ["La columna se llame igual en ambas tablas", "Haya una FK declarada", "Las tablas tengan el mismo número de columnas", "Se use LEFT JOIN"], 0, "USING es un atajo para columnas con el mismo nombre.");
  M("c3-15", 3, "join", "Un total de ventas sale mucho más grande de lo real después de unir con una tabla 1:N. ¿Qué pasó?", ["El JOIN repitió filas antes de sumar", "Falta ORDER BY", "SUM no sirve con JOIN", "Falta DISTINCT en el SELECT"], 0, "Cada fila del lado 1 se repite por cada fila del lado N; hay que sumar antes de unir o contar bien.");

  /* ============ Subconsultas, EXISTS, CTE, conjuntos (sem 3) ============ */
  N("c3-16", 3, "sub", "¿Cuántos empleados ganan más que el promedio de SU departamento?", "andes", "SELECT COUNT(*) FROM empleados e WHERE sueldo > (SELECT AVG(sueldo) FROM empleados WHERE id_depto = e.id_depto);", "cell", "Subconsulta correlacionada: se recalcula por cada empleado.");
  M("c3-17", 3, "sub", "¿Qué distingue a una subconsulta correlacionada?", ["Usa columnas de la consulta externa y se evalúa por cada fila", "Es siempre más rápida", "No puede tener WHERE", "Solo funciona con UNION"], 0, "Depende de la fila externa.");
  N("c3-18", 3, "sub", "¿Cuántas filas devuelve? (departamentos sin empleados)", "andes", "SELECT d.nombre FROM departamentos d WHERE NOT EXISTS (SELECT 1 FROM empleados e WHERE e.id_depto = d.id_depto);", "rows", "NOT EXISTS aísla los que no tienen filas relacionadas.");
  M("c3-19", 3, "sub", "¿Cuál es la ventaja de NOT EXISTS sobre NOT IN?", ["No se rompe cuando hay NULL en la lista", "Es el único que existe en SQLite", "Devuelve más filas", "Permite usar GROUP BY"], 0, "NOT IN con un NULL en la lista no devuelve filas.");
  M("c3-20", 3, "sub", "Una CTE (WITH nombre AS …) sirve principalmente para…", ["Dar nombre a un resultado intermedio y hacer la consulta legible", "Guardar datos permanentemente", "Crear índices", "Cambiar permisos"], 0, "No almacena datos: se recalcula en esa consulta.");
  N("c3-21", 3, "sub", "¿Cuántas filas devuelve? (departamentos sin ningún proyecto)", "andes", "SELECT id_depto FROM departamentos EXCEPT SELECT id_depto FROM proyectos;", "rows", "EXCEPT resta el segundo conjunto del primero.");
  N("c3-22", 3, "sub", "¿Cuántas filas devuelve? (INTERSECT)", "andes", "SELECT id_emp FROM ventas INTERSECT SELECT id_emp FROM empleados WHERE ciudad = 'Lima';", "rows", "Solo quienes están en ambos: venden y viven en Lima.");
  X("c3-23", 3, "sub", "Relaciona cada operador de conjuntos con lo que devuelve:", [["UNION", "Todo de ambas, sin repetidos"], ["UNION ALL", "Todo de ambas, con repetidos"], ["INTERSECT", "Solo lo que está en ambas"], ["EXCEPT", "Lo de la primera que no está en la segunda"]], "Operadores sobre conjuntos de filas.");
  S("c3-24", 3, "sub", "Con una CTE llamada t que calcule el total vendido por id_emp, muestra los id_emp con total mayor a 5000.", "andes", "WITH t AS (SELECT id_emp, SUM(monto) AS total FROM ventas GROUP BY id_emp) SELECT id_emp, total FROM t WHERE total > 5000;", "WITH t AS (…) SELECT … FROM t WHERE total > 5000", "La CTE agrupa y la consulta final filtra.");

  /* ============ Funciones de ventana (sem 3) ============ */
  M("c3-25", 3, "ventana", "¿Qué diferencia hay entre GROUP BY y una función de ventana?", ["GROUP BY colapsa filas; la ventana mantiene todas las filas y agrega un cálculo", "Ninguna", "La ventana solo funciona con texto", "GROUP BY mantiene todas las filas"], 0, "La ventana calcula sobre un grupo sin colapsar.");
  M("c3-26", 3, "ventana", "RANK() con dos empleados empatados en el puesto 1 asigna al siguiente el puesto…", ["3", "2", "1", "NULL"], 0, "RANK salta números tras un empate (1, 1, 3). DENSE_RANK daría 2.");
  M("c3-27", 3, "ventana", "¿Qué función usarías para obtener los 2 mejor pagados de cada departamento?", ["ROW_NUMBER() OVER (PARTITION BY id_depto ORDER BY sueldo DESC) y filtrar n <= 2", "COUNT(*) con GROUP BY", "LAG()", "DISTINCT"], 0, "Numeras dentro de cada departamento y filtras en una consulta externa.");
  N("c3-28", 3, "ventana", "¿Qué puesto (RANK por sueldo, de mayor a menor) tiene el empleado 8?", "andes", "SELECT puesto FROM (SELECT id_emp, RANK() OVER (ORDER BY sueldo DESC) AS puesto FROM empleados) WHERE id_emp = 8;", "cell", "Hay que ordenar a todos por sueldo descendente y ver en qué lugar queda.");
  N("c3-29", 3, "ventana", "¿Cuál es el acumulado de la venta 5 (orden fecha, id_venta)?", "andes", "SELECT acumulado FROM (SELECT id_venta, SUM(monto) OVER (ORDER BY fecha, id_venta) AS acumulado FROM ventas) WHERE id_venta = 5;", "cell", "SUM() OVER (ORDER BY …) acumula desde la primera fila hasta la actual.");
  M("c3-30", 3, "ventana", "LAG(ingreso) en la primera fila de un conjunto devuelve…", ["NULL", "0", "El mismo ingreso", "Error"], 0, "No hay fila anterior.");
  M("c3-31", 3, "ventana", "¿Se puede filtrar el resultado de una función de ventana directamente con WHERE?", ["No: hay que envolver la consulta y filtrar afuera", "Sí, siempre", "Solo con HAVING", "Solo en SQLite"], 0, "WHERE se ejecuta antes de calcular las ventanas.");
  F("c3-32", 3, "ventana", "Completa el ranking por departamento:", "SELECT nombre, id_depto,\n  ROW_NUMBER() ___ (___ BY id_depto ORDER BY sueldo DESC) AS n\nFROM empleados;", ["OVER", "PARTITION"], ["GROUP", "WHERE"], "OVER (PARTITION BY … ORDER BY …).");
  S("c3-33", 3, "ventana", "Muestra id_venta, monto y el porcentaje (con 1 decimal) que cada venta representa del total, usando SUM() OVER ().", "andes", "SELECT id_venta, monto, ROUND(100.0 * monto / SUM(monto) OVER (), 1) FROM ventas;", "100.0 * monto / SUM(monto) OVER ()", "SUM() OVER () da el total sin colapsar filas.");

  /* ============ Método y depuración (sem 3) ============ */
  O("c3-34");
  function O(id) { Q.push({ id, sem: 3, topic: "metodo", type: "order", q: "Ordena el método de resolución de una consulta:", items: ["Entender qué se pide", "Ubicar las tablas con los datos", "Unir con JOIN", "Filtrar y agrupar", "Presentar y revisar el resultado"], why: "Entender → Ubicar → Unir → Filtrar/Agrupar → Presentar." }); }
  M("c3-35", 3, "metodo", "Esperabas 17 clientes y salen 1008 filas. ¿Qué revisas primero?", ["Que el JOIN tenga su condición ON", "Que exista ORDER BY", "El tipo de dato de la fecha", "El nombre de la base"], 0, "Un JOIN sin ON produce el producto cartesiano.");
  M("c3-36", 3, "metodo", "Los clientes sin pedidos muestran 1 en vez de 0 con COUNT(*). ¿Cómo se corrige?", ["COUNT(p.id_pedido) con la columna de la tabla derecha", "Cambiar a INNER JOIN", "Usar SUM", "Agregar DISTINCT"], 0, "COUNT(*) cuenta la fila vacía que genera el LEFT JOIN.");

  /* ============ Diseño y DDL (sem 4) ============ */
  X("c4-01", 4, "claves", "Relaciona cada tipo de clave con su descripción:", [["Clave primaria", "La candidata elegida para identificar cada fila"], ["Clave foránea", "Apunta a la clave primaria de otra tabla"], ["Clave compuesta", "Formada por dos o más columnas"], ["Clave sustituta", "Número artificial creado solo para identificar"]], "Distintos roles de las claves.");
  M("c4-02", 4, "claves", "¿Por qué suele preferirse una clave sustituta (id) en lugar de usar el nombre o el DNI como PK?", ["Las claves naturales pueden cambiar o repetirse por errores", "Porque SQLite lo exige", "Porque ocupan menos memoria siempre", "Porque son más fáciles de leer"], 0, "La natural se protege con UNIQUE; la PK sustituta no cambia.");
  M("c4-03", 4, "diseno", "¿Cuál es la secuencia de niveles de diseño?", ["Conceptual → lógico → físico", "Físico → lógico → conceptual", "Lógico → conceptual → físico", "Conceptual → físico → lógico"], 0, "De las entidades del negocio al SQL concreto.");
  M("c4-04", 4, "diseno", "Con ON DELETE CASCADE, al borrar un cliente…", ["Se borran también sus pedidos", "Se impide el borrado", "Los pedidos quedan con FK NULL", "No pasa nada"], 0, "CASCADE propaga el borrado a las filas hijas.");
  M("c4-05", 4, "diseno", "ON DELETE RESTRICT (por defecto) significa que…", ["No se puede borrar el padre si tiene hijas", "Se borran las hijas", "Se ponen en NULL", "Se ignora la FK"], 0, "Protege la integridad referencial.");
  M("c4-06", 4, "diseno", "Guardar «tel1, tel2, tel3» como columnas viola…", ["La 1FN (grupos repetidos)", "La 2FN", "La 3FN", "Nada"], 0, "Mejor una tabla telefonos(id_cliente, numero).");
  M("c4-07", 4, "diseno", "¿Cuándo SÍ conviene guardar el precio en la línea de venta aunque exista en productos?", ["Para conservar el precio aplicado en ese momento", "Nunca", "Solo si hay pocos productos", "Siempre que sea REAL"], 0, "El precio del producto puede cambiar; la venta histórica no.");
  M("c4-08", 4, "diseno", "La forma normal de Boyce-Codd (BCNF) exige que…", ["Todo determinante sea una clave candidata", "No haya claves foráneas", "Todas las tablas tengan PK compuesta", "No existan NULL"], 0, "Es una 3FN más estricta.");
  U("c4-09", 4, "diseno", "Marca los errores de diseño:", ["Guardar una lista en una celda", "Usar el nombre como clave primaria", "Declarar la FK en el lado N", "Repetir el nombre del cliente en cada venta"], [0, 1, 3], "Declarar la FK en el lado N es lo correcto.");
  M("c4-10", 4, "diseno", "Un conductor maneja un solo bus y cada bus tiene un solo conductor. En la tabla de asignaciones, ¿cómo lo aseguras?", ["UNIQUE en id_conductor y en id_bus", "Una PK compuesta en ambas", "Quitando las FK", "CHECK(id_bus > 0)"], 0, "UNIQUE en cada FK convierte la relación en 1:1.");
  S("c4-11", 4, "ddl", "Agrega a la tabla departamentos una columna presupuesto de tipo REAL y luego muestra la tabla.", "andes", "ALTER TABLE departamentos ADD COLUMN presupuesto REAL; SELECT * FROM departamentos;", "ALTER TABLE … ADD COLUMN … REAL", "ALTER TABLE ADD COLUMN deja NULL en las filas existentes.");
  M("c4-12", 4, "ddl", "¿Qué hace CREATE INDEX idx_ciudad ON clientes (ciudad)?", ["Acelera las búsquedas y ordenamientos por ciudad", "Crea una nueva tabla", "Borra los duplicados", "Cambia la clave primaria"], 0, "Un índice evita recorrer toda la tabla.");
  M("c4-13", 4, "ddl", "EXPLAIN QUERY PLAN muestra «SCAN clientes». Eso significa que…", ["Recorre toda la tabla (probablemente falta un índice)", "Usa un índice", "La consulta tiene error", "La tabla está vacía"], 0, "SEARCH … USING INDEX sería la versión eficiente.");
  M("c4-14", 4, "ddl", "¿Qué defiende un CHECK (edad BETWEEN 0 AND 120)?", ["La calidad del dato desde la propia base", "El rendimiento", "La FK", "El orden de las filas"], 0, "Rechaza valores fuera de la regla en cada INSERT/UPDATE.");
  M("c4-15", 4, "ddl", "¿Qué hace DROP TABLE IF EXISTS temporal?", ["Elimina la tabla si existe, sin dar error si no existe", "Solo vacía la tabla", "Renombra la tabla", "Copia la tabla"], 0, "DROP elimina estructura y datos.");
  M("c4-16", 4, "ddl", "Una vista (VIEW)…", ["Guarda la consulta, no los datos", "Guarda una copia de los datos", "Es un tipo de índice", "Es una transacción"], 0, "Cada consulta a la vista recalcula con los datos actuales.");
  F("c4-17", 4, "ddl", "Completa la tabla con restricciones:", "CREATE TABLE contactos (\n  id_contacto INTEGER ___ KEY,\n  correo TEXT ___,\n  pais TEXT ___ 'Perú',\n  edad INTEGER ___ (edad BETWEEN 0 AND 120)\n);", ["PRIMARY", "UNIQUE", "DEFAULT", "CHECK"], ["NOT", "FOREIGN"], "PRIMARY KEY, UNIQUE, DEFAULT y CHECK.");

  /* ============ DML, transacciones, permisos, seguridad (sem 4/9) ============ */
  M("c4-18", 4, "dml", "UPSERT (INSERT … ON CONFLICT DO UPDATE) sirve para…", ["Insertar y, si ya existe, actualizar", "Borrar y volver a crear", "Copiar una tabla", "Crear un índice"], 0, "Evita el error de clave duplicada.");
  M("c4-19", 4, "dml", "INSERT INTO destino SELECT * FROM origen WHERE …; ¿qué hace?", ["Copia a destino las filas que cumplen la condición", "Crea la tabla destino", "Borra origen", "Une las dos tablas"], 0, "Es la base de los procesos ETL.");
  N("c4-20", 4, "dml", "¿Cuántas ventas quedan tras ejecutar esto?", "andes", "DELETE FROM ventas WHERE monto < 400;\nSELECT COUNT(*) FROM ventas;", "cell", "DELETE quita las ventas menores a 400.");
  N("c4-21", 4, "dml", "¿Qué sueldo tiene el empleado 3 tras esta transacción?", "andes", "BEGIN;\nUPDATE empleados SET sueldo = sueldo - 500 WHERE id_emp = 3;\nROLLBACK;\nSELECT sueldo FROM empleados WHERE id_emp = 3;", "cell", "ROLLBACK deshace el UPDATE: el sueldo sigue igual.");
  N("c4-22", 4, "dml", "¿Qué sueldo tiene el empleado 3 tras esta transacción?", "andes", "BEGIN;\nUPDATE empleados SET sueldo = sueldo - 500 WHERE id_emp = 3;\nCOMMIT;\nSELECT sueldo FROM empleados WHERE id_emp = 3;", "cell", "COMMIT confirma el cambio.");
  M("c4-23", 4, "dml", "La propiedad ACID de «atomicidad» significa…", ["Todo o nada", "Los datos se cifran", "Las transacciones son rápidas", "Se guardan copias"], 0, "Una transacción se completa entera o no se aplica.");
  M("c4-24", 4, "dml", "La «durabilidad» garantiza que…", ["Lo confirmado con COMMIT no se pierde", "Las tablas nunca se borran", "Las consultas son rápidas", "Los índices se actualizan"], 0, "Sobrevive incluso a una falla.");
  M("c4-25", 4, "dml", "GRANT SELECT ON ventas TO analista; es una sentencia…", ["DCL", "DDL", "DML", "DQL"], 0, "Controla permisos; SQLite no la implementa.");
  M("c4-26", 4, "dml", "El principio de mínimo privilegio dice que…", ["Cada usuario recibe solo los permisos que necesita", "Todos tienen todos los permisos", "Solo el administrador entra", "Los permisos se heredan siempre"], 0, "Reduce el riesgo de accesos indebidos.");
  M("c4-27", 4, "dml", "¿Cuál es la mejor defensa contra la inyección SQL?", ["Consultas parametrizadas con ?", "Poner comillas dobles", "Usar mayúsculas", "Ocultar el nombre de las tablas"], 0, "Los parámetros separan el código del dato.");
  M("c4-28", 4, "dml", "¿Qué pasa si ejecutas UPDATE sin WHERE?", ["Se actualizan TODAS las filas", "Da error", "Solo la primera fila", "Nada"], 0, "Siempre prueba antes con un SELECT con el mismo WHERE.");
  X("c4-29", 4, "dml", "Relaciona cada sentencia con su efecto:", [["BEGIN", "Inicia una transacción"], ["COMMIT", "Confirma los cambios"], ["ROLLBACK", "Deshace los cambios"], ["SAVEPOINT", "Marca un punto intermedio"]], "Control de transacciones.");
  S("c4-30", 4, "dml", "Aumenta 3 % el sueldo de los empleados de Lima y luego muestra id_emp y sueldo de esos empleados, ordenado por id_emp.", "andes", "UPDATE empleados SET sueldo = ROUND(sueldo * 1.03, 2) WHERE ciudad = 'Lima'; SELECT id_emp, sueldo FROM empleados WHERE ciudad = 'Lima' ORDER BY id_emp;", "UPDATE con WHERE y luego SELECT", "Ejecuta el UPDATE y consulta el resultado.", true);

  /* ============ Python y pandas ============ */
  M("c4-31", 4, "python", "¿Para qué sirve el signo ? en cursor.execute('… WHERE id = ?', (5,))?", ["Para pasar valores de forma segura (parámetros)", "Para comparar con NULL", "Para comentar", "Para repetir la consulta"], 0, "Evita la inyección SQL y los problemas de comillas.");
  M("c4-32", 4, "python", "Después de INSERT/UPDATE/DELETE con sqlite3, ¿qué debes llamar para guardar los cambios?", ["conexion.commit()", "conexion.save()", "cursor.close()", "pd.to_sql()"], 0, "Sin commit, los cambios se pierden al cerrar.");
  M("c4-33", 4, "python", "df.to_sql('tabla', conexion, if_exists='append', index=False) hace que…", ["Se agreguen las filas a la tabla existente", "Se borre la tabla y se cree de nuevo", "Falle si la tabla existe", "Se cree una vista"], 0, "'replace' borra y crea; 'fail' da error; 'append' agrega.");
  M("c4-34", 4, "python", "¿Qué devuelve cursor.fetchall()?", ["Una lista de tuplas con todas las filas", "Una sola fila", "Un DataFrame", "El número de filas"], 0, "Cada fila es una tupla.");
  M("c4-35", 4, "python", "pd.read_sql_query('SELECT * FROM t', conexion) devuelve…", ["Un DataFrame", "Una lista", "Un diccionario", "Un cursor"], 0, "Es el puente entre SQL y pandas.");
  M("c4-36", 4, "python", "¿Qué ventaja tiene usar «with conexion:» al escribir datos?", ["Hace commit si todo sale bien y rollback si hay error", "Cierra el navegador", "Es más rápido siempre", "Evita escribir SQL"], 0, "Agrupa los cambios de forma segura.");
  M("c4-37", 4, "python", "¿Cuándo conviene filtrar y resumir en SQL en vez de traer todo a pandas?", ["Cuando los datos viven en una base y son muchos", "Nunca", "Solo con pocos datos", "Solo para graficar"], 0, "Menos datos viajan a tu memoria.");

  /* ============ Otros motores ============ */
  M("c4-38", 4, "dialectos", "Para limitar filas en SQL Server se usa…", ["SELECT TOP n", "LIMIT n", "FETCH n", "ROWNUM"], 0, "SQLite, PostgreSQL y MySQL usan LIMIT.");
  M("c4-39", 4, "dialectos", "Para concatenar texto en MySQL se usa…", ["CONCAT(a, b)", "a || b", "a & b", "a.join(b)"], 0, "SQLite y PostgreSQL usan ||.");
  M("c4-40", 4, "dialectos", "Un autonumérico en SQLite se logra con…", ["INTEGER PRIMARY KEY", "AUTO_INCREMENT", "SERIAL", "IDENTITY(1,1)"], 0, "Los otros nombres son de MySQL, PostgreSQL y SQL Server.");

  /* ================================================================
     GENERADORES de los complementos
     ================================================================ */
  const G = (id, sem, topic, titulo, fn) => Q.push({ id, sem, topic, type: "gen", q: "Pregunta dinámica: " + titulo, why: "", fn });
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const ri = (a, b) => a + ((Math.random() * (b - a + 1)) | 0);
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const EMPS = [[1, "Alicia Paucar"], [2, "Marisol Cutipa"], [3, "Jorge Quiroz"], [4, "Víctor Layme"], [5, "Lucía Mendieta"], [6, "Pablo Cornejo"], [7, "Rosa Tacuri"], [8, "Josué Huillca"], [9, "Elena Paredes"], [10, "Mario Salas"], [11, "Diana Vega"], [12, "Hugo Flores"]];

  G("g-texto", 2, "funcion", "funciones de texto", async (ctx) => {
    const pal = pick(["Arequipa", "Trujillo", "Cusco", "Huancayo", "Piura", "Ayacucho", "Chiclayo"]), i = ri(1, 3), n = ri(2, 4);
    const casos = [
      [`UPPER('${pal}')`, [`LOWER('${pal}')`, `SUBSTR('${pal}', 1, 3)`, `LENGTH('${pal}')`], "UPPER convierte a mayúsculas."],
      [`LENGTH('${pal}')`, [`LENGTH('${pal}') + 1`, `LENGTH('${pal}') - 1`, `INSTR('${pal}', 'a')`], "LENGTH cuenta los caracteres."],
      [`SUBSTR('${pal}', ${i}, ${n})`, [`SUBSTR('${pal}', ${i + 1}, ${n})`, `SUBSTR('${pal}', ${Math.max(1, i - 1)}, ${n + 1})`, `SUBSTR('${pal}', 1, ${n})`], "SUBSTR(texto, inicio, largo): la primera posición es la 1."],
      [`INSTR('${pal}', 'u')`, [`INSTR('${pal}', 'a')`, `LENGTH('${pal}')`, `INSTR('${pal}', 'o')`], "INSTR devuelve la posición del primer caracter buscado (0 si no está)."],
      [`REPLACE('${pal}', 'a', '*')`, [`REPLACE('${pal}', 'o', '*')`, `UPPER('${pal}')`, `REPLACE('${pal}', 'e', '*')`], "REPLACE cambia todas las apariciones del texto."],
    ];
    for (let k = 0; k < 8; k++) {
      const [expr, alts, why] = pick(casos), v = await ctx.run("andes", `SELECT ${expr}`); if (v.error) continue;
      const correcto = String(v.rows[0][0]), opts = [correcto];
      for (const a of alts) { const r = await ctx.run("andes", `SELECT ${a}`); const s = r.rows && String(r.rows[0][0]); if (s !== undefined && !opts.includes(s)) opts.push(s); }
      if (opts.length < 3) continue;
      const lista = shuf(opts.slice(0, 4)); return { type: "mcq", code: `SELECT ${expr};`, q: "¿Qué devuelve esta consulta?", opts: lista, a: lista.indexOf(correcto), why };
    }
    return { type: "num", q: "¿Cuántos caracteres tiene 'Cusco'? (LENGTH)", ans: 5, why: "LENGTH cuenta caracteres." };
  });
  G("g-fecha", 2, "funcion", "fechas con strftime", async () => {
    const v = ri(0, 2);
    if (v === 0) { const y = pick(["2019", "2021", "2022", "2023", "2024"]); return { type: "num", db: "andes", calc: "cell", code: `SELECT COUNT(*) FROM empleados\nWHERE strftime('%Y', fecha_ingreso) = '${y}';`, q: `¿Cuántos empleados ingresaron en ${y}?`, why: "strftime('%Y', fecha) extrae el año." }; }
    if (v === 1) { const m = pick(["2026-03", "2026-04", "2026-05"]); return { type: "num", db: "andes", calc: "cell", round: 0, code: `SELECT SUM(monto) FROM ventas\nWHERE strftime('%Y-%m', fecha) = '${m}';`, q: `¿Cuánto se vendió en ${m}? (redondea al entero)`, why: "'%Y-%m' agrupa por año y mes." }; }
    const c = pick(["Cusco", "Lima"]), y = pick(["2022", "2023", "2024"]); return { type: "num", db: "andes", calc: "cell", code: `SELECT COUNT(*) FROM empleados\nWHERE ciudad = '${c}' AND fecha_ingreso >= '${y}-01-01';`, q: `¿Cuántos empleados de ${c} ingresaron desde el ${y}-01-01?`, why: "Las fechas ISO se comparan como texto." };
  });
  G("g-case", 3, "case", "CASE y agregación condicional", async () => {
    const a = pick([3000, 3500, 4000, 4500]), b = pick([5000, 5100, 4800]);
    const v = ri(0, 1);
    if (v === 0) return { type: "num", db: "andes", calc: "cell", code: `SELECT COUNT(*) FROM (\n  SELECT CASE WHEN sueldo >= ${b} THEN 'Alto'\n              WHEN sueldo >= ${a} THEN 'Medio'\n              ELSE 'Bajo' END AS nivel\n  FROM empleados\n) WHERE nivel = 'Medio';`, q: "¿Cuántos empleados quedan en el nivel 'Medio'?", why: "CASE evalúa en orden: Medio son los que no llegan a Alto pero superan el umbral." };
    const c = pick(["Cusco", "Lima", "Arequipa"]); return { type: "num", db: "andes", calc: "cell", code: `SELECT SUM(CASE WHEN ciudad = '${c}' THEN 1 ELSE 0 END)\nFROM empleados;`, q: `¿Qué número devuelve esta suma condicional? (empleados de ${c})`, why: "SUM(CASE … 1 ELSE 0) cuenta las filas que cumplen la condición." };
  });
  G("g-ventana", 3, "ventana", "funciones de ventana", async () => {
    const e = pick(EMPS), v = ri(0, 2);
    if (v === 0) return { type: "num", db: "andes", calc: "cell", code: `SELECT puesto FROM (\n  SELECT id_emp, RANK() OVER (ORDER BY sueldo DESC) AS puesto\n  FROM empleados\n) WHERE id_emp = ${e[0]};`, q: `¿Qué puesto en sueldos (de mayor a menor) tiene ${e[1]}?`, why: "RANK numera según el orden indicado en OVER." };
    if (v === 1) return { type: "num", db: "andes", calc: "cell", code: `SELECT n FROM (\n  SELECT id_emp, ROW_NUMBER() OVER (PARTITION BY id_depto ORDER BY sueldo DESC) AS n\n  FROM empleados\n) WHERE id_emp = ${e[0]};`, q: `¿Qué puesto ocupa ${e[1]} dentro de su departamento (por sueldo, de mayor a menor)?`, why: "PARTITION BY reinicia la numeración en cada departamento." };
    const k = ri(2, 12); return { type: "num", db: "andes", calc: "cell", round: 0, code: `SELECT acumulado FROM (\n  SELECT id_venta, SUM(monto) OVER (ORDER BY fecha, id_venta) AS acumulado\n  FROM ventas\n) WHERE id_venta = ${k};`, q: `¿Cuánto es el acumulado de ventas hasta la venta ${k}?`, why: "SUM() OVER (ORDER BY …) acumula desde la primera venta." };
  });
  G("g-dml", 4, "dml", "efecto de una sentencia DML", async () => {
    const v = ri(0, 3);
    if (v === 0) { const n = pick([300, 400, 800, 1500]); return { type: "num", db: "andes", calc: "cell", code: `DELETE FROM ventas WHERE monto < ${n};\nSELECT COUNT(*) FROM ventas;`, q: "¿Qué número devuelve la última consulta?", why: "DELETE elimina las filas que cumplen el WHERE; luego se cuentan las restantes." }; }
    if (v === 1) { const d = ri(1, 4), pct = pick([5, 10, 20]); return { type: "num", db: "andes", calc: "cell", round: 0, code: `UPDATE empleados SET sueldo = sueldo * ${1 + pct / 100}\nWHERE id_depto = ${d};\nSELECT SUM(sueldo) FROM empleados\nWHERE id_depto = ${d};`, q: `¿Cuánto suman los sueldos del departamento ${d} después del aumento? (redondea)`, why: "El UPDATE modifica solo ese departamento y SUM suma los nuevos valores." }; }
    if (v === 2) { const e = pick(EMPS), fin = pick(["ROLLBACK", "COMMIT"]); return { type: "num", db: "andes", calc: "cell", round: 0, code: `BEGIN;\nUPDATE empleados SET sueldo = sueldo + 1000 WHERE id_emp = ${e[0]};\n${fin};\nSELECT sueldo FROM empleados WHERE id_emp = ${e[0]};`, q: `¿Qué sueldo tiene ${e[1]} al final?`, why: "ROLLBACK deshace la transacción; COMMIT la confirma." }; }
    const c = pick(["Cusco", "Lima", "Arequipa"]); return { type: "num", db: "andes", calc: "cell", code: `UPDATE empleados SET ciudad = 'Remoto'\nWHERE ciudad = '${c}';\nSELECT COUNT(*) FROM empleados WHERE ciudad = 'Remoto';`, q: "¿Qué número devuelve la última consulta?", why: "El UPDATE cambia la ciudad de todos los que cumplían el WHERE." };
  });
  G("g-estructura", 4, "diseno", "diagnóstico de un diseño", async () => {
    const casos = [
      ["Una tabla ventas guarda cliente_nombre, cliente_distrito y cliente_telefono en cada fila.", "Redundancia: conviene una tabla clientes y una FK en ventas."],
      ["La tabla pedidos guarda productos como «Pan, Jugo, Café» en una sola celda.", "Rompe la 1FN: hace falta una tabla de detalle con una fila por producto."],
      ["Se usa el nombre del cliente como clave primaria.", "Dos personas pueden llamarse igual: usa una clave sustituta y UNIQUE si procede."],
      ["Una tabla guarda el total de la venta y también cantidad y precio.", "El total es un dato derivado que puede quedar inconsistente."],
      ["No se activó PRAGMA foreign_keys y hay ventas de clientes que no existen.", "Sin verificar las FK aparecen datos huérfanos."],
    ];
    const [txt, why] = pick(casos), opts = ["Redundancia", "Violación de 1FN", "Clave mal elegida", "Dato derivado guardado", "FK sin verificar"];
    const a = [0, 1, 2, 3, 4][casos.findIndex((c) => c[0] === txt)], lista = shuf(opts.map((o, i) => [o, i])).slice(0, 5);
    return { type: "mcq", q: `¿Cuál es el problema principal de este diseño?\n«${txt}»`, opts: lista.map((x) => x[0]), a: lista.findIndex((x) => x[1] === a), why };
  });
})();
