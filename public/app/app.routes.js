/**
 * Created by Bluemagma on 7/25/16.
 */
app.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
        })
        .when('/employees', {
            templateUrl: 'employees.html',
            controller: 'EmployeesCtrl'
        })
        .when('/employees/:employeeId', {
            templateUrl: 'employee.html',
            controller: 'EmployeeCtrl'
        })
        .when('/teams', {
            templateUrl: 'teams.html',
            controller: 'TeamsCtrl'
        })
        .when('/teams/:teamId', {
            templateUrl: 'team.html',
            controller: 'TeamCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
