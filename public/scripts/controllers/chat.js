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
                        text: $scope.chatMessage
                    };

                    chatService.emit('message', message);
                    $scope.chatMessage = '';
                }
            };

            chatService.on('connected', function (message) {
                message.colour = 'alert-success';
                $scope.user = {
                    nickName : message.nickName
                };
                chatService.emit('joinRoom', {name : 'Lobby'});
            });

            chatService.on('message', function (message) {
                if(message.nickName === $scope.user.nickName) {
                    message.colour = 'alert-success';
                } else {
                    message.colour = 'alert-info';
                }

                $scope.messages.push(message);
            });

            chatService.on('nicknameChanged', function (newNickName) {
                $scope.user.nickName = newNickName;
            });

            chatService.on('roomJoined', function (room) {
                currentRoom = room;
                $scope.messages = [];
                $scope.messages.push({
                    text: 'Welcome to : [' + room.name + ']',
                    colour: 'alert-warning'
                });
            });
        }]);