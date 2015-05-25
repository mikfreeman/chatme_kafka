'use strict';

angular.module('chatme.directives')
    .directive("scrollDiv", [function () {

        function link(scope, element, attrs) {

            function scrollToBottom() {
                element.scrollTop(
                    element[0].scrollHeight - element.height()
                );
            }

            scope.$watchCollection(attrs.toWatch, function () {
                scrollToBottom();
            });
        }

        return {
            restrict: 'A',
            link: link
        }
    }])
