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
		//	0
		// 1	2
		//	3
		// 4	5
		//	6
		let signals = new Array(7).fill(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
		// map length of letters to which signals they could be
		const signalsToAdapt = {
			2: [2, 5], // 1
			3: [0, 2, 5], // 7
			4: [1, 2, 3, 5], // 4
			5: [0, 3, 6], // 5 is 2,3,5, they share 0,3,6
			6: [0, 1, 5, 6], // 6 is 0, 6 or 9, they share signal 0,1,5,6
			7: [], // nothing can be deduced from 8
		};
		entry[0].map((el) => {
			const letters = el.split('');
			signalsToAdapt[el.length].map(
				(i) => (signals[i] = signals[i].filter((x) => letters.includes(x)))
			);
		});

		// if a signal has only one entry, that must be the right one, remove it from all others
		let singleEntries = signals.filter((x) => x.length === 1).flat();
		while (singleEntries.length < 7) {
			// until they all have 1 entry
			signals = signals.map((el) =>
				el.length > 1 ? el.filter((x) => !singleEntries.includes(x)) : el
			);
			singleEntries = signals.filter((x) => x.length === 1).flat();
		}

		const decipher = [
			[1, 1, 1, 0, 1, 1, 1],
			[0, 0, 1, 0, 0, 1, 0],
			[1, 0, 1, 1, 1, 0, 1],
			[1, 0, 1, 1, 0, 1, 1],
			[0, 1, 1, 1, 0, 1, 0],
			[1, 1, 0, 1, 0, 1, 1],
			[1, 1, 0, 1, 1, 1, 1],
			[1, 0, 1, 0, 0, 1, 0],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 0, 1, 1],
		];
		let thisNumber = 0;
		for (let number of entry[1]) {
			thisNumber *= 10;
			let result = signals.flat().map((x) => (number.includes(x) ? 1 : 0));
			let y = decipher.map(JSON.stringify).indexOf(JSON.stringify(result));
			thisNumber += y;
		}
		total += thisNumber;
	}
	return total;
}

console.log(search('data/input8.txt'));
