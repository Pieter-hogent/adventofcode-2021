const fs = require('fs');
const { resolve } = require('path');

function score(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(''));

	const pairs = [
		['(', ')'],
		['[', ']'],
		['{', '}'],
		['<', '>'],
	];
	const cost = { ')': 1, ']': 2, '}': 3, '>': 4 };

	let completionStrings = data.map(processRow).filter((x) => x !== undefined);

	function processRow(row, rowIdx) {
		let stack = new Array();
		try {
			row.forEach((el, elIdx) => {
				pairs.forEach((pair) => {
					if (pair[0] === el) {
						stack.push(pair[1]);
					} else {
						if (pair[1] === el) {
							if (el === stack?.[stack.length - 1]) {
								stack.pop();
							} else {
								// early out
								throw new Error('short circuit');
							}
						}
					}
				});
			});
			return stack.reverse().flat();
		} catch (error) {
			return undefined;
		}
	}

	return completionStrings
		.map((row) => row.reduce((total, char) => total * 5 + cost[char], 0))
		.sort((a, b) => b - a)[Math.floor(completionStrings.length / 2)];
}

console.log(score('data/input10.txt'));
