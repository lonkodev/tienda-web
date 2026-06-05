// ─── routes/productos.js — Rutas ────────────────────────
// Conecta cada método HTTP con su función en el Controller.

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/productoController');

router.get   ('/',    controller.listar);    // Listar todos
router.post  ('/',    controller.agregar);   // Agregar uno
router.put   ('/:id', controller.editar);    // Editar por id
router.delete('/:id', controller.eliminar);  // Eliminar por id

module.exports = router;
