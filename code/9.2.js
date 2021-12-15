const fs = require('fs');
const { resolve } = require('path');

function basins(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('').map(Number));

	let sizes = [];
	let marked = new Set();
	for (let [rowIdx, row] of data.entries()) {
		for (let [colIdx, col] of row.entries()) {
			if (marked.has(JSON.stringify({ x: rowIdx, y: colIdx }))) {
				continue;
			}
			// console.log(
			// 	`explore ${rowIdx}, ${colIdx}, size ${JSON.stringify(sizes)}`
			// );
			sizes.push(explore({ x: rowIdx, y: colIdx }));
		}
	}

	function explore({ x, y }) {
		// console.log(`${x} ${y}: ${data[x]?.[y]}`);
		if (marked.has(JSON.stringify({ x, y }))) return 0;
		if (data[x]?.[y] === undefined) return 0;
		if (data[x]?.[y] === 9) return 0;

		marked.add(JSON.stringify({ x, y }));
		let size = 1;
		[
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
		].map(([dx, dy]) => {
			size += explore({ x: x + dx, y: y + dy });
		});
		return size;
	}

	return sizes
		.sort((a, b) => b - a)
		.slice(0, 3)
		.filter((x) => x > 0)
		.reduce((total, el) => total * el, 1);
}

console.log(basins('data/input9.txt'));
