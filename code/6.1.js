const fs = require('fs');
const { resolve } = require('path');

function lanternfish(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(',').map(Number));
	let list = data.flat();
	const DAYS = 80;

	for (let i = 0; i < 80; ++i) {
		let newFish = 0;
		list = list.map((x) => (x - 1 >= 0 ? x - 1 : (newFish++, 6)));
		while (newFish--) list.push(8);
	}

	return list.length;
}
