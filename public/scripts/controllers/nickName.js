'use strict';

angular.module('chatme.controllers')
    .controller('NickNameController',
    ['$scope', 'chatService',
        function ($scope, chatService) {

            $scope.changeNickname = function () {
                console.log("here");
                if ($scope.nickName) {
                    chatService.emit('changeNickname', $scope.nickName);
                }
            };

        }]);