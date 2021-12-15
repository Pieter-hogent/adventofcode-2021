// https://dodona.ugent.be/en/courses/961/series/10742/activities/1187391962/

const fs = require('fs');
const { resolve } = require('path');

function paths(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('-'));

	data = data.flatMap(([from, to]) =>
		from === 'start' || to === 'end'
			? [[from, to]]
			: from === 'end' || to === 'start'
			? [[to, from]]
			: [
					[from, to],
					[to, from],
			  ]
	);
	// console.log(data);

	let pathsFound = 0;
	let openList = [['start']];
	while (true) {
		openList = openList.flatMap((path) => {
			let start = path[path.length - 1];
			let destinations = data
				.filter(([from, _]) => from === start)
				.map(([_, to]) => to);
			return destinations.map((end) => [...path, end]);
		});

		// remove those where a 'small' is visited twice
		openList = openList.filter((path) => {
			let withoutCapitalPaths = [...path]
				.filter((el) => el.toUpperCase() !== el)
				.filter((el) => el !== 'start' && el !== 'end');

			// only small ones left, check if there's at least one duplicate
			return !withoutCapitalPaths.some(
				(item, index) => withoutCapitalPaths.indexOf(item) !== index
			);
		});

		// count the found paths
		pathsFound = openList.reduce(
			(total, path) => (path?.[path.length - 1] === 'end' ? total + 1 : total),
			pathsFound
		);
		// remove the ones that reached end, they're a valid path
		// not really necessary, they hav eno followups so will be removed by the first flatMap

		if (openList.length === 0) break;
		// console.log(openList);
		// break;
	}

	return pathsFound;
}

// console.log(paths('data/input12.1.txt'));
