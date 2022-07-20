'use strict';

angular.module('app').controller('PredationController',
['$scope', '$timeout', '$interval', '$window', '$routeParams', 'DeckService', 'StateService', 'options', 'deck', 'i18n',
function ($scope, $timeout, $interval, $window, $routeParams, DeckService, StateService, options, deck, i18n) {
	$scope.state = {};
	$scope.here = true;
	$scope.decklist = DeckService.listDeck();

	$scope.init = function (restart) {
		$scope.logInfo('predation init()');

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
		updateScores();
		runAi();
	}

	$scope.newState = function () {
		StateService.clear();
		$scope.state = StateService.new('predation');
		var names = ['alex', 'bob', 'chip', 'dave', 'ebert', 'felix'];
		for (var i = 0; i < names.length; i++)
			$scope.state.players.push(StateService.newPlayer(names[i]));
		while ($scope.state.drawpile.length > 0) {
			for (var i = 0; i < $scope.state.players.length; i++) {
				if ($scope.state.drawpile.length > 0)
					$scope.state.players[i].hand.push($scope.state.drawpile.pop());
				else
					$scope.state.players[i].bonus = true;
			}
		}
		for (var i = 0; i < $scope.state.players.length; i++)
			DeckService.sortPile($scope.state.players[i].hand);
		for (var i = 0; i < $scope.state.players.length; i++)
			$scope.state.order.push(i);
		$scope.state.order.shuffle();
		startTimer();
		$scope.logInfo('state created');
	}

	var timer, gametimerwatch, playtimerwatch;
	var startTimer = function (startAt) {
		$scope.state.gameclock = startAt || options.predationGameLength;
		$scope.state.playclock = options.predationPlayLength;
		resumeTimer();
		gametimerwatch = $scope.$watch('state.gameclock', function () {
			if ($scope.state.gameclock == 0) {
				$scope.logInfo('game timer expired, game over');
				findWinner();
				gametimerwatch();
				$interval.cancel(timer);
			}
		});
		playtimerwatch = $scope.$watch('state.playclock', function () {
			if ($scope.state.playclock == 0) {
				$scope.logInfo('play timer expired, next player\'s turn');
				nextTurn();
				$scope.state.playclock = options.predationPlayLength;
			}
		});
	};

	var resumeTimer = function () {
		$scope.state.clockpaused = false;
		timer = $interval(function () {
			$scope.state.gameclock--;
			$scope.state.playclock--;
			// do not split up because opponent could abuse game clock
		}, 1000);
	}

	var pauseTimer = function () {
		if (angular.isDefined(timer))
			$interval.cancel(timer);
		$scope.state.clockpaused = true;
	}

	$scope.$on('$destroy', function () {
		pauseTimer();
	});

	var nextTurn = function () {
		var s = $scope.state;
		s.turn++;
		s.battleturn = 0;
		s.battletype = '';
		s.opponent = -1;
		s.challengetarget = '';
		s.useddeath = false;
		s.wondeath = false;
		if (s.turn >= s.order.length) {
			s.turn = 0;
			s.round++;
		}
	}

	var findWinner = function () {
		var winner = -1, topscore = -1;
		for (var i = 0; i < $scope.state.players.length; i++) {
			if ($scope.state.players[i].score > topscore) {
				winner = i;
				topscore = $scope.state.players[i].score;
			}
		}
		$scope.state.winner = winner;
		$scope.logInfo($scope.state.players[winner].name + ' wins the game');
		StateService.clear();
	};

	$scope.playShowdown = function () {
		var s = $scope.state;
		if (s.opponent == -1) {
			s.battletype = 'showdown';
			if (chooseOpponent() != -1) {
				$scope.logInfo('player chose ' + s.players[s.opponent].name + ' to showdown. choose card now');
				s.battleturn = 0;
				runAi();
			}
		}
	}

	$scope.playChallenge = function () {
		var s = $scope.state;
		if (s.opponent == -1) {
			s.battletype = 'challenge';
			if (chooseOpponent() != -1) {
				$scope.logInfo('player chose ' + s.players[s.opponent].name + ' to challenge. choose card now');
				s.battleturn = 0;
				runAi();
			}
		}
	}

	var chooseOpponent = function () {
		var s = $scope.state;
		do {
			s.opponent = prompt('Choose player to fight. You are ' + s.order[s.turn]);
			if (s.opponent == null) {
				s.opponent = -1;
				return -1;
			}
			else if (typeof s.players[s.opponent] === 'undefined') {
				$scope.logError('player ' + s.opponent + ' does not exist');
				s.opponent = -1;
			}
			else if (!s.players[s.opponent].hand.length) {
				$scope.logError('player ' + s.opponent + ' has no cards in hand');
				s.opponent = -1;
			}
			else if (s.order[s.turn] == s.opponent) {
				$scope.logError('player ' + s.opponent + ' chose himself');
				s.opponent = -1;
			}
		} while (s.opponent < 0 || s.opponent >= s.order.length);
		return s.opponent;
	}

	$scope.playCard = function (player, idx) {
		var s = $scope.state;
		var any = 0;
		if (s.battleturn == 0 && s.order[s.turn] != player || s.battleturn != 0 && s.opponent != player)
			throw 'it is not ' + s.players[player].name + '\'s turn';
		if (s.winner != -1)
			throw 'game is over';
		if (s.battletype == '')
			throw 'no battle has been started';

		s.playclock = options.predationPlayLength;

		if (s.battletype == 'showdown') {
			s.trick.push({ player: player, card: s.players[player].hand.splice(idx, 1)[0] });
			$scope.logInfo(s.players[player].name + ' played ' + s.trick[s.trick.length - 1].card.data.name);

			if (s.battleturn == 0) {
				s.battleturn++;
				pauseTimer();
			}
			else {
				var winner = -1;
				for (var i = 0; i < s.trick.length; i++)
					if (s.trick[i].player == s.order[s.turn])
						var p1 = i;
				var p1idx = s.trick[p1].player;
				for (var i = 0; i < s.trick.length; i++)
					if (s.trick[i].player == s.opponent)
						var p2 = i;
				var p2idx = s.trick[p2].player;

				if (s.trick[p1].card.data.eats.includes(s.trick[p2].card.id)
					&& s.trick[p2].card.data.eats.includes(s.trick[p1].card.id)) {
					$scope.logInfo('tie (both), return');
				}
				else if (s.trick[p1].card.data.eats.includes(s.trick[p2].card.id)) {
					$scope.logInfo(s.players[p1idx].name + ' wins');
					winner = s.trick[p1].player;
				}
				else if (s.trick[p2].card.data.eats.includes(s.trick[p1].card.id)) {
					$scope.logInfo(s.players[p2idx].name + ' wins');
					winner = s.trick[p2].player;
				}
				else {
					$scope.logInfo('tie (neither), return');
				}
				if (winner > -1) {
					$scope.logInfo('pushing trick onto ' + s.players[winner].name + '\'s hand');
					while (s.trick.length) {
						s.players[winner].hand.push(s.trick.pop().card);
					}
				}
				else {
					$scope.logInfo('returning trick to original players');
					while (s.trick.length) {
						var c = s.trick.pop();
						s.players[c.player].hand.push(c.card);
					}
				}
				DeckService.sortPile(s.players[p1idx].hand);
				DeckService.sortPile(s.players[p2idx].hand);

				resumeTimer();
				updateScores();
				nextTurn();
				$scope.logInfo('showdown completed');
				$scope.logInfo('now ' + s.players[s.order[s.turn]].name + '\'s turn');
			}
		}
		else if (s.battletype == 'challenge') {
			if (s.battleturn == 0) {
				if (s.challengetarget == '') {
					throw 'you must choose a target card';
				}

				var card = s.players[player].hand[idx];
				if (card.id == 'death') {
					if (s.useddeath) {
						throw 'already played death this turn';
					}
					else {
						s.useddeath = true;
						$scope.logInfo('setting useddeath = true');
					}
				}

				var target = s.players[s.opponent].hand.map(function (el) { return el.id; }).indexOf(s.challengetarget);
				if (target > -1) {
					if (card.data.eats.includes(s.challengetarget)
						|| card.id == 'death' && s.challengetarget == 'death') {
						$scope.logInfo(s.players[player].name + ' played ' + s.players[player].hand[idx].data.name);
						s.players[player].hand.push(s.players[s.opponent].hand.splice(target, 1)[0]);
						DeckService.sortPile(s.players[player].hand);
						$scope.logInfo(s.players[player].name + ' wins ' + s.challengetarget);
						if (s.challengetarget == 'death') {
							s.wondeath = true;
							$scope.logInfo('setting wondeath = true');
						}
						s.battleturn = 0;
						s.battletype = '';
						s.opponent = -1;
						s.challengetarget = '';
					}
					else {
						$scope.logInfo(s.players[player].name + ' played ' + card.data.name);
						$scope.logInfo(s.players[player].name + '\'s played card does not eat ' + s.challengetarget + ', loses card');
						s.players[s.opponent].hand.push(s.players[player].hand.splice(idx, 1)[0]);
						DeckService.sortPile(s.players[s.opponent].hand);
						nextTurn();
					}
				}
				else {
					$scope.logInfo(s.players[s.opponent].name + ' does not have ' + s.challengetarget + ', ' + s.players[player].name + ' loses card');
					s.players[s.opponent].hand.push(s.players[player].hand.splice(idx, 1)[0]);
					DeckService.sortPile(s.players[s.opponent].hand);
					nextTurn();
				}
				updateScores();
			}
		}

		StateService.save($scope.state);
		runAi();
	}

	$scope.$watch('state.challengetarget', function (n, o, $scope) {
		if (n != o)
			$scope.logInfo('challengetarget changed to ' + n);
	}, true);

	var updateScores = function () {
		var bonus = options.bonusAmount;

		for (var i = 0; i < $scope.state.players.length; i++) {
			var sum = 0;
			if ($scope.state.players[i].bonus)
				sum += bonus;
			for (var j = 0; j < $scope.state.players[i].hand.length; j++) {
				sum += $scope.state.players[i].hand[j].data.energy;
			}
			$scope.state.players[i].score = sum;
		}
	}

	$scope.classActive = function (player) {
		var s = $scope.state;
		if (s.winner != -1) return false;
		if (s.battletype == '' || s.battleturn == 0) return s.order[s.turn] == player;
		return s.opponent == player;
	}

	var runAi = function () {
		if (!$scope.here)
			return;
		// true to highlight, false to auto play
		if (true)
			$scope.aiFindBestCards();
		else if ($scope.state.winner == -1)
			$timeout($scope.aiPlayCard, 500);
	}

	$scope.aiPlayCard = function () {
		/*var s = $scope.state;
		$scope.aiFindBestCards();
		var hand = s.players[s.order[s.turn]].hand;
		hand = hand.map(function (el, index) { el.index = index; return el; });
		var bests = hand.filter(function (el) { return el.best; });
		bests.shuffle();
		$scope.playCard(s.order[s.turn], bests[0].index);*/
	}

	$scope.aiFindBestCards = function () {
		var s = $scope.state;

		for (var i = 0; i < s.players.length; i++) {
			for (var j = 0; j < s.players[i].hand.length; j++) {
				s.players[i].hand[j].best = false;
			}
		}
		for (var i = 0; i < s.trick.length; i++) {
			s.trick[i].card.best = false;
		}

		var hand;
		if (s.battletype == '')
			return;
		else if (s.battletype == 'showdown') {
			if (s.battleturn == 0)
				hand = s.players[s.order[s.turn]].hand;
			else
				hand = s.players[s.opponent].hand;
		}
		else if (s.battletype == 'challenge')
			return;
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

	$scope.init();
	$scope.$on('$locationChangeStart', function (event) {
		$scope.here = false;
	});
}]);