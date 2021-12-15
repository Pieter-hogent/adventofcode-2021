const fs = require('fs');
const { resolve } = require('path');

function blablabla(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('').map(Number));

	return data;
}

console.log(blablabla('../data/input0.txt'));
