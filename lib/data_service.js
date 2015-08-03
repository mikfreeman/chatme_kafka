var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Q = require('q');

// Connection URL
var url = 'mongodb://localhost:27017/chatme';
var db;

MongoClient.connect(url, function (err, database) {
    assert.equal(null, err);
    console.log("Connected to mongo");

    db = database;
});

module.exports.createRoom = function (room) {

    var deferred = Q.defer();

    var rooms = db.collection('rooms');

    rooms.insertOne(room).then(function (result) {
        console.log("Created room " + room.name);
        deferred.resolve(result);

    }).catch(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;

};


module.exports.findAllRooms = function(skip, limit) {
    var deferred = Q.defer();

    var rooms = db.collection('rooms');

    rooms.find({}, {skip:skip, limit:limit}).toArray().then(function(rooms) {
        deferred.resolve(rooms);

    }).catch(function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
};