const fs = require('fs');
const { resolve } = require('path');

function dive(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(' '));

	let position = { x: 0, y: 0, aim: 0 };

	for (let [direction, amount] of data) {
		const amountNr = Number(amount);
		switch (direction) {
			case 'forward': {
				position.x += amountNr;
				position.y += amountNr * position.aim;
				break;
			}
			case 'down':
				position.aim += amountNr;
				break;
			case 'up':
				position.aim -= amountNr;
				break;
		}
	}
	return position.x * position.y;
}

console.log(dive('data/input2.txt'));
