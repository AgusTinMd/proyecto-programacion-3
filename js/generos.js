// JS dedicado a la gestión de generos CRUD.

//Funcion para crear el modal de la creación de un nuevo genero.


export async function abrirModalGenero() {
    if (document.querySelector('.modal-overlay-genero')) return
    
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay modal-overlay-genero'  // ← clase que ella va a estilizar

    overlay.innerHTML = `
        <div class="modal-box">         
        <h2 class="modal-titulo">Agregar genero</h2>
        <input type="text" name ="genero" id="genero" placeholder="Genero del libro">
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
    const btn = document.getElementById('btn-agregar-genero')
    if (btn) btn.onclick = () => abrirModalGenero()
})