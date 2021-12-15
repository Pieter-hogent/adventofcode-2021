const fs = require('fs');
const { resolve } = require('path');

function search(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) =>
			x
				.trim()
				.split('|')
				.map((y) => y.trim().split(' '))
		);

	let total = 0;
	for (let entry of data) {
		total = entry[1].reduce(
			(total, x) => ([2, 3, 4, 7].includes(x.length) ? total + 1 : total),
			total
		);
	}
	return total;
}
