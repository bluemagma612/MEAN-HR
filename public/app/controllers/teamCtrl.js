app.controller('TeamsCtrl', ['$scope', 'TeamService', function($scope, TeamService){
    TeamService.query(function (data) {
        $scope.teams = data;
    }, _handleError);
}])

app.controller('TeamCtrl', ['$scope','$routeParams', 'TeamService', function($scope, $routeParams, TeamService){
    TeamService.get({
        teamId: $routeParams.teamId
    }, function(data, headers) {
        $scope.team = data;
    }, _handleError);
}]);

app.controller('view', ['$scope', 'EmployeeService', function($scope, EmployeeService) {
    $scope.employees = [];
    $scope.firstName = $scope.lastName = '';

    EmployeeService.list(function (data) {
        $scope.employees = data;
    });
}]);

app.controller('edit', ['$scope', 'EmployeeService', '$routeParams',
    function($scope, EmployeeService, $routeParams) {
        $scope.employee = {};

        EmployeeService.get({
            employeeId: $routeParams.employeeId
        }, function (data) {
            $scope.employees = data;
        });
    }]);