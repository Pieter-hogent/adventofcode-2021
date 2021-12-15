const fs = require('fs');
const { resolve } = require('path');

function lanternfish(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(',').map(Number))
		.flat();

	const DAYS = 256;

	let list = Array(9).fill(0);
	data.map((x) => list[x]++);
	for (let i = 0; i < DAYS; ++i) {
		let newFish = list[0];
		for (let j = 0; j <= 7; ++j) {
			list[j] = list[j + 1];
		}
		list[8] = newFish;
		list[6] += newFish;
	}

	return list.reduce((total, x) => total + BigInt(x), BigInt(0));
}

console.log(lanternfish('data/input6.txt'));
