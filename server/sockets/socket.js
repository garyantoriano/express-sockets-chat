const { io } = require('../server');
const Users = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {
    client.on('enterToChat', (data, callback) => {
        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'The name/room is required'
            });
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);
        client.broadcast.to(data.room).emit('peopleList', users.getPeopleByRoom(data.room));
        callback(users.getPeopleByRoom(data.room));
    });

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);
        if (deletedPerson) {
            client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Administrator', `${deletedPerson.name} left`));
        }

        client.broadcast.to(deletedPerson.room).emit('peopleList', users.getPeopleByRoom(deletedPerson.room));
    });

    // Private messages
    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });
});
