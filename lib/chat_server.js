var socketio = require('socket.io'),
    events = require('events'),
    _ = require('underscore'),
    dataService = require('./data_service')
Q = require('q');

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
        dataService.generateNextTemporaryUserId().then(function (tempUserId) {
            console.log('Generated temp id ' + tempUserId);

            var tempNickname = 'Guest' + tempUserId;

            //Assign the guestname to the socket/user
            chatServer.assignGuestName(socket, tempNickname).then(function (result) {
                //Welcome the user
                socket.emit('connected', {
                    text: "Welcome : " + tempNickname,
                    nickName: tempNickname
                });
            }).catch(function (err) {
                console.log('Error ' + error);
            });

        }).catch(function (error) {
            console.log('Error ' + error);
        });


        socket.on('joinRoom', function (room) {
            chatServer.joinRoom(socket, room);

        });

        socket.on('createRoom', function (room) {
            console.log('Attempting to create room ' + room.name);
            chatServer.createRoom(socket, room);

        });

        socket.on('message', function (message) {
            chatServer.sendMessage(socket, message);
        });

        socket.on('changeNickname', function (nickname) {
            chatServer.changeNickname(socket, nickname);
        });

        socket.on('disconnect', function () {
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
        socket.emit('roomJoined', room);
        this.emit('roomJoined', room);

        var message = {
            room: room,
            nickName: nickNames.names[socket.id],
            text: nickNames.names[socket.id] + " has joined"
        }

        this.emit('sendMessage', message);
    };

    chatServer.disconnect = function (socket) {
        var nickname = nickNames.names[socket.id];
        console.log(nickname + ' has disconnected');
        delete currentRooms[socket.id];
        delete nickNames.names[socket.id];

        dataService.deleteNickname(nickname).then(function (result) {

        }).catch(function (err) {

        });
    };

    chatServer.assignGuestName = function (socket, nickname) {

        var deferred = Q.defer();

        dataService.insertNickname(nickname).then(function (result) {
            nickNames.names[socket.id] = nickname;
            deferred.resolve(result);

        }).catch(function (err) {
            socket.emit('message', {
                text: nickname + " already in use"
            });
            deferred.reject(err);
        });

        return deferred.promise;
    };

    chatServer.sendMessage = function (socket, message) {

        var message = {
            room: message.room,
            nickName: nickNames.names[socket.id],
            text: nickNames.names[socket.id] + " : " + message.text
        }

        this.emit('sendMessage', message);
    };

    chatServer.changeNickname = function (socket, nickname) {

        var oldNickname = nickNames.names[socket.id];
        var that = this;

        chatServer.assignGuestName(socket, nickname).then(function (result) {
            dataService.deleteNickname(oldNickname).then(function (result) {

            }).catch(function (err) {

            });

            console.log(oldNickname + " changed nickname to : " + nickname);
            socket.emit('nicknameChanged', nickname);

            var message = {
                room: {
                    name: currentRooms[socket.id]
                },
                nickName: nickNames.names[socket.id],
                text: oldNickname + " changed nickname to : " + nickname

            };

            that.emit('sendMessage', message);

        }).catch(function (err) {
            console.log(err);
            socket.emit('message', {
                text: nickname + " already in use"
            });
        });
    };

    chatServer.broadcast = function (message) {
        this.io.to(message.room.name).emit('message', message);
    };

    EventEmitter.call(chatServer);
    _.extend(chatServer, EventEmitter.prototype);

    return chatServer;
};