'use strict';

angular.module('chatme.directives')
    .directive("flashOnChange", ['$animate', '$timeout', function ($animate, $timeout) {

        function link(scope, element, attr) {
            scope.$on('flash', function () {
                $animate.addClass(element, 'flash', function () {
                    $timeout(function () {
                        $animate.removeClass(element, 'flash');
                    }, 1000);
                });
            });
        }
        return {
            restrict: 'A',
            link: link
        }
    }]);
