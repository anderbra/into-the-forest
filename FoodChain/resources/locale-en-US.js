'use strict';

angular.module('app').value('i18n', {
	locale: 'en_US',
	locale_name: 'English',
	lowercaseWords: ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'near', 'of', 'on', 'onto', 'to', 'with'],

	gametypes: {
		showdown: { one: 'Showdown', other: 'Showdowns' },
		predation: { one: 'Predation', other: 'Predations' }
	},
	menu: {
		showdown: { one: 'Showdown', other: 'Showdowns' },
		challenge: { one: 'Challenge', other: 'Challenges' }
	},
	types: {
		plant: { one: 'plant', other: 'plants' },
		herbivore: { one: 'herbivore', other: 'herbivores' },
		omnivore: { one: 'omnivore', other: 'omnivores' },
		carnivore: { one: 'carnivore', other: 'carnivores' },
		apex: { one: 'apex predator', other: 'apex predators' },
		death: { one: 'death & decay', other: 'death & decays' },
		notacard: { one: 'invalid', other: 'invalid' }
	},
	cards: {
		sun: { one: 'plants make their own food', other: 'plants make their own food' },
		bark: { one: 'bark', other: 'barks' },
		nut: { one: 'nuts', other: 'nuts' },
		fruit: { one: 'fruit', other: 'fruits' },
		grass: { one: 'grass', other: 'grasses' },
		fungus: { one: 'fungi', other: 'fungi' },
		seed: { one: 'seeds', other: 'seeds' },
		bud: { one: 'buds & twigs', other: 'buds & twigs' },
		fern: { one: 'ferns', other: 'ferns' },
		herb: { one: 'herbs', other: 'herbs' },
		leaf: { one: 'leaves', other: 'leaves' },
		millipede: { one: 'millipede', other: 'millipedes' },
		porcupine: { one: 'porcupine', other: 'porcupines' },
		plantinsect: { one: 'plant-eating insect', other: 'plant-eating insects' },
		worm: { one: 'earthworm', other: 'earthworms' },
		deer: { one: 'deer', other: 'deer' },
		rabbit: { one: 'rabbit', other: 'rabbits' },
		twigbird: { one: 'bird on twig', other: 'birds on twig' },
		leafbird: { one: 'bird on leaf', other: 'birds on leaf' },
		opossum: { one: 'opossum', other: 'opossums' },
		mole: { one: 'mole', other: 'moles' },
		squirrel: { one: 'squirrel', other: 'squirrels' },
		shrew: { one: 'shrew', other: 'shrews' },
		mouse: { one: 'mouse', other: 'mice' },
		skunk: { one: 'skunk', other: 'skunks' },
		turtle: { one: 'turtle', other: 'turtles' },
		groundbird: { one: 'bird on ground', other: 'birds on ground' },
		trunkbird: { one: 'bird on tree trunk', other: 'birds on tree trunk' },
		raccoon: { one: 'raccoon', other: 'raccoons' },
		centipede: { one: 'centipede', other: 'centipedes' },
		frog: { one: 'frog or toad', other: 'frogs & toads' },
		snake: { one: 'snake', other: 'snakes' },
		hawk: { one: 'hawk', other: 'hawks' },
		owl: { one: 'owl', other: 'owls' },
		spider: { one: 'spider', other: 'spiders' },
		meatinsect: { one: 'preying insect', other: 'preying insects' },
		coyote: { one: 'coyote', other: 'coyotes' },
		fox: { one: 'fox', other: 'foxes' },
		bobcat: { one: 'bobcat', other: 'bobcats' },
		bear: { one: 'bear', other: 'bears' },
		death: { one: 'death & decay', other: 'death & decay' },
	}
});