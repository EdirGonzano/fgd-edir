/* Banco ampliado: tipos nuevos (num, fill, match, multi) y GENERADORES (preguntas que cambian de datos cada vez
   y cuya respuesta se calcula ejecutando SQL en vivo). Se suma a FGD.preguntas. */
window.FGD = window.FGD || {};
(function () {
  const Q = FGD.preguntas;
  const M = (id, sem, topic, q, opts, a, why, code, db) => Q.push({ id, sem, topic, type: "mcq", q, opts, a, why, code, db });
  const S = (id, sem, topic, q, db, solution, hint, why, ordered) => Q.push({ id, sem, topic, type: "sql", q, db, solution, hint, why, ordered: !!ordered });
  // num: la respuesta se calcula ejecutando `code` (calc = "cell" primera celda | "rows" nº de filas). round:0 => comparar redondeado
  const N = (id, sem, topic, q, db, code, calc, why, round) => Q.push({ id, sem, topic, type: "num", q, db, code, calc, why, round });
  const F = (id, sem, topic, q, code, blanks, extra, why, db) => Q.push({ id, sem, topic, type: "fill", q, code, blanks, extra, why, db });
  const X = (id, sem, topic, q, pairs, why) => Q.push({ id, sem, topic, type: "match", q, pairs, why });
  const U = (id, sem, topic, q, opts, a, why) => Q.push({ id, sem, topic, type: "multi", q, opts, a, why });

  /* ================= SEMANA 1 ================= */
  X("1-21", 1, "dato", "Relaciona cada tipo de dato con su ejemplo:", [["Estructurado", "Tabla de ventas en SQL"], ["Semiestructurado", "Respuesta JSON de una API"], ["No estructurado", "Video de una cámara de seguridad"], ["Metadato", "Fecha y GPS de una foto"]], "La estructura (filas/columnas, etiquetas, ninguna) define el tipo; el metadato describe a otro dato.");
  X("1-22", 1, "dato", "Ubica cada frase en su escalón de DIKW:", [["Dato", "500 ventas en octubre"], ["Información", "Las ventas subieron 20 % frente a septiembre"], ["Conocimiento", "Conviene reforzar la publicidad en el cuarto trimestre"]], "Dato = hecho crudo; información = con contexto; conocimiento = orienta una decisión.");
  X("1-23", 1, "roles", "Relaciona cada rol con su tarea principal:", [["Data Analyst", "Responde preguntas de negocio con SQL y gráficos"], ["Data Engineer", "Construye los pipelines que mueven los datos"], ["Data Scientist", "Entrena modelos predictivos"], ["BI Analyst", "Arma reportes para la dirección"]], "Cada rol ocupa un tramo distinto del ciclo de vida del dato.");
  U("1-24", 1, "metadatos", "Marca TODOS los metadatos de un correo electrónico:", ["Remitente", "Hora de envío", "Texto del mensaje", "Servidor de origen"], [0, 1, 3], "El texto del mensaje es el dato; remitente, hora y servidor lo describen (metadatos).");
  U("1-25", 1, "calidad", "Marca las dimensiones de calidad del dato:", ["Exactitud", "Completitud", "Velocidad del internet", "Unicidad", "Color del reporte"], [0, 1, 3], "Exactitud, completitud, consistencia, oportunidad, validez y unicidad.");
  M("1-26", 1, "calidad", "Un sistema registra la edad de un cliente como 250. ¿Qué dimensión falla principalmente?", ["Exactitud", "Oportunidad", "Unicidad", "Completitud"], 0, "250 años no refleja la realidad: exactitud (y también validez).");
  M("1-27", 1, "calidad", "El teléfono está vacío en 40 % de los clientes. ¿Qué dimensión falla?", ["Completitud", "Consistencia", "Unicidad", "Oportunidad"], 0, "Faltan valores críticos: completitud.");
  M("1-28", 1, "ciclo", "¿Por qué la limpieza es tan crítica en el ciclo de vida?", ["Un error ahí daña todo lo que viene después", "Porque nadie quiere analizar", "Porque los modelos ya no sirven", "Porque SQL no filtra"], 0, "Análisis y decisiones heredan los errores que no se limpiaron (GIGO).");
  M("1-29", 1, "dato", "Un log de servidor con líneas etiquetadas (fecha, nivel, mensaje) es…", ["Semiestructurado", "Estructurado", "Un metadato", "Binario"], 0, "Tiene organización interna pero no esquema rígido de tabla.");
  M("1-30", 1, "ciclo", "Un banco bloquea una transacción sospechosa en menos de 200 ms con un modelo. ¿Qué etapas del ciclo se ven?", ["Captura y almacenamiento", "Solo limpieza", "Análisis y decisión", "Ninguna"], 2, "El modelo analiza y decide automáticamente.");

  /* ================= SEMANA 2 ================= */
  N("2-41", 2, "where", "¿Cuántas filas devuelve esta consulta?", "chasqui", "SELECT * FROM ventas WHERE unidades >= 3;", "rows", "Cuenta las ventas con 3 o más unidades.");
  N("2-42", 2, "distinct", "¿Qué número devuelve esta consulta?", "chasqui", "SELECT COUNT(DISTINCT producto) FROM ventas;", "cell", "COUNT(DISTINCT) cuenta valores únicos.");
  N("2-43", 2, "like", "¿Qué número devuelve?", "chasqui", "SELECT COUNT(*) FROM ventas WHERE producto LIKE '%pulgadas';", "cell", "'%pulgadas' = termina en «pulgadas».");
  N("2-44", 2, "resumen", "¿Cuánto devuelve COUNT(fecha_registro)?", "chasqui", "SELECT COUNT(fecha_registro) FROM clientes;", "cell", "COUNT(columna) ignora los NULL.");
  N("2-45", 2, "resumen", "¿Cuánto devuelve COUNT(*)?", "chasqui", "SELECT COUNT(*) FROM clientes;", "cell", "COUNT(*) cuenta todas las filas, aunque haya NULL en alguna columna.");
  N("2-46", 2, "resumen", "¿Cuál es el monto máximo de la sede Piura? (redondea a entero)", "chasqui", "SELECT MAX(monto) FROM ventas WHERE sede = 'Piura';", "cell", "MAX con WHERE.", 0);
  N("2-47", 2, "distinct", "¿Cuántas filas devuelve?", "chasqui", "SELECT DISTINCT sede, canal FROM ventas;", "rows", "DISTINCT sobre dos columnas cuenta combinaciones únicas: 4 sedes × 2 canales.");
  M("2-48", 2, "bug", "Esta consulta falla. ¿Por qué?", ["Lima va sin comillas simples (es texto)", "Falta GROUP BY", "FROM debe ir primero", "monto no existe"], 0, "El texto va entre comillas simples; sin ellas SQL cree que Lima es una columna.", "SELECT sede, monto FROM ventas\nWHERE sede = Lima;", "chasqui");
  M("2-49", 2, "bug", "Esta consulta no devuelve ninguna fila aunque hay clientes sin fecha. ¿Cuál es el error?", ["Se compara con = NULL en vez de IS NULL", "Falta DISTINCT", "Falta ORDER BY", "La tabla no existe"], 0, "Con NULL siempre se usa IS NULL.", "SELECT nombre FROM clientes\nWHERE fecha_registro = NULL;", "chasqui");
  M("2-50", 2, "bug", "¿Qué está mal en el orden de las cláusulas?", ["ORDER BY debe ir antes de LIMIT", "SELECT debe ir al final", "Falta GROUP BY", "LIMIT no existe en SQLite"], 0, "El orden de escritura es ... ORDER BY, LIMIT.", "SELECT * FROM ventas\nLIMIT 3\nORDER BY monto;", "chasqui");
  M("2-51", 2, "bug", "Quieres cambiar la ciudad de UN cliente. ¿Qué peligro tiene esta sentencia?", ["Sin WHERE actualiza TODOS los clientes", "No funciona en SQLite", "Cambia el nombre de la tabla", "Solo cambia el primero"], 0, "UPDATE sin WHERE afecta todas las filas.", "UPDATE clientes SET ciudad = 'Lima';", "chasqui");
  M("2-52", 2, "bug", "Se quiere el número de ventas por sede. ¿Qué falta?", ["GROUP BY sede", "ORDER BY sede", "DISTINCT", "WHERE sede"], 0, "Mezclar una columna con un agregado exige agrupar por esa columna.", "SELECT sede, COUNT(*) FROM ventas;", "chasqui");
  F("2-53", 2, "orden", "Completa la consulta (toca las palabras en orden):", "SELECT producto, monto\nFROM ventas\n___ monto > 1000\n___ BY monto DESC\n___ 5;", ["WHERE", "ORDER", "LIMIT"], ["HAVING", "GROUP"], "WHERE filtra, ORDER BY ordena y LIMIT corta.");
  F("2-54", 2, "resumen", "Completa con las funciones correctas:", "SELECT ___(monto) AS total,\n       ___(*) AS filas\nFROM ventas;", ["SUM", "COUNT"], ["AVG", "MAX"], "SUM suma valores; COUNT(*) cuenta filas.");
  X("2-55", 2, "sql", "Relaciona cada sublenguaje con su comando:", [["DQL", "SELECT"], ["DML", "INSERT · UPDATE · DELETE"], ["DDL", "CREATE TABLE"], ["DCL", "GRANT · REVOKE"]], "Consultar, manipular, definir y controlar.");
  X("2-56", 2, "resumen", "Relaciona cada función con lo que hace:", [["COUNT(*)", "Cuenta filas"], ["SUM(col)", "Suma valores"], ["AVG(col)", "Promedio de valores no nulos"], ["MAX(col)", "Mayor valor"]], "Las funciones de resumen condensan muchas filas en un valor.");
  U("2-57", 2, "dml", "Marca los comandos que son DML:", ["INSERT", "CREATE TABLE", "UPDATE", "DELETE", "SELECT"], [0, 2, 3], "DML modifica registros. CREATE es DDL; SELECT es DQL.");
  U("2-58", 2, "ddl", "Marca las restricciones válidas en SQLite:", ["PRIMARY KEY", "NOT NULL", "UNIQUE", "LOOP", "CHECK"], [0, 1, 2, 4], "LOOP no es una restricción.");
  M("2-59", 2, "like", "¿Qué texto cumple LIKE 'M_use%'?", ["Mouse inalámbrico", "Monitor 24 pulgadas", "Muse", "Memoria USB 64 GB"], 0, "_ reemplaza exactamente un carácter: M + o + use.");
  M("2-60", 2, "orden", "ORDER BY monto DESC LIMIT 1 devuelve…", ["La fila con el mayor monto", "La fila con el menor monto", "La suma de montos", "Todas las filas"], 0, "DESC ordena de mayor a menor y LIMIT 1 se queda con la primera.");
  S("2-61", 2, "where", "Muestra nombre y precio de los productos de la categoría 'Accesorios' con precio menor a 100.", "chasqui", "SELECT nombre, precio FROM productos WHERE categoria = 'Accesorios' AND precio < 100;", "WHERE con AND", "Dos condiciones con AND.");
  S("2-62", 2, "orden", "Muestra nombre y precio de los 3 productos más baratos.", "chasqui", "SELECT nombre, precio FROM productos ORDER BY precio ASC LIMIT 3;", "ORDER BY precio + LIMIT", "ORDER BY ascendente y LIMIT 3.", true);
  S("2-63", 2, "null", "Cuenta cuántos clientes tienen fecha_registro vacía (NULL).", "chasqui", "SELECT COUNT(*) FROM clientes WHERE fecha_registro IS NULL;", "IS NULL", "Con NULL se usa IS NULL.");

  /* ================= SEMANA 3 ================= */
  X("3-41", 3, "join", "Relaciona cada JOIN con lo que conserva:", [["INNER JOIN", "Solo las coincidencias"], ["LEFT JOIN", "Todo A más las coincidencias de B"], ["RIGHT JOIN", "Todo B más las coincidencias de A"], ["FULL OUTER JOIN", "Todo de ambas tablas"]], "A es la tabla de la izquierda (después de FROM).");
  M("3-42", 3, "bug", "Esta consulta devuelve muchísimas filas repetidas. ¿Qué falta?", ["La condición ON", "Un GROUP BY", "DISTINCT", "Un LIMIT"], 0, "Sin ON se obtiene un producto cartesiano.", "SELECT c.nombre, p.total\nFROM clientes c JOIN pedidos p;", "chasqui");
  M("3-43", 3, "bug", "Esta consulta da error. ¿Por qué?", ["No se puede usar SUM() en WHERE: va en HAVING", "Falta ORDER BY", "sede no existe", "GROUP BY va antes de FROM"], 0, "Las funciones de resumen se filtran con HAVING.", "SELECT sede, SUM(monto) FROM ventas\nWHERE SUM(monto) > 1000\nGROUP BY sede;", "chasqui");
  M("3-44", 3, "bug", "Se buscan clientes sin pedidos pero no sale ninguna fila. ¿Cuál es el error?", ["= NULL en vez de IS NULL", "Debe ser INNER JOIN", "Falta GROUP BY", "p.id_pedido no existe"], 0, "NULL se compara con IS NULL.", "SELECT c.nombre FROM clientes c\nLEFT JOIN pedidos p ON c.id_cliente = p.id_cliente\nWHERE p.id_pedido = NULL;", "chasqui");
  M("3-45", 3, "bug", "¿Qué problema tiene este GROUP BY?", ["canal no está agrupada ni resumida", "COUNT(*) no se puede usar", "Falta HAVING", "sede no existe"], 0, "Toda columna del SELECT debe ir en GROUP BY o dentro de una función de resumen.", "SELECT sede, canal, COUNT(*)\nFROM ventas\nGROUP BY sede;", "chasqui");
  M("3-46", 3, "bug", "¿Qué está mal escrito?", ["HAVING debe ir después de GROUP BY", "COUNT(*) no se permite", "Falta ORDER BY", "Falta WHERE"], 0, "Orden: WHERE, GROUP BY, HAVING.", "SELECT sede FROM ventas\nHAVING COUNT(*) > 3\nGROUP BY sede;", "chasqui");
  N("3-47", 3, "join", "¿Cuántas filas devuelve este LEFT JOIN?", "chasqui", "SELECT * FROM productos pr\nLEFT JOIN detalles_pedido d ON pr.id_producto = d.id_producto;", "rows", "Una fila por cada detalle de pedido más una fila (con NULL) por cada producto nunca vendido.");
  N("3-48", 3, "join", "¿Cuántas filas devuelve este INNER JOIN?", "chasqui", "SELECT * FROM pedidos p\nINNER JOIN detalles_pedido d ON p.id_pedido = d.id_pedido;", "rows", "Una fila por cada detalle que tiene su pedido.");
  N("3-49", 3, "null", "¿Qué valor devuelve? (el cliente 5 no tiene pedidos)", "chasqui", "SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE id_cliente = 5;", "cell", "SUM sobre cero filas es NULL; COALESCE lo convierte en 0.");
  N("3-50", 3, "groupby", "¿Cuántas filas devuelve? (¿cuántos clientes distintos compraron?)", "chasqui", "SELECT id_cliente FROM pedidos GROUP BY id_cliente;", "rows", "Una fila por cada grupo (cliente).");
  N("3-51", 3, "sub", "¿Cuántos pedidos superan el promedio del total?", "chasqui", "SELECT * FROM pedidos\nWHERE total > (SELECT AVG(total) FROM pedidos);", "rows", "La subconsulta calcula el promedio y el WHERE conserva los que lo superan.");
  U("3-52", 3, "join", "Marca los JOIN que pueden devolver filas de A SIN pareja en B:", ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], [1, 3], "LEFT y FULL conservan todo A. RIGHT conserva todo B.");
  U("3-53", 3, "groupby", "Marca las condiciones que van en HAVING:", ["COUNT(*) > 3", "sede = 'Lima'", "SUM(monto) >= 1000", "monto > 50"], [0, 2], "HAVING usa funciones de resumen; sede y monto de cada fila van en WHERE.");
  F("3-54", 3, "join", "Completa el JOIN:", "SELECT c.nombre, p.total\nFROM clientes c\n___ JOIN pedidos p ___ c.id_cliente = p.id_cliente;", ["INNER", "ON"], ["WHERE", "GROUP"], "INNER JOIN … ON une por la clave.");
  F("3-55", 3, "groupby", "Completa con las cláusulas:", "SELECT sede, COUNT(*)\nFROM ventas\n___ canal = 'Web'\n___ BY sede\n___ COUNT(*) >= 6;", ["WHERE", "GROUP", "HAVING"], ["ORDER", "LIMIT"], "WHERE filtra filas; GROUP BY agrupa; HAVING filtra grupos.");
  F("3-56", 3, "join", "Completa el anti-join:", "SELECT c.nombre\nFROM clientes c\nLEFT JOIN pedidos p ON c.id_cliente = p.id_cliente\nWHERE p.id_pedido ___ ___;", ["IS", "NULL"], ["=", "NOT"], "IS NULL aísla las filas sin pareja.");
  M("3-57", 3, "groupby", "Un cliente tiene 3 pedidos en total, pero solo 1 en septiembre. Con WHERE fecha >= '2026-09-01' … GROUP BY cliente HAVING COUNT(*) >= 2, ¿aparece?", ["No: el WHERE deja 1 pedido y el HAVING pide 2", "Sí: tiene 3 pedidos", "Sí: HAVING no mira el WHERE", "Depende del ORDER BY"], 0, "WHERE se ejecuta antes de agrupar: cuenta solo los pedidos de septiembre.");
  M("3-58", 3, "groupby", "Hay dos clientes llamados Carlos Mendoza. ¿Por qué agrupar por id_cliente y no solo por nombre?", ["El nombre puede repetirse entre personas distintas", "El id es más corto", "SQL exige agrupar por números", "No hay diferencia"], 0, "La identidad es la clave, no el nombre: agrupar por nombre mezclaría a ambas personas.");
  M("3-59", 3, "sub", "¿Por qué no se compara el monto acumulado por cliente con el promedio por pedido?", ["Son medidas distintas", "El promedio no sirve", "Solo se compara en septiembre", "SQLite no lo permite"], 0, "Un cliente suma varios pedidos: hay que comparar acumulado con acumulado.");
  M("3-60", 3, "null", "El cliente que lidera en monto acumulado, ¿es el más rentable?", ["No necesariamente: faltan costos y márgenes", "Sí, siempre", "Solo si es de Lima", "Solo si compró en septiembre"], 0, "Monto ≠ utilidad: se necesita más información antes de dar beneficios.");
  M("3-61", 3, "join", "RIGHT JOIN da el error «not currently supported». Causa probable:", ["Una versión de SQLite anterior a 3.39", "Falta ON", "La tabla no existe", "Falta GROUP BY"], 0, "RIGHT y FULL OUTER JOIN existen desde SQLite 3.39.0; se verifica con sqlite_version().");
  M("3-62", 3, "join", "En un FULL JOIN de agosto vs septiembre, una fila con NULL en la columna de septiembre indica que el cliente…", ["Solo compró en agosto", "Solo compró en septiembre", "Compró en ambos meses", "No existe"], 0, "No hay pareja en septiembre → NULL.");
  M("3-63", 3, "sub", "Creas una vista hoy. Mañana se insertan pedidos nuevos. Al consultar la vista…", ["Refleja los datos nuevos", "Muestra los datos de ayer", "Da error", "Se borra"], 0, "La vista guarda la consulta, no los datos.");
  S("3-64", 3, "join", "Muestra el nombre de cada cliente y cuántos pedidos tiene (0 si ninguno). Agrupa correctamente.", "chasqui", "SELECT c.nombre, COUNT(p.id_pedido) FROM clientes c LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente GROUP BY c.id_cliente;", "LEFT JOIN + COUNT(p.id_pedido) + GROUP BY c.id_cliente", "COUNT de una columna de B da 0 para los sin pedido; GROUP BY id mantiene separados a los homónimos.");
  S("3-65", 3, "groupby", "Calcula el ingreso por categoría de producto: categoria y SUM(cantidad × precio_unitario) usando detalles_pedido y productos.", "chasqui", "SELECT pr.categoria, SUM(d.cantidad * d.precio_unitario) FROM detalles_pedido d JOIN productos pr ON d.id_producto = pr.id_producto GROUP BY pr.categoria;", "JOIN + GROUP BY categoria", "El ingreso sale de las líneas de detalle.");
  S("3-66", 3, "groupby", "Muestra las categorías con ingreso de al menos 10000 (categoria y la suma), desde detalles_pedido y productos.", "chasqui", "SELECT pr.categoria, SUM(d.cantidad * d.precio_unitario) FROM detalles_pedido d JOIN productos pr ON d.id_producto = pr.id_producto GROUP BY pr.categoria HAVING SUM(d.cantidad * d.precio_unitario) >= 10000;", "HAVING SUM(...) >= 10000", "El umbral sobre un resumen va en HAVING.");
  S("3-67", 3, "join", "Muestra el nombre de los clientes de Piura que NO tienen pedidos.", "chasqui", "SELECT c.nombre FROM clientes c LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE c.ciudad = 'Piura' AND p.id_pedido IS NULL;", "LEFT JOIN + IS NULL + ciudad", "Anti-join con un filtro adicional por ciudad.");

  /* ================= SEMANA 4 ================= */
  X("4-31", 4, "normalizacion", "Relaciona cada forma normal con su regla:", [["1FN", "Celdas atómicas y clave definida"], ["2FN", "Sin dependencias parciales"], ["3FN", "Sin dependencias transitivas"]], "La clave, toda la clave y nada más que la clave.");
  X("4-32", 4, "cardinalidad", "Relaciona cada cardinalidad con un ejemplo:", [["1:1", "Persona – DNI"], ["1:N", "Cliente – Ventas"], ["N:M", "Producto – Pedido"]], "N:M se resuelve con una tabla intermedia.");
  X("4-33", 4, "anomalias", "Relaciona cada anomalía con su síntoma:", [["Actualización", "Cambiar un distrito exige corregir varias filas"], ["Inserción", "No puedo registrar un producto que aún no se vende"], ["Eliminación", "Al borrar una venta pierdo que el producto existe"]], "Son consecuencias de la redundancia.");
  U("4-34", 4, "modelo", "Marca las ventajas de separar entidades en tablas:", ["Un dato se corrige en un solo lugar", "Se reducen las anomalías", "Las consultas nunca necesitan JOIN", "Cada hecho vive en un solo lugar"], [0, 1, 3], "Se gana consistencia; a cambio se usan JOIN para reunir la información.");
  U("4-35", 4, "normalizacion", "Marca lo que cumple la 1FN:", ["Un valor por celda", "Una celda con 'Pan, Jugo'", "Una clave que identifica cada fila", "Columnas repetidas tel1, tel2, tel3"], [0, 2], "Valores atómicos y sin grupos repetidos.");
  M("4-36", 4, "normalizacion", "Se agrega telefono_proveedor a productos (un proveedor abastece varios productos). ¿Qué forma normal se viola?", ["3FN: depende del proveedor, no del producto (transitiva)", "1FN", "2FN siempre", "Ninguna"], 0, "id_producto → id_proveedor → telefono: dependencia transitiva. Solución: tabla proveedores.");
  M("4-37", 4, "ddl", "Un cliente quiere varios productos distintos en una sola venta. ¿Qué habría que crear?", ["Una tabla detalle_venta (id_venta, id_producto, cantidad)", "Más columnas producto1, producto2…", "Repetir la fila de ventas", "Nada: ya se puede"], 0, "Se separa cabecera y detalle: PK compuesta (id_venta, id_producto).");
  M("4-38", 4, "cardinalidad", "¿Cómo se implementa «máximo una credencial vigente por empleado» (1:1)?", ["Declarando UNIQUE la FK id_empleado en credenciales", "Con otra tabla intermedia", "Con COUNT en cada consulta", "No se puede"], 0, "UNIQUE impide repetir el empleado.");
  M("4-39", 4, "cardinalidad", "En una tabla intermedia producto_categoria, la clave primaria correcta es…", ["La pareja (id_producto, id_categoria)", "Solo id_producto", "Solo id_categoria", "Ninguna"], 0, "El par es único; con una sola columna no podría haber relaciones N:M.");
  M("4-40", 4, "ddl", "Con PRAGMA foreign_keys = ON, un INSERT con un id_cliente inexistente…", ["Falla: FOREIGN KEY constraint failed", "Funciona y crea el cliente", "Funciona y deja NULL", "Borra la tabla"], 0, "Integridad referencial.");
  M("4-41", 4, "ddl", "En SQLite, sin PRAGMA foreign_keys = ON…", ["No se verifican las claves foráneas", "Se verifican igual", "No se pueden crear FK", "Solo falla DELETE"], 0, "Viene desactivada por defecto en cada conexión.");
  M("4-42", 4, "ddl", "PRAGMA foreign_key_check no devuelve filas. Significa que…", ["No hay referencias rotas", "Hay errores graves", "No hay FK", "La tabla está vacía"], 0, "Cada fila devuelta sería una referencia inválida.");
  M("4-43", 4, "modelo", "¿Por qué el total de la venta no se guarda en la tabla ventas?", ["Se calcula con cantidad × precio_unitario (dato derivado)", "SQLite no guarda números", "Es ilegal", "Ocupa mucho espacio siempre"], 0, "Guardar el total duplicaría información que puede quedar inconsistente.");
  M("4-44", 4, "normalizacion", "Una tabla repite el nombre de una ciudad en varias filas. ¿Eso prueba que viola 1FN o 2FN?", ["No: hay que revisar atomicidad, clave y dependencias", "Sí, siempre", "Solo viola 3FN siempre", "Solo si es texto"], 0, "La repetición sola no demuestra una violación.");
  N("4-45", 4, "join", "¿Cuántas ventas tiene el local 2?", "yaku", "SELECT * FROM ventas WHERE id_local = 2;", "rows", "Filtra por la FK id_local.");
  N("4-46", 4, "resumen", "¿Cuántas unidades se vendieron en total?", "yaku", "SELECT SUM(cantidad) FROM ventas;", "cell", "SUM(cantidad) suma unidades (no registros).");
  N("4-47", 4, "anomalias", "¿Cuántas veces aparece Ana Torres en ventas_original?", "yaku", "SELECT COUNT(*) FROM ventas_original WHERE cliente_nombre = 'Ana Torres';", "cell", "Su nombre y distrito se repiten en cada una de sus ventas.");
  N("4-48", 4, "join", "¿Cuántas filas devuelve este LEFT JOIN categorias–productos?", "yaku", "SELECT g.nombre, p.nombre FROM categorias g\nLEFT JOIN productos p ON g.id_categoria = p.id_categoria;", "rows", "Cada categoría con cada uno de sus productos; todas tienen al menos uno.");
  M("4-49", 4, "bug", "Al ejecutar esto con las FK activas, el INSERT de una venta falla aunque el cliente existe. ¿Cuál es el problema probable?", ["La tabla ventas se creó antes que clientes (padre)", "Falta ORDER BY", "NOT NULL sobra", "REAL no existe"], 0, "Hay que crear primero las tablas padre y después las hijas.", "CREATE TABLE ventas (\n  id_venta INTEGER PRIMARY KEY,\n  id_cliente INTEGER,\n  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)\n);\n-- clientes se crea DESPUÉS");
  M("4-50", 4, "bug", "¿Qué le falta a esta tabla para identificar cada producto?", ["Una PRIMARY KEY", "Un ORDER BY", "Un JOIN", "Un LIMIT"], 0, "Toda tabla necesita una clave primaria.", "CREATE TABLE productos (\n  id_producto INTEGER,\n  nombre TEXT NOT NULL\n);");
  F("4-51", 4, "ddl", "Completa el CREATE TABLE:", "CREATE TABLE productos (\n  id_producto INTEGER ___ KEY,\n  nombre TEXT ___ NULL,\n  id_categoria INTEGER,\n  ___ KEY (id_categoria) REFERENCES categorias(id_categoria)\n);", ["PRIMARY", "NOT", "FOREIGN"], ["UNIQUE", "DEFAULT"], "PRIMARY KEY, NOT NULL y FOREIGN KEY.");
  S("4-52", 4, "groupby", "Cuenta cuántas ventas hay por método de pago (metodo_pago y la cantidad).", "yaku", "SELECT metodo_pago, COUNT(*) FROM ventas GROUP BY metodo_pago;", "GROUP BY metodo_pago", "COUNT(*) por grupo.");
  S("4-53", 4, "join", "Calcula el ingreso por local: nombre del local y SUM(cantidad × precio_unitario).", "yaku", "SELECT l.nombre, SUM(v.cantidad * p.precio_unitario) FROM ventas v JOIN productos p ON v.id_producto = p.id_producto JOIN locales l ON v.id_local = l.id_local GROUP BY l.id_local;", "ventas JOIN productos JOIN locales + GROUP BY", "El ingreso se calcula con el precio del producto.");
  S("4-54", 4, "groupby", "Muestra nombre de producto y unidades vendidas (SUM de cantidad), de mayor a menor.", "yaku", "SELECT p.nombre, SUM(v.cantidad) AS unidades FROM ventas v JOIN productos p ON v.id_producto = p.id_producto GROUP BY p.id_producto ORDER BY unidades DESC;", "JOIN + SUM + ORDER BY DESC", "Unidades ≠ registros ≠ ingreso.", true);

  /* ================================================================
     GENERADORES: la pregunta cambia de datos en cada sesión y la
     respuesta sale de ejecutar SQL en vivo (no se puede memorizar).
     ================================================================ */
  const G = (id, sem, topic, titulo, fn) => Q.push({ id, sem, topic, type: "gen", q: "Pregunta dinámica: " + titulo, why: "", fn });
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const ri = (a, b) => a + ((Math.random() * (b - a + 1)) | 0);
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const SEDES = ["Lima", "Arequipa", "Trujillo", "Piura"], CIUDADES = ["Lima", "Arequipa", "Trujillo", "Piura", "Cusco"], CATS = ["Cómputo", "Celulares", "Accesorios"];

  G("g-count", 2, "where", "contar filas con filtros", async () => {
    const v = ri(0, 2);
    if (v === 0) { const s = pick(SEDES), c = pick(["Web", "Tienda"]); return { type: "num", db: "chasqui", calc: "cell", code: `SELECT COUNT(*) FROM ventas\nWHERE sede = '${s}' AND canal = '${c}';`, q: `¿Cuántas ventas hay en la sede ${s} por el canal ${c}?`, why: "COUNT(*) con dos condiciones unidas por AND." }; }
    if (v === 1) { const c = pick(CATS), k = ri(2, 3); return { type: "num", db: "chasqui", calc: "cell", code: `SELECT COUNT(*) FROM ventas\nWHERE categoria = '${c}' AND unidades >= ${k};`, q: `¿Cuántas ventas de la categoría ${c} tienen ${k} o más unidades?`, why: "Filtra con WHERE y cuenta con COUNT(*)." }; }
    const s = pick(SEDES); return { type: "num", db: "chasqui", calc: "cell", code: `SELECT COUNT(DISTINCT producto) FROM ventas\nWHERE sede = '${s}';`, q: `¿Cuántos productos distintos se vendieron en ${s}?`, why: "COUNT(DISTINCT) no cuenta repetidos." };
  });
  G("g-agg", 2, "resumen", "funciones de resumen", async () => {
    const f = pick([["SUM", "el ingreso total (SUM)"], ["AVG", "el monto promedio (AVG)"], ["MAX", "el monto máximo (MAX)"], ["MIN", "el monto mínimo (MIN)"]]), c = pick(CATS), s = pick(SEDES), usar = Math.random() < 0.5;
    const donde = usar ? `categoria = '${c}'` : `sede = '${s}'`, tit = usar ? `la categoría ${c}` : `la sede ${s}`;
    return { type: "num", db: "chasqui", calc: "cell", round: 0, code: `SELECT ${f[0]}(monto) FROM ventas\nWHERE ${donde};`, q: `¿Cuál es ${f[1]} de ${tit}? (redondea al entero más cercano)`, why: `${f[0]}(monto) resume el grupo filtrado por WHERE.` };
  });
  G("g-null", 2, "null", "NULL en las funciones de resumen", async () => {
    const n = ri(5, 6), vals = Array.from({ length: n }, () => ri(1, 9) * 10), nulos = shuf([...Array(n).keys()]).slice(0, ri(1, 3));
    nulos.forEach((i) => (vals[i] = null));
    const ok = vals.filter((v) => v !== null), pregunta = pick([["COUNT(*)", n], ["COUNT(nota)", ok.length], ["SUM(nota)", ok.reduce((a, b) => a + b, 0)], ["AVG(nota)", +(ok.reduce((a, b) => a + b, 0) / ok.length).toFixed(2)]]);
    const motivos = { "COUNT(*)": "COUNT(*) cuenta todas las filas, incluso con NULL.", "COUNT(nota)": "COUNT(columna) ignora los NULL.", "SUM(nota)": "SUM ignora los NULL.", "AVG(nota)": "AVG promedia solo los valores no nulos (divide entre la cantidad de no nulos)." };
    return { type: "num", q: `La columna nota de una tabla tiene estas ${n} filas:\n${vals.map((v) => (v === null ? "NULL" : v)).join(", ")}\n¿Qué devuelve ${pregunta[0]}?`, ans: pregunta[1], why: motivos[pregunta[0]] };
  });
  G("g-having", 3, "groupby", "GROUP BY con HAVING", async () => {
    const t = pick([
      () => { const n = ri(14, 19); return { db: "chasqui", code: `SELECT sede, COUNT(*) FROM ventas\nGROUP BY sede\nHAVING COUNT(*) > ${n};`, q: "¿Cuántas filas devuelve esta consulta?" }; },
      () => { const n = pick([5000, 40000, 60000, 80000]); return { db: "chasqui", code: `SELECT categoria, SUM(monto) FROM ventas\nGROUP BY categoria\nHAVING SUM(monto) > ${n};`, q: "¿Cuántas filas devuelve esta consulta?" }; },
      () => { const n = ri(3, 7); return { db: "chasqui", code: `SELECT ciudad, COUNT(*) FROM clientes\nGROUP BY ciudad\nHAVING COUNT(*) >= ${n};`, q: "¿Cuántas ciudades devuelve esta consulta?" }; },
      () => { const n = ri(1, 3); return { db: "chasqui", code: `SELECT id_cliente, COUNT(*) FROM pedidos\nGROUP BY id_cliente\nHAVING COUNT(*) >= ${n};`, q: "¿Cuántos clientes devuelve esta consulta?" }; },
    ])();
    return { type: "num", db: t.db, calc: "rows", code: t.code, q: t.q, why: "Primero se forman los grupos y después HAVING descarta los que no cumplen." };
  });
  G("g-joinrows", 3, "join", "filas de un JOIN", async () => {
    const v = ri(0, 3), c = pick(CIUDADES);
    if (v === 0) return { type: "num", db: "chasqui", calc: "rows", code: `SELECT * FROM clientes c\nINNER JOIN pedidos p ON c.id_cliente = p.id_cliente\nWHERE c.ciudad = '${c}';`, q: `¿Cuántas filas devuelve este INNER JOIN (clientes de ${c})?`, why: "Una fila por cada pedido de clientes de esa ciudad." };
    if (v === 1) return { type: "num", db: "chasqui", calc: "rows", code: `SELECT * FROM clientes c\nLEFT JOIN pedidos p ON c.id_cliente = p.id_cliente\nWHERE c.ciudad = '${c}';`, q: `¿Cuántas filas devuelve este LEFT JOIN (clientes de ${c})?`, why: "Una fila por pedido, más una fila (con NULL) por cada cliente sin pedidos." };
    if (v === 2) { const k = pick(CATS); return { type: "num", db: "chasqui", calc: "rows", code: `SELECT * FROM productos pr\nLEFT JOIN detalles_pedido d ON pr.id_producto = d.id_producto\nWHERE pr.categoria = '${k}';`, q: `¿Cuántas filas devuelve este LEFT JOIN (productos de ${k})?`, why: "Una fila por detalle y una por cada producto sin ventas." }; }
    const k = pick(CATS); return { type: "num", db: "chasqui", calc: "rows", code: `SELECT * FROM detalles_pedido d\nINNER JOIN productos pr ON d.id_producto = pr.id_producto\nWHERE pr.categoria = '${k}';`, q: `¿Cuántas líneas de detalle hay de la categoría ${k}?`, why: "INNER JOIN conserva solo los detalles con producto." };
  });
  G("g-anti", 3, "join", "anti-join", async () => {
    const v = ri(0, 2);
    if (v === 0) return { type: "num", db: "chasqui", calc: "rows", code: "SELECT c.nombre FROM clientes c\nLEFT JOIN pedidos p ON c.id_cliente = p.id_cliente\nWHERE p.id_pedido IS NULL;", q: "¿Cuántos clientes devuelve esta consulta?", why: "LEFT JOIN + IS NULL aísla a los clientes sin pedidos." };
    if (v === 1) { const c = pick(CIUDADES); return { type: "num", db: "chasqui", calc: "rows", code: `SELECT c.nombre FROM clientes c\nLEFT JOIN pedidos p ON c.id_cliente = p.id_cliente\nWHERE c.ciudad = '${c}' AND p.id_pedido IS NULL;`, q: `¿Cuántos clientes de ${c} no tienen pedidos?`, why: "Anti-join con un filtro de ciudad. Puede dar 0." }; }
    const k = pick(CATS); return { type: "num", db: "chasqui", calc: "rows", code: `SELECT pr.nombre FROM productos pr\nLEFT JOIN detalles_pedido d ON pr.id_producto = d.id_producto\nWHERE pr.categoria = '${k}' AND d.id_detalle IS NULL;`, q: `¿Cuántos productos de ${k} nunca se vendieron?`, why: "Anti-join desde productos hacia detalles." };
  });
  G("g-top", 3, "groupby", "lectura de un ranking", async (ctx) => {
    for (let i = 0; i < 12; i++) {
      const bySede = Math.random() < 0.6, otro = bySede ? pick(["Web", "Tienda"]) : pick(SEDES);
      const col = bySede ? "sede" : "categoria", filtro = bySede ? `canal = '${otro}'` : `sede = '${otro}'`;
      const code = `SELECT ${col}, SUM(monto) AS ingreso\nFROM ventas\nWHERE ${filtro}\nGROUP BY ${col}\nORDER BY ingreso DESC\nLIMIT 1;`;
      const res = await ctx.run("chasqui", `SELECT ${col}, SUM(monto) AS t FROM ventas WHERE ${filtro} GROUP BY ${col} ORDER BY t DESC`);
      if (!res.rows || res.rows.length < 2 || res.rows[0][1] === res.rows[1][1]) continue;
      const opts = bySede ? SEDES : CATS, a = opts.indexOf(res.rows[0][0]);
      if (a < 0) continue;
      return { type: "mcq", code, db: "chasqui", q: `¿Qué ${bySede ? "sede" : "categoría"} devuelve esta consulta?`, opts, a, why: "ORDER BY … DESC + LIMIT 1 deja solo el grupo con mayor suma." };
    }
    return { type: "mcq", q: "¿Qué hace ORDER BY ingreso DESC LIMIT 1?", opts: ["Devuelve el grupo de mayor ingreso", "Devuelve el de menor ingreso", "Suma todo", "Cuenta filas"], a: 0, why: "DESC + LIMIT 1 = el mayor." };
  });
  const SENT = [
    ["ventas con monto mayor a {n}", 0], ["pedidos del mes de agosto", 0], ["productos con precio menor a {n}", 0], ["clientes de la ciudad {c}", 0],
    ["sedes con más de {k} ventas", 1], ["clientes con 2 o más pedidos", 1], ["categorías cuyo ingreso total supera {n}", 1], ["ciudades con al menos {k} clientes", 1],
    ["pedidos de septiembre y, de ellos, los clientes con 2 o más pedidos", 2], ["ventas Web y, de ellas, las sedes con más de {k} ventas", 2],
  ];
  G("g-wh", 3, "groupby", "WHERE o HAVING", async () => {
    const [txt, a] = pick(SENT), f = txt.replace("{n}", pick([500, 1000, 5000, 10000])).replace("{k}", ri(2, 8)).replace("{c}", pick(CIUDADES));
    return { type: "mcq", q: `Quieres obtener: «${f}». ¿Qué cláusula usas?`, opts: ["Solo WHERE", "Solo HAVING", "WHERE y después HAVING", "Ninguna de las dos"], a, why: "WHERE filtra filas antes de agrupar; HAVING filtra grupos (resúmenes). Si hay ambas ideas, se usan los dos en ese orden." };
  });
  G("g-sql", 3, "groupby", "escribir una consulta con parámetros", async () => {
    const v = ri(0, 3);
    if (v === 0) { const s = pick(SEDES), n = pick([500, 1000, 2000]); return { type: "sql", db: "chasqui", q: `Muestra venta_id y monto de las ventas de la sede ${s} con monto mayor a ${n}.`, solution: `SELECT venta_id, monto FROM ventas WHERE sede = '${s}' AND monto > ${n};`, hint: "WHERE con AND", why: "Dos condiciones sobre cada fila: WHERE.", ordered: false }; }
    if (v === 1) { const c = pick(["Web", "Tienda"]); return { type: "sql", db: "chasqui", q: `Cuenta las ventas por categoría solo del canal ${c} (categoria y la cantidad).`, solution: `SELECT categoria, COUNT(*) FROM ventas WHERE canal = '${c}' GROUP BY categoria;`, hint: "WHERE antes del GROUP BY", why: "WHERE filtra filas antes de agrupar.", ordered: false }; }
    if (v === 2) { const n = ri(14, 18); return { type: "sql", db: "chasqui", q: `Muestra las sedes con más de ${n} ventas (sede y la cantidad).`, solution: `SELECT sede, COUNT(*) FROM ventas GROUP BY sede HAVING COUNT(*) > ${n};`, hint: "GROUP BY + HAVING", why: "La condición sobre un COUNT va en HAVING.", ordered: false }; }
    const c = pick(CIUDADES); return { type: "sql", db: "chasqui", q: `Muestra el nombre de los clientes de ${c} que SÍ tienen al menos un pedido (sin repetir nombres).`, solution: `SELECT DISTINCT c.nombre FROM clientes c INNER JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE c.ciudad = '${c}';`, hint: "INNER JOIN + DISTINCT", why: "INNER JOIN deja a los que tienen pedidos; DISTINCT evita repetirlos.", ordered: false };
  });
  const EJEC = ["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY", "LIMIT"], ESCR = ["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"];
  G("g-orden", 3, "groupby", "orden de cláusulas", async () => {
    const ejec = Math.random() < 0.5, base = ejec ? EJEC : ESCR, n = ri(4, 6), sub = shuf(base).slice(0, n).sort((a, b) => base.indexOf(a) - base.indexOf(b));
    return { type: "order", q: ejec ? "Ordena estas fases según el orden en que SQL las EJECUTA:" : "Ordena estas cláusulas según el orden en que se ESCRIBEN:", items: sub, why: (ejec ? "Se ejecuta: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT." : "Se escribe: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.") };
  });
  const NORM = [
    ["Una celda guarda «Pan, Jugo» como un solo texto.", 0], ["Una columna telefonos contiene «999111, 988222».", 0], ["Existen las columnas tel1, tel2, tel3 para el mismo cliente.", 0],
    ["Clave (id_pedido, id_producto) y nombre_producto depende solo de id_producto.", 1], ["Clave (id_alumno, id_curso) y nombre_curso depende solo de id_curso.", 1],
    ["id_venta → id_cliente → distrito_cliente: el distrito se obtiene a través del cliente.", 2], ["id_producto → id_categoria → nombre_categoria.", 2], ["id_empleado → id_area → jefe_area.", 2],
    ["Clave simple id_cliente; nombre y distrito dependen de id_cliente; celdas atómicas.", 3], ["Tabla categorias(id_categoria, nombre): cada atributo depende de la clave.", 3],
  ];
  G("g-norm", 4, "normalizacion", "diagnóstico de forma normal", async () => {
    const [txt, a] = pick(NORM);
    return { type: "mcq", q: `¿Qué ocurre en este caso?\n«${txt}»`, opts: ["Viola la 1FN (no atómico)", "Viola la 2FN (dependencia parcial)", "Viola la 3FN (dependencia transitiva)", "No viola ninguna de las tres"], a, why: "1FN: celdas atómicas. 2FN: dependencia de toda la clave compuesta. 3FN: ningún atributo depende de otro no clave." };
  });
  const CARD = [["Cliente", "Venta", "1:N"], ["Persona", "DNI", "1:1"], ["Alumno", "Curso", "N:M"], ["Autor", "Libro", "N:M"], ["País", "Capital", "1:1"], ["Madre", "Hijo", "1:N"], ["Pedido", "Producto", "N:M"], ["Local", "Venta", "1:N"], ["Categoría", "Producto", "1:N"], ["Empleado", "Credencial vigente (máx. una)", "1:1"], ["Médico", "Paciente", "N:M"], ["Departamento", "Empleado", "1:N"]];
  G("g-card", 4, "cardinalidad", "cardinalidad", async () => {
    const [a, b, k] = pick(CARD), v = Math.random() < 0.5;
    if (v) return { type: "mcq", q: `¿Qué cardinalidad hay entre ${a} y ${b}? (una fila de ${a} se relaciona con…)`, opts: ["1:1", "1:N", "N:M"], a: ["1:1", "1:N", "N:M"].indexOf(k), why: "1:1 una con una · 1:N una con muchas · N:M muchas con muchas (tabla intermedia)." };
    const donde = k === "1:N" ? 1 : k === "1:1" ? 2 : 3;
    return { type: "mcq", q: `La relación ${a} – ${b} es ${k}. ¿Cómo se implementa en tablas?`, opts: [`FK en la tabla de ${a}`, `FK en la tabla de ${b} (lado N)`, `FK en ${b} declarada UNIQUE`, "Tabla intermedia con dos FK"], a: donde === 1 ? 1 : donde === 2 ? 2 : 3, why: "1:N → FK en el lado N. 1:1 → FK + UNIQUE. N:M → tabla intermedia." };
  });
  G("g-yaku", 4, "join", "contar con el modelo de Café Yaku", async () => {
    const v = ri(0, 3), clientes = ["Ana Torres", "Luis Ramos", "María Pérez", "Carlos Ríos", "Rosa Díaz", "Jorge Lima"], locales = ["Café Yaku Central", "Café Yaku Norte", "Café Yaku Plaza"], cats = ["Panes", "Pasteles", "Bebidas", "Salados"];
    if (v === 0) { const c = pick(clientes); return { type: "num", db: "yaku", calc: "cell", code: `SELECT COUNT(*) FROM ventas v\nJOIN clientes c ON v.id_cliente = c.id_cliente\nWHERE c.nombre = '${c}';`, q: `¿Cuántas ventas registró ${c}?`, why: "Se reúne ventas con clientes por la FK." }; }
    if (v === 1) { const l = pick(locales); return { type: "num", db: "yaku", calc: "cell", code: `SELECT SUM(v.cantidad) FROM ventas v\nJOIN locales l ON v.id_local = l.id_local\nWHERE l.nombre = '${l}';`, q: `¿Cuántas unidades vendió ${l}?`, why: "SUM(cantidad) suma unidades, no registros." }; }
    if (v === 2) { const c = pick(cats); return { type: "num", db: "yaku", calc: "cell", round: 0, code: `SELECT SUM(v.cantidad * p.precio_unitario)\nFROM ventas v\nJOIN productos p ON v.id_producto = p.id_producto\nJOIN categorias g ON p.id_categoria = g.id_categoria\nWHERE g.nombre = '${c}';`, q: `¿Cuál es el ingreso de la categoría ${c}? (redondea al entero más cercano)`, why: "El ingreso se calcula: cantidad × precio_unitario." }; }
    const m = pick(["Efectivo", "Yape", "Tarjeta"]); return { type: "num", db: "yaku", calc: "cell", code: `SELECT COUNT(*) FROM ventas\nWHERE metodo_pago = '${m}';`, q: `¿Cuántas ventas se pagaron con ${m}?`, why: "COUNT(*) con WHERE sobre metodo_pago." };
  });

  FGD.pregPorId = Object.fromEntries(FGD.preguntas.map((q) => [q.id, q]));
})();
