/**
 * Created by Bluemagma on 7/25/16.
 */
//*** Controllers ***


app.controller('EmployeesCtrl', ['$scope', 'EmployeeService',
    function($scope, EmployeeService) {
        EmployeeService.query(function(data, headers) {
            $scope.employees = data;
        }, _handleError);
    }]);

app.controller('EmployeeCtrl', ['$scope', '$routeParams', 'EmployeeService', 'TeamService', '$q',
    'config', '$route',  function($scope, $routeParams, EmployeeService, TeamService, $q, config, $route){
        $scope.address = {};

        function getTeam(teams, teamId) {
            for (var i = 0, l = teams.length; i < l; ++i) {
                var t = teams[i];
                if (t._id === teamId) {
                    return t;
                }
            }
        }

        $q.all([
            EmployeeService.get({
                employeeId: $routeParams.employeeId
            }).$promise,
            TeamService.query().$promise
        ]).then(function(values) {
            $scope.teams = values[1];
            $scope.employee = values[0];
            $scope.employee.team = getTeam($scope.teams, $scope.employee.team_id);
        }).catch(_handleError);

        $scope.editing = false;

        //to prevent multiple references to the same array, give us a new copy of it
        $scope.states = config.states.slice(0);

        $scope.edit = function() {
            $scope.editing = !$scope.editing;
        };

        $scope.save = function() {
            //to prevent empty lines in the db and keep the UI clean remove blank lines
            var lines = $scope.employee.address.lines;

            if (lines.length) {
                lines = lines.filter(function(value) {
                    return value;
                });
            }

            $scope.employee.address.lines = lines;

            $scope.employee.team_id = $scope.employee.team._id;

            // call the employee service using http put
            // providing an id and changed and
            // unchanged values in the scope.employee object
            EmployeeService.update({
                employeeId: $routeParams.employeeId
            }, $scope.employee, function() {
                $scope.editing = !$scope.editing;
            });
        };

        $scope.cancel = function() {
            $route.reload();
        }

        $scope.address.addLine = function (index) {
            var lines = $scope.employee.address.lines;

            lines.splice(index + 1,0,'');
        }

        $scope.address.removeLine = function (index) {
            var lines = $scope.employee.address.lines;

            lines.splice(index, 1);
        }

    }]);