function abrirModal() {
    if (document.querySelector('.modal-overlay')) return
    
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'  // ← clase que ella va a estilizar

    overlay.innerHTML = `
        <div class="modal-box">         
        <h2 class="modal-titulo">Agregar autor</h2>
        <input type="text" name ="nombre" id="nombre" placeholder="Nombre del autor">
        <div class="modal-acciones">
            <button class="btn-secundario" id="btn-cancelar">Cancelar</button>
            <button class="btn-primario" id="btn-guardar">Guardar</button>
            </div>
        </div>
    `
    
    document.body.appendChild(overlay)
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
}