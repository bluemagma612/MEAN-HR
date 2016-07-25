
/**
 * Created by Bluemagma on 7/25/16.
 */
angular.module('userCtrl', ['userService'])

    .controller('userController', function(User) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the users at page load
        User.all()
            .success(function(data) {

                //when all the users come back, remove the processing var
                vm.processing = false;

                // bind the users that come back to vm.users
                vm.users = data;
            });

        // delete a user
        vm.deleteUser = function(id) {
            vm.processing = true;

            // accepts the user id as a parameter
            User.delete(id)
                .success(function(data) {

                    // get all users to update the table
                    User.all()
                        .success(function(data){
                            vm.processing = false;
                            vm.users = data;
                        });
                });
        };

    })

    .controller('userCreateController', function(User) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a user
        vm.saveUser = function() {
            vm.processing = true;

            // clear the on page message
            vm.message = '';

            // use the create function in the userService
            User.create(vm.userData)
                .success(function(data){
                    vm.processing = false;

                    // clear the form
                    vm.userData = {};
                    vm.message = data.message;
                });
        };
    })

    .controller('userEditController', function($routeParams, User) {

        var vm = this;

        // variable to hide/show elements of the view
        // differenciated between create or edit pages
        vm.type = 'edit';

        // get the user data for the user you want to edit
        // $routeParams is the way we grab data from the URL

        User.get($routeParams.user_id)
            .success(function(data) {
                vm.userData = data;
            });

        // function to save the user
        vm.saveUser = function() {
            vm.processing = true;
            vm.message = '';

            // call the userService funtion to update
            User.update($routeParams.user_id, vm.userData)
                .success(function(data){
                    vm.processing = false;

                    vm.userData = {};

                    vm.message = data.message;
                });
        };
    });