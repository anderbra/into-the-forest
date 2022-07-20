'use strict';

var app = angular.module('app');

app.service('StateService', ['$window', 'DeckService', function ($window, DeckService) {
	var svc = {};

	svc.exists = function () {
		return !!$window.localStorage.getItem('state');
	};

	svc.load = function () {
		return JSON.parse($window.localStorage.getItem('state'));
	};

	svc.save = function (state) {
		$window.localStorage.setItem('state', JSON.stringify(state));
	};

	svc.clear = function () {
		$window.localStorage.removeItem('state');
	};

	svc.new = function (type) {
		return {
			gametype: type,
			players: [],
			drawpile: DeckService.buildDeck(),
			trick: [],
			turn: 0,
			round: 0,
			order: [],
			battletype: '',
			opponent: -1,
			battleturn: 0,
			challengetarget: '',
			useddeath: false,
			wondeath: false,
			winner: -1,
			gameclock: 0,
			playclock: 0,
			clockpaused: false
		};
	};

	svc.newPlayer = function (name) {
		return {
			name: name,
			hand: [],
			stack: [],
			score: 0,
			bonus: false
		};
	};

	return svc;
}]);

app.service('DeckService', ['deck', 'i18n', function (deck, i18n) {
	var svc = {};

	svc.buildDeck = function () {
		var drawpile = [];
		populateDeck();
		for (var card in deck.cards) {
			if (deck.cards[card].type !== deck.types.notacard) {
				for (var i = 0; i < (deck.cards[card].qty || 1); i++) {
					drawpile.push({
						id: card,
						data: deck.cards[card]
					});
				}
			}
		}
		drawpile.shuffle();
		return drawpile;
	};

	svc.listDeck = function () {
		var list = [];
		populateDeck();
		for (var card in deck.cards)
			if (deck.cards[card].type !== deck.types.notacard)
				list.push({ id: card, name: deck.cards[card].name });
		list.sort(function (a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
		return list;
	};

	svc.sortPile = function (array) {
		return sort(array);
	};

	var sort = function (array) {
		array.sort(function (a, b) {
			if (deck.typeSortKey[a.data.type] < deck.typeSortKey[b.data.type])
				return -1;
			if (deck.typeSortKey[a.data.type] > deck.typeSortKey[b.data.type])
				return 1;
			if (a.data.name < b.data.name)
				return -1;
			if (a.data.name > b.data.name)
				return 1;
			return 0;
		});
		return array;
	};

	var populateDeck = function () {
		if (deck.populated)
			return;
		for (var card in deck.cards) {
			var c = deck.cards[card];
			if (c.type !== deck.types.notacard) {
				c.eaten = getEatenList(card);
				c.img = 'resources/card-' + card + '.png';
				c.name = i18n.cards[card].one;
				c.name2 = i18n.cards[card].other;
				if (c.type === deck.types.death) {
					for (var card2 in deck.cards) {
						if (deck.cards[card2].type !== deck.types.death && deck.cards[card2].type !== deck.types.notacard) {
							c.eats.push(card2);
						}
					}
				}
			}
		}
		deck.populated = true;
	};

	var getEatenList = function (id) {
		var arr = [];
		for (var card in deck.cards) {
			var c = deck.cards[card];
			if (typeof c.eats !== 'undefined' && c.eats.includes(id))
				arr.push(card);
			else if (id !== 'death' && c.type === 'death')
				arr.push(card);
		}
		return arr;
	};

	return svc;
}]);