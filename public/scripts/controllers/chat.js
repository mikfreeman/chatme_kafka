'use strict';

angular.module('chatme.controllers')
  .controller('ChatController', 
    ['$scope',
      function($scope) {
      	$scope.messages = [{
      		'text' : 'Welcome : guest52'

      	},{
      		'text' : 'Fred : Hey dude'
      	},{
      		'text' : 'Bob : Welcome'
      	}]
  }]);