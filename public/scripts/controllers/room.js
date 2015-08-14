'use strict';

angular.module('chatme.controllers')
    .controller('RoomController',
    ['$scope', '$modal', '$http', 'chatService',
        function ($scope, $modal, $http, chatService) {

            var currentRoom = 'Lobby';

            var roomsRequest = $http({
                method: 'GET',
                url: '/rooms'
            });

            roomsRequest.success(function (data, status, headers, config) {
                $scope.rooms = data.rooms;
            });

            roomsRequest.error(function (data, status, headers, config) {
            });

            $scope.isActive = function (room) {
                return room.name == currentRoom.name;
            };

            $scope.joinRoom = function (room) {
                chatService.emit('joinRoom', room);
            };

            $scope.createRoomDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/createRoomModal.html',
                    controller: 'ModalRoomController'

                });

                modalInstance.result.then(function (roomName) {
                    var room = {
                        name : roomName
                    };
                    currentRoom = room;
                    $scope.rooms.push(room);
                    chatService.emit('createRoom', room);
                }, function () {

                });
            };

            chatService.on('roomJoined', function (room) {
                currentRoom = room;
            });

            chatService.on('newRoom', function (room) {
                $scope.rooms.push(room);
            });

        }]);