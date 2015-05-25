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
                return room == currentRoom;
            };

            $scope.joinRoom = function (room) {
                chatService.emit('joinRoom', room);
            };

            $scope.createRoomDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/createRoomModal.html',
                    controller: 'ModalRoomController'

                });

                modalInstance.result.then(function (room) {
                    //TODO should not need this here
                    currentRoom = room;
                    $scope.rooms.push(room);
                    chatService.emit('joinRoom', room);
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            chatService.emit('joinRoom', 'Lobby');

            chatService.on('roomJoined', function (room) {
                currentRoom = room;
            });

            chatService.on('newRoom', function (room) {
                $scope.rooms.push(room);
            });

        }]);