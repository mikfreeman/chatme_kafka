var chat_server = require('./lib/chat_server');
var http = require('http');
var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

//io.configure(function () {
//  io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
//});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/rooms', function (req, res) {
    res.json({'rooms': chatServer.getRooms()});
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(3000);
chatServer = chat_server(server);

//Example of event emitting
chatServer.on('roomJoined', function (room) {
   console.log(room + ' joined');
});