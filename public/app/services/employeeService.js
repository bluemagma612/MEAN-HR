angular.module('EmployeeService', [])

    .factory('Employee', function($http) {
        // create a new object
        var employeeFactory = {};

        // get a single user
        employeeFactory.get = function(id) {
            return $http.get('/api/employees/' + id);
        };

        // get all employees
        employeeFactory.all = function() {
            return $http.get('/api/employees/');
        };

        // create a user
        employeeFactory.create = function(employeeData) {
            return $http.post('/api/employees/', employeeData);
        };

        // update a user
        employeeFactory.update = function(id, employeeData) {
            return $http.put('/api/employees/' + id, employeeData);
        };

        // delete a user
        employeeFactory.delete = function(id) {
            return $http.delete('/api/employees/' + id);
        };

        // return our entire employeeFactory object
        return employeeFactory;
});