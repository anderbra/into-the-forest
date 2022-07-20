'use strict';

angular.module('app').controller('HomeController', ['$scope', '$filter', 'StateService', 'i18n', function ($scope, $filter, StateService, i18n) {
	$scope.gameExists = StateService.exists();
	if ($scope.gameExists) {
		$scope.state = StateService.load();
		var players = [], cardsleft = 0;
		for (var i = 0; i < $scope.state.players.length; i++) {
			players.push($scope.state.players[i].name + ": " + $scope.state.players[i].score);
			cardsleft += $scope.state.players[i].hand.length;
		}
		$scope.gameDescr = $filter('toProperCase')(i18n.gametypes[$scope.state.gametype].one) + ', ' + players.join(', ') + ', cards left: ' + cardsleft;
	}

	$scope.continue = function () {
		if ($scope.gameExists)
			$scope.go('/' + $scope.state.gametype, 'load');
	}
}]);