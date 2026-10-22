/* Taller de modelado: lees reglas de negocio, escribes el CREATE TABLE y la web comprueba tu diseño
   (tablas, columnas, claves primarias, claves foráneas, UNIQUE y pruebas de integridad). */
window.FGD = window.FGD || {};
(function () {
  const T = [];
  const t = (o) => T.push(o);

  t({ id: "t1", titulo: "Biblioteca de barrio", nivel: 1, color: "var(--sky)",
    reglas: ["La biblioteca registra a sus <strong>socios</strong> (nombre y correo; el correo no se puede repetir).", "Cada <strong>libro</strong> tiene título y autor.", "Un socio puede pedir prestados muchos libros y un libro puede ser prestado muchas veces (en fechas distintas). Cada <strong>préstamo</strong> guarda la fecha de préstamo y la de devolución."],
    pista: "Socio y Libro son N:M → necesitas una tabla intermedia (prestamos) con dos FK. Crea primero las tablas padre.",
    spec: { tablas: {
      socios: { cols: ["id_socio", "nombre", "correo"], pk: ["id_socio"], unique: [["correo"]] },
      libros: { cols: ["id_libro", "titulo", "autor"], pk: ["id_libro"] },
      prestamos: { cols: ["id_prestamo", "id_socio", "id_libro", "fecha_prestamo", "fecha_devolucion"], pk: ["id_prestamo"], fk: { id_socio: "socios", id_libro: "libros" } } },
      pruebas: [
        { desc: "Rechaza un préstamo de un socio que no existe", setup: ["INSERT INTO libros (id_libro, titulo, autor) VALUES (1, 'Datos', 'Edir')"], bad: "INSERT INTO prestamos (id_prestamo, id_socio, id_libro, fecha_prestamo) VALUES (1, 99, 1, '2026-01-01')" },
        { desc: "Rechaza dos socios con el mismo correo", setup: ["INSERT INTO socios (id_socio, nombre, correo) VALUES (1, 'Ana', 'a@x.pe')"], bad: "INSERT INTO socios (id_socio, nombre, correo) VALUES (2, 'Luis', 'a@x.pe')" } ] },
    solucion: "CREATE TABLE socios (\n  id_socio INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  correo TEXT UNIQUE\n);\nCREATE TABLE libros (\n  id_libro INTEGER PRIMARY KEY,\n  titulo TEXT NOT NULL,\n  autor TEXT\n);\nCREATE TABLE prestamos (\n  id_prestamo INTEGER PRIMARY KEY,\n  id_socio INTEGER NOT NULL,\n  id_libro INTEGER NOT NULL,\n  fecha_prestamo TEXT NOT NULL,\n  fecha_devolucion TEXT,\n  FOREIGN KEY (id_socio) REFERENCES socios(id_socio),\n  FOREIGN KEY (id_libro) REFERENCES libros(id_libro)\n);" });

  t({ id: "t2", titulo: "Clínica", nivel: 2, color: "var(--teal)",
    reglas: ["Cada <strong>médico</strong> tiene una única <strong>especialidad</strong>, pero una especialidad agrupa a muchos médicos.", "Los <strong>pacientes</strong> se identifican también por su DNI (único).", "Una <strong>cita</strong> relaciona a un paciente con un médico en una fecha y hora. Un paciente puede tener muchas citas y un médico también."],
    pista: "Especialidad–Médico es 1:N: la FK va en medicos. Paciente–Médico es N:M: la tabla intermedia es citas.",
    spec: { tablas: {
      especialidades: { cols: ["id_especialidad", "nombre"], pk: ["id_especialidad"] },
      medicos: { cols: ["id_medico", "nombre", "id_especialidad"], pk: ["id_medico"], fk: { id_especialidad: "especialidades" } },
      pacientes: { cols: ["id_paciente", "nombre", "dni"], pk: ["id_paciente"], unique: [["dni"]] },
      citas: { cols: ["id_cita", "id_paciente", "id_medico", "fecha_hora"], pk: ["id_cita"], fk: { id_paciente: "pacientes", id_medico: "medicos" } } },
      pruebas: [
        { desc: "Rechaza una cita de un paciente inexistente", setup: ["INSERT INTO especialidades (id_especialidad, nombre) VALUES (1, 'Pediatría')", "INSERT INTO medicos (id_medico, nombre, id_especialidad) VALUES (1, 'Dra. Lara', 1)"], bad: "INSERT INTO citas (id_cita, id_paciente, id_medico, fecha_hora) VALUES (1, 50, 1, '2026-05-01 10:00')" },
        { desc: "Rechaza dos pacientes con el mismo DNI", setup: ["INSERT INTO pacientes (id_paciente, nombre, dni) VALUES (1, 'Rosa', '12345678')"], bad: "INSERT INTO pacientes (id_paciente, nombre, dni) VALUES (2, 'Pedro', '12345678')" } ] },
    solucion: "CREATE TABLE especialidades (\n  id_especialidad INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL\n);\nCREATE TABLE medicos (\n  id_medico INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  id_especialidad INTEGER NOT NULL,\n  FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)\n);\nCREATE TABLE pacientes (\n  id_paciente INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  dni TEXT NOT NULL UNIQUE\n);\nCREATE TABLE citas (\n  id_cita INTEGER PRIMARY KEY,\n  id_paciente INTEGER NOT NULL,\n  id_medico INTEGER NOT NULL,\n  fecha_hora TEXT NOT NULL,\n  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),\n  FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)\n);" });

  t({ id: "t3", titulo: "Escuela y notas", nivel: 2, color: "var(--coral)",
    reglas: ["Hay <strong>alumnos</strong> y <strong>cursos</strong>.", "Un alumno se matricula en muchos cursos y un curso tiene muchos alumnos. La <strong>matrícula</strong> guarda la nota (de 0 a 20).", "Un alumno no puede matricularse dos veces en el mismo curso."],
    pista: "La tabla matriculas puede tener una clave primaria COMPUESTA (id_alumno, id_curso) y la nota debe llevar un CHECK entre 0 y 20.",
    spec: { tablas: {
      alumnos: { cols: ["id_alumno", "nombre"], pk: ["id_alumno"] },
      cursos: { cols: ["id_curso", "nombre"], pk: ["id_curso"] },
      matriculas: { cols: ["id_alumno", "id_curso", "nota"], pk: ["id_alumno", "id_curso"], fk: { id_alumno: "alumnos", id_curso: "cursos" } } },
      pruebas: [
        { desc: "Rechaza matricular dos veces al mismo alumno en el mismo curso", setup: ["INSERT INTO alumnos (id_alumno, nombre) VALUES (1, 'Ana')", "INSERT INTO cursos (id_curso, nombre) VALUES (1, 'Datos')", "INSERT INTO matriculas (id_alumno, id_curso, nota) VALUES (1, 1, 15)"], bad: "INSERT INTO matriculas (id_alumno, id_curso, nota) VALUES (1, 1, 16)" },
        { desc: "Rechaza una nota fuera de 0–20 (CHECK)", setup: ["INSERT INTO cursos (id_curso, nombre) VALUES (2, 'SQL')"], bad: "INSERT INTO matriculas (id_alumno, id_curso, nota) VALUES (1, 2, 25)" } ] },
    solucion: "CREATE TABLE alumnos (\n  id_alumno INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL\n);\nCREATE TABLE cursos (\n  id_curso INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL\n);\nCREATE TABLE matriculas (\n  id_alumno INTEGER NOT NULL,\n  id_curso INTEGER NOT NULL,\n  nota INTEGER CHECK (nota BETWEEN 0 AND 20),\n  PRIMARY KEY (id_alumno, id_curso),\n  FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno),\n  FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)\n);" });

  t({ id: "t4", titulo: "Tienda en línea", nivel: 3, color: "var(--amber)",
    reglas: ["Los <strong>productos</strong> pertenecen a una <strong>categoría</strong> (una categoría tiene muchos productos).", "Los <strong>clientes</strong> hacen <strong>pedidos</strong> (un cliente, muchos pedidos).", "Un pedido contiene varios productos con una <strong>cantidad</strong> (siempre mayor que 0) y el <strong>precio_unitario</strong> aplicado en ese momento. Un producto no puede repetirse dentro del mismo pedido."],
    pista: "Pedido–Producto es N:M: crea detalle_pedido con PK compuesta (id_pedido, id_producto) y guarda el precio aplicado (no se deduce del producto: puede cambiar).",
    spec: { tablas: {
      categorias: { cols: ["id_categoria", "nombre"], pk: ["id_categoria"] },
      productos: { cols: ["id_producto", "nombre", "precio", "id_categoria"], pk: ["id_producto"], fk: { id_categoria: "categorias" } },
      clientes: { cols: ["id_cliente", "nombre", "correo"], pk: ["id_cliente"] },
      pedidos: { cols: ["id_pedido", "id_cliente", "fecha"], pk: ["id_pedido"], fk: { id_cliente: "clientes" } },
      detalle_pedido: { cols: ["id_pedido", "id_producto", "cantidad", "precio_unitario"], pk: ["id_pedido", "id_producto"], fk: { id_pedido: "pedidos", id_producto: "productos" } } },
      pruebas: [
        { desc: "Rechaza una cantidad 0 o negativa (CHECK)", setup: ["INSERT INTO categorias (id_categoria, nombre) VALUES (1, 'Tecnología')", "INSERT INTO productos (id_producto, nombre, precio, id_categoria) VALUES (1, 'Mouse', 50, 1)", "INSERT INTO clientes (id_cliente, nombre, correo) VALUES (1, 'Ana', 'a@x.pe')", "INSERT INTO pedidos (id_pedido, id_cliente, fecha) VALUES (1, 1, '2026-02-01')"], bad: "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (1, 1, 0, 50)" },
        { desc: "Rechaza el mismo producto dos veces en un pedido", setup: ["INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (1, 1, 2, 50)"], bad: "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (1, 1, 3, 50)" } ] },
    solucion: "CREATE TABLE categorias (\n  id_categoria INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL\n);\nCREATE TABLE productos (\n  id_producto INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  precio REAL NOT NULL,\n  id_categoria INTEGER NOT NULL,\n  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)\n);\nCREATE TABLE clientes (\n  id_cliente INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  correo TEXT\n);\nCREATE TABLE pedidos (\n  id_pedido INTEGER PRIMARY KEY,\n  id_cliente INTEGER NOT NULL,\n  fecha TEXT NOT NULL,\n  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)\n);\nCREATE TABLE detalle_pedido (\n  id_pedido INTEGER NOT NULL,\n  id_producto INTEGER NOT NULL,\n  cantidad INTEGER NOT NULL CHECK (cantidad > 0),\n  precio_unitario REAL NOT NULL,\n  PRIMARY KEY (id_pedido, id_producto),\n  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),\n  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)\n);" });

  t({ id: "t5", titulo: "Transporte: asignación 1:1", nivel: 3, color: "var(--lavender)",
    reglas: ["Hay <strong>conductores</strong> (con licencia única) y <strong>buses</strong> (con placa única).", "Una <strong>asignación</strong> vincula a un conductor con un bus. Un conductor maneja <strong>un solo bus</strong> y un bus tiene <strong>un solo conductor</strong> (relación 1:1 en ambos sentidos).", "Cada asignación guarda la fecha de inicio."],
    pista: "Una relación 1:1 se logra declarando UNIQUE la FK. Aquí necesitas UNIQUE en id_conductor y en id_bus dentro de asignaciones.",
    spec: { tablas: {
      conductores: { cols: ["id_conductor", "nombre", "licencia"], pk: ["id_conductor"], unique: [["licencia"]] },
      buses: { cols: ["id_bus", "placa"], pk: ["id_bus"], unique: [["placa"]] },
      asignaciones: { cols: ["id_asignacion", "id_conductor", "id_bus", "fecha_inicio"], pk: ["id_asignacion"], fk: { id_conductor: "conductores", id_bus: "buses" }, unique: [["id_conductor"], ["id_bus"]] } },
      pruebas: [
        { desc: "Rechaza que un conductor tenga dos buses", setup: ["INSERT INTO conductores (id_conductor, nombre, licencia) VALUES (1, 'Raúl', 'L-001')", "INSERT INTO buses (id_bus, placa) VALUES (1, 'ABC-123')", "INSERT INTO buses (id_bus, placa) VALUES (2, 'XYZ-987')", "INSERT INTO asignaciones (id_asignacion, id_conductor, id_bus, fecha_inicio) VALUES (1, 1, 1, '2026-01-01')"], bad: "INSERT INTO asignaciones (id_asignacion, id_conductor, id_bus, fecha_inicio) VALUES (2, 1, 2, '2026-01-02')" } ] },
    solucion: "CREATE TABLE conductores (\n  id_conductor INTEGER PRIMARY KEY,\n  nombre TEXT NOT NULL,\n  licencia TEXT NOT NULL UNIQUE\n);\nCREATE TABLE buses (\n  id_bus INTEGER PRIMARY KEY,\n  placa TEXT NOT NULL UNIQUE\n);\nCREATE TABLE asignaciones (\n  id_asignacion INTEGER PRIMARY KEY,\n  id_conductor INTEGER NOT NULL UNIQUE,\n  id_bus INTEGER NOT NULL UNIQUE,\n  fecha_inicio TEXT NOT NULL,\n  FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor),\n  FOREIGN KEY (id_bus) REFERENCES buses(id_bus)\n);" });

  FGD.taller = T;
})();
