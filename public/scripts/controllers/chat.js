'use strict';

angular.module('chatme.controllers')
  .controller('ChatController', 
    ['$scope','chatService',
      function($scope,chatService) {

      	$scope.messages = [];

      	var currentRoom = 'Lobby';

      	$scope.sendChatMessage = function() {
      		if($scope.chatMessage) {

      			var message = {
      				room : currentRoom,
  					text : $scope.chatMessage
      			};

      			chatService.emit('message', message);
				$scope.messages.push(message);      			
  				$scope.chatMessage = '';
      		}
      	};

        chatService.on('connected', function(message) {
        	$scope.messages.push(message);
        });

        chatService.on('message', function(message) {
        	$scope.messages.push(message);
        });

        chatService.on('roomJoined', function(room) {
        	currentRoom = room;
         	$scope.messages.push({text : 'Welcome to : ' + room});
        });
  }]);