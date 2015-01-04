// Main configuration file. Sets up AngularJS module and routes and any other config objects

/* app.js */
//////////angular.module('myApp.services', []).
//////////    factory('GetFormVals', function () {
//////////        return {
//////////            exampleValue: "test5"
//////////        }
//////////    });

//////////var app = angular.module('myApp', ['myApp.services']);

//////////app.controller('ctrlFSR', [
//////////    '$scope', 'GetFormVals', function ($scope, GetFormVals) {
//////////        $scope.test = GetFormVals.exampleValue;
//////////    }]);
/* control.js */

//function ctrlFSR($scope, $http, $location, GetFormVals) {
//    $scope.test = GetFormVals.exampleValue;
//}


var appRoot = angular.module('main', ['ngRepo', 'ngRoute']);     //Define the main module

appRoot

    .controller('RootController', ['$scope', '$route', '$routeParams', '$location', '$repository', function ($scope, $route, $routeParams, $location, $repository) {

        $scope.links = [
                        {
                            url: '/',
                            text: 'Home'
                        },
                        {
                            url: 'Course',
                            text: 'Course'
                        },
                        {
                            url: 'Orders',
                            text: 'Orders'
                        }
        ];
        $scope.$on('$routeChangeSuccess', function (e, current, previous) {
            $scope.activeViewPath = $location.path();
        });

    }])

    .config(['$routeProvider', function ($routeProvider) {
        //Setup routes to load partial templates from server. TemplateUrl is the location for the server view (Razor .cshtml view)
        $routeProvider
            .when('/',
                {
                    templateUrl: 'Home/Index',
                    controller: 'MainController'
                })
            .when('/Course',
                {
                    templateUrl: 'api/values',
                    controller: 'MainController'
                })
            .when('/Orders',
                {
                    templateUrl: 'api/values',
                    controller: 'OrderController'
                })
            .otherwise({ redirectTo: '' });
    }])

    .controller('MainController', function ($scope) {
        $scope.name = 'Home Page';
    })

    .controller('CourseController', function ($scope) {

    })
    .controller('OrderController', function ($scope, $repository) {
        $repository.setResourceLocation('api/Orders');
        //var data = $repository.resourse.query();
    })
;

function Login() {
    $.post('/token',
    {
        grant_type: 'password',
        username: 'Ashish',
        password: 'password'
    },
    function (data) {
        sessionStorage.setItem('accessToken', data.access_token);
    });
};

Login();
