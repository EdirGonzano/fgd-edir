/* Gimnasio de retos SQL: se corrigen ejecutando tu consulta y comparando con la solución de referencia.
   Para retos que modifican datos, `check` es la consulta que se ejecuta DESPUÉS para comparar el estado final. */
window.FGD = window.FGD || {};
(function () {
  FGD.retosTemas = [
    ["filtrar", "Filtrar, ordenar y contar", "var(--sky)"], ["resumir", "Resumir y agrupar", "var(--gold)"], ["unir", "Unir tablas", "var(--coral)"],
    ["sub", "Subconsultas, CTE y conjuntos", "var(--fuchsia)"], ["funcion", "Texto, fechas y NULL", "var(--cyan)"], ["case", "CASE y funciones de ventana", "var(--mint)"],
    ["dml", "Modificar datos", "var(--rose)"], ["ddl", "Crear estructura", "var(--lavender)"],
  ];
  const R = [];
  const r = (id, tema, nivel, db, enun, sol, pista, o) => R.push(Object.assign({ id, tema, nivel, db, enun, sol, pista }, o || {}));

  /* ----- filtrar, ordenar y contar (Andes Soft) ----- */
  r("r01", "filtrar", 1, "andes", "Muestra nombre, cargo y sueldo de los empleados del departamento 1 que ganan 3500 o más.", "SELECT nombre, cargo, sueldo FROM empleados WHERE id_depto = 1 AND sueldo >= 3500;", "WHERE con AND");
  r("r02", "filtrar", 1, "andes", "Muestra los 2 empleados con menor sueldo (nombre y sueldo), del menor al mayor.", "SELECT nombre, sueldo FROM empleados ORDER BY sueldo ASC LIMIT 2;", "ORDER BY + LIMIT", { ordered: true });
  r("r03", "filtrar", 1, "andes", "¿Cuántos cargos distintos hay en la empresa? (un solo número)", "SELECT COUNT(DISTINCT cargo) FROM empleados;", "COUNT(DISTINCT …)");
  r("r04", "filtrar", 1, "andes", "¿Cuántos empleados NO viven en Cusco? (un solo número)", "SELECT COUNT(*) FROM empleados WHERE ciudad <> 'Cusco';", "<> significa distinto");
  r("r05", "filtrar", 1, "andes", "¿Cuál es el sueldo promedio de los empleados de Cusco? (un solo número)", "SELECT AVG(sueldo) FROM empleados WHERE ciudad = 'Cusco';", "AVG + WHERE");
  r("r06", "filtrar", 1, "andes", "¿Quién no tiene correo registrado? Muestra nombre y cargo.", "SELECT nombre, cargo FROM empleados WHERE correo IS NULL;", "IS NULL, no = NULL");
  r("r07", "filtrar", 2, "andes", "Muestra nombre y fecha de ingreso de quienes ingresaron en 2023 o después, del más antiguo al más reciente.", "SELECT nombre, fecha_ingreso FROM empleados WHERE fecha_ingreso >= '2023-01-01' ORDER BY fecha_ingreso;", "Las fechas ISO se comparan como texto", { ordered: true });
  r("r08", "filtrar", 2, "andes", "Muestra los 3 proyectos con mayor presupuesto (nombre y presupuesto).", "SELECT nombre, presupuesto FROM proyectos ORDER BY presupuesto DESC LIMIT 3;", "DESC + LIMIT", { ordered: true });

  /* ----- resumir y agrupar ----- */
  r("r09", "resumir", 1, "andes", "Cuenta los empleados por ciudad (ciudad y cantidad).", "SELECT ciudad, COUNT(*) FROM empleados GROUP BY ciudad;", "GROUP BY ciudad");
  r("r10", "resumir", 2, "andes", "Total vendido por vendedor (id_emp y la suma de monto), de mayor a menor.", "SELECT id_emp, SUM(monto) AS total FROM ventas GROUP BY id_emp ORDER BY total DESC;", "SUM + GROUP BY + ORDER BY DESC", { ordered: true });
  r("r11", "resumir", 2, "andes", "Por estado de proyecto: estado, cantidad de proyectos y presupuesto total.", "SELECT estado, COUNT(*), SUM(presupuesto) FROM proyectos GROUP BY estado;", "Dos funciones de resumen");
  r("r12", "resumir", 2, "andes", "Muestra los vendedores (id_emp y cantidad de ventas) que tienen 3 o más ventas.", "SELECT id_emp, COUNT(*) FROM ventas GROUP BY id_emp HAVING COUNT(*) >= 3;", "HAVING COUNT(*) >= 3");
  r("r13", "resumir", 2, "andes", "Muestra los departamentos (id_depto y sueldo promedio) cuyo sueldo promedio supera 3500.", "SELECT id_depto, AVG(sueldo) FROM empleados GROUP BY id_depto HAVING AVG(sueldo) > 3500;", "HAVING sobre un promedio");
  r("r14", "resumir", 3, "andes", "Por mes (formato AAAA-MM): número de ventas e ingreso total, en orden cronológico.", "SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*), SUM(monto) FROM ventas GROUP BY mes ORDER BY mes;", "strftime('%Y-%m', fecha)", { ordered: true });

  /* ----- unir tablas ----- */
  r("r15", "unir", 2, "andes", "Muestra fecha, nombre del vendedor, producto y monto de cada venta.", "SELECT v.fecha, e.nombre, v.producto, v.monto FROM ventas v JOIN empleados e ON v.id_emp = e.id_emp;", "ventas JOIN empleados");
  r("r16", "unir", 2, "andes", "¿Qué departamentos no tienen empleados? Muestra su nombre.", "SELECT d.nombre FROM departamentos d LEFT JOIN empleados e ON e.id_depto = d.id_depto WHERE e.id_emp IS NULL;", "LEFT JOIN + IS NULL");
  r("r17", "unir", 3, "andes", "Total vendido por departamento del vendedor (nombre del departamento y suma), de mayor a menor.", "SELECT d.nombre, SUM(v.monto) AS total FROM ventas v JOIN empleados e ON v.id_emp = e.id_emp JOIN departamentos d ON e.id_depto = d.id_depto GROUP BY d.id_depto ORDER BY total DESC;", "Tres tablas: ventas → empleados → departamentos", { ordered: true });
  r("r18", "unir", 1, "andes", "Muestra el nombre de cada empleado y el nombre de su departamento.", "SELECT e.nombre, d.nombre FROM empleados e JOIN departamentos d ON e.id_depto = d.id_depto;", "JOIN con ON");
  r("r19", "unir", 3, "andes", "Muestra cada empleado y el nombre de su jefe (quienes no tienen jefe deben aparecer con NULL).", "SELECT e.nombre, j.nombre FROM empleados e LEFT JOIN empleados j ON e.id_jefe = j.id_emp;", "Autounión con LEFT JOIN");
  r("r20", "unir", 3, "andes", "¿Cuántas personas dirige cada jefe? Muestra nombre del jefe y cantidad, de más a menos.", "SELECT j.nombre, COUNT(*) AS n FROM empleados j JOIN empleados e ON e.id_jefe = j.id_emp GROUP BY j.id_emp ORDER BY n DESC, j.nombre;", "Autounión + GROUP BY", { ordered: true });
  r("r21", "unir", 3, "andes", "Por departamento (nombre), cuántos proyectos EN CURSO tiene; los que no tienen deben salir con 0.", "SELECT d.nombre, COUNT(p.id_proyecto) FROM departamentos d LEFT JOIN proyectos p ON d.id_depto = p.id_depto AND p.estado = 'En curso' GROUP BY d.id_depto;", "El filtro del estado va en el ON, no en el WHERE");
  r("r22", "unir", 2, "chasqui", "Clientes que NUNCA compraron, contados por ciudad (ciudad y cantidad).", "SELECT c.ciudad, COUNT(*) FROM clientes c LEFT JOIN pedidos p ON p.id_cliente = c.id_cliente WHERE p.id_pedido IS NULL GROUP BY c.ciudad;", "Anti-join + GROUP BY");

  /* ----- subconsultas, CTE y conjuntos ----- */
  r("r23", "sub", 2, "andes", "Muestra nombre y sueldo de quienes ganan más que el sueldo promedio de toda la empresa.", "SELECT nombre, sueldo FROM empleados WHERE sueldo > (SELECT AVG(sueldo) FROM empleados);", "Subconsulta escalar en WHERE");
  r("r24", "sub", 3, "andes", "Muestra el nombre de quienes ganan más que el promedio de SU departamento.", "SELECT nombre FROM empleados e WHERE sueldo > (SELECT AVG(sueldo) FROM empleados WHERE id_depto = e.id_depto);", "Subconsulta correlacionada");
  r("r25", "sub", 3, "andes", "Muestra el nombre de los empleados que nunca han registrado una venta (usa NOT EXISTS).", "SELECT nombre FROM empleados e WHERE NOT EXISTS (SELECT 1 FROM ventas v WHERE v.id_emp = e.id_emp);", "NOT EXISTS (SELECT 1 …)");
  r("r26", "sub", 3, "andes", "¿Qué departamentos (id_depto) no tienen ningún proyecto? Resuélvelo con EXCEPT.", "SELECT id_depto FROM departamentos EXCEPT SELECT id_depto FROM proyectos;", "A EXCEPT B");
  r("r27", "sub", 3, "andes", "Con una CTE: muestra nombre y total de los vendedores cuyo total vendido supera el promedio entre vendedores.", "WITH t AS (SELECT id_emp, SUM(monto) AS total FROM ventas GROUP BY id_emp) SELECT e.nombre, t.total FROM t JOIN empleados e ON e.id_emp = t.id_emp WHERE t.total > (SELECT AVG(total) FROM t);", "WITH t AS (…) y luego compara con AVG(total) de t");

  /* ----- texto, fechas y NULL ----- */
  r("r28", "funcion", 2, "andes", "Muestra el nombre en MAYÚSCULAS y las 3 primeras letras del cargo.", "SELECT UPPER(nombre), SUBSTR(cargo, 1, 3) FROM empleados;", "UPPER y SUBSTR");
  r("r29", "funcion", 2, "andes", "Muestra nombre y el dominio del correo (lo que va después de @) de quienes tienen correo.", "SELECT nombre, SUBSTR(correo, INSTR(correo, '@') + 1) FROM empleados WHERE correo IS NOT NULL;", "SUBSTR + INSTR");
  r("r30", "funcion", 2, "andes", "Cuenta cuántas personas ingresaron en cada año (anio y cantidad).", "SELECT strftime('%Y', fecha_ingreso) AS anio, COUNT(*) FROM empleados GROUP BY anio;", "strftime('%Y', …)");
  r("r31", "funcion", 2, "andes", "Muestra nombre y correo; donde el correo sea NULL, muestra el texto 'sin correo'.", "SELECT nombre, COALESCE(correo, 'sin correo') FROM empleados;", "COALESCE");
  r("r32", "funcion", 3, "andes", "Muestra nombre y antigüedad en años enteros al 2026-10-21.", "SELECT nombre, CAST((julianday('2026-10-21') - julianday(fecha_ingreso)) / 365.25 AS INTEGER) FROM empleados;", "julianday y CAST");

  /* ----- CASE y ventanas ----- */
  r("r33", "case", 2, "andes", "Clasifica a los empleados por sueldo: 'Alto' si es 5000 o más, 'Medio' si es 3500 o más, 'Bajo' en otro caso (nombre y nivel).", "SELECT nombre, CASE WHEN sueldo >= 5000 THEN 'Alto' WHEN sueldo >= 3500 THEN 'Medio' ELSE 'Bajo' END FROM empleados;", "CASE WHEN … THEN … ELSE … END");
  r("r34", "case", 3, "andes", "Por departamento: total de empleados y cuántos ganan más de 3500 (id_depto, total, altos).", "SELECT id_depto, COUNT(*), SUM(CASE WHEN sueldo > 3500 THEN 1 ELSE 0 END) FROM empleados GROUP BY id_depto;", "SUM(CASE …)");
  r("r35", "case", 3, "andes", "Ranking de sueldos de toda la empresa (nombre, sueldo y puesto con RANK), del puesto 1 en adelante.", "SELECT nombre, sueldo, RANK() OVER (ORDER BY sueldo DESC) AS puesto FROM empleados ORDER BY puesto;", "RANK() OVER (ORDER BY …)", { ordered: true });
  r("r36", "case", 3, "andes", "El mejor pagado de cada departamento (nombre, id_depto, sueldo).", "SELECT nombre, id_depto, sueldo FROM (SELECT nombre, id_depto, sueldo, ROW_NUMBER() OVER (PARTITION BY id_depto ORDER BY sueldo DESC) AS n FROM empleados) WHERE n = 1;", "ROW_NUMBER() + subconsulta que filtre n = 1");
  r("r37", "case", 3, "andes", "Cada venta con su acumulado: id_venta, monto y el total acumulado ordenado por fecha e id_venta.", "SELECT id_venta, monto, SUM(monto) OVER (ORDER BY fecha, id_venta) AS acumulado FROM ventas ORDER BY fecha, id_venta;", "SUM() OVER (ORDER BY …)", { ordered: true });
  r("r38", "case", 3, "andes", "Variación del ingreso mes a mes: mes, ingreso y diferencia con el mes anterior (NULL en el primero).", "SELECT mes, ingreso, ingreso - LAG(ingreso) OVER (ORDER BY mes) FROM (SELECT strftime('%Y-%m', fecha) AS mes, SUM(monto) AS ingreso FROM ventas GROUP BY mes) ORDER BY mes;", "LAG(ingreso) OVER (ORDER BY mes)", { ordered: true });
  r("r39", "case", 3, "chasqui", "Por cada pedido: id_pedido y el porcentaje (con 2 decimales) que representa del total de todos los pedidos.", "SELECT id_pedido, ROUND(100.0 * total / SUM(total) OVER (), 2) FROM pedidos;", "SUM(total) OVER () da el total general");

  /* ----- otros casos (Chasqui y Café Yaku) ----- */
  r("r40", "resumir", 3, "chasqui", "Top 5 clientes por monto total comprado (nombre y total), del mayor al menor.", "SELECT c.nombre, SUM(p.total) AS total FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente GROUP BY c.id_cliente ORDER BY total DESC LIMIT 5;", "JOIN + GROUP BY id + ORDER BY + LIMIT", { ordered: true });
  r("r41", "resumir", 3, "chasqui", "Categorías (de productos) con ingreso total de al menos 10000, calculado desde detalles_pedido.", "SELECT pr.categoria, SUM(d.cantidad * d.precio_unitario) FROM detalles_pedido d JOIN productos pr ON d.id_producto = pr.id_producto GROUP BY pr.categoria HAVING SUM(d.cantidad * d.precio_unitario) >= 10000;", "HAVING con SUM(cantidad * precio)");
  r("r42", "resumir", 2, "yaku", "Ingreso por categoría: nombre de la categoría y SUM(cantidad × precio_unitario).", "SELECT g.nombre, SUM(v.cantidad * p.precio_unitario) FROM ventas v JOIN productos p ON v.id_producto = p.id_producto JOIN categorias g ON p.id_categoria = g.id_categoria GROUP BY g.id_categoria;", "Tres JOIN desde ventas");
  r("r43", "resumir", 3, "yaku", "Por producto: nombre, número de registros de venta, unidades vendidas e ingreso.", "SELECT p.nombre, COUNT(*), SUM(v.cantidad), SUM(v.cantidad * p.precio_unitario) FROM ventas v JOIN productos p ON v.id_producto = p.id_producto GROUP BY p.id_producto;", "COUNT(*) ≠ SUM(cantidad)");

  /* ----- modificar datos (se compara el estado final) ----- */
  r("r44", "dml", 2, "andes", "Sube 10 % el sueldo de los empleados del departamento 3.", "UPDATE empleados SET sueldo = sueldo * 1.10 WHERE id_depto = 3;", "UPDATE … SET sueldo = sueldo * 1.10 WHERE …", { check: "SELECT id_emp, sueldo FROM empleados ORDER BY id_emp;" });
  r("r45", "dml", 1, "andes", "Inserta un departamento nuevo: id 6, nombre 'Legal', ciudad 'Lima'.", "INSERT INTO departamentos (id_depto, nombre, ciudad) VALUES (6, 'Legal', 'Lima');", "INSERT INTO … VALUES", { check: "SELECT * FROM departamentos ORDER BY id_depto;" });
  r("r46", "dml", 2, "andes", "Elimina las ventas con monto menor a 400.", "DELETE FROM ventas WHERE monto < 400;", "DELETE con WHERE", { check: "SELECT * FROM ventas ORDER BY id_venta;" });
  r("r47", "dml", 3, "andes", "UPSERT: inserta el departamento 1 con nombre 'Sistemas' y ciudad 'Lima'; como ya existe, debe actualizar su ciudad.", "INSERT INTO departamentos (id_depto, nombre, ciudad) VALUES (1, 'Sistemas', 'Lima') ON CONFLICT (id_depto) DO UPDATE SET ciudad = excluded.ciudad;", "ON CONFLICT (id_depto) DO UPDATE SET …", { check: "SELECT * FROM departamentos ORDER BY id_depto;" });
  r("r48", "dml", 3, "andes", "Crea una tabla sueldos_por_depto con id_depto y el sueldo promedio (columna promedio) usando CREATE TABLE … AS SELECT.", "CREATE TABLE sueldos_por_depto AS SELECT id_depto, AVG(sueldo) AS promedio FROM empleados GROUP BY id_depto;", "CREATE TABLE … AS SELECT …", { check: "SELECT * FROM sueldos_por_depto ORDER BY id_depto;" });
  r("r49", "dml", 3, "andes", "Dentro de una transacción baja 500 al sueldo del empleado 3 y súbelo 500 al empleado 1; después deshaz todo con ROLLBACK.", "BEGIN; UPDATE empleados SET sueldo = sueldo - 500 WHERE id_emp = 3; UPDATE empleados SET sueldo = sueldo + 500 WHERE id_emp = 1; ROLLBACK;", "BEGIN; …; ROLLBACK;", { check: "SELECT id_emp, sueldo FROM empleados ORDER BY id_emp;" });

  /* ----- crear estructura ----- */
  r("r50", "ddl", 2, "andes", "Crea la tabla proveedores (id_proveedor clave primaria, nombre obligatorio, telefono) e inserta 2 proveedores.", "CREATE TABLE proveedores (id_proveedor INTEGER PRIMARY KEY, nombre TEXT NOT NULL, telefono TEXT); INSERT INTO proveedores (nombre, telefono) VALUES ('Distribuidora Andina', '999111222'), ('TecnoSur', '988777666');", "CREATE TABLE con PRIMARY KEY y NOT NULL; luego INSERT de dos filas", { check: "SELECT COUNT(*) FROM proveedores;" });
  r("r51", "ddl", 3, "andes", "Agrega a empleados una columna activo (INTEGER, valor por defecto 1) y pon activo = 0 a quienes NO tienen correo.", "ALTER TABLE empleados ADD COLUMN activo INTEGER DEFAULT 1; UPDATE empleados SET activo = 0 WHERE correo IS NULL;", "ALTER TABLE … ADD COLUMN … DEFAULT 1; luego UPDATE", { check: "SELECT id_emp, activo FROM empleados ORDER BY id_emp;" });
  r("r52", "ddl", 3, "andes", "Crea una vista v_top_ventas con el nombre del vendedor y su total vendido (columnas nombre y total), y luego consúltala del mayor al menor total.", "CREATE VIEW v_top_ventas AS SELECT e.nombre AS nombre, SUM(v.monto) AS total FROM ventas v JOIN empleados e ON e.id_emp = v.id_emp GROUP BY e.id_emp; SELECT * FROM v_top_ventas ORDER BY total DESC;", "CREATE VIEW … AS SELECT … y después SELECT * FROM la vista", { ordered: true });

  FGD.retos = R;
})();
