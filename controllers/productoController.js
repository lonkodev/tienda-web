// ─── controllers/productoController.js — Controller ─────
// El Controller recibe cada petición HTTP, consulta la BD
// y responde con JSON. Usa el Model solo para armar objetos.

const db = require('../config/db');
const Producto = require('../models/Producto');

// ── GET /api/productos — Listar todos ────────────────────
// Consulta todos los registros y los convierte en objetos Producto
const listar = (req, res) => {
  db.query('SELECT * FROM productos', (err, filas) => {
    if (err) {
      res.status(500).json({ error: 'Error al listar productos' });
      return;
    }
    // Convertimos cada fila de la BD en un objeto Producto
    const productos = filas.map(
      (fila) => new Producto(fila.id, fila.nombre, fila.precio)
    );
    res.json(productos);
  });
};

// ── POST /api/productos — Agregar uno ────────────────────
// POST — crea un recurso nuevo
// Recibe nombre y precio en el body, inserta en la BD
const agregar = (req, res) => {
  const { nombre, precio } = req.body;

  // Validación: ambos campos son obligatorios
  if (!nombre || !precio) {
    res.status(400).json({ error: 'Nombre y precio son obligatorios' });// estado 400 es Bad Request — solicitud incorrecta.
    return;
  }

  // Los ? evitan inyección SQL — mysql2 reemplaza los valores de forma segura
  // El parámetro va directo en el query, sin variable sql intermedia
  db.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio], (err, resultado) => {
    if (err) {
      res.status(500).json({ error: 'Error al agregar producto' });
      return;
    }
    // insertId trae el id autogenerado por MySQL
    const nuevo = new Producto(resultado.insertId, nombre, precio);
    res.status(201).json(nuevo);//201Created Se creó un recurso nuevo (POST exitoso)
  });
};

// ── PUT /api/productos/:id — Editar uno ──────────────────
// PUT — reemplaza un recurso existente
// Recibe id por la URL y nombre/precio por el body
const editar = (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    return;
  }

  db.query('UPDATE productos SET nombre = ?, precio = ? WHERE id = ?', [nombre, precio, id], (err, resultado) => {
    if (err) {
      res.status(500).json({ error: 'Error al editar producto' });
      return;
    }
    // affectedRows indica cuántas filas se modificaron
    if (resultado.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(new Producto(id, nombre, precio));
  });
};

// ── DELETE /api/productos/:id — Eliminar uno ─────────────
// Recibe el id por la URL y borra ese registro
const eliminar = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM productos WHERE id = ?', [id], (err, resultado) => {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar producto' });
      return;
    }
    if (resultado.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
};

module.exports = { listar, agregar, editar, eliminar };