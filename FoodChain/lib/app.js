'use strict';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.run(['$rootScope', '$location', 'options', 'deck', 'i18n', function ($rootScope, $location, options, deck, i18n) {

	$rootScope.go = function (path, qs) {
		$location.path(path).search(qs || '');
	};

	$rootScope.logError = function (msg) {
		$rootScope.log(msg, 'error');
	};

	$rootScope.logInfo = function (msg) {
		$rootScope.log(msg, 'info');
	};

	$rootScope.debugmsgs = [];
	$rootScope.log = function (msg, type) {
		type = type || 'info';
		$rootScope.debugmsgs.push({ msg: msg, type: type });
		if (options.debug)
			$("#debug").animate({ scrollTop: $("#debug").offset().top + $("#debug").prop("scrollHeight") }, "fast");
		if (type == 'error')
			console.error(msg);
		else
			console.log(msg);
	};

	Array.prototype.shuffle = function () {
		for (var i = this.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = this[i];
			this[i] = this[j];
			this[j] = temp;
		}
	};
}]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/home', { templateUrl: 'views/home.html', controller: 'HomeController' })
		.when('/showdown', { templateUrl: 'views/showdown.html', controller: 'ShowdownController' })
		.when('/predation', { templateUrl: 'views/predation.html', controller: 'PredationController' })
		.otherwise({ redirectTo: '/home' });

	//$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('');
}]);

app.config(['$provide', function ($provide) {
	$provide.decorator("$exceptionHandler", ['$delegate', '$injector', function ($delegate, $injector) {
		return function (exception, cause) {
			$delegate(exception, cause);
			var $rootScope = $injector.get('$rootScope');
			$rootScope.logError(exception);
		};
	}]);
}]);