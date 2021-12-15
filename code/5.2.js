// https://dodona.ugent.be/en/courses/961/series/10678/activities/1373018759/

// ====================
// 		FAILS ON DODONA
// --------------------
// no idea why, everything is fine, and gives correct results when ran locally
// so hard to debug the problem
//

const fs = require('fs');
const { resolve } = require('path');

let grid = [];

function addLine(line) {
	let [x1, y1, x2, y2] = line;

	if (x1 !== x2 && y1 !== y2 && Math.abs(x2 - x1) !== Math.abs(y2 - y1)) {
		return;
	}
	let dx = Math.sign(x2 - x1);
	let dy = Math.sign(y2 - y1);
	let distance = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
	for (let i = 0; i <= distance; ++i) {
		let y = y1 + i * dy;
		let x = x1 + i * dx;
		if (!grid[y]) grid[y] = [];
		if (!grid[y][x]) grid[y][x] = 0;
		grid[y][x]++;
	}
}

function overlap(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) =>
			x
				.trim()
				.split('->')
				.map((pair) => pair.trim().split(',').map(Number))
				.flat()
		);

	data.map(addLine);

	return grid
		.flat(2)
		.filter(Number)
		.filter((x) => x > 1).length;
}

// console.log(overlap('data/input5.1.txt'));
