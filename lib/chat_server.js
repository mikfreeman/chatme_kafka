var socketio = require('socket.io'),
    events = require('events'),
    _ = require('underscore'),
    dataService = require('./data_service');

module.exports = function (server) {

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
        socket.emit('connected', {
                text: "Welcome : " + tempNickname,
                nickName : tempNickname
        });

        socket.on('joinRoom', function (room) {
           chatServer.joinRoom(socket,room);

        });

        socket.on('createRoom', function (room) {
            console.log('Attempting to create room ' + room.name);
            chatServer.createRoom(socket,room);

        });

        socket.on('message', function (message) {
            chatServer.sendMessage(socket,message);
        });

        socket.on('changeNickname', function (nickname) {
            chatServer.changeNickname(socket, nickname);
        });

        socket.on('disconnect', function() {
            chatServer.disconnect(socket);
        });
    });

    chatServer.createRoom = function (socket, room) {
        dataService.createRoom(room).then(function (result) {
            socket.broadcast.emit('newRoom', room);
            this.emit('newRoom', room);
            chatServer.joinRoom(socket, room);
        }).catch(function (err) {

        });
    };

    chatServer.joinRoom = function (socket, room) {
        socket.leave(currentRooms[socket.id]);
        currentRooms[socket.id] = room.name;
        socket.join(room.name);
        socket.emit('roomJoined',room);
        this.emit('roomJoined', room);

        var message = {
            room : room,
            nickName : nickNames.names[socket.id],
            text: nickNames.names[socket.id] + " has joined"
        }

        this.emit('sendMessage', message);
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

    chatServer.sendMessage = function(socket, message) {

        var message = {
            room : message.room,
            nickName : nickNames.names[socket.id],
            text: nickNames.names[socket.id] + " : " + message.text
        }

        this.emit('sendMessage', message);
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

            var message = {
                room : {
                    name : currentRooms[socket.id]
                },
                nickName : nickNames.names[socket.id],
                text : oldNickname + " changed nickname to : " + nickname

            }

            this.emit('sendMessage', message);
        }
    };

    chatServer.broadcast = function(message) {
        this.io.to(message.room.name).emit('message', message);
    };

    EventEmitter.call(chatServer);
    _.extend(chatServer, EventEmitter.prototype);

    return chatServer;
};