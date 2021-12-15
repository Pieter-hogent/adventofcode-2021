// https://dodona.ugent.be/en/courses/961/series/10746/activities/642908031/
const fs = require('fs');
const { resolve } = require('path');

function dots(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n');

	let foldInstructions = data
		.filter((x) => x.startsWith('fold along '))
		.map((y) => y.substring('fold along '.length))
		.map((z) => z.trim().split('='))
		.map(([dir, amount]) => [dir, Number(amount)]);
	data = data
		.map((x) => x.trim().split(',').map(Number))
		.filter((y) => y.length == 2); // remove fold along and emtpy lines

	// initialize zero grid
	let [maxX, maxY] = data.reduce(
		(total, el) => [Math.max(total[0], el[0]), Math.max(total[1], el[1])],
		[0, 0]
	);
	let dotGrid = new Array(maxY + 1).fill([]);
	dotGrid = dotGrid.map((row) => new Array(maxX + 1).fill(0));
	// add dots
	data.forEach(([x, y]) => (dotGrid[y][x] = 1));

	// helpers
	const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]));
	const foldY = (m, pos) => {
		let foldUnto = m.slice(pos + 1).reverse();
		m = m.slice(0, pos);
		let foldUntoOffset = m.length - foldUnto.length;

		m = m.map((row, rowIdx) => {
			if (rowIdx < foldUntoOffset) return row;
			return row.map(
				(x, colIdx) => (x |= foldUnto?.[rowIdx - foldUntoOffset]?.[colIdx])
			);
		});
		return m;
	};

	// foldInstructions.forEach(([dir, pos]) => {
	const dir = foldInstructions[0][0];
	const pos = foldInstructions[0][1];
	if (dir === 'y') {
		dotGrid = foldY(dotGrid, pos);
	}
	if (dir === 'x') {
		dotGrid = transpose(foldY(transpose(dotGrid), pos));
	}
	// });
	return dotGrid.flat().filter((x) => x).length;
}

// console.log(dots('data/input13.1.txt'));
