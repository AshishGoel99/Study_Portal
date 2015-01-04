//// Define you service here. Services can be added to same module as 'main' or a seperate module can be created.

var dataService = angular.module('ngRepo', ['ngResource']);     //Define the services module

dataService.factory('$repository', ['$rootScope', '$http', '$resource', '$window', function ($rootScope, $http, $resource, $window) {

    var url;

    var setAuthHeader = function () {
        $http.defaults.headers.common["Authorization"] = 'Bearer ' + ($window.sessionStorage.accessToken || '');

        //add watch to monitor accessToken on each request 
        $rootScope.$watch(function () {
            return sessionStorage.accessToken;
        }, function (token) {
            $http.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        });
    };

    var factory = {

        getTemplate: function (url) {
            this.setResourceLocation(url);
            return this.resourse.query();
        },

        setResourceLocation: function (url) {
            this.url = url;
            setAuthHeader();
        },

        resourse: function () {
            return $resource(url);
        }
    };
    return factory;
}]);
