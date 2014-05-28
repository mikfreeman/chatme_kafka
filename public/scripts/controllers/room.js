'use strict';

angular.module('chatme.controllers')
  .controller('RoomController', 
    ['$scope','chatService',
      function($scope,chatService) {

        var currentRoom = 'Lobby';

        chatService.emit('joinRoom','Lobby');

      	$scope.rooms = [
      		'Lobby'
      	];

        chatService.on('roomJoined', function(room) {
          currentRoom = room;
        });

  }]);