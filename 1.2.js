const fs = require('fs');
const { resolve } = require('path');

function sonar(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map(Number);

	// convert array to array of arrays with 3 consecutive elements
	data = data
		.map((_, i, all) => all.slice(i, i + 3))
		.filter((x) => x.length === 3); // filter out first and last two, which have 1,2 elements

	// create array of sums, then do as before
	return data
		.map((x) => x.reduce((a, b) => a + b, 0))
		.map((x, i, all) => (i === 0 ? 0 : x > all[i - 1] ? 1 : 0))
		.reduce((a, b) => a + b, 0);
}

console.log(sonar('data/input1.txt'));
