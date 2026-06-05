-- ─── Ejecutar en phpMyAdmin → pestaña SQL ───────────────

-- 1. Crear la base de datos
CREATE DATABASE tienda_web;

-- 2. Seleccionarla
USE tienda_web;

-- 3. Crear la tabla productos
CREATE TABLE productos (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)  NOT NULL,
  precio int NOT NULL
);

-- 4. Insertar datos de prueba
INSERT INTO productos (nombre, precio) VALUES ('Teclado USB', 15990);
INSERT INTO productos (nombre, precio) VALUES ('Mouse inalámbrico', 9990);
INSERT INTO productos (nombre, precio) VALUES ('Monitor 24"', 129990);

-- 5. Verificar que quedó todo bien
SELECT * FROM productos;