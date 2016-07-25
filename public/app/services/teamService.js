/**
 * Created by Bluemagma on 7/25/16.
 */
app.factory('TeamService', ['$resource', function($resource) {
    return $resource('/teams/:teamId');
}]);
