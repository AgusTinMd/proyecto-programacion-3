// Esqueleto limpio listo para que tu equipo complete el CRUD de notas
const API_URL = 'http://localhost:3000';

const modalNota = document.getElementById('modal-agregar-nota');
const btnAbrirNota = document.getElementById('btn-agregar-nota');

window.abrirModal = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = 'flex';
}
window.cerrarModal = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = 'none';
}

if (btnAbrirNota) {
    btnAbrirNota.addEventListener('click', () => window.abrirModal('modal-agregar-nota'));
}