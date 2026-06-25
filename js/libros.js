// ==========================================================================
// CONTROLADOR DE LOGICA Y MODALES - tomo. (js/libros.js)
// ==========================================================================

import { cargarAutores } from './autores.js';
import { cargarGeneros } from './generos.js';

const API_URL = 'http://localhost:3000';

// --- 1. CAPTURA DE ELEMENTOS DEL DOM ---
const modalLibro = document.getElementById('modal-agregar-libro');
const btnAbrirLibro = document.getElementById('btn-agregar-libro');
const btnMostrarLibros = document.getElementById('btn-mostrar-libros');
const contenedorLibros = document.getElementById('contenedor-libros');
const formLibro = document.getElementById('form-nuevo-libro');

// Captura de botones de cierre específicos
const btnCerrarCruz = document.getElementById('btn-cerrar-modal-cruz');
const btnCerrarCancelar = document.getElementById('btn-cerrar-modal-cancelar');

// --- 2. LOGICA INTERNA DE APERTURA Y CIERRE ---
function abrirModalPropio() {
    if (modalLibro) modalLibro.style.display = 'flex';
}

function cerrarModalPropio() {
    if (modalLibro) modalLibro.style.display = 'none';
}

if (btnAbrirLibro) {
    btnAbrirLibro.addEventListener('click', async () => {
        abrirModalPropio();
        // Cargamos los selectores invocando las funciones del equipo
        await cargarGeneros();
        await cargarAutores();
    });
}

// Escuchadores de cierre libres de atributos del HTML
if (btnCerrarCruz) btnCerrarCruz.addEventListener('click', cerrarModalPropio);
if (btnCerrarCancelar) btnCerrarCancelar.addEventListener('click', cerrarModalPropio);

window.addEventListener('click', (e) => {
    if (e.target === modalLibro) {
        cerrarModalPropio();
    }
});

// --- 3. PETICIONES AXIOS (CRUD Y RENDER) ---
async function mostrarLibros() {
    try {
        const response = await axios.get(`${API_URL}/libros`);
        const libros = response.data;
        
        if (!contenedorLibros) return;
        contenedorLibros.innerHTML = '';
        
        libros.forEach(libro => {
            const claseEstado = libro.estado.toLowerCase().replace(' ', '-');
            
            contenedorLibros.innerHTML += `
                <div class="tarjeta-libro-render">
                    <div>
                        <h3 class="titulo-libro-render">${libro.nombre}</h3>
                        <p class="autor-libro-render">Autor ID: ${libro.autorId}</p>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.2rem;">Género ID: ${libro.generoId}</p>
                        <p style="font-size: 0.9rem; color: #666;">Páginas: ${libro.numeroPaginas}</p>
                    </div>
                    <span class="badge badge-${claseEstado}">${libro.estado}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al obtener los libros:", error);
    }
}

if (btnMostrarLibros) {
    btnMostrarLibros.addEventListener('click', mostrarLibros);
}

// --- 4. ENVÍO DEL FORMULARIO ---
if (formLibro) {
    formLibro.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nuevoLibro = {
            nombre: document.getElementById('input-titulo').value,
            generoId: document.getElementById('select-genero').value,
            autorId: document.getElementById('select-autor').value,
            numeroPaginas: document.getElementById('input-paginas').value,
            estado: document.getElementById('select-estado').value
        };

        try {
            await axios.post(`${API_URL}/libros`, nuevoLibro);
            alert("¡Libro guardado con éxito!");
            formLibro.reset(); 
            cerrarModalPropio(); 
            mostrarLibros(); 
        } catch (error) {
            console.error("Error al guardar el libro:", error);
        }
    });
}

// --- 5. LOGICA DE CIERRE DE SESIÓN ---
const btnSalir = document.getElementById('btn-cerrar-sesion');
if (btnSalir) {
    btnSalir.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarLibros();
});