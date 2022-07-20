'use strict';

angular.module('app').controller('ShowdownController',
['$scope', '$timeout', '$interval', '$window', '$routeParams', 'DeckService', 'StateService', 'deck', 'i18n',
function ($scope, $timeout, $interval, $window, $routeParams, DeckService, StateService, deck, i18n) {
	$scope.state = {};
	$scope.here = true;

	$scope.init = function (restart) {
		$scope.logInfo('showdown init()');

		if ($routeParams.load && !restart) {
			$scope.logInfo('loading state from local storage');
			if ($scope.state = StateService.load()) {
				startTimer($scope.state.gameclock);
			}
			else {
				$scope.newState();
			}
		}
		else {
			$scope.newState();
		}
		
		$scope.logInfo('starting with ' + $scope.state.players[$scope.state.order[$scope.state.turn]].name + '\'s turn');
		runAi();
	}

	$scope.newState = function () {
		StateService.clear();
		$scope.state = StateService.new('showdown');
		var names = ['alex', 'bob'];
		for (var i = 0; i < names.length; i++)
			$scope.state.players.push(StateService.newPlayer(names[i]));
		while ($scope.state.drawpile.length >= $scope.state.players.length)
			for (var i = 0; i < $scope.state.players.length; i++)
				$scope.state.players[i].hand.push($scope.state.drawpile.pop());
		for (var i = 0; i < $scope.state.players.length; i++)
			DeckService.sortPile($scope.state.players[i].hand);
		for (var i = 0; i < $scope.state.players.length; i++)
			$scope.state.order.push(i);
		$scope.state.order.shuffle();
		$scope.logInfo('state created');
		startTimer();
	}

	var timer;
	var startTimer = function (startAt) {
		$scope.state.gameclock = startAt || 0;
		resumeTimer();
	};

	var resumeTimer = function () {
		timer = $interval(function () {
			$scope.state.gameclock++;
		}, 1000);
	}

	var pauseTimer = function () {
		if (angular.isDefined(timer))
			$interval.cancel(timer);
	}

	$scope.$on('$destroy', function () {
		pauseTimer();
	});

	$scope.playCard = function (player, idx) {
		var s = $scope.state;
		var any = 0;
		if (s.order[s.turn] != player)
			throw 'it is not ' + s.players[player].name + '\'s turn';
		if (s.winner != -1)
			throw 'game is over';
		
		s.trick.push({ player: player, card: s.players[player].hand.splice(idx, 1)[0] });
		$scope.logInfo(s.players[player].name + ' played ' + s.trick[s.trick.length - 1].card.data.name);

		if (s.turn == s.order.length - 1) {
			s.turn = 0;
			var curtrick = s.trick.slice(-s.order.length);
			for (var i = 0; i < curtrick.length; i++)
				if (curtrick[i].player == 0)
					var p1 = i;
			for (var i = 0; i < curtrick.length; i++)
				if (curtrick[i].player == 1)
					var p2 = i;
			var winner = -1;

			if (curtrick[p1].card.data.eats.includes(curtrick[p2].card.id)
				&& curtrick[p2].card.data.eats.includes(curtrick[p1].card.id)) {
				s.round++;
				$scope.logInfo('tie (both), do another round');
			}
			else if (curtrick[p1].card.data.eats.includes(curtrick[p2].card.id)) {
				s.round = 0;
				$scope.logInfo(s.players[s.order[p1]].name + ' wins');
				winner = s.order[p1];
			}
			else if (curtrick[p2].card.data.eats.includes(curtrick[p1].card.id)) {
				s.round = 0;
				$scope.logInfo(s.players[s.order[p2]].name + ' wins');
				winner = s.order[p2];
			}
			else {
				s.round++;
				$scope.logInfo('tie (neither), do another round');
			}

			if (winner > -1) {
				while (s.trick.length) {
					s.players[winner].stack.push(s.trick.pop().card);
				}
				updateScores();
			}

			if (!s.players[any].hand.length) {
				if (s.players[0].score > s.players[1].score) {
					$scope.logInfo(s.players[0].name + ' wins the game');
					s.winner = 0;
				}
				else if (s.players[0].score < s.players[1].score) {
					$scope.logInfo(s.players[1].name + ' wins the game');
					s.winner = 1;
				}
				else {
					$scope.logInfo('tie game, oh no');
					s.winner = -2;
				}
				StateService.clear();
				pauseTimer();
			}
		}
		else {
			s.turn++;
			$scope.logInfo('now ' + s.players[s.order[s.turn]].name + '\'s turn');
		}

		StateService.save($scope.state);
		runAi();
	}

	var updateScores = function () {
		for (var i = 0; i < $scope.state.players.length; i++) {
			var sum = 0;
			for (var j = 0; j < $scope.state.players[i].stack.length; j++)
				sum += $scope.state.players[i].stack[j].data.energy;
				//sum += 1; //for card count win condition
			$scope.state.players[i].score = sum;
		}
	}

	var runAi = function () {
		if (!$scope.here)
			return;
		// true to highlight, false to auto play
		if (false)
			aiFindBestCards();
		else if ($scope.state.winner === -1)
			$timeout(aiPlayCard, 500);
	}

	var aiPlayCard = function () {
		var s = $scope.state;
		aiFindBestCards();
		var hand = s.players[s.order[s.turn]].hand;
		hand = hand.map(function (el, index) { el.index = index; return el; });
		var bests = hand.filter(function (el) { return el.best; });
		bests.shuffle();
		$scope.playCard(s.order[s.turn], bests[0].index);
	}

	var aiFindBestCards = function () {
		var s = $scope.state;

		for (var i = 0; i < s.players.length; i++) {
			for (var j = 0; j < s.players[i].hand.length; j++) {
				s.players[i].hand[j].best = false;
			}
		}
		for (var i = 0; i < s.trick.length; i++) {
			s.trick[i].card.best = false;
		}

		var hand = s.players[s.order[s.turn]].hand;
		var best = hand[0];

		var besttype = hand.filter(function (el) { return el.data.type != 'death'; });
		besttype = besttype.length ? besttype[0].data.type : 0;

		for (var i = 0; i < hand.length; i++) {
			if (deck.typeSortKey[hand[i].data.type] <= deck.typeSortKey[best.data.type])
				hand[i].best = true;
			else if (best.data.type == 'death' && deck.typeSortKey[hand[i].data.type] <= deck.typeSortKey[besttype])
				hand[i].best = true;
		}
	}

	// this is for if cards are placed face-up into a trick
	/*var aiFindBestCards = function () {
		var s = $scope.state;

		for (var i = 0; i < s.players.length; i++) {
			for (var j = 0; j < s.players[i].hand.length; j++) {
				s.players[i].hand[j].best = false;
			}
		}
		for (var i = 0; i < s.trick.length; i++) {
			s.trick[i].card.best = false;
		}

		if (s.turn % s.order.length == 0) {
			var hand = s.players[s.order[s.turn]].hand;
			var best = hand[0];

			var besttype = hand.filter(function (el) { return el.data.type != 'death'; });
			besttype = besttype.length ? besttype[0].data.type : 0;

			for (var i = 0; i < hand.length; i++) {
				if (deck.typeSortKey[hand[i].data.type] <= deck.typeSortKey[best.data.type])
					hand[i].best = true;
				else if (best.data.type == 'death' && deck.typeSortKey[hand[i].data.type] <= deck.typeSortKey[besttype])
					hand[i].best = true;
			}
		}
		else {
			var pcard = s.trick[s.trick.length - 1].card;
			var hand = s.players[s.order[s.turn]].hand;

			var found = false;
			// if death played, look for cards that eat death
			if (pcard.data.type == 'death') {
				var found = false;
				for (var i = 0; i < hand.length; i++) {
					if (hand[i].data.eats.includes(pcard.id)) {
						hand[i].best = true;
						found = true;
					}
				}
			}
			// normal card played
			else {
				// if nothing (but death) eats played card, look for cards that aren't eaten by it
				if (pcard.data.eaten.length == 1 && pcard.data.eaten[0] == 'death') {
					for (var i = 0; i < hand.length; i++) {
						if (!pcard.data.eats.includes(hand[i].id)) {
							hand[i].best = true;
							found = true;
						}
					}
				}
				// played card is eaten by something
				else {
					// look for the cards that eat played card and are not eaten by it
					for (var i = 0; i < hand.length; i++) {
						if (hand[i].data.eats.includes(pcard.id) && !hand[i].data.eaten.includes(pcard.id)) {
							hand[i].best = true;
							found = true;
						}
					}
					// didn't find anything, look for a card that will tie
					if (!found) {
						for (var i = 0; i < hand.length; i++) {
							if (!hand[i].data.eaten.includes(pcard.id)) {
								hand[i].best = true;
								found = true;
							}
						}
					}
				}
			}
			// you're screwed, pick the lowest value cards to "discard"
			if (!found) {
				for (var i = hand.length - 1; i >= 0; i--) {
					if (hand[i].data.type == hand[hand.length - 1].data.type)
						hand[i].best = true;
					else
						break;
				}
			}
		}
	}*/

	$scope.init();
	$scope.$on('$locationChangeStart', function (event) {
		$scope.here = false;
	});
}]);