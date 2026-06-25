// ==========================================================================
// CONTROLADOR DE AUTORES CRUD - tomo. (js/autores.js)
// ==========================================================================

const API_URL = 'http://localhost:3000';

// --- 1. ELEMENTOS DEL DOM ---
const modalAutor = document.getElementById('modal-agregar-autor');
const btnAbrirAutor = document.getElementById('btn-agregar-autor');
const btnMostrarAutores = document.getElementById('btn-mostrar-autores');
const contenedorAutores = document.getElementById('contenedor-autores');
const formAutor = document.getElementById('form-nuevo-autor');

// --- 2. LOGICA INTERNA DE APERTURA Y CIERRE ---
function abrirModalAutorPropio() {
    if (modalAutor) modalAutor.style.display = 'flex';
}

function cerrarModalAutorPropio() {
    if (modalAutor) modalAutor.style.display = 'none';
}

// Vinculamos el botón de tu panel izquierdo
if (btnAbrirAutor) {
    btnAbrirAutor.addEventListener('click', () => {
        abrirModalAutorPropio();
    });
}

// Cerrar si hacen clic afuera del modal
window.addEventListener('click', (e) => {
    if (e.target === modalAutor) {
        cerrarModalAutorPropio();
    }
});

// --- 3. EXPORTACIONES OBLIGATORIAS PARA TU EQUIPO (SINCRO CON LIBROS.JS) ---

export async function abrirModalAutor() {
    abrirModalAutorPropio();
}

export async function guardarAutor() {
    const inputAutor = document.getElementById('input-autor-nombre');
    if (!inputAutor) return;

    const nombreAutor = inputAutor.value;

    try {
        await axios.post(`${API_URL}/autores`, { nombre: nombreAutor });
        alert("¡Autor registrado con éxito!");
        
        if (formAutor) formAutor.reset();
        cerrarModalAutorPropio();
        
        await mostrarAutores(); 
    } catch (error) {
        console.error("Error al guardar autor:", error);
    }
}

export async function cargarAutores() {
    const select = document.getElementById('select-autor') || document.getElementById('autorLibro');
    if (!select) return;
    
    try {
        select.innerHTML = '<option value="">-- Seleccionar autor --</option>';
        const response = await axios.get(`${API_URL}/autores`);
        const autores = response.data;
        
        autores.forEach((autor) => {
            const option = document.createElement('option');
            option.value = autor.id;
            option.textContent = autor.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al rellenar select de autores:", error);
    }
}

// --- 4. RENDER LOCAL EN LA GRILLA DERECHA ---
async function mostrarAutores() {
    if (!contenedorAutores) return;
    try {
        const response = await axios.get(`${API_URL}/autores`);
        const autores = response.data;
        
        contenedorAutores.innerHTML = '';
        autores.forEach(autor => {
            contenedorAutores.innerHTML += `
                <div class="tarjeta-libro-render">
                    <div>
                        <h3 class="titulo-libro-render">${autor.nombre}</h3>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">ID de Registro: ${autor.id}</p>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al renderizar autores:", error);
    }
}

// --- 5. DISPARADORES ---
if (btnMostrarAutores) {
    btnMostrarAutores.addEventListener('click', mostrarAutores);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarAutores();
    if (formAutor) {
        formAutor.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarAutor();
        });
    }
});