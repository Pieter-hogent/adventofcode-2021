const fs = require('fs');
const { resolve } = require('path');

function dive(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split(' '));

	let position = { x: 0, y: 0 };

	for (let [direction, amount] of data) {
		switch (direction) {
			case 'forward':
				position.x += Number(amount);
				break;
			case 'down':
				position.y += Number(amount);
				break;
			case 'up':
				position.y -= Number(amount);
				break;
		}
	}
	return position.x * position.y;
}

console.log(dive('data/input2.txt'));
