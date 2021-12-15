const fs = require('fs');
const { resolve } = require('path');

function score(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(''));

	const pairs = [
		['(', ')', 3],
		['[', ']', 57],
		['{', '}', 1197],
		['<', '>', 25137],
	];
	let stack = new Array();
	let cost = 0;
	data.map(processRow);

	function processRow(row, rowIdx) {
		try {
			row.forEach((el, elIdx) => {
				pairs.forEach((pair) => {
					if (pair[0] === el) {
						stack.push(el);
					} else {
						if (pair[1] === el) {
							if (pair[0] === stack?.[stack.length - 1]) {
								stack.pop();
							} else {
								// console.log(
								// 	`${rowIdx}:${elIdx} got ${pair[1]} expected ${
								// 		stack?.[stack.length - 1]
								// 	}`
								// );
								cost += pair[2];
								throw new Error('short circuit');
							}
						}
					}
				});
			});
		} catch (error) {
			//ignore
		}
	}

	return cost;
}

console.log(score('data/input10.txt'));
