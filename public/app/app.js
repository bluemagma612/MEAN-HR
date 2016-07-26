/**
 * Created by Bluemagma on 7/25/16.
 */
var app = angular.module('app', [
    'ngRoute',
    'ngResource',
    'app.routes',
    'authService',
    'userService',
    'userCtrl',
    'employeeService',
    'employeeCtrl',
    'teamService',
    'teamCtrl'
])
    .constant('config', {
        states: ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
            'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS',
            'MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR',
            'PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
    })
// application configuration to integrate token into requests
    .config(function($httpProvider) {
        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });

function _handleError(response) {
// TODO: Do something here. Probably just redirect to error page
    console.log('%c ' + response, 'color:red');
}