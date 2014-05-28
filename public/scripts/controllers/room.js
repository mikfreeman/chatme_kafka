'use strict';

angular.module('chatme.controllers')
  .controller('RoomController', 
    ['$scope','chatService',
      function($scope,chatService) {

        var currentRoom = 'Lobby';

      	$scope.rooms = [
      		'Lobby'
      	];

        $scope.isActive = function(room) {
          return room == currentRoom;
        };

        chatService.emit('joinRoom','Lobby');

        chatService.on('roomJoined', function(room) {
          currentRoom = room;
        });



  }]);