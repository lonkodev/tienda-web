// ─── models/Producto.js — Model ─────────────────────────
// El Model define qué ES un Producto.
// No consulta la BD — eso lo hace el Controller.

class Producto {
  constructor(id, nombre, precio) {
    this.id     = id;
    this.nombre = nombre;
    this.precio = precio;
  }
}

module.exports = Producto;
