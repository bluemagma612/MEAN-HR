/**
 * Created by Bluemagma on 7/25/16.
 */
angular.module('employeeCtrl', ['employeeService', 'teamService', 'editInLineDir', 'imageFallbackDir'])

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
    })

    .controller('employeeCreateController', function($location, config, Employee, Team) {
        var vm = this;
        console.log('create controller');

        //load the teams for the dropdown
        Team.all()
            .success(function(data){
                vm.teams = data;
            });

        // get and set an array for all states from a constant in app.js
        // for use in editing
        vm.states = config.states;


        //function to create a employee
        vm.save = function() {
            vm.processing = true;

            // clear the on page message
            vm.message = '';

            var lines = vm.employeeData.address.lines;

            if (lines.length) {
                lines = lines.filter(function(value) {
                    return value;
                });
            }

            vm.employeeData.address.lines = lines;

            vm.employeeData.team_id = vm.employeeData.team._id;

            // use the create function in the employeeService
            Employee.create(vm.employeeData)
                .success(function(data){
                    vm.processing = false;

                    // clear the form
                    vm.employeeData = {};
                    vm.message = data.message;
                });
        };

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

        // user has cancelled 
        vm.cancel = function() {
            $location.path("/employees");
        }
    })

    .controller('employeeEditController', function($routeParams, $route, $location, config, Employee, Team) {
        var vm = this;

        // variable to hide/show elements of the view
        // differenciated between show or edit pages
        vm.editing = false;

        // get and set an array for all states from a constant in app.js
        // for use in editing
        vm.states = config.states;

        // hide the confirmation prompt for employee delete action on load
        vm.displayEmployeeDeletePopup = false;

        // get the employee data for the employee you want to edit
        // $routeParams is the way we grab data from the URL
        Employee.get($routeParams.employee_id)
            .success(function(data){
                vm.employeeData = data;
            });

        // get the current team for the employee, by iterating over
        // an array of all the teams and matching on the team id
        Team.all()
            .success(function(data){
                vm.teams = data;
                vm.employeeData.team = getTeam(vm.teams, vm.employeeData.team_id);
            });
        
        function getTeam(teams, teamId) {
            for (var i = 0, l = teams.length; i < l; ++i) {
                var t = teams[i];
                if (t._id === teamId) {
                    return t; 
                }
            }
        }

        vm.edit = function () {
            vm.editing = !vm.editing;
        };

        // function to save the employee
        vm.save = function() {
            vm.processing = true;
            vm.message = '';

            var lines = vm.employeeData.address.lines;

            if (lines.length) {
                lines = lines.filter(function(value) {
                    return value;
                });
            }

            vm.employeeData.address.lines = lines;

            vm.employeeData.team_id = vm.employeeData.team._id;

            // call the employeeService function to update
            Employee.update($routeParams.employee_id, vm.employeeData)
                .success(function(data){
                    vm.processing = false;

                    //vm.employeeData = {};

                    vm.message = data.message;

                    vm.editing = !vm.editing;
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

        // delete an employee \\

        //show the confirmation 
        vm.showDeleteEmployeePopup = function(options) {
            if (options === true) {
                vm.displayEmployeeDeletePopup = true;
            } else {
                vm.displayEmployeeDeletePopup = false;
            }
        };


        vm.deleteEmployee = function(id) {
            vm.processing = true;

            // accepts the employee id as a parameter
            Employee.delete(id)
                .success(function(data) {
                    $location.path("/employees");
                    vm.processing = false;
                });
        };
    });