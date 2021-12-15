const fs = require('fs');
const { resolve } = require('path');

function neighbours(data, { x, y }) {
	let result = x > 0 ? [data[x - 1][y]] : [];
	y > 0 ? result.push(data[x][y - 1]) : null;
	x < data.length - 1 ? result.push(data[x + 1][y]) : null;
	y < data[0].length - 1 ? result.push(data[x][y + 1]) : null;
	return result;
}
function basins(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('').map(Number));

	let total = 0;
	data.map((row, i) =>
		row.map((el, j) => {
			let surrounding = neighbours(data, { x: i, y: j });
			if (surrounding.filter((x) => x <= el).length === 0) {
				total += el + 1;
				// console.log(
				// 	`got minimum ${el} compared to ${JSON.stringify(
				// 		surrounding
				// 	)} at (${i}, ${j}), total becomes ${total}`
				// );
			}
		})
	);
	return total;
}

console.log(basins('data/input9.1.txt'));
