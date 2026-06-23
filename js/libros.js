// JS dedicado a la gestión de libros CRUD.
//Funcion para crear el modal de la creación de un nuevo libro.
const API_URL = 'http://localhost:3000'
import { abrirModalAutor,cargarAutores } from './autores.js'
import { abrirModalGenero,cargarGeneros } from './generos.js'


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

    overlay.querySelector('#btn-agregar-autor').onclick = (e) => {e.stopPropagation()
        abrirModalAutor()
    }
    overlay.querySelector('#btn-agregar-genero').onclick = (e) => {e.stopPropagation()
        abrirModalGenero()
    }

    await cargarGeneros()
    await cargarAutores()
}


// CRUD 


async function guardarLibro(){
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-agregar-libro').onclick = (e) => {e.stopPropagation()}
        abrirModalLibros()
})