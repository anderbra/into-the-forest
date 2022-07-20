'use strict';

angular.module('app').controller('MainController', ['$scope', '$locale', '$location', 'options', 'i18n', function ($scope, $locale, $location, options, i18n) {
	var self = this;

	$scope.options = options;
	$scope.i18n = i18n;
}]);