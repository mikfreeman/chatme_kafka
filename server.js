var chat_server = require('./lib/chat_server');
var kafka_consumer = require('./lib/kafka_consumer');
var kafka_producer = require('./lib/kafka_producer');
var http = require('http');
var express = require('express');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var data_service = require('./lib/data_service');

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
    data_service.findAllRooms(0,10).then(function(rooms) {
        res.json({'rooms': rooms});
    }).catch(function(err) {
        console.log(err);
    })
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

console.log('Using arguments ' + JSON.stringify(argv));
var server = http.createServer(app);
var port = (argv.port) ? argv.port : 3000;

server.listen(port);
chatServer = chat_server(server);

var groupId = (argv.groupid) ? argv.groupid : 'chat-server-group';
kafkaConsumer = kafka_consumer(chatServer, groupId);
kafkaProducer = kafka_producer(chatServer);

//Example of event emitting
chatServer.on('roomJoined', function (room) {
   console.log(room.name + ' joined');
});