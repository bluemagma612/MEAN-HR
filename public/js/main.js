var app = angular.module('app', ['ngResource']);
	app.factory('EmployeeService', ['$resource', function($resource) {
	return $resource('/employees/:employeeId', {}, {
		get: {
		isArray: true
		},
		post: {
		method: 'POST',
		isArray: false
		}
	});
}]);

app.controller('main', ['$scope', 'EmployeeService', function($scope, EmployeeService) {
	$scope.employees = [];
	$scope.firstName = $scope.lastName = '';
	EmployeeService.get(function (data) {
		$scope.employees = data;
	});
	$scope.addDisabled = function () {
		return !($scope.firstName.trim().length && $scope.lastName.trim().length);
	}
	$scope.add = function () {
		EmployeeService.post({
			first: $scope.firstName,
			last: $scope.lastName
	}, function (data) {
		$scope.employees.push(data);
		$scope.firstName = $scope.lastName = '';
	});
	};
}]);