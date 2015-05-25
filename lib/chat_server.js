var socketio = require('socket.io'),
    events = require('events'),
    util = require('util'),
    _ = require('underscore');

module.exports = function (server) {

    var rooms = {};
    rooms['Lobby'] = true;
    var currentRooms = {};
    var nickNames = {
        used: {},
        names: {}
    };
    var guestNo = 1;

    var EventEmitter = require('events').EventEmitter;
    var _ = require('underscore');

    var that = {};

    that.io = socketio.listen(server);

    that.io.sockets.on('connection', function (socket) {

        var tempNickname = that.getNextGuestName();
        that.assignGuestName(socket, tempNickname);
        socket.emit('connected', {text: "Welcome : " + tempNickname});

        socket.on('joinRoom', function (room) {
            socket.leave(currentRooms[socket.id])
            currentRooms[socket.id] = room;
            socket.join(room);
            socket.emit('roomJoined', room);
            that.emit('roomJoined', room);

            that.addRoom(socket, room);

            socket.broadcast.to(room).emit('message', {
                text: nickNames.names[socket.id] + " has joined"
            });

        });

        socket.on('message', function (message) {
            socket.broadcast.to(message.room).emit('message', {
                text: nickNames.names[socket.id] + " : " + message.text
            });
        });

        socket.on('changeNickname', function (nickname) {
            if (nickNames.used[nickname]) {
                socket.emit('message', {
                    text: nickname + " already in use"
                });
            } else {
                var oldNickname = nickNames.names[socket.id];
                that.assignGuestName(socket, nickname);
                console.log(oldNickname + " changed nickname to : " + nickname)
                socket.emit('nicknameChanged', nickname);
                socket.broadcast.to(currentRooms[socket.id]).emit('message', {
                    text: oldNickname + " changed nickname to : " + nickname
                });
            }
        });
    });

    that.getRooms = function () {
        return Object.keys(rooms);
    };

    that.addRoom = function (socket, room) {

        var chatServer = this;

        if (!(room in rooms)) {
            rooms[room] = true;
            socket.broadcast.emit('newRoom', room);
            chatServer.emit('newRoom', room);
        }
    }

    that.assignGuestName = function (socket, nickname) {
        nickNames.names[socket.id] = nickname;
        nickNames.used[nickname] = true;
    }

    that.getNextGuestName = function () {
        var name = 'Guest' + guestNo++;
        return name;
    }

    EventEmitter.call(that);
    _.extend(that, EventEmitter.prototype);

    return that;
};