// JS dedicado a la gestión de generos CRUD.

//Funcion para crear el modal de la creación de un nuevo genero.

const API_URL = 'http://localhost:3000'
export async function abrirModalGenero() {
    if (document.querySelector('.modal-overlay-genero')) return
    
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay modal-overlay-genero'  // ← clase que ella va a estilizar
    overlay.innerHTML = `
        <div class="modal-box">         
        <h2 class="modal-titulo">Agregar genero</h2>
        <input type="text" name ="genero" id="nombreGenero" placeholder="Genero del libro">
        <div class="modal-acciones">
            <button class="btn-secundario" id="btn-cancelar">Cancelar</button>
            <button class="btn-primario" id="btn-guardar">Guardar</button>
            </div>
        </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
    overlay.querySelector('#btn-guardar').onclick = (e) =>{e.stopPropagation()
        guardarGenero()
    } 
}

export async function cargarGeneros() {
    const select = document.getElementById('genero')
    if (!select) return
    select.innerHTML = '<option value="">-- Seleccionar género --</option>'
    const response = await axios.get(`${API_URL}/generos`)
    const generos = response.data
    generos.forEach((genero) => {
        const option = document.createElement('option')
        option.value = genero.id
        option.textContent = genero.nombre
        select.appendChild(option)
    })
}

export async function guardarGenero(){
    const nombreGenero = document.getElementById('nombreGenero').value
    console.log('nombreGenero:', nombreGenero)
    await axios.post(`${API_URL}/generos`, { nombre: nombreGenero })
    document.querySelector('.modal-overlay-genero').remove()
    await cargarGeneros()
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-agregar-genero')
    if (btn) btn.onclick = () => abrirModalGenero()
})