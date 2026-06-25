// JS dedicado a la gestión de generos CRUD.

const API_URL = 'http://localhost:3000'

// listar generos
async function mostrarGeneros() {
    const response = await axios.get(`${API_URL}/generos`)
    const generos = response.data

    let lista = document.getElementById('lista-generos')
    if (!lista) {
        lista = document.createElement('ul')
        lista.id = 'lista-generos'
        document.querySelector('main').appendChild(lista)
    }

    lista.innerHTML = generos.map(genero => `
        <li>
            <span>${genero.nombre}</span>
            <button class="btn-editar" data-id="${genero.id}" data-nombre="${genero.nombre}">editar</button>
            <button class="btn-eliminar" data-id="${genero.id}">eliminar</button>
        </li>
    `).join('')

    lista.querySelectorAll('.btn-editar').forEach(btn => {
        btn.onclick = () => abrirModalEditarGenero(btn.dataset.id, btn.dataset.nombre)
    })
    lista.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.onclick = () => eliminarGenero(btn.dataset.id)
    })
}

// abrir MODAL-CREATE
export async function abrirModalGenero() {
    if (document.querySelector('.modal-overlay-genero')) return

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay modal-overlay-genero'
    overlay.innerHTML = `
        <div class="modal-box">         
            <h2 class="modal-titulo">agregar genero</h2>
            <input type="text" name="genero" id="nombreGenero" placeholder="nombre del genero">
            <div class="modal-acciones">
                <button class="btn-secundario" id="btn-cancelar">cancelar</button>
                <button class="btn-primario" id="btn-guardar">guardar</button>
            </div>
        </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
    overlay.querySelector('#btn-guardar').onclick = (e) => {
        e.stopPropagation()
        guardarGenero()
    }
}

// guardar nuevo genero
export async function guardarGenero() {
    const nombreGenero = document.getElementById('nombreGenero').value
    if (!nombreGenero) {
        alert('el nombre es obligatorio')
        return
    }
    await axios.post(`${API_URL}/generos`, { nombre: nombreGenero })
    document.querySelector('.modal-overlay-genero').remove()
    await cargarGeneros()
    await mostrarGeneros()
}

// abrir modal para editar
function abrirModalEditarGenero(id, nombreActual) {
    if (document.querySelector('.modal-overlay-genero')) return

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay modal-overlay-genero'
    overlay.innerHTML = `
        <div class="modal-box">
            <h2 class="modal-titulo">editar genero</h2>
            <input type="text" id="nombreGenero" value="${nombreActual}" placeholder="nombre del genero">
            <div class="modal-acciones">
                <button class="btn-secundario" id="btn-cancelar">cancelar</button>
                <button class="btn-primario" id="btn-guardar">guardar cambios</button>
            </div>
        </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
    overlay.querySelector('#btn-guardar').onclick = (e) => {
        e.stopPropagation()
        actualizarGenero(id)
    }
}

// actualizar genero existente
async function actualizarGenero(id) {
    const nombreGenero = document.getElementById('nombreGenero').value
    if (!nombreGenero) {
        alert('el nombre es obligatorio')
        return
    }
    await axios.put(`${API_URL}/generos/${id}`, { nombre: nombreGenero })
    document.querySelector('.modal-overlay-genero').remove()
    await cargarGeneros()
    await mostrarGeneros()
}

// eliminar genero
async function eliminarGenero(id) {
    if (!confirm('¿seguro que queres eliminar este genero?')) return
    await axios.delete(`${API_URL}/generos/${id}`)
    await cargarGeneros()
    await mostrarGeneros()
}

// cargar generos en el select (para libros)
export async function cargarGeneros() {
    const select = document.getElementById('genero')
    if (!select) return
    select.innerHTML = '<option value="">-- seleccionar genero --</option>'
    const response = await axios.get(`${API_URL}/generos`)
    const generos = response.data
    generos.forEach(genero => {
        const option = document.createElement('option')
        option.value = genero.id
        option.textContent = genero.nombre
        select.appendChild(option)
    })
}

// inicializar
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-agregar-genero')
    if (btn) btn.onclick = () => abrirModalGenero()
    mostrarGeneros()
})