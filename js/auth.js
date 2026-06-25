// ==========================================================================
// CONTROLADOR DE AUTENTICACIÓN (LOGIN Y REGISTRO) - tomo. (js/auth.js)
// ==========================================================================

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
    
    // --- LÓGICA DE INICIO DE SESIÓN (LOGIN) ---
    const formularioLogin = document.getElementById('formulario-login');
    
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function (e) {
            e.preventDefault(); 

            const usuarioInput = document.getElementById('usuario').value;
            const claveInput = document.getElementById('clave').value;

            axios.get(`${API_URL}/usuarios`)
                .then(response => {
                    const usuarios = response.data;
                    const foundUser = usuarios.find(user => user.username === usuarioInput && user.clave === claveInput);

                    if (foundUser) {
                        alert('¡Inicio de sesión exitoso! Bienvenido/a ' + (foundUser.username));
                        localStorage.setItem('usuarioLogueado', JSON.stringify(foundUser));
                        
                        // Redirección directa al vivir en la misma carpeta pages/
                        window.location.href = 'libros.html'; 
                    } else {
                        alert('Error: Usuario o contraseña incorrectos.');
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos de usuarios:', error);
                    alert('Hubo un error al conectar con el servidor. Revisá que JSON Server esté corriendo.');
                });
        });
    }

    // --- LÓGICA DE CREACIÓN DE USUARIO (SIGNUP) ---
    const formularioRegistro = document.getElementById('formulario-registro');

    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', function (e) {
            e.preventDefault(); 
            
            const usuarioInput = document.getElementById('usuario').value;
            const claveInput = document.getElementById('clave').value;

            const nuevoUsuario = {
                username: usuarioInput,
                clave: claveInput,
                nombre: "",
                apellido: "",
                dni: "",
                direccion: ""
            };

            axios.post(`${API_URL}/usuarios`, nuevoUsuario)
                .then(response => {
                    console.log('Usuario creado en db.json:', response.data);
                    alert('¡Cuenta creada con éxito! Ahora iniciá sesión.');
                    
                    formularioRegistro.reset();
                    
                    // Redirección directa al vivir en la misma carpeta pages/
                    window.location.href = 'login.html'; 
                })
                .catch(error => {
                    console.error('Error en la petición POST de registro:', error);
                    alert('Hubo un error al intentar crear el usuario. Asegurate de tener la tabla usuarios en db.json');
                });
        });
    }
});