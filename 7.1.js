const fs = require('fs');
const { resolve } = require('path');

function fuel(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(',').map(Number))
		.flat();

	const smallest = Math.min(...data);
	const largest = Math.max(...data);

	let smallestDistance = Infinity;
	for (let x = smallest; x <= largest; ++x) {
		let distance = data.reduce((total, el) => total + Math.abs(el - x), 0);
		smallestDistance = Math.min(smallestDistance, distance);
	}
	return smallestDistance;
}
