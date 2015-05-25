'use strict';

angular.module('chatme.controllers')
    .controller('ChatController',
    ['$scope', 'chatService',
        function ($scope, chatService) {

            $scope.messages = [];

            var currentRoom = 'Lobby';

            $scope.sendChatMessage = function () {
                if ($scope.chatMessage) {

                    var message = {
                        room: currentRoom,
                        text: $scope.chatMessage,
                        colour: 'alert-success'
                    };

                    chatService.emit('message', message);
                    $scope.messages.push(message);
                    $scope.chatMessage = '';
                }
            };

            chatService.on('connected', function (message) {
                message.colour = 'alert-info';
                $scope.messages.push(message);
            });

            chatService.on('message', function (message) {
                message.colour = 'alert-info';
                $scope.messages.push(message);
            });

            chatService.on('nicknameChanged', function (newNickName) {
                var message = {
                    colour: 'alert-info',
                    text: "Succesfully changed nickname to : " + newNickName
                }

                $scope.messages.push(message);
            });

            chatService.on('roomJoined', function (room) {
                currentRoom = room;
                $scope.messages.push({
                    text: 'Welcome to : ' + room,
                    colour: 'alert-info'
                });
            });
        }]);