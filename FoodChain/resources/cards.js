angular.module('app').value('deck', {
	types: {
		plant: 'plant',
		herbivore: 'herbivore',
		omnivore: 'omnivore',
		carnivore: 'carnivore',
		apex: 'apex',
		death: 'death',
		notacard: 'notacard'
	},
	typeSortKey: {
		plant: 5,
		herbivore: 4,
		omnivore: 3,
		carnivore: 2,
		apex: 1,
		death: 0,
		notacard: 0
	},
	cards: {
		sun: {
			type: 'notacard'
		},
		bark: {
			type: 'plant',
			energy: 10,
			eats: ['sun'],
		},
		nut: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		fruit: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		grass: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		fungus: {
			type: 'plant',
			energy: 10,
			eats: ['death']
		},
		seed: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		bud: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		fern: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		herb: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		leaf: {
			type: 'plant',
			energy: 10,
			eats: ['sun']
		},
		millipede: {
			type: 'herbivore',
			energy: 5,
			eats: ['death', 'grass', 'herb']
		},
		porcupine: {
			type: 'herbivore',
			energy: 5,
			eats: ['bark', 'bud', 'fruit', 'herb', 'leaf', 'nut']
		},
		plantinsect: {
			type: 'herbivore',
			energy: 5,
			eats: ['bark', 'bud', 'fern', 'fruit', 'fungus', 'grass', 'herb', 'leaf', 'nut', 'seed']
		},
		worm: {
			type: 'herbivore',
			energy: 5,
			eats: ['death', 'grass', 'herb', 'leaf']
		},
		deer: {
			type: 'herbivore',
			energy: 5,
			eats: ['bud', 'fern', 'fruit', 'fungus', 'grass', 'herb', 'leaf', 'nut', 'seed']
		},
		rabbit: {
			type: 'herbivore',
			energy: 5,
			eats: ['bark', 'bud', 'fruit', 'grass', 'herb']
		},
		twigbird: {
			type: 'omnivore',
			energy: 3,
			eats: ['fruit', 'plantinsect', 'meatinsect', 'spider']
		},
		leafbird: {
			type: 'omnivore',
			energy: 3,
			eats: ['plantinsect', 'meatinsect', 'seed', 'spider']
		},
		opossum: {
			type: 'omnivore',
			energy: 3,
			eats: ['groundbird', 'leafbird', 'trunkbird', 'twigbird', 'fruit', 'nut', 'plantinsect', 'meatinsect', 'seed']
		},
		mole: {
			type: 'omnivore',
			energy: 3,
			eats: ['centipede', 'worm', 'fungus', 'herb', 'millipede', 'plantinsect', 'meatinsect', 'seed', 'spider']
		},
		squirrel: {
			type: 'omnivore',
			energy: 3,
			eats: ['bark', 'groundbird', 'leafbird', 'trunkbird', 'twigbird', 'bud', 'fern', 'fruit', 'fungus', 'herb', 'leaf', 'nut', 'seed']
		},
		shrew: {
			type: 'omnivore',
			energy: 4,
			eats: ['centipede', 'worm', 'frog', 'fruit', 'fungus', 'herb', 'mouse', 'millipede', 'mole', 'nut', 'plantinsect', 'meatinsect', 'seed', 'snake', 'spider']
		},
		mouse: {
			type: 'omnivore',
			energy: 4,
			eats: ['centipede', 'fruit', 'herb', 'millipede', 'nut', 'plantinsect', 'meatinsect', 'seed', 'spider', 'death']
		},
		skunk: {
			type: 'omnivore',
			energy: 3,
			eats: ['groundbird', 'centipede', 'frog', 'fruit', 'fungus', 'herb', 'mouse', 'millipede', 'mole', 'plantinsect', 'meatinsect', 'snake', 'spider', 'turtle']
		},
		turtle: {
			type: 'omnivore',
			energy: 4,
			eats: ['worm', 'fruit', 'fungus', 'leaf', 'seed', 'plantinsect', 'meatinsect']
		},
		groundbird: {
			type: 'omnivore',
			energy: 4,
			eats: ['bud', 'centipede', 'worm', 'fruit', 'millipede', 'nut', 'plantinsect', 'meatinsect', 'seed', 'spider']
		},
		trunkbird: {
			type: 'omnivore',
			energy: 3,
			eats: ['nut', 'plantinsect', 'meatinsect', 'seed', 'spider']
		},
		raccoon: {
			type: 'omnivore',
			energy: 2,
			eats: ['worm', 'frog', 'fruit', 'mouse', 'mole', 'nut']
		},
		centipede: {
			type: 'carnivore',
			energy: 2,
			eats: ['plantinsect', 'meatinsect']
		},
		frog: {
			type: 'carnivore',
			energy: 3,
			eats: ['centipede', 'worm', 'millipede', 'plantinsect', 'meatinsect', 'spider']
		},
		snake: {
			type: 'carnivore',
			energy: 2,
			eats: ['groundbird', 'leafbird', 'trunkbird', 'twigbird', 'centipede', 'worm', 'frog', 'mouse', 'mole', 'plantinsect', 'meatinsect', 'shrew', 'spider']
		},
		hawk: {
			type: 'carnivore',
			energy: 4,
			eats: ['groundbird', 'leafbird', 'trunkbird', 'twigbird', 'frog', 'mouse', 'plantinsect', 'meatinsect', 'rabbit', 'shrew', 'snake']
		},
		owl: {
			type: 'carnivore',
			energy: 2,
			eats: ['groundbird', 'leafbird', 'trunkbird', 'twigbird', 'hawk', 'mouse', 'mole', 'plantinsect', 'meatinsect', 'rabbit', 'shrew', 'skunk', 'squirrel']
		},
		spider: {
			type: 'carnivore',
			energy: 2,
			eats: ['centipede', 'millipede', 'plantinsect', 'meatinsect']
		},
		meatinsect: {
			type: 'carnivore',
			energy: 2,
			eats: ['centipede', 'frog', 'millipede', 'plantinsect', 'spider']
		},
		coyote: {
			type: 'apex',
			energy: 1,
			eats: ['groundbird', 'death', 'frog', 'fruit', 'mouse', 'opossum', 'plantinsect', 'meatinsect', 'rabbit', 'shrew', 'snake', 'turtle']
		},
		fox: {
			type: 'apex',
			energy: 1,
			eats: ['groundbird', 'deer', 'frog', 'fruit', 'mouse', 'opossum', 'porcupine', 'plantinsect', 'meatinsect', 'rabbit', 'shrew', 'skunk', 'snake', 'squirrel']
		},
		bobcat: {
			type: 'apex',
			energy: 1,
			eats: ['groundbird', 'trunkbird', 'twigbird', 'hawk', 'mouse', 'opossum', 'owl', 'porcupine', 'plantinsect', 'meatinsect', 'rabbit', 'raccoon', 'skunk', 'squirrel', 'shrew']
		},
		bear: {
			type: 'apex',
			energy: 1,
			eats: ['deer', 'frog', 'fruit', 'mouse', 'nut', 'plantinsect', 'porcupine', 'meatinsect', 'rabbit', 'seed', 'shrew', 'turtle']
		},
		death: {
			type: 'death',
			energy: 0,
			eats: [],
			qty: 2
		}
	}
});