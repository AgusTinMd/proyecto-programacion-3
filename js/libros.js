// JS dedicado a la gestión de libros CRUD.
//Funcion para crear el modal de la creación de un nuevo libro.
const API_URL = 'http://localhost:3000'
import { abrirModalAutor, cargarAutores } from './autores.js'
import { abrirModalGenero, cargarGeneros } from './generos.js'

// READ — muestra todos los libros
async function cargarLibros() {
    const response = await axios.get(`${API_URL}/libros`)
    const libros = response.data

    let contenedor = document.getElementById('lista-libros')
    if (!contenedor) {
        contenedor = document.createElement('div')
        contenedor.id = 'lista-libros'
        document.body.appendChild(contenedor)
    }

    contenedor.innerHTML = ''

    libros.forEach(libro => {
        contenedor.innerHTML += `
            <div class="libro">
                <h3>${libro.nombre}</h3>
                <p>Género: ${libro.generoId}</p>
                <p>Autor: ${libro.autorId}</p>
                <p>Páginas: ${libro.numeroPaginas}</p>
                <p>Estado: ${libro.estado}</p>
                <button onclick="abrirModalEditar(${libro.id}, '${libro.nombre}', '${libro.generoId}', '${libro.autorId}', ${libro.numeroPaginas}, '${libro.estado}')">Editar</button>
                <button onclick="eliminarLibro(${libro.id})">Eliminar</button>
            </div>
        `
    })
}

// CREATE — abre modal para agregar libro
export async function abrirModalLibros() {
    if (document.querySelector('.modal-overlay')) return

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'

    overlay.innerHTML = `
    <div class="modal-box">         
        <h2 class="modal-titulo">Agregar libro</h2>
        <input type="text" name="nombreLibro" id="nombreLibro" placeholder="Nombre del libro">
        
        <div class="genero-row">
            <select name="genero" id="genero">
                <option value="">-- Seleccionar género --</option>
            </select>
            <button id="btn-agregar-genero">Agregar genero</button>
        </div>

        <div class="autor-row">
            <select name="autorLibro" id="autorLibro">
                <option value="">-- Seleccionar autor --</option>   
            </select>
            <button id="btn-agregar-autor">Agregar autor</button>
        </div>
        
        <input type="number" min="1" name="numeroPaginas" id="numeroPaginas" placeholder="Numero de paginas">
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

    overlay.querySelector('#btn-cancelar').onclick = (e) => { e.stopPropagation(); overlay.remove() }
    overlay.querySelector('#btn-guardar').onclick = () => guardarLibro()
    overlay.querySelector('#btn-agregar-autor').onclick = (e) => { e.stopPropagation(); abrirModalAutor() }
    overlay.querySelector('#btn-agregar-genero').onclick = (e) => { e.stopPropagation(); abrirModalGenero() }

    await cargarGeneros()
    await cargarAutores()
}

// CREATE — guarda el libro nuevo
async function guardarLibro() {
    const nombreLibro = document.getElementById('nombreLibro').value
    const generoId = document.getElementById('genero').value
    const autorId = document.getElementById('autorLibro').value
    const numeroPaginas = document.getElementById('numeroPaginas').value
    const estado = document.getElementById('estado').value

    await axios.post(`${API_URL}/libros`, {
        nombre: nombreLibro,
        generoId: generoId,
        autorId: autorId,
        numeroPaginas: numeroPaginas,
        estado: estado
    })

    document.querySelector('.modal-overlay').remove()
    await cargarLibros()
}

// UPDATE — abre modal para editar libro existente
window.abrirModalEditar = async function(id, nombre, generoId, autorId, numeroPaginas, estado) {
    if (document.querySelector('.modal-overlay-editar')) return

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay modal-overlay-editar'

    overlay.innerHTML = `
    <div class="modal-box">
        <h2 class="modal-titulo">Editar libro</h2>
        <input type="text" id="edit-nombre" value="${nombre}" placeholder="Nombre del libro">

        <div class="genero-row">
            <select id="edit-genero">
                <option value="">-- Seleccionar género --</option>
            </select>
        </div>

        <div class="autor-row">
            <select id="edit-autor">
                <option value="">-- Seleccionar autor --</option>
            </select>
        </div>

        <input type="number" min="1" id="edit-paginas" value="${numeroPaginas}" placeholder="Numero de paginas">
        <select id="edit-estado">
            <option value="Leido" ${estado === 'Leido' ? 'selected' : ''}>Leido</option>
            <option value="Sin Leer" ${estado === 'Sin Leer' ? 'selected' : ''}>Sin Leer</option>
            <option value="Leyendo" ${estado === 'Leyendo' ? 'selected' : ''}>Leyendo</option>
        </select>

        <div class="modal-acciones">
            <button class="btn-secundario" id="btn-cancelar-editar">Cancelar</button>
            <button class="btn-primario" id="btn-guardar-editar">Guardar</button>
        </div>
    </div>
    `

    document.body.appendChild(overlay)

    // Carga géneros y autores en los selects del modal editar
    const resGeneros = await axios.get(`${API_URL}/generos`)
    resGeneros.data.forEach(g => {
        const opt = document.createElement('option')
        opt.value = g.id
        opt.textContent = g.nombre
        if (g.id == generoId) opt.selected = true
        overlay.querySelector('#edit-genero').appendChild(opt)
    })

    const resAutores = await axios.get(`${API_URL}/autores`)
    resAutores.data.forEach(a => {
        const opt = document.createElement('option')
        opt.value = a.id
        opt.textContent = a.nombre
        if (a.id == autorId) opt.selected = true
        overlay.querySelector('#edit-autor').appendChild(opt)
    })

    overlay.querySelector('#btn-cancelar-editar').onclick = () => overlay.remove()
    overlay.querySelector('#btn-guardar-editar').onclick = () => editarLibro(id)
}

// UPDATE — guarda los cambios del libro
async function editarLibro(id) {
    const nombre = document.getElementById('edit-nombre').value
    const generoId = document.getElementById('edit-genero').value
    const autorId = document.getElementById('edit-autor').value
    const numeroPaginas = document.getElementById('edit-paginas').value
    const estado = document.getElementById('edit-estado').value

    await axios.patch(`${API_URL}/libros/${id}`, {
        nombre,
        generoId,
        autorId,
        numeroPaginas,
        estado
    })

    document.querySelector('.modal-overlay-editar').remove()
    await cargarLibros()
}

// DELETE — elimina un libro y sus anotaciones
window.eliminarLibro = async function(id) {
    const confirmar = confirm('¿Seguro que querés eliminar este libro?')
    if (!confirmar) return

    // Elimina todas las anotaciones asociadas al libro (eliminación en cascada)
    const resAnotaciones = await axios.get(`${API_URL}/anotaciones?libroId=${id}`)
    const anotaciones = resAnotaciones.data
    for (const anotacion of anotaciones) {
        await axios.delete(`${API_URL}/anotaciones/${anotacion.id}`)
    }

    await axios.delete(`${API_URL}/libros/${id}`)
    await cargarLibros()
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarLibros()

    const btnAgregar = document.getElementById('btn-agregar-libro')
    if (btnAgregar) btnAgregar.onclick = (e) => { e.stopPropagation(); abrirModalLibros() }
})