'use strict';

angular.module('chatme.controllers')
  .controller('HomeController', 
    ['$scope',
      function($scope) {
      	$scope.rooms = [{
      		'roomId' : 'programming',
      		'label' : 'Programming'

      	},{
      		'roomId' : 'humour',
      		'label' : 'Humour'
      	},{
      		'roomId' : 'photography',
      		'label' : 'Photography' 
      	}]
  }]);