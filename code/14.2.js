// https://dodona.ugent.be/en/courses/961/series/10807/activities/1962711451/
const { count } = require('console');
const fs = require('fs');
const { resolve } = require('path');

function polymerize(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n');

	let startPolymer = data[0];

	data = data
		.slice(2)
		.map((x) => x.trim().split('->'))
		.reduce((asObject, [key, val]) => {
			asObject[key.trim()] = val.trim();
			return asObject;
		}, {});

	// we can't 'brute force' anymore, but! one pair always expands into two pairs, no side effects
	// and there are a very limited distinct amount of pairs (order is not significant),
	// so simply count the # of each pair

	let lastLetter = startPolymer[startPolymer.length - 1];
	// every letter is part of two pairs (once as first, once as last)
	// so when counting occurences, we only count the first one of each pair,
	// to count them all exactly once, EXCEPT for the very last letter,
	// whom we need to count one extra time

	let polyPairs = {};
	while (startPolymer.length >= 2) {
		let [a, b] = [startPolymer[0], startPolymer[1]];
		polyPairs[`${a}${b}`] = polyPairs[`${a}${b}`]
			? polyPairs[`${a}${b}`] + 1
			: 1;
		startPolymer = startPolymer.slice(1);
	}

	for (let i = 0; i < 40; ++i) {
		let previousPairs = { ...polyPairs };
		polyPairs = {};

		for (let [pair, amount] of Object.entries(previousPairs)) {
			let [a, c] = pair.split('');

			let b = data[pair];
			polyPairs[`${a}${b}`] = polyPairs[`${a}${b}`]
				? polyPairs[`${a}${b}`] + amount
				: amount;
			polyPairs[`${b}${c}`] = polyPairs[`${b}${c}`]
				? polyPairs[`${b}${c}`] + amount
				: amount;
		}
	}

	let countEl = Object.entries(polyPairs).reduce((split, [pair, amount]) => {
		let [a, _] = pair.split('');
		split[a] = split[a] ? split[a] + amount : amount; // only count the first
		return split;
	}, {});
	countEl[lastLetter]++;

	let count = Object.values(countEl).sort((a, b) => b - a);
	return count[0] - count[count.length - 1];
}

// console.log(polymerize('./data/input14.1.txt'));
