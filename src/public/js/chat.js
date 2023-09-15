const socket = io();
const usernameInput = document.getElementById('usernameInput');
let username = '';

// Solicitar al usuario que ingrese su nombre de usuario
usernameInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && usernameInput.value.trim() !== '') {
    // Obtener el nombre de usuario ingresado
    username = usernameInput.value.trim();
    console.log(username)
    // Ocultar el cuadro de texto del nombre de usuario
    usernameInput.style.display = 'none';

    // Enfocar el cuadro de texto del chat
    chatBox.focus();
  }
});

// Manejar el evento "keyup" del cuadro de chat
const chatBox = document.getElementById('chatBox');
chatBox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && chatBox.value.trim() !== '') {
    const message = chatBox.value.trim();
    console.log('Nombre de usuario:', username);

    // Enviar el mensaje y el nombre de usuario al servidor
    socket.emit('message', { user: username, message });

    // Limpiar el cuadro de chat
    chatBox.value = '';
  }
});

// Escuchar el evento "messageLogs" y actualizar la vista con los mensajes
socket.on('messageLogs', (data) => {
  const messageLogs = document.getElementById('messageLogs');
  messageLogs.innerHTML = '';

  data.forEach((message) => {
    const p = document.createElement('p');
    p.textContent = `${message.user} dice: ${message.message}`;
    messageLogs.appendChild(p);
  });
});