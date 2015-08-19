'use strict';

angular.module('chatme.controllers')
    .controller('NickNameController',
    ['$scope', 'chatService',
        function ($scope, chatService) {
            
            $scope.changeNickname = function () {
                if ($scope.nickName) {
                    chatService.emit('changeNickname', $scope.nickName);
                }
            };

            chatService.on('connected', function (message) {
                $scope.nickName = message.nickName;
                $scope.flash = 'flash';
            });

        }]);