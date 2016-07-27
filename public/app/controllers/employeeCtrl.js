/**
 * Created by Bluemagma on 7/25/16.
 */
angular.module('employeeCtrl', ['employeeService', 'teamService'])

    .controller('employeeController', function(Employee) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the employees at page load
        Employee.all()
            .success(function(data) {

                //when all the employees come back, remove the processing var
                vm.processing = false;

                // bind the employees that come back to vm.employees
                vm.employees = data;
            });

        // delete a employee
        vm.deleteEmployee = function(id) {
            vm.processing = true;

            // accepts the employee id as a parameter
            Employee.delete(id)
                .success(function(data) {

                    // get all employees to update the table
                    Employee.all()
                        .success(function(data){
                            vm.processing = false;
                            vm.employees = data;
                        });
                });
        };
    })

    .controller('employeeCreateController', function(Employee) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a employee
        vm.saveEmployee = function() {
            vm.processing = true;

            // clear the on page message
            vm.message = '';

            // use the create function in the employeeService
            Employee.create(vm.employeeData)
                .success(function(data){
                    vm.processing = false;

                    // clear the form
                    vm.employeeData = {};
                    vm.message = data.message;
                });
        };
    })

    .controller('employeeEditController', function($routeParams, $q, $route, Employee, Team) {
        var vm = this;

        // variable to hide/show elements of the view
        // differenciated between create or edit pages
        vm.type = 'edit';

        // get the current team for the employee, by iterating over
        // an array of all the teams and matching on the team id
        function getTeam(teams, teamId) {
            for (var i = 0, l = teams.length; i < l; ++i) {
                var t = teams[i];
                if (t._id === teamId) {
                    return t; 
                }
            }
        }

        $q.all([
            Employee.get($routeParams.employee_id).$promise,
            Team.all().$promise
        ]).then(function(values) {
            vm.teams = values[1];
            vm.employeeData = values[0];
            console.log("employeeData.team_id: " + vm.employeeData.team_id);
            vm.employee.team = getTeam(vm.teams, vm.employeeData.team_id);
        }).catch(_handleError);

        // get the employee data for the employee you want to edit
        // $routeParams is the way we grab data from the URL

        Employee.get($routeParams.employee_id)
            .success(function(data) {
                vm.employeeData = data;
            });

        //to prevent multiple references to the same array, give us a new copy of it
        //vm.states = config.states.slice(0);

        // function to save the employee
        vm.saveEmployee = function() {
            vm.processing = true;
            vm.message = '';

            var lines = vm.employee.address.lines;

            if (lines.length) {
                lines = lines.filter(function(value) {
                    return value;
                });
            }

            vm.employee.address.lines = lines;

            vm.employee.team_id = vm.employee.team._id;

            // call the employeeService function to update
            Employee.update($routeParams.employee_id, vm.employeeData)
                .success(function(data){
                    vm.processing = false;

                    vm.employeeData = {};

                    vm.message = data.message;
                });
        };

        // user has cancelled the editing
        vm.cancel = function() {
            $route.reload();
        }

        // user is adding a line to the address
        vm.addLine = function (index) {
            var lines = vm.employee.address.lines;

            lines.splice(index + 1,0,'');
        }

        // user is removing a line from the address
        vm.removeLine = function (index) {
            var lines = vm.employee.address.lines;

            lines.splice(index, 1);
        }
    });