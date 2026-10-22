"""Genera los datos ficticios de FGD-Edir (CSV para Colab + datasets.js para la web).

Uso:  python scripts/generar_datos.py
Todo es inventado (empresas y personas ficticias). Semilla fija: siempre salen los mismos datos.
"""
import csv, json, os, random, sqlite3

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATOS = os.path.join(RAIZ, "datos")
os.makedirs(DATOS, exist_ok=True)
az = random.Random(2026)

# ------------------------------------------------------------------ CHASQUI TECH
PRODUCTOS_FLAT = [
    ("Laptop 14 pulgadas", "Cómputo", 2400), ("Monitor 24 pulgadas", "Cómputo", 650),
    ("Teclado mecánico", "Cómputo", 180), ("Mouse inalámbrico", "Cómputo", 55),
    ("Smartphone gama media", "Celulares", 1200), ("Smartphone gama alta", "Celulares", 3200),
    ("Tablet 10 pulgadas", "Celulares", 900), ("Audífonos Bluetooth", "Accesorios", 160),
    ("Cargador rápido", "Accesorios", 70), ("Funda protectora", "Accesorios", 35),
    ("Memoria USB 64 GB", "Accesorios", 40), ("Parlante portátil", "Accesorios", 220),
]
SEDES = ["Lima", "Arequipa", "Trujillo", "Piura"]
ventas = []
for i in range(1, 73):
    nom, cat, base = az.choice(PRODUCTOS_FLAT)
    unid = az.randint(1, 3)
    precio = round(base * az.choice([0.9, 1.0, 1.0, 1.0, 1.05]), 2)
    canal = az.choice(["Tienda", "Tienda", "Web"])
    ventas.append((i, f"2026-08-{az.randint(3, 8):02d}", az.choice(SEDES), canal, nom, cat, unid, precio, round(unid * precio, 2)))
ventas.sort(key=lambda r: (r[1], r[0]))
ventas = [(i + 1,) + r[1:] for i, r in enumerate(ventas)]

CLIENTES = [
    "Lucía Paredes", "Pedro Seminario", "Rosa Quispe", "Miguel Alarcón", "Carla Huamán", "Jorge Salas",
    "Ana Villanueva", "Diego Rojas", "Sofía Campos", "Luis Ccori", "Valeria Núñez", "Marco Tapia",
    "Elena Mamani", "Raúl Vargas", "Patricia León", "Hugo Cárdenas", "Daniela Flores", "Iván Ochoa",
    "Mónica Ríos", "César Apaza", "Gabriela Soto", "Andrés Palomino", "Julia Espinoza", "Óscar Medina",
]
CIUDADES = ["Lima", "Arequipa", "Trujillo", "Piura", "Cusco"]
clientes = [(i + 1, n, az.choice(CIUDADES), f"2026-0{az.randint(5, 7)}-{az.randint(1, 28):02d}") for i, n in enumerate(CLIENTES)]
# 3 clientes sin fecha de registro (NULL) para practicar IS NULL y COUNT(col)
clientes = [(c[0], c[1], c[2], None if c[0] in (4, 11, 20) else c[3]) for c in clientes]
# dos clientes distintos con el MISMO nombre: la identidad es id_cliente, no el nombre (agrupar por id)
clientes = [(c[0], "Carlos Mendoza" if c[0] in (18, 24) else c[1], c[2], c[3]) for c in clientes]

PRODUCTOS = [
    (1, "Laptop 14 pulgadas", "Cómputo", 2400.0), (2, "Monitor 24 pulgadas", "Cómputo", 650.0),
    (3, "Teclado mecánico", "Cómputo", 180.0), (4, "Mouse inalámbrico", "Cómputo", 55.0),
    (5, "Webcam HD", "Cómputo", 120.0), (6, "Smartphone gama media", "Celulares", 1200.0),
    (7, "Smartphone gama alta", "Celulares", 3200.0), (8, "Tablet 10 pulgadas", "Celulares", 900.0),
    (9, "Audífonos Bluetooth", "Accesorios", 160.0), (10, "Cargador rápido", "Accesorios", 70.0),
    (11, "Funda protectora", "Accesorios", 35.0), (12, "Memoria USB 64 GB", "Accesorios", 40.0),
    (13, "Parlante portátil", "Accesorios", 220.0), (14, "Smartwatch", "Accesorios", 480.0),
]
# 8 clientes (ids 17..24 salvo algunos) no compran nunca; 3 productos no se venden nunca
activos = [c[0] for c in clientes if c[0] not in (5, 9, 13, 16, 19, 22)]
vendibles = [p for p in PRODUCTOS if p[0] not in (5, 14)]
pedidos, detalles = [], []
id_det = 1
for id_ped in range(1, 43):
    cli = az.choice(activos)
    fecha = f"2026-{az.choice(['08', '09'])}-{az.randint(1, 28):02d}"
    total = 0.0
    for p in az.sample(vendibles, az.choice([1, 1, 2, 2, 2, 3])):
        cant = az.randint(1, 2)
        detalles.append((id_det, id_ped, p[0], cant, p[3]))
        total += cant * p[3]
        id_det += 1
    pedidos.append((id_ped, cli, fecha, round(total, 2)))
pedidos.sort(key=lambda r: r[2])
mapa = {r[0]: i + 1 for i, r in enumerate(pedidos)}
pedidos = [(mapa[r[0]], r[1], r[2], r[3]) for r in pedidos]
detalles = [(d[0], mapa[d[1]], d[2], d[3], d[4]) for d in detalles]

# ------------------------------------------------------------------ CAFÉ YAKU (modelado)
categorias = [(1, "Panes"), (2, "Pasteles"), (3, "Bebidas"), (4, "Salados")]
prod_yaku = [
    (1, "Pan francés", 1, 0.5), (2, "Pan integral", 1, 0.8), (3, "Torta de chocolate", 2, 12.0),
    (4, "Jugo de naranja", 3, 5.0), (5, "Café americano", 3, 4.0), (6, "Empanada de pollo", 4, 4.5),
]
cli_yaku = [
    (1, "Ana Torres", "Los Olivos"), (2, "Luis Ramos", "Comas"), (3, "María Pérez", "Independencia"),
    (4, "Carlos Ríos", "San Martín de Porres"), (5, "Rosa Díaz", "Los Olivos"), (6, "Jorge Lima", "Comas"),
]
locales = [(1, "Café Yaku Central", "Los Olivos"), (2, "Café Yaku Norte", "Comas"), (3, "Café Yaku Plaza", "Independencia")]
ventas_y = []
for i in range(1, 19):
    ventas_y.append((i, f"2026-04-0{az.randint(1, 6)}", az.choice(cli_yaku)[0], az.choice(prod_yaku)[0],
                     az.choice(locales)[0], az.randint(1, 4), az.choice(["Efectivo", "Yape", "Tarjeta"])))
ventas_y.sort(key=lambda r: (r[1], r[0]))
ventas_y = [(i + 1,) + r[1:] for i, r in enumerate(ventas_y)]

# ------------------------------------------------------------------ ESQUEMAS
DDL_CHASQUI = """CREATE TABLE ventas (
  venta_id INTEGER PRIMARY KEY, fecha_venta TEXT NOT NULL, sede TEXT NOT NULL, canal TEXT NOT NULL,
  producto TEXT NOT NULL, categoria TEXT NOT NULL, unidades INTEGER NOT NULL,
  precio_unitario REAL NOT NULL, monto REAL NOT NULL);
CREATE TABLE clientes (id_cliente INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL, fecha_registro TEXT);
CREATE TABLE productos (id_producto INTEGER PRIMARY KEY, nombre TEXT NOT NULL, categoria TEXT NOT NULL, precio REAL NOT NULL);
CREATE TABLE pedidos (id_pedido INTEGER PRIMARY KEY, id_cliente INTEGER NOT NULL, fecha_pedido TEXT NOT NULL, total REAL NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente));
CREATE TABLE detalles_pedido (id_detalle INTEGER PRIMARY KEY, id_pedido INTEGER NOT NULL, id_producto INTEGER NOT NULL,
  cantidad INTEGER NOT NULL, precio_unitario REAL NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido), FOREIGN KEY (id_producto) REFERENCES productos(id_producto));"""
DDL_YAKU = """CREATE TABLE categorias (id_categoria INTEGER PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE productos (id_producto INTEGER PRIMARY KEY, nombre TEXT NOT NULL, id_categoria INTEGER NOT NULL, precio_unitario REAL NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria));
CREATE TABLE clientes (id_cliente INTEGER PRIMARY KEY, nombre TEXT NOT NULL, distrito TEXT NOT NULL);
CREATE TABLE locales (id_local INTEGER PRIMARY KEY, nombre TEXT NOT NULL, distrito TEXT NOT NULL);
CREATE TABLE ventas (id_venta INTEGER PRIMARY KEY, fecha TEXT NOT NULL, id_cliente INTEGER NOT NULL, id_producto INTEGER NOT NULL,
  id_local INTEGER NOT NULL, cantidad INTEGER NOT NULL, metodo_pago TEXT NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente), FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  FOREIGN KEY (id_local) REFERENCES locales(id_local));
CREATE TABLE ventas_original (id_venta INTEGER PRIMARY KEY, fecha TEXT, cliente_nombre TEXT, cliente_distrito TEXT,
  producto_nombre TEXT, categoria_nombre TEXT, precio_unitario REAL, local_nombre TEXT, local_distrito TEXT,
  cantidad INTEGER, metodo_pago TEXT, total REAL);"""

# ------------------------------------------------------------------ ANDES SOFT (empresa: empleados, departamentos, proyectos, ventas)
DDL_ANDES = """CREATE TABLE departamentos (id_depto INTEGER PRIMARY KEY, nombre TEXT NOT NULL UNIQUE, ciudad TEXT NOT NULL);
CREATE TABLE empleados (id_emp INTEGER PRIMARY KEY, nombre TEXT NOT NULL, cargo TEXT NOT NULL, sueldo REAL NOT NULL CHECK (sueldo > 0),
  ciudad TEXT NOT NULL, correo TEXT, id_depto INTEGER NOT NULL, id_jefe INTEGER, fecha_ingreso TEXT NOT NULL,
  FOREIGN KEY (id_depto) REFERENCES departamentos(id_depto), FOREIGN KEY (id_jefe) REFERENCES empleados(id_emp));
CREATE TABLE proyectos (id_proyecto INTEGER PRIMARY KEY, nombre TEXT NOT NULL, estado TEXT NOT NULL, presupuesto REAL NOT NULL, id_depto INTEGER NOT NULL,
  FOREIGN KEY (id_depto) REFERENCES departamentos(id_depto));
CREATE TABLE ventas (id_venta INTEGER PRIMARY KEY, fecha TEXT NOT NULL, id_emp INTEGER NOT NULL, producto TEXT NOT NULL, monto REAL NOT NULL,
  FOREIGN KEY (id_emp) REFERENCES empleados(id_emp));"""
departamentos = [(1, "Sistemas", "Cusco"), (2, "Ventas", "Lima"), (3, "Finanzas", "Lima"), (4, "RRHH", "Cusco"), (5, "Marketing", "Arequipa")]
empleados = [
    (1, "Alicia Paucar", "Analista", 2800.0, "Cusco", "a.paucar@andes.pe", 1, 3, "2024-03-01"),
    (2, "Marisol Cutipa", "Asistente", 2200.0, "Cusco", "m.cutipa@andes.pe", 4, 5, "2025-01-13"),
    (3, "Jorge Quiroz", "Jefe de Sistemas", 5200.0, "Cusco", "j.quiroz@andes.pe", 1, None, "2019-05-12"),
    (4, "Víctor Layme", "Vendedor", 3100.0, "Lima", "v.layme@andes.pe", 2, 6, "2022-08-15"),
    (5, "Lucía Mendieta", "Jefa de RRHH", 4800.0, "Cusco", "l.mendieta@andes.pe", 4, None, "2018-02-20"),
    (6, "Pablo Cornejo", "Jefe de Ventas", 5000.0, "Lima", "p.cornejo@andes.pe", 2, None, "2017-11-05"),
    (7, "Rosa Tacuri", "Contadora", 3900.0, "Lima", "r.tacuri@andes.pe", 3, 9, "2021-01-18"),
    (8, "Josué Huillca", "Programador", 3500.0, "Cusco", None, 1, 3, "2023-06-30"),
    (9, "Elena Paredes", "Jefa de Finanzas", 5100.0, "Lima", "e.paredes@andes.pe", 3, None, "2016-09-09"),
    (10, "Mario Salas", "Vendedor", 2900.0, "Arequipa", "m.salas@andes.pe", 2, 6, "2023-10-02"),
    (11, "Diana Vega", "Programadora", 3700.0, "Cusco", "d.vega@andes.pe", 1, 3, "2022-04-11"),
    (12, "Hugo Flores", "Analista de datos", 3600.0, "Lima", "h.flores@andes.pe", 1, 3, "2024-01-22"),
]
proyectos = [
    (1, "Portal de clientes", "En curso", 48000.0, 1), (2, "Migración a la nube", "En curso", 85000.0, 1), (3, "Campaña de verano", "Finalizado", 22000.0, 2),
    (4, "Auditoría anual", "En curso", 30000.0, 3), (5, "Programa de bienestar", "Pausado", 12000.0, 4), (6, "App de ventas", "Finalizado", 40000.0, 2),
]
ventas_a = [
    (1, "2026-03-02", 4, "Licencia Office", 1500.0), (2, "2026-03-05", 10, "Antivirus Anual", 300.0), (3, "2026-03-09", 4, "Soporte Técnico", 800.0),
    (4, "2026-03-15", 6, "Laptop Empresarial", 4200.0), (5, "2026-03-21", 4, "Antivirus Anual", 300.0), (6, "2026-04-01", 10, "Licencia Office", 1500.0),
    (7, "2026-04-07", 6, "Soporte Técnico", 800.0), (8, "2026-04-12", 4, "Laptop Empresarial", 4200.0), (9, "2026-04-20", 10, "Soporte Técnico", 800.0),
    (10, "2026-05-03", 6, "Licencia Office", 1500.0), (11, "2026-05-11", 4, "Antivirus Anual", 300.0), (12, "2026-05-25", 10, "Laptop Empresarial", 4200.0),
]

TABLAS = {
    "andes": {
        "departamentos": (["id_depto", "nombre", "ciudad"], departamentos),
        "empleados": (["id_emp", "nombre", "cargo", "sueldo", "ciudad", "correo", "id_depto", "id_jefe", "fecha_ingreso"], empleados),
        "proyectos": (["id_proyecto", "nombre", "estado", "presupuesto", "id_depto"], proyectos),
        "ventas": (["id_venta", "fecha", "id_emp", "producto", "monto"], ventas_a),
    },
    "chasqui": {
        "ventas": (["venta_id", "fecha_venta", "sede", "canal", "producto", "categoria", "unidades", "precio_unitario", "monto"], ventas),
        "clientes": (["id_cliente", "nombre", "ciudad", "fecha_registro"], clientes),
        "productos": (["id_producto", "nombre", "categoria", "precio"], PRODUCTOS),
        "pedidos": (["id_pedido", "id_cliente", "fecha_pedido", "total"], pedidos),
        "detalles_pedido": (["id_detalle", "id_pedido", "id_producto", "cantidad", "precio_unitario"], detalles),
    },
    "yaku": {
        "categorias": (["id_categoria", "nombre"], categorias),
        "productos": (["id_producto", "nombre", "id_categoria", "precio_unitario"], prod_yaku),
        "clientes": (["id_cliente", "nombre", "distrito"], cli_yaku),
        "locales": (["id_local", "nombre", "distrito"], locales),
        "ventas": (["id_venta", "fecha", "id_cliente", "id_producto", "id_local", "cantidad", "metodo_pago"], ventas_y),
    },
}

def crear_db(nombre, ddl):
    con = sqlite3.connect(":memory:")
    con.executescript(ddl)
    for t, (cols, filas) in TABLAS[nombre].items():
        con.executemany(f"INSERT INTO {t} ({','.join(cols)}) VALUES ({','.join('?' * len(cols))})", filas)
    if nombre == "yaku":
        con.execute("""INSERT INTO ventas_original
          SELECT v.id_venta, v.fecha, c.nombre, c.distrito, p.nombre, g.nombre, p.precio_unitario, l.nombre, l.distrito,
                 v.cantidad, v.metodo_pago, v.cantidad * p.precio_unitario
          FROM ventas v JOIN clientes c USING(id_cliente) JOIN productos p USING(id_producto)
          JOIN categorias g USING(id_categoria) JOIN locales l USING(id_local)""")
    con.commit()
    return con

def volcar(con, nombre, tablas):
    for t in tablas:
        cur = con.execute(f"SELECT * FROM {t}")
        cols = [d[0] for d in cur.description]
        with open(os.path.join(DATOS, f"{nombre}_{t}.csv"), "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(cols); w.writerows(cur.fetchall())

def sql_inserts(con, tablas):
    out = []
    for t in tablas:
        cur = con.execute(f"SELECT * FROM {t}")
        cols = [d[0] for d in cur.description]
        for fila in cur.fetchall():
            vals = ["NULL" if v is None else (repr(v) if isinstance(v, (int, float)) else "'" + str(v).replace("'", "''") + "'") for v in fila]
            out.append(f"INSERT INTO {t} ({','.join(cols)}) VALUES ({','.join(vals)});")
    return "\n".join(out)

con_c = crear_db("chasqui", DDL_CHASQUI)
con_y = crear_db("yaku", DDL_YAKU)
con_a = crear_db("andes", DDL_ANDES)
volcar(con_a, "andes", TABLAS["andes"])
volcar(con_c, "chasqui", TABLAS["chasqui"])
volcar(con_y, "yaku", list(TABLAS["yaku"]) + ["ventas_original"])
js = "window.FGD = window.FGD || {};\nFGD.datasets = " + json.dumps({
    "andes": {"nombre": "Andes Soft", "desc": "Empresa de software: empleados con jefe, departamentos, proyectos y ventas (ejercicios de cierre de SQL)",
              "ddl": DDL_ANDES, "datos": sql_inserts(con_a, TABLAS["andes"]),
              "tablas": {t: c for t, (c, _) in TABLAS["andes"].items()}},
    "chasqui": {"nombre": "Chasqui Tech", "desc": "Tienda de tecnología con 4 sedes y canal Web (semanas 2 y 3)",
                "ddl": DDL_CHASQUI, "datos": sql_inserts(con_c, TABLAS["chasqui"]),
                "tablas": {t: c for t, (c, _) in TABLAS["chasqui"].items()}},
    "yaku": {"nombre": "Café Yaku", "desc": "Cafetería con 3 locales: una tabla gigante vs modelo relacional (semana 4)",
             "ddl": DDL_YAKU, "datos": sql_inserts(con_y, list(TABLAS["yaku"]) + ["ventas_original"]),
             "tablas": dict({t: c for t, (c, _) in TABLAS["yaku"].items()},
                            ventas_original=["id_venta", "fecha", "cliente_nombre", "cliente_distrito", "producto_nombre", "categoria_nombre",
                                             "precio_unitario", "local_nombre", "local_distrito", "cantidad", "metodo_pago", "total"])},
}, ensure_ascii=False, indent=1) + ";\n"
open(os.path.join(RAIZ, "content", "datasets.js"), "w", encoding="utf-8").write(js)
# guardar también las .db para Colab (sqlite3.connect del archivo)
for nombre, con in (("chasqui_tech", con_c), ("cafe_yaku", con_y), ("andes_soft", con_a)):
    ruta = os.path.join(DATOS, nombre + ".db")
    if os.path.exists(ruta): os.remove(ruta)
    dest = sqlite3.connect(ruta); con.backup(dest); dest.close()
print("OK", {k: len(v[1]) for k, v in TABLAS["chasqui"].items()}, {k: len(v[1]) for k, v in TABLAS["yaku"].items()})
