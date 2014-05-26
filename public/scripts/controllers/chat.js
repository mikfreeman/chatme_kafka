'use strict';

angular.module('chatme.controllers')
  .controller('ChatController', 
    ['$scope','chatService',
      function($scope,chatService) {

      	$scope.messages = [];

        chatService.on('connected', function(message) {
          console.log(message);
          $scope.messages.push(message);
        });
  }]);