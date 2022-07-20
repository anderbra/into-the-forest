'use strict';

var app = angular.module('app');

app.directive('fcCard', function () {
	return {
		restrict: 'AE',
		scope: {
			card: '=',
			cardclick: '&'
		},
		replace: true,
		templateUrl: 'views/partial/card.html'
	};
});
app.directive('fcCardback', function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'views/partial/cardback.html'
	};
});