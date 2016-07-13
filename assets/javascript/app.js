var app = angular.module('app', ['ngRoute', 'ngResource'])
.constant('config', {
	states: ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS',
'MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR',
'PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
});

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'home.html',
		})
		.when('/employees', {
			templateUrl: 'employees.html',
			controller: 'EmployeesCtrl'
		})
		.when('/employees/:employeeId', {
			templateUrl: 'employee.html',
			controller: 'EmployeeCtrl'
		})
		.when('/teams', {
			templateUrl: 'teams.html',
			controller: 'TeamsCtrl'
		})
		.when('/teams/:teamId', {
			templateUrl: 'team.html',
			controller: 'TeamCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.factory('EmployeeService', ['$resource', function($resource) {
	return $resource('/employees/:employeeId', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);

app.factory('TeamService', ['$resource', function($resource) {
	return $resource('/teams/:teamId');
}]);

//*** Directives ***

//if theres no image for the employee, use a default anonymous image
app.directive('imageFallback', function() {
	return {
		link: function(scope, elem, attrs) {
			elem.bind('error', function() {
				angular.element(this).attr('src', attrs.imageFallback);
			});
		}
	};
//TODO document this
}).directive('editInLine', ['$compile', function($compile) {
	var exports = {};

	function link (scope, element, attrs) {
		var template = '<div class="in-line-container">';
		var newElement;
		var displayValue;
		var options;

		switch (attrs.editType) {
			case 'select':
				displayValue = attrs.displayValue ? 'displayValue' : 'value';
				options = attrs.editOption;
				options = options.replace(attrs.editList, 'editList');

				template += '<div class="in-line-value" ng-hide="editing">' + 
				'{{'+displayValue+'}}</div>';
				template += '<select class="in-line-input form-control" ng-show="editing"' + 
				'ng-model="value" ng-options="' +options+'"></select>';
			break;

			case 'number':
				template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
				template += '<input class="in-line-input form-control" ng-show="editing"' +
				'type="number" ng-model="value" step="any" min="0" max="99999" />';
			break;

			default:
				template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
				template += '<input class="in-line-input form-control" ng-show="editing"' +
				'type="text" ng-model="value" />';
			}

			//Close the outer div
			template += '</div>';
			newElement = $compile(template)(scope);
			element.replaceWith(newElement);

			scope.$on('$destroy', function() {
				newElement = undefined;
				element = undefined;
			});
		}

		exports.scope = {
			value: '=',
			editing: '=',
			editList: '=',
			displayValue: '='
		};

		exports.restrict = 'E';
		exports.link = link;

		return exports;
}]);

//*** end Directives ***

//*** Controllers ***

//TODO document each controller
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
		};

		$scope.address.addLine = function (index) {
			var lines = $scope.employee.address.lines;
		
			lines.splice(index + 1,0,'');
		};

		$scope.address.removeLine = function (index) {
			var lines = $scope.employee.address.lines;
		
			lines.splice(index, 1);
		};

}]);

app.controller('TeamsCtrl', ['$scope', 'TeamService', function($scope, TeamService){
		TeamService.query(function (data) {
			$scope.teams = data;
		}, _handleError);	
}]);

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

function _handleError(response) {
// TODO: Do something here. Probably just redirect to error page
console.log('%c ' + response, 'color:red');
}