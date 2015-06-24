var socketio = require('socket.io'),
    events = require('events'),
    _ = require('underscore');

module.exports = function (server) {

    //The rooms available on the server
    var rooms = {};
    rooms['Lobby'] = true;

    //The room a socket/user is currently in
    var currentRooms = {};

    var nickNames = {
        used: {},
        names: {}
    };

    //Start guest user number at 1
    var guestNo = 1;

    //Allow the chatServer to emit events
    var EventEmitter = require('events').EventEmitter;

    var chatServer = {};

    chatServer.io = socketio.listen(server);

    chatServer.io.sockets.on('connection', function (socket) {

        //Generate a temporary nickname for the user
        var tempNickname = chatServer.getNextGuestName();

        //Assign the guestname to the socket/user
        chatServer.assignGuestName(socket, tempNickname);

        //Welcome the user
        socket.emit('connected', {text: "Welcome : " + tempNickname});

        socket.on('joinRoom', function (room) {
           chatServer.joinRoom(socket,room);

        });

        socket.on('message', function (message) {
            chatServer.broadcastMessage(socket,message);
        });

        socket.on('changeNickname', function (nickname) {
            chatServer.changeNickname(socket, nickname);
        });

        socket.on('disconnect', function() {
            chatServer.disconnect(socket);
        });
    });


    chatServer.getRooms = function () {
        return Object.keys(rooms);
    };

    chatServer.addRoom = function (socket, room) {
        if (!(room in rooms)) {
            rooms[room] = true;
            socket.broadcast.emit('newRoom', room);
            this.emit('newRoom', room);
        }
    };

    chatServer.joinRoom = function (socket, room) {
        socket.leave(currentRooms[socket.id]);
        currentRooms[socket.id] = room;
        socket.join(room);
        socket.emit('roomJoined', room);
        this.emit('roomJoined', room);

        this.addRoom(socket, room);

        socket.broadcast.to(room).emit('message', {
            text: nickNames.names[socket.id] + " has joined"
        });
    };

    chatServer.disconnect = function (socket) {
        var nickname = nickNames.names[socket.id];
        console.log(nickname + ' has disconnected');
        delete currentRooms[socket.id];
        delete nickNames.names[socket.id];
        delete nickNames.used[nickname];
    };

    chatServer.assignGuestName = function (socket, nickname) {
        nickNames.names[socket.id] = nickname;
        nickNames.used[nickname] = true;
    };

    chatServer.getNextGuestName = function () {
        return 'Guest' + guestNo++;
    };

    chatServer.broadcastMessage = function(socket, message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames.names[socket.id] + " : " + message.text
        });
    };

    chatServer.changeNickname = function(socket, nickname) {
        if (nickNames.used[nickname]) {
            socket.emit('message', {
                text: nickname + " already in use"
            });
        } else {
            var oldNickname = nickNames.names[socket.id];
            chatServer.assignGuestName(socket, nickname);
            delete nickNames.used[oldNickname];
            console.log(oldNickname + " changed nickname to : " + nickname);
            socket.emit('nicknameChanged', nickname);
            socket.broadcast.to(currentRooms[socket.id]).emit('message', {
                text: oldNickname + " changed nickname to : " + nickname
            });
        }
    };

    EventEmitter.call(chatServer);
    _.extend(chatServer, EventEmitter.prototype);

    return chatServer;
};