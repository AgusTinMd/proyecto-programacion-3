// JS dedicado a la gestión de autores CRUD.

//Funcion para crear el modal de la creación de un nuevo autor.


export async function abrirModalAutor() {
    if (document.querySelector('.modal-overlay-autor')) return
    
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay modal-overlay-autor'  // ← clase que ella va a estilizar

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

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-agregar-autor')
    if (btn) btn.onclick = () => abrirModalAutor()
})

async function guardarAutor() {
    nombreAutor = document.getElementById('nombre').value
}