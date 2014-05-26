'use strict';

angular.module('chatme.services', [])
    .factory('chatService', [function() {
      var githubUrl = 'https://api.github.com',
          githubUsername;

      var runUserRequest = function(path) {
        // Return the promise from the $http service
        // that calls the Github API using JSONP
        return $http({
          method: 'JSONP',
          url: githubUrl + '/users/' +
                githubUsername + '/' +
                path + '?callback=JSON_CALLBACK'
        });
      };

      return {
        events: function() {
          return runUserRequest('events');
        },
        setUsername: function(username) {
          githubUsername = username;
        }
      };
    }]);