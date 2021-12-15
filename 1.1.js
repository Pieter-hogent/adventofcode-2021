const fs = require('fs');
const { resolve } = require('path');

function sonar(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map(Number);

	return data
		.map((x, i, all) => (i === 0 ? 0 : x > all[i - 1] ? 1 : 0))
		.reduce((a, b) => a + b, 0);
}

console.log(sonar('data/input1.txt'));
