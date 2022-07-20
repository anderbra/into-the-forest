'use strict';

angular.module('app').value('options', {
	// boolean; turns on debug logging
	debug: true,
	// number; length of a predation game in seconds
	predationGameLength: 20 * 60,
	// number; max length of a player's turn in a predation game in seconds
	predationPlayLength: 30,
	// integer; bonus points to award players in a predation game who get short-handed
	bonusAmount: 5,
});