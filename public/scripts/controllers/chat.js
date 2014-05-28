'use strict';

angular.module('chatme.controllers')
  .controller('ChatController', 
    ['$scope','chatService',
      function($scope,chatService) {

      	$scope.messages = [];

        chatService.on('connected', function(message) {
          $scope.messages.push(message);
        });

        chatService.on('message', function(message) {
          $scope.messages.push(message);
        });

        chatService.on('roomJoined', function(room) {
          $scope.messages.push({text : 'Welcome to : ' + room});
        });
  }]);