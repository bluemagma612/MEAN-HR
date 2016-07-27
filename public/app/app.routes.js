/**
 * Created by Bluemagma on 7/25/16.
 */
angular.module('app.routes', [
    'ngRoute', 
    'employeeCtrl', 
    'teamCtrl',
    'userCtrl',
    'loginCtrl'
    ])

    .config(function($routeProvider, $locationProvider) {

    $routeProvider
        // home page route
        
        .when('/employees', {
            templateUrl: '/app/views/pages/employees/employees.html',
            controller: 'employeeController',
            controllerAs: 'employee'
        })
        .when('/employees/:employee_id', {
            templateUrl: '/app/views/pages/employees/employee.html',
            controller: 'employeeEditController',
            controllerAs: 'employee'
        })
        .when('/teams', {
            templateUrl: '/app/views/pages/teams/teams.html',
            controller: 'teamController',
            controllerAs: 'team'
        })
        .when('/teams/:team_id', {
            templateUrl: '/app/views/pages/teams/team.html',
            controller: 'teamEditController',
            controllerAs: 'team'
        })

        // login page
        .when('/login', {
            templateUrl: '/app/views/pages/login.html',
            controller: 'loginController',
            controllerAs: 'login'
        })

        // show all users
        .when('/users', {
            templateUrl: '/app/views/pages/users/users.html',
            controller: 'userController',
            controllerAs: 'user'
        })

        // form to create a new user
        // same view as edit page
        .when('/users/create', {
            templateUrl: '/app/views/pages/users/user.html',
            controller: 'userCreateController',
            controllerAs: 'user'
        })

        // page to edit a user
        .when('/users/:user_id', {
            templateUrl: '/app/views/pages/users/user.html',
            controller: 'userEditController',
            controllerAs: 'user'
        })

        .when('/', {
            templateUrl: '/app/views/pages/home.html'
        })

        .otherwise({
            redirectTo: 'app/views/pages/notfound.html'
        });


        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
});
