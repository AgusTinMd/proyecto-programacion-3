function abrirModal() {
    if (document.querySelector('.modal-overlay')) return

    // Obtiene el id del libro desde la URL
    const params = new URLSearchParams(window.location.search)
    const idLibro = params.get('id_libro')

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'

    overlay.innerHTML = `
        <div class="modal-box">         
            <h2 class="modal-titulo">Agregar anotacion</h2>
            <!-- El libro viene por URL, no se le pide al usuario -->
            <input type="number" name="pagina" id="pagina" placeholder="Pagina de la anotacion">
            <input type="text" name="contenido" id="contenido" placeholder="Contenido de la anotacion">
            <div class="modal-acciones">
                <button class="btn-secundario" id="btn-cancelar">Cancelar</button>
                <!-- Al guardar se debe hacer POST /anotaciones con: idLibro, pagina, contenido y la fecha generada automáticamente con new Date() -->
                <button class="btn-primario" id="btn-guardar">Guardar</button>
            </div>
        </div>
    `
    
    document.body.appendChild(overlay)
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
}