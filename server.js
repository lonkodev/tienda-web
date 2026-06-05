// ─── server.js — Punto de entrada ───────────────────────
const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = 3000;

// Permite leer JSON en el body de las peticiones POST y PUT
app.use(express.json());

// Sirve los archivos estáticos desde /public (index.html, js/, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
const productosRouter = require('./routes/productos');
app.use('/api/productos', productosRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
