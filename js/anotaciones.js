// JS dedicado a la gestión de anotaciones CRUD.
const API_URL = 'http://localhost:3000';

// Obtiene el id del libro desde la URL actual (?id_libro=X)
const params = new URLSearchParams(window.location.search);
const idLibro = params.get('id_libro');

// Cargo el DOM
document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar-anotacion');
    if (btnAgregar) {
        btnAgregar.onclick = () => abrirModalAnotacion();
    }
    
    // Al cargar la página, listamos las anotaciones del libro actual
    if (idLibro) {
        cargarAnotaciones();
    } else {
        console.warn("No se especificó ningún id_libro en la URL.");
    }
});

// READ
async function cargarAnotaciones() {
    const contenedor = document.getElementById('lista-anotaciones');
    if (!contenedor) return;

    try {
        // Se filtra por id de libro
        const response = await axios.get(`${API_URL}/anotaciones?libroId=${idLibro}`);
        const anotaciones = response.data;

        if (anotaciones.length === 0) {
            contenedor.innerHTML = '<p>No hay anotaciones para este libro aún.</p>';
            return;
        }

        // Pasamos cada anotacion al HTML 
        contenedor.innerHTML = anotaciones.map(anotacion => `
            <div class="anotacion-card" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <p><strong>Página:</strong> ${anotacion.pagina}</p>
                <p><strong>Nota:</strong> ${anotacion.texto}</p>
                <p><small><strong>Fecha:</strong> ${anotacion.fecha}</small></p>
                <button class="btn-editar-anotacion" data-id="${anotacion.id}">Editar</button>
                <button class="btn-eliminar-anotacion" data-id="${anotacion.id}">Eliminar</button>
            </div>
        `).join('');

        // Asigno evento al boton de editar
        contenedor.querySelectorAll('.btn-editar-anotacion').forEach(btn => {
            btn.onclick = async (e) => {
                const idAnotacion = e.target.getAttribute('data-id');
                // Buscamos los datos de esa anotacion puntual para mandarla al modal
                const res = await axios.get(`${API_URL}/anotaciones/${idAnotacion}`);
                abrirModalAnotacion(res.data);
            };
        });

        // Asigno evento al boton de eliminar
        contenedor.querySelectorAll('.btn-eliminar-anotacion').forEach(btn => {
            btn.onclick = async (e) => {
                const idAnotacion = e.target.getAttribute('data-id');
                await eliminarAnotacion(idAnotacion);
            };
        });

    } catch (error) {
        console.error('Error al cargar las anotaciones:', error);
    }
}

//  MODAL - CREATE / UPDATE
function abrirModalAnotacion(anotacionAEditar = null) {
    if (document.querySelector('.modal-overlay-anotacion')) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay-anotacion';

    // Nos fijamos si vino un objeto para editar o si está vacío (
    const esEditar = anotacionAEditar !== null;

    overlay.innerHTML = `
        <div class="modal-box" style="background: white; padding: 20px; border: 1px solid #000; position: fixed; top: 30%; left: 35%; z-index: 1000;">         
            <h2 class="modal-titulo">${esEditar ? 'Editar anotación' : 'Agregar anotación'}</h2>
            <input type="number" name="pagina" id="pagina" placeholder="Página de la anotación" value="${esEditar ? anotacionAEditar.pagina : ''}"><br><br>
            <input type="text" name="contenido" id="contenido" placeholder="Contenido de la anotación" value="${esEditar ? anotacionAEditar.texto : ''}"><br><br>
            <div class="modal-acciones">
                <button class="btn-secundario" id="btn-cancelar">Cancelar</button>
                <button class="btn-primario" id="btn-guardar">Guardar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Acción para cancelar/cerrar el modal
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove();

    // Acción para guardar la anotación
    overlay.querySelector('#btn-guardar').onclick = async () => {
        const paginaInput = document.getElementById('pagina').value;
        const contenidoInput = document.getElementById('contenido').value;

        if (!paginaInput || !contenidoInput) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            if (esEditar) {
                // UPDATE 
                await axios.patch(`${API_URL}/anotaciones/${anotacionAEditar.id}`, {
                    texto: contenidoInput,
                    pagina: parseInt(paginaInput)
                });
            } else {
                // CREATE 
                const hoy = new Date();
                const fechaAutomatica = hoy.toISOString().split('T')[0];

                const nuevaAnotacion = {
                    libroId: parseInt(idLibro),
                    texto: contenidoInput,
                    pagina: parseInt(paginaInput),
                    fecha: fechaAutomatica
                };

                await axios.post(`${API_URL}/anotaciones`, nuevaAnotacion);
            }

            overlay.remove(); // Cerramos el modal
            await cargarAnotaciones(); // Refrescamos la lista en pantalla sin recargar
        } catch (error) {
            console.error('Error al guardar la anotación:', error);
            alert('Hubo un error al intentar guardar la anotación.');
        }
    };
}

//   DELETE 
async function eliminarAnotacion(id) {
    if (confirm('¿Estás seguro de que querés borrar esta anotación?')) {
        try {
            await axios.delete(`${API_URL}/anotaciones/${id}`);
            await cargarAnotaciones(); // Actualizar la vista tras borrar
        } catch (error) {
            console.error('Error al eliminar la anotación:', error);
            alert('No se pudo eliminar la anotación.');
        }
    }
}