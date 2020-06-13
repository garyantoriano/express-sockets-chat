var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('The name and room are required');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.emit('enterToChat', user, function (resp) {
        renderUsers(resp);
    });

});

// escuchar
socket.on('disconnect', function () {

    console.log('The server connection is lost');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Gary',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function (message) {
    renderMessages(message, false);
    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('peopleList', function (people) {
    renderUsers(people);
});

// Mensajes privados
socket.on('privateMessage', function (message) {
    console.log('Private Message: ', message);
});