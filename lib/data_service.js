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

module.exports.generateNextTemporaryUserId = function() {
    var deferred = Q.defer();

    var counters = db.collection('counters');

    counters.findOneAndUpdate({'_id':'tempUserId'}, {$inc: { seq: 1 }}).then(function(result) {
        deferred.resolve(result.value.seq);

    }).catch(function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

module.exports.insertNickname = function(nickname) {
    var deferred = Q.defer();

    var nicknames = db.collection('nicknames');

    nicknames.insertOne({_id:nickname,createdAt : new Date()}).then(function(result) {
        deferred.resolve(result);
    }).catch(function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

module.exports.deleteNickname = function(nickname) {
    var deferred = Q.defer();

    var nicknames = db.collection('nicknames');

    nicknames.deleteOne({_id:nickname}).then(function(result) {
        deferred.resolve(result);
    }).catch(function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

module.exports.close = function() {
    console.log('Closing mongo connection');
    db.close(true);
}