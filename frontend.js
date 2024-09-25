// Función para obtener los libros y mostrarlos en la tabla
function obtenerLibros() {
  fetch('/libros')
    .then(response => response.json())
    .then(libros => {
      const tbody = document.querySelector('#tabla-libros tbody');
      tbody.innerHTML = '';  // Limpiar el contenido anterior

      libros.forEach(libro => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${libro.titulo || 'Sin título'}</td>
          <td>${libro.autor || 'Sin autor'}</td>
          <td>${libro.edad || 'N/A'}</td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(error => console.error('Error al obtener los libros:', error));
}

// Función para agregar un libro
document.getElementById('form-agregar').addEventListener('submit', function (event) {
  event.preventDefault();  // Evitar el envío del formulario por defecto

  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const edad = document.getElementById('edad').value;

  if (!titulo || !autor || !edad) {
    alert('Todos los campos son obligatorios');
    return;
  }

  const nuevoLibro = { titulo, autor, edad };

  fetch('/libros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoLibro)
  })
    .then(response => response.json())
    .then(libro => {
      alert('Libro agregado correctamente');
      obtenerLibros();  // Actualizar la tabla de libros
    })
    .catch(error => console.error('Error al agregar el libro:', error));
});

// Función para editar un libro
document.getElementById('form-editar').addEventListener('submit', function (event) {
  event.preventDefault();  // Evitar el envío del formulario por defecto

  const id = document.getElementById('editar-id').value;
  const titulo = document.getElementById('editar-titulo').value;
  const autor = document.getElementById('editar-autor').value;
  const edad = document.getElementById('editar-edad').value;

  if (!id || !titulo || !autor || !edad) {
    alert('Todos los campos son obligatorios');
    return;
  }

  const libroActualizado = { titulo, autor, edad };

  fetch(`/libros/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(libroActualizado)
  })
    .then(response => response.json())
    .then(libro => {
      alert('Libro actualizado correctamente');
      obtenerLibros();  // Actualizar la tabla de libros
    })
    .catch(error => console.error('Error al actualizar el libro:', error));
});

// Función para eliminar un libro
document.getElementById('form-eliminar').addEventListener('submit', function (event) {
  event.preventDefault();  // Evitar el envío del formulario por defecto

  const id = document.getElementById('eliminar-id').value;

  if (!id) {
    alert('Debe ingresar el ID del libro a eliminar');
    return;
  }

  fetch(`/libros/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message || 'Libro eliminado correctamente');
      obtenerLibros();  // Actualizar la tabla de libros
    })
    .catch(error => console.error('Error al eliminar el libro:', error));
});

// Cargar los libros al cargar la página
document.addEventListener('DOMContentLoaded', obtenerLibros);