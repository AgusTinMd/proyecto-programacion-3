// JS dedicado a la gestión de libros CRUD.
//Funcion para crear el modal de la creación de un nuevo libro.
import { abrirModalAutor } from './autores.js'
import { abrirModalGenero } from './generos.js'


export async function abrirModalLibros() {
    if (document.querySelector('.modal-overlay')) return
    
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay' // estilizar esa clase
    
    overlay.innerHTML = `
    <div class="modal-box">         
    <h2 class="modal-titulo">Agregar libro</h2>
    <input type="text" name="nombreLibro" id="nombreLibro" placeholder="Nombre del libro">
    
    <div class="genero-row">
    <select name="genero" id="genero">
        <option value="">-- Seleccionar género --</option>
    </select>
    <button class="" id="btn-agregar-genero">Agregar genero</button>
    </div>

    <div class="autor-row">
    <select name="autorLibro" id="autorLibro">
        <option value="">-- Seleccionar autor --</option>   
    </select>
    <button class="" id="btn-agregar-autor">Agregar autor</button>
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
    
    overlay.querySelector('#btn-cancelar').onclick = () => overlay.remove()
    overlay.querySelector('#btn-guardar').onclick = () => guardarLibro()

    overlay.querySelector('#btn-agregar-autor').onclick = () => abrirModalAutor()
    overlay.querySelector('#btn-agregar-genero').onclick = () => abrirModalGenero()

    await cargarGeneros()
    await cargarAutores()
}


// CRUD 

const API_URL = 'http://localhost:3000'

async function cargarGeneros() {
    const response = await axios.get(`${API_URL}/generos`)
    const generos = response.data
    generos.forEach((genero) => {
        const option = document.createElement('option')
        option.value = genero.id
        option.textContent = genero.nombre
        document.getElementById('genero').appendChild(option)
    })
}

async function cargarAutores() {
    const response = await axios.get( `${API_URL}/autores`)
    const autores = response.data
    autores.forEach((autor) => {
        const option = document.createElement('option')
        option.value = autor.id
        option.textContent = autor.nombre
        document.getElementById('autorLibro').appendChild(option)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-agregar-libro').onclick = () => abrirModalLibros()
})