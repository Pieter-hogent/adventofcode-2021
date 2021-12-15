const fs = require('fs');
const { resolve } = require('path');

// floor [ [ 0, 0, 0, ...], ...]
// line in format [ [x1, y1], [x2, y2] ]
function addLine(floor, line) {
	if (line[0][0] !== line[1][0] && line[0][1] !== line[1][1]) return floor;

	let colStart =
		line[0][0] === line[1][0] ? Math.min(line[0][1], line[1][1]) : line[0][1];
	let colEnd =
		line[0][0] === line[1][0] ? Math.max(line[0][1], line[1][1]) : line[0][1];
	let rowStart =
		line[0][1] === line[1][1] ? Math.min(line[0][0], line[1][0]) : line[0][0];
	let rowEnd =
		line[0][1] === line[1][1] ? Math.max(line[0][0], line[1][0]) : line[0][0];

	// console.log(line);
	// console.log(rowStart, rowEnd, colStart, colEnd);
	floor = floor.map((row, rowIdx) =>
		rowIdx >= rowStart && rowIdx <= rowEnd
			? row.map((x, colIdx) =>
					colIdx >= colStart && colIdx <= colEnd ? x + 1 : x
			  )
			: row
	);

	return floor;
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
		);

	let maxSize =
		data
			.flat()
			.flat()
			.reduce((max, x) => (x > max ? x : max), 0) + 1;

	let floor = new Array(maxSize).fill(new Array(maxSize).fill(0));

	data.every((line) => (floor = addLine(floor, line)));

	return floor.flat().reduce((total, x) => (x > 1 ? total + 1 : total), 0);
}

console.log(overlap('data/input5.txt'));
