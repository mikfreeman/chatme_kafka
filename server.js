var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var chat_server = require('./lib/chat_server');

//io.configure(function () {
//  io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
//});

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/rooms', function (req, res) {
    res.json({'rooms': chatServer.getRooms()});
});

server.listen(3000);
chatServer = chat_server(server);

//Example of event emitting
chatServer.on('roomJoined', function (room) {
   console.log(room + ' joined');
});