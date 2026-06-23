document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('login');
    
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            const usuarioInput = document.getElementById('usuario').value;
            const claveInput = document.getElementById('clave').value;

            if (!usuarioInput || !claveInput) {
                console.log('Error: Por favor, ingrese su usuario y contraseña.');
                return;
            }

            axios.get('http://localhost:3000/usuario')
                .then(response => {
                    const usuarios = response.data;
                    
                    const foundUser = usuarios.find(user => user.username === usuarioInput && user.clave === claveInput);

                    if (foundUser) {
                        console.log('Inicio de sesión exitoso. ¡Bienvenido, ' + foundUser.nombre + '!');
                        
                        // --- AQUÍ IRÍA LA LÓGICA DE REDIRECCIÓN ---
                        // window.location.href = 'dashboard.html'; 
                        
                    } else {
                        console.log('Error: Usuario o contraseña incorrectos.');
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos:', error);
                });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Capturamos el botón usando el ID correcto de tu HTML
    const btnCrearUsuario = document.getElementById('crearUsuario');

    if (btnCrearUsuario) {
        btnCrearUsuario.addEventListener('click', function () {
            
            const usuarioInput = document.getElementById('usuario').value;
            const claveInput = document.getElementById('clave').value;

            if (!usuarioInput || !claveInput) {
                console.log('Error: Faltan datos.');
                alert('Por favor, ingresa un usuario y una contraseña.');
                return;
            }

            const nuevoUsuario = {
                username: usuarioInput,
                clave: claveInput,
                nombre: "",
                apellido: "",
                dni: "",
                direccion: ""
            };

            axios.post('http://localhost:3000/usuario', nuevoUsuario)
                .then(response => {
                    console.log('Usuario creado en db.json:', response.data);
                    //alert('¡Usuario creado con éxito!');
                    
                    document.getElementById('usuario').value = '';
                    document.getElementById('clave').value = '';

                    // Descomenta la siguiente línea si quieres que lo redirija automáticamente al login
                    // window.location.href = '../index.html'; 
                })
                .catch(error => {
                    console.error('Error en la petición POST:', error);
                    alert('Hubo un error al intentar crear el usuario.');
                });
        });
    }
});