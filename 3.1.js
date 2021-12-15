const fs = require('fs');
const { resolve } = require('path');

function powerConsumption(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n');

	let rate = [];
	let mask = 0;
	data.forEach((v, lineIdx) => {
		if (lineIdx === 0) {
			rate = new Array(v.length).fill(0);
			mask = Math.pow(2, v.length) - 1;
		}
		v.trim()
			.split('')
			.map((x, idx) => {
				Number(x) ? rate[idx]++ : rate[idx]--;
			});
	});

	const gamma =
		rate.reduce((v, n) => {
			v = n >= 0 ? v + 1 : v;
			return v * 2;
		}, 0) / 2;
	const delta = ~gamma & mask;
	return gamma * delta;
}

console.log(powerConsumption('data/input3.txt'));
