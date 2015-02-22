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
                    templateUrl: 'Home/Course',
                    controller: 'CourseController'
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

    .controller('CourseController', function ($scope, $repository, $search) {
        $repository.setResourceLocation('api/Course');
        $repository.resourse().query(function (data) {
            $scope.courseList = [];
            angular.forEach(data, function (courseData) {
                $scope.courseList.push(courseData);
            });
        });

        $scope.courseGrid = {
            data: 'courseList',
            multiSelect: false,
            selectedItems: $scope.selectedUsers,
            enableColumnResize: false,
            columnDefs: [
                { field: 'Name', displayName: 'Course Name', width: '50%' },
                { field: 'Content', displayName: 'Course Content', width: '50%' }
            ]
        };

        $scope.getSearchResult = function () {
            $scope.searchResult = $search.result($scope.query);
        }
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




var appRoot = angular.module('main', ['ngRepo', 'ngSearch', 'ngRoute', 'ngGrid', 'ngBook']);     //Define the main module

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

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        //Setup routes to load partial templates from server. TemplateUrl is the location for the server view (Razor .cshtml view)
        $routeProvider
            .when('/',
                {
                    templateUrl: '/Home/Index',
                    controller: 'MainController'
                })
            .when('/Course/:CourseId?',
                {
                    templateUrl: function (params) { return '/Home/Course/' + (params.CourseId | ''); },
                    controller: 'CourseController'
                })
            .when('/Orders',
                {
                    templateUrl: '/api/values',
                    controller: 'OrderController'
                })
            .when('/Subject/:SubjectId',
                {
                    templateUrl: function (params) { return '/Home/Subject/' + (params.SubjectId | ''); },
                    controller: 'SubjectController'
                })
            .otherwise({ redirectTo: '' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }])

    .controller('MainController', function ($scope) {
        //$scope.name = 'Home Page';
    })

    .controller('CourseController', function ($scope, $repository, $routeParams, $search) {

        if ($routeParams.CourseId) {

            Utils.bindGrid({
                gridSourceName: 'subjectList',
                gridName: 'subjectGrid',
                scope: $scope,
                repository: $repository,
                url: '/api/Subject?CourseId=' + $routeParams.CourseId,
                columnDef: [
                    { field: 'SrNo', displayName: 'Sr. No.', width: '25%' },
                    { field: 'Name', displayName: 'Subject Name', width: '75%', cellTemplate: '<a href="/Subject/{{row.entity.Id}}">{{row.entity[col.field]}}</a>', enableCellEdit: true }
                ],
                bindUpdateEvent: true
            });
        }

        else {

            Utils.bindGrid({
                gridSourceName: 'courseList',
                gridName: 'courseGrid',
                scope: $scope,
                repository: $repository,
                url: '/api/Course',
                columnDef: [
                    { field: 'Name', displayName: 'Course Name', width: '25%', cellTemplate: '<a href="/Course/{{row.entity.Id}}">{{row.entity[col.field]}}</a>' },
                    { field: 'Subjects', displayName: 'Subjects', width: '75%' }
                ]
            });
        }

        //// for the search functionality

        //$scope.getSearchResult = function () {
        //    $search.result($scope.query)
        //        .success(function (data) {
        //            console.log(data);
        //            $scope.searchResult = data;
        //        });
        //}
    })


    .controller("SubjectController", function ($book, $scope, $routeParams, $repository) {

        //binding Book of a perticular subject
        var url = "/api/Subject?SubjectId=" + $routeParams.SubjectId;
        $repository.setResourceLocation(url);
        $repository.resourse().get(function (data) {
            $scope.subjectName = data.Name;
            $scope.teacherName = data.TeacherName;
        });


        //binding notes grid
        Utils.bindGrid({
            gridSourceName: 'notesList',
            gridName: 'notesGrid',
            scope: $scope,
            repository: $repository,
            url: '/api/Note?SubjectId=' + $routeParams.SubjectId,
            columnDef: [
                { field: 'Name', displayName: 'Name', width: '25%', enableCellEdit: true },
                { field: 'Description', displayName: 'Description', width: '75%', enableCellEdit: true }
            ],
            bindUpdateEvent: true,
            showFooter: true
        });

        //binding book grid
        Utils.bindGrid({
            gridSourceName: 'bookList',
            gridName: 'bookGrid',
            scope: $scope,
            repository: $repository,
            url: '/api/Book?SubjectId=' + $routeParams.SubjectId,
            columnDef: [
                { field: 'Name', displayName: 'Book Name', width: '75%', enableCellEdit: true },
                { displayName: 'Action', width: '25%', cellTemplate: '<a href="#" ng-click="showBookViewer(row.entity.Name)">View Google Suggested Books</a>' }
            ],
            bindUpdateEvent: true
        });

        //binding book suggestion grid of a perticular book
        $scope.suggestedBooks = [];
        $scope.bookSuggestionGrid = {
            data: 'suggestedBooks',
            enableColumnResize: false,
            columnDefs: [
                { field: 'title', width: '100%', cellTemplate: '<img ng-src="{{row.entity.img}}" ng-click="showBookReader(row.entity.url)" />' }
            ]
        };

        $scope.showBookViewer = function (bookName) {
            $book.search(bookName, function (data) {
                angular.forEach(data.items, function (item) {
                    $scope.suggestedBooks.push({
                        img: item.volumeInfo.imageLinks.smallThumbnail,
                        author: item.volumeInfo.authors,
                        url: item.accessInfo.webReaderLink,
                        desc: item.volumeInfo.description,
                        publisher: item.volumeInfo.publisher,
                        title: item.volumeInfo.title
                    });
                });
            });
        }

        $scope.showBookReader = function (linkUrl) {
            window.open(window.location.host + '/Home/BookReader?url=' + linkUrl, "_blank", { width: 300, height: 200 });
        }
    })

    .controller('OrderController', function ($scope, $repository) {

        $repository.setResourceLocation('api/Orders');
        var res = $repository.resourse();
        var data = res.query();
    })
;


var Utils = {
    bindGrid: function (options) {
        options.repository.setResourceLocation(options.url);
        options.repository.resourse().query(function (data) {
            options.scope[options.gridSourceName] = [];
            angular.forEach(data, function (data) {
                options.scope[options.gridSourceName].push(data);
            });
        });

        options.scope[options.gridName] = {
            data: options.gridSourceName,
            enableColumnResize: false,
            columnDefs: options.columnDef
        };

        if (options.showFooter) {
            options.scope[options.gridName].footerTemplate = '<input type=button value="Add Row" ng-click="addRow()" />';
            options.scope[options.gridName].showFooter = true;

            options.scope.addRow = function () {
                options.scope[options.gridSourceName].push({});
            }
        }


        if (options.bindUpdateEvent) {
            options.scope.$on('ngGridEventEndCellEdit', function (evt) {
                console.log(evt.targetScope.row.entity);  // the underlying data bound to the row
                evt.targetScope.row.entity.$update();
                // Detect changes and send entity to server 
            });
        }
    }
}




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