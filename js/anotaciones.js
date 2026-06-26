// JS dedicado a la gestión de anotaciones CRUD.

//Funcion para crear el modal de la creación de una nueva anotacion.


function abrirModal() {
    if (document.querySelector('.modal-overlay')) return

    // Obtiene el id del libro desde la URL
    const params = new URLSearchParams(window.location.search)
    const idLibro = params.get('id_libro')

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay-anotacion';

    overlay.innerHTML = `
        <div class="modal-box" style="background: white; padding: 20px; border: 1px solid #000; position: fixed; top: 30%; left: 35%; z-index: 1000;">         
            <h2 class="modal-titulo">Agregar anotación</h2>
            <input type="number" name="pagina" id="pagina" placeholder="Página de la anotación"><br><br>
            <input type="text" name="contenido" id="contenido" placeholder="Contenido de la anotación"><br><br>
            <div class="modal-acciones">
                <button class="btn-secundario" id="btn-cancelar">Cancelar</button>
                <!-- Al guardar se debe hacer POST /anotaciones con: idLibro, pagina, contenido y la fecha generada automáticamente con new Date() -->
                <button class="btn-primario" id="btn-guardar">Guardar</button>
            </div>
        </div>
    `
    
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