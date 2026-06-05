// ─── db.js — Conexión a MySQL ────────────────────────────
// Este archivo se encarga SOLO de conectarse a la base de datos.
// Todos los demás archivos lo importan con require('../db')

const mysql = require('mysql2');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tienda_web'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL correctamente');
});

module.exports = db;
