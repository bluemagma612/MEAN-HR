/**
 * Created by Bluemagma on 7/25/16.
 */
angular.module('teamService', [])
    .factory('Team', function($http) {
        // create a new object
        var teamFactory = {};

        // get a single user
        teamFactory.get = function(id) {
            return $http.get('/api/teams/' + id);
        };

        // get all teams
        teamFactory.all = function() {
            return $http.get('/api/teams/');
        };

        // create a user
        teamFactory.create = function(teamData) {
            return $http.post('/api/teams/', teamData);
        };

        // update a user
        teamFactory.update = function(id, teamData) {
            return $http.put('/api/teams/' + id, teamData);
        };

        // delete a user
        teamFactory.delete = function(id) {
            return $http.delete('/api/teams/' + id);
        };

        // return our entire teamFactory object
        return teamFactory;
});
