// ==========================================================================
// CONTROLADOR DE GÉNEROS CRUD - tomo. (js/generos.js)
// ==========================================================================

const API_URL = 'http://localhost:3000';

// --- 1. CAPTURA DE ELEMENTOS DEL DOM ---
const modalGenero = document.getElementById('modal-agregar-genero');
const btnAbrirGenero = document.getElementById('btn-agregar-genero');
const btnMostrarGeneros = document.getElementById('btn-mostrar-generos'); // El botón de tu tarjeta izquierda
const contenedorGeneros = document.getElementById('contenedor-generos'); // Tu grilla Pinterest a la derecha
const formGenero = document.getElementById('form-nuevo-genero');

// --- 2. LOGICA GLOBAL DE MODALES (Scope type="module") ---
window.abrirModal = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = 'flex';
}

window.cerrarModal = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = 'none';
}

// Vinculamos tu botón estético de la izquierda para que despierte el modal
if (btnAbrirGenero) {
    btnAbrirGenero.addEventListener('click', () => {
        window.abrirModal('modal-agregar-genero');
    });
}

// Cerrar si hacen clic en la zona difuminada de afuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-fondo')) {
        e.target.style.display = 'none';
    }
});

// --- 3. EXPORTACIONES EXCLUSIVAS PARA LA NAVEGACIÓN Y CRUD ---

// A. Función para abrir el modal (Exportada para cuando se use desde libros.js)
export async function abrirModalGenero() {
    window.abrirModal('modal-agregar-genero');
}

// B. Guardar un nuevo género conectando tu formulario estético con Axios
export async function guardarGenero() {
    // Capturamos el input con el ID estético que pusimos en tu HTML
    const inputGenero = document.getElementById('input-genero-nombre');
    if (!inputGenero) return;

    const nombreGenero = inputGenero.value;
    console.log('Registrando género:', nombreGenero);

    try {
        await axios.post(`${API_URL}/generos`, { nombre: nombreGenero });
        alert("¡Género creado con éxito!");
        
        if (formGenero) formGenero.reset(); // Limpiamos el campo crema
        window.cerrarModal('modal-agregar-genero'); // Escondemos el modal
        
        await mostrarGeneros(); // Recarga tu grilla Pinterest al instante
    } catch (error) {
        console.error("Error al guardar el género:", error);
    }
}

// C. Alimentar dinámicamente los dropdowns (Exportada para libros.js)
export async function cargarGeneros() {
    // Busca tanto el select de libros.html como el de editar si existiera
    const select = document.getElementById('select-genero') || document.getElementById('genero');
    if (!select) return;
    
    try {
        select.innerHTML = '<option value="">-- Seleccionar género --</option>';
        const response = await axios.get(`${API_URL}/generos`);
        const generos = response.data;
        
        generos.forEach((genero) => {
            const option = document.createElement('option');
            option.value = genero.id;
            option.textContent = genero.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar géneros en los selects:", error);
    }
}

// --- 4. RENDERIZADO DE LAS TARJETAS EN LA GRILLA DERECHA ---

async function mostrarGeneros() {
    if (!contenedorGeneros) return; // Evita errores si se ejecuta en otra pantalla
    
    try {
        const response = await axios.get(`${API_URL}/generos`);
        const generos = response.data;
        
        contenedorGeneros.innerHTML = '';
        
        generos.forEach(genero => {
            // Reutiliza tus tarjetas .tarjeta-libro-render automáticas de components.css
            contenedorGeneros.innerHTML += `
                <div class="tarjeta-libro-render">
                    <div>
                        <h3 class="titulo-libro-render">${genero.nombre}</h3>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; font-style: normal;">ID Categoría: ${genero.id}</p>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al listar los géneros:", error);
    }
}

// --- 5. DISPARADORES AL CARGAR LA PÁGINA ---

if (btnMostrarGeneros) {
    btnMostrarGeneros.addEventListener('click', mostrarGeneros);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarGeneros(); // Carga el catálogo Pinterest de entrada
    
    // Escucha el submit de tu formulario estético
    if (formGenero) {
        formGenero.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarGenero();
        });
    }
});