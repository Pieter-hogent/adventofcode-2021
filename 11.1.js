const fs = require('fs');
const { resolve } = require('path');

function flashes(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('').map(Number));

	let flashes = 0;

	for (let i = 0; i < 100; ++i) {
		data = data.map((row) => row.map((el) => el + 1));
		let directions = [
			[0, 1],
			[1, 1],
			[1, 0],
			[1, -1],
			[0, -1],
			[-1, -1],
			[-1, 0],
			[-1, 1],
		];

		let newFlashes = 0;
		do {
			newFlashes = 0;

			for (let [rowIdx, row] of data.entries()) {
				for (let [colIdx, el] of row.entries()) {
					if (el > 9) {
						++newFlashes;
						directions.forEach(([x, y]) => {
							if (data?.[rowIdx + x]?.[colIdx + y]) {
								data[rowIdx + x][colIdx + y]++;
							}
						});
						data[rowIdx][colIdx] = -Infinity;
					}
				}
			}
			flashes += newFlashes;
		} while (newFlashes);

		data = data.map((row) => row.map((el) => (el < 0 ? 0 : el)));
	}
	return flashes;
}

console.log(flashes('data/input11.txt'));
