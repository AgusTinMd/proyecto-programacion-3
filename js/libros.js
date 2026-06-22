// JS dedicado a la gestión de libros CRUD.

//Funcion para crear el modal de la creación de un nuevo libro.

function abrirModal() {
    if (document.querySelector('.modal-overlay')) return

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay' // estilizar esa clase

    overlay.innerHTML = `
        <div class="modal-box">         
        <h2 class="modal-titulo">Agregar libro</h2>
        <input type="text" name="nombreLibro" id="nombreLibro" placeholder="Nombre del libro">

        <div class="genero-row">
            <select name="genero" id="genero">
            </select>
        </div>
        <div class="autor-row">
            <select name="autorLibro" id="autorLibro">
            </select>
            <button class="" id="btn-agregar-autor">Agregar autor</button>
        </div>

        <input type="number" name="numeroPaginas" id="numeroPaginas" placeholder="Numero de paginas">
        <select name="estado" id="estado">
            <option value="Leido">Leido</option>
            <option value="Sin Leer">Sin Leer</option>
            <option value="Leyendo">Leyendo</option>
        </select>

        <div class="modal-acciones">
            <button class="btn-secundario" id="btn-cancelar">Cancelar</button>
            <button class="btn-primario" id="btn-guardar">Guardar</button>
        </div>
    </div>
    `
    
    document.body.appendChild(overlay)
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
}
