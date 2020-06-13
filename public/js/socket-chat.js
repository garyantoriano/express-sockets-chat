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
    socket.emit('enterToChat', user, function (resp) {
        console.log('Connected users', resp);
    });
});

// Hear
socket.on('disconnect', function () {
    console.log('Server connection lost');
});


// Send information
// socket.emit('createMessage', {
//     user: 'Gary',
//     message: 'Hola Mundo'
// }, function (resp) {
//     console.log('server response: ', resp);
// });

// Receive information
socket.on('createMessage', function (message) {
    console.log('Server:', message);
});

// Watch user cahnges (when a user enter to the chat)
socket.on('peopleList', function (people) {
    console.log(people);
});

// Private message
socket.on('privateMessage', (message) => {
    console.log('Private message: ', message);
});