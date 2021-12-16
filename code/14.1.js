// https://dodona.ugent.be/en/courses/961/series/10806/activities/1395660207/
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

	let newPolymer = startPolymer;
	for (let i = 0; i < 10; ++i) {
		let remaining = [...newPolymer];
		newPolymer = [];
		while (remaining.length >= 2) {
			let [first, second, ...ignore] = remaining;
			const insert = data[`${first}${second}`];
			newPolymer = [...newPolymer, first, insert];
			remaining = remaining.slice(1);
		}
		newPolymer = [...newPolymer, startPolymer[startPolymer.length - 1]]; // add last one
	}
	let count = Object.values(
		newPolymer.reduce((count, val) => {
			if (!count[val]) count[val] = BigInt(0);
			count[val]++;
			return count;
		}, {})
	).sort((a, b) => b - a);
	return count[0] - count[count.length - 1];
}

console.log(polymerize('./data/input14.txt'));
