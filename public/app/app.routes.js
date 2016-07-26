/**
 * Created by Bluemagma on 7/25/16.
 */
angular.module('app.routes', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
        })
        .when('/employees', {
            templateUrl: 'employees.html',
            controller: 'employeeCtrl'
        })
        .when('/employees/:employeeId', {
            templateUrl: 'employee.html',
            controller: 'employeeCtrl'
        })
        .when('/teams', {
            templateUrl: 'teams.html',
            controller: 'teamCtrl'
        })
        .when('/teams/:teamId', {
            templateUrl: 'team.html',
            controller: 'teamCtrl'
        })
        .when('/users', {
            templateUrl: 'users.html',
            controller: 'userCtrl'
        })
        .when('/users/:userId', {
            templateUrl: 'user.html',
            controller: 'userCtrl'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
