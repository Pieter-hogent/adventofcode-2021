const fs = require('fs');
const { resolve } = require('path');

function steps(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('').map(Number));

	let simultaneousStep = -1;
	for (let i = 0; true; ++i) {
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
		]; // 8 neighbours

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
						data[rowIdx][colIdx] = -Infinity; // don't flash again in this iteration
					}
				}
			}
		} while (newFlashes);

		data = data.map((row) => row.map((el) => (el < 0 ? 0 : el))); // replace -Infinity with 0

		if (data.flat().filter((x) => x !== 0)?.length === 0) {
			simultaneousStep = i;
			break;
		}
	}
	return simultaneousStep + 1; // start at step 1
}

console.log(steps('data/input11.txt'));
