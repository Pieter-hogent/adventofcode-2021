// https://dodona.ugent.be/en/courses/961/series/10674/activities/1137110852/
const fs = require('fs');
const { resolve } = require('path');

// positive: 1
// negative: 0
// zero: equal
function bitAppearsMost(list, position) {
	return list.reduce(
		(total, number) => (number & (1 << position) ? total + 1 : total - 1),
		0
	);
}

function filterList(list, position, keepOnes) {
	if (list.length === 1) return list;
	return list.filter((val) =>
		keepOnes ? val & (1 << position) : !(val & (1 << position))
	);
}

function lifeSupportRating(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n');
	let numbers = data.map((x) => parseInt(x.trim(), 2));
	let bits = data[0].length;

	let oxygen = [...numbers];
	let co2 = [...numbers];
	for (let i = bits - 1; i >= 0; --i) {
		let bit = bitAppearsMost(oxygen, i);
		if (Math.abs(bit) !== oxygen.length)
			oxygen = filterList(oxygen, i, bit >= 0);
		bit = bitAppearsMost(co2, i);

		if (Math.abs(bit) !== co2.length) co2 = filterList(co2, i, bit < 0);
	}
	// console.log(`oxygen: ${oxygen.map((x) => x.toString(2))}, ${oxygen}`);
	// console.log(`co2: ${co2.map((x) => x.toString(2))} ${co2}`);
	return oxygen[0] * co2[0];
}

// console.log(lifeSupportRating('data/input3.txt'));
