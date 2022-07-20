'use strict';

var app = angular.module('app');

app.filter('toProperCase', ['i18n', function (i18n) {
	return function (input) {
		input = input || '';
		var lowers = i18n.lowercaseWords || [];
		var str = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
		for (var i = 0; i < lowers.length; i++)
			str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'gi'), function (txt) { return txt.toLowerCase(); });
		return str;
	};
}]);

app.filter('getCardName', ['i18n', function (i18n) {
	return function (input) {
		return typeof i18n.cards[input] !== 'undefined' ? i18n.cards[input].one : 'i18n missing';
	};
}]);

app.filter('getCardName2', ['i18n', function (i18n) {
	return function (input) {
		return typeof i18n.cards[input] !== 'undefined' ? i18n.cards[input].other : 'i18n missing';
	};
}]);

app.filter('getTypeName', ['i18n', function (i18n) {
	return function (input) {
		return typeof i18n.types[input] !== 'undefined' ? i18n.types[input].one : 'i18n missing';
	};
}]);

app.filter('getTypeName2', ['i18n', function (i18n) {
	return function (input) {
		return typeof i18n.types[input] !== 'undefined' ? i18n.types[input].other : 'i18n missing';
	};
}]);

app.filter('toTime', [function () {
    return function (input) {
        input = parseFloat(input);
        input = isNaN(input) ? 0 : input;
        var day = Math.floor(Math.floor(input) / (24*60*60));
        input %= 24*60*60;
        var hr = Math.floor(Math.floor(input) / (60*60));
        input %= 60*60;
        var min = Math.floor(Math.floor(input) / 60);
        var sec = Math.floor(input % 60);
        return (day > 0 ? day + ':' : '')
            + (hr > 0 ? (hr < 10 && day > 0 ? '0' + hr : hr) + ':' : '')
            + (min > 0 ? (min < 10 && hr > 0 ? '0' + min : min) + ':' : (hr > 0 ? '00:' : '0:'))
            + (sec > 0 ? (sec < 10 ? '0' + sec : sec) : '00');
    };
}]);