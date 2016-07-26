angular.module('teamCtrl', ['teamService'])

    .controller('teamController', function(Team) {

        var vm = this;

        // set a processing variable to show loading animation
        vm.processing = true;

        // grab all the teams at page load
        Team.all()
            .success(function(data) {

                // when all the teams come back, set animation var to false
                vm.processing = false;

                // bind the teams that come back to vm.teams
                vm.teams = data;

            });

        // delete a team
        vm.deleteTeam = function(id) {
            vm.processing = true;

            // accepts the team id as a param
            Team.delete(id)
                .success(function(data) {
                    // get all teams to update the table
                    Team.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.users = data;
                        });
                });
        };
    })

    .controller('teamCreateController', function(Team) {

        var vm = this;

        // variable to hide/show elements of the view
        // differenciates between create or edit pages
        vm.type = 'create';

        // function to create a team
        vm.saveTeam = function() {
            vm.processing = true;

            // clear the on page success/error message
            vm.message = '';

            // use the create function in the teamService
            Team.create(vm.teamData)
                .success(function(data){
                    vm.processing = false;

                    // clear the input form
                    vm.teamData = {};
                    vm.message = data.message;
                });
        };
    })

    .controller('teamEditController', function($routeParams, Team) {
        // set vm to this so we can use controllerAs methods, much better than $scope
        var vm = this;

        // variable to hide/show elements of the view
        // differenciated between create or edit pages
        vm.type = 'edit';

        // get the user data for the user you want to edit
        // $routeParams is the way we grab data from the URL

        Team.get($routeParams.team_id)
            .success(function(data) {
                vm.userData = data;
            });

        // function to save the user
        vm.saveTeam = function() {
            vm.processing = true;
            vm.message = '';

            // call the teamService function to update
            Team.update($routeParams.team_id, vm.teamData)
                .success(function(data){
                    vm.processing = false;

                    vm.teamData = {};

                    vm.message = data.message;
                });
        };
    });



    // .controller('TeamsCtrl', ['$scope', 'TeamService', function($scope, TeamService){
    //     TeamService.query(function (data) {
    //         $scope.teams = data;
    //     }, _handleError);
    // }])

    // .controller('TeamCtrl', ['$scope','$routeParams', 'TeamService', function($scope, $routeParams, TeamService){
    //     TeamService.get({
    //         teamId: $routeParams.teamId
    //     }, function(data, headers) {
    //         $scope.team = data;
    //     }, _handleError);
    // }])
    //
    // .controller('view', ['$scope', 'EmployeeService', function($scope, EmployeeService) {
    //     $scope.employees = [];
    //     $scope.firstName = $scope.lastName = '';
    //
    //     EmployeeService.list(function (data) {
    //         $scope.employees = data;
    //     });
    // }])
    //
    // .controller('edit', ['$scope', 'EmployeeService', '$routeParams',
    //     function($scope, EmployeeService, $routeParams) {
    //         $scope.employee = {};
    //
    //         EmployeeService.get({
    //             employeeId: $routeParams.employeeId
    //         }, function (data) {
    //             $scope.employees = data;
    //         });