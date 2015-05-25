'use strict';

angular.module('chatme.controllers')
    .controller('ModalRoomController',
    ['$scope', '$modalInstance',
        function ($scope, $modalInstance) {

            $scope.roomToCreate = {};

            $scope.createRoom = function () {
                $modalInstance.close($scope.roomToCreate.roomName);
            };

            $scope.cancelCreateRoom = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);