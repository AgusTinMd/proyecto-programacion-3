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
                <button class="btn-eliminar-anotacion" data-id="${anotacion.id}">Eliminar</button>
            </div>
        `).join('');

        // Asigno evento al boton
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

//  MODAL - CREATE
function abrirModalAnotacion() {
    if (document.querySelector('.modal-overlay-anotacion')) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay-anotacion';

    overlay.innerHTML = `
        <div class="modal-box" style="background: white; padding: 20px; border: 1px solid #000; position: fixed; top: 30%; left: 35%; z-index: 1000;">         
            <h2 class="modal-titulo">Agregar anotación</h2>
            <input type="number" name="pagina" id="pagina" placeholder="Página de la anotación"><br><br>
            <input type="text" name="contenido" id="contenido" placeholder="Contenido de la anotación"><br><br>
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

        // Genero fecha automática del día actual en formato YYYY-MM-DD
        const hoy = new Date();
        const fechaAutomatica = hoy.toISOString().split('T')[0];

        // Armamos el objeto 
        const nuevaAnotacion = {
            libroId: parseInt(idLibro), // Guardamos como número para mantener consistencia
            texto: contenidoInput,
            pagina: parseInt(paginaInput),
            fecha: fechaAutomatica
        };

        try {
            //  CREATE
            await axios.post(`${API_URL}/anotaciones`, nuevaAnotacion);
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