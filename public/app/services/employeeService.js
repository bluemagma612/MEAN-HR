var app = angular.module('app', ['ngResource']);
app.factory('EmployeeService', ['$resource', function($resource) {
    return $resource('/employees/:employeeId', {}, {
        get: {
            isArray: true
        },
        post: {
            method: 'POST',
            isArray: false
        }
    });
}]);