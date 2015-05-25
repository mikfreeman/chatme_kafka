'use strict';

angular.module('chatme', [
    'chatme.controllers',
    'chatme.services',
    'chatme.directives',
    'chatme.filters',
    'ngRoute',
    'ui.bootstrap'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

angular.module('chatme.filters', []);
angular.module('chatme.controllers', []);
angular.module('chatme.directives', []);
angular.module('chatme.services', [])
    .value('version', '0.0.1');
