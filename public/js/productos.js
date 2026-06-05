// ─── public/js/productos.js ──────────────────────────────
// Maneja toda la interacción del CRUD desde el navegador.
// Se comunica con la API de Express usando fetch + async/await.
// No escribe HTML — usa la <template> definida en index.html.

// ── Referencias a elementos del DOM ─────────────────────
// Guardamos cada elemento en una variable para no buscarlo
// cada vez que lo necesitamos — es más eficiente y legible.
const tbody = document.getElementById('cuerpo-tabla');
const plantilla = document.getElementById('plantilla-fila');
const inputId = document.getElementById('producto-id');
const inputNombre = document.getElementById('input-nombre');
const inputPrecio = document.getElementById('input-precio');
const tituloForm = document.getElementById('titulo-formulario');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

// ── Listar todos los productos ───────────────────────────
// Hace GET /api/productos y construye una fila por cada resultado.
// async/await hace que el código se lea de arriba hacia abajo,
// sin encadenar .then() dentro de .then()
const cargarProductos = async () => {
  tbody.innerHTML = '<tr><td colspan="4" class="text-center">Cargando...</td></tr>';

  try {
    const respuesta = await fetch('/api/productos');//await fetch espera a que la petición HTTP
    const productos = await respuesta.json();

    tbody.innerHTML = '';

    // Dos caminos claros: o no hay productos, o los pintamos
    if (productos.length === 0) {//compara valor Y tipo
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay productos registrados</td></tr>';
    } else {
      productos.forEach((producto) => {
        const fila = crearFila(producto);
        tbody.appendChild(fila);
      });
    }

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Error: ${err.message}</td></tr>`;
  }
};

// ── Crear una fila a partir de la plantilla ──────────────
// Clona la <template> del HTML, rellena los datos
// y agrega los eventos a los botones Editar y Eliminar.
// Así el HTML vive en el HTML — no en el JS.
const crearFila = (producto) => {
  // cloneNode(true) copia la plantilla completa con sus hijos
  //clonamos la plantilla para cada producto, prototype
  const clon = plantilla.content.cloneNode(true);

  // Rellenamos cada celda buscando su clase
  clon.querySelector('.col-id').textContent = producto.id;
  clon.querySelector('.col-nombre').textContent = producto.nombre;
  clon.querySelector('.col-precio').textContent = `$${Number(producto.precio).toLocaleString('es-CL')}`;

  // Botón Editar: carga los datos del producto en el formulario
  clon.querySelector('.btn-editar').addEventListener('click', () => {
    prepararEdicion(producto);
  });

  // Botón Eliminar: pide confirmación y llama a la función eliminar
  clon.querySelector('.btn-eliminar').addEventListener('click', () => {
    eliminar(producto.id);
  });

  return clon;
};

// ── Guardar: decide entre POST (nuevo) y PUT (edición) ───
// Si el campo oculto producto-id tiene valor → editamos (PUT)
// Si está vacío → creamos uno nuevo (POST)
const guardar = async () => {
  const id = inputId.value;
  const nombre = inputNombre.value.trim();
  const precio = inputPrecio.value;

  // Validación antes de enviar al servidor
  if (!nombre || !precio) {
    alert('Completa el nombre y el precio antes de guardar.');
    return;
  }

  // Definimos método y URL según si hay id o no
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `/api/productos/${id}` : '/api/productos';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    });

    if (respuesta.ok) {
      limpiarFormulario();
      cargarProductos();
    } else {
      alert('No se pudo guardar el producto');
    }

  } catch (err) {
    alert(`Error al guardar: ${err.message}`);
  }
};

// ── Preparar el formulario para editar ───────────────────
// Carga los datos del producto seleccionado en los inputs
// y cambia el título para indicar que estamos editando.
const prepararEdicion = (producto) => {
  inputId.value = producto.id;
  inputNombre.value = producto.nombre;
  inputPrecio.value = producto.precio;
  tituloForm.textContent = 'Editar Producto';
};

// ── Eliminar un producto ─────────────────────────────────
// Envía DELETE /api/productos/:id y recarga la tabla.
const eliminar = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

  try {
    const respuesta = await fetch(`/api/productos/${id}`, { method: 'DELETE' });

    if (respuesta.ok) {
      cargarProductos();
    } else {
      alert('No se pudo eliminar el producto');
    }

  } catch (err) {
    alert(`Error al eliminar: ${err.message}`);
  }
};

// ── Limpiar el formulario ────────────────────────────────
// Vacía todos los campos y vuelve el formulario a modo "Agregar"
const limpiarFormulario = () => {
  inputId.value = '';
  inputNombre.value = '';
  inputPrecio.value = '';
  tituloForm.textContent = 'Agregar Producto';
};

// ── Asignar eventos a los botones del formulario ─────────
// Los botones del formulario están en el HTML, pero sus acciones
// se definen aquí para no mezclar JS dentro del HTML.
btnGuardar.addEventListener('click', guardar);
btnCancelar.addEventListener('click', limpiarFormulario);

// ── Inicialización ───────────────────────────────────────
// Al cargar la página, pedimos los productos de inmediato
cargarProductos();
