// JS dedicado a la gestión de autores CRUD.

//Funcion para crear el modal de la creación de un nuevo autor.
const API_URL = 'http://localhost:3000'

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
    console.log('btn-guardar:', overlay.querySelector('#btn-guardar'))
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
    overlay.querySelector('#btn-guardar').onclick = (e) =>{e.stopPropagation()
        guardarAutor()
    } 
}

export async function cargarAutores() {
    const select = document.getElementById('autorLibro')
    if (!select) return  // si no existe el select, no hace nada
    select.innerHTML = '<option value="">-- Seleccionar autor --</option>'
    const response = await axios.get(`${API_URL}/autores`)
    const autores = response.data
    autores.forEach((autor) => {
        const option = document.createElement('option')
        option.value = autor.id
        option.textContent = autor.nombre
        select.appendChild(option)
    })
}


document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-agregar-autor')
    if (btn) btn.onclick = () => abrirModalAutor()
})


async function guardarAutor() {
    const nombreAutor = document.getElementById('nombre').value
    await axios.post(`${API_URL}/autores`, { nombre: nombreAutor })
    document.querySelector('.modal-overlay-autor').remove()
    await cargarAutores()
}