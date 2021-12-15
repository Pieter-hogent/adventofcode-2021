// https://dodona.ugent.be/nl/courses/961/series/10743/activities/366184811/
const fs = require('fs');
const { resolve } = require('path');

function paths(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('-'));

	// make sure 'start' is always at front, and 'end' the last one
	// add b->a if a->b existed for all the others
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
	// should probably remove duplicates here, but was never an issue, go figure

	let pathsFound = 0;
	let openList = [['start']]; // list of all unfinished paths, which we'll expand
	while (true) {
		// each entry is mapped on an array with all followers of the last entry from the parsed data
		// flatMap collapses into a single array of paths again
		openList = openList.flatMap((path) => {
			let start = path[path.length - 1];
			let destinations = data
				.filter(([from, _]) => from === start) // so only entries where last one of path is the first one (start)
				.map(([_, to]) => to); // replace the array with the last element of the path (end)
			return destinations.map((end) => [...path, end]);
		});

		// remove those where a 'small' is visited twice
		openList = openList.filter((path) => {
			let withoutCapitalPaths = [...path]
				.filter((el) => el.toUpperCase() !== el)
				.filter((el) => el !== 'start' && el !== 'end');

			// only small ones left, check if there's at least one duplicate
			return (
				withoutCapitalPaths.filter(
					(item, index) => withoutCapitalPaths.indexOf(item) !== index
				).length <= 1
			);
		});

		// count the found paths
		pathsFound = openList.reduce(
			(total, path) => (path?.[path.length - 1] === 'end' ? total + 1 : total),
			pathsFound
		);
		// remove the ones that reached end, they're a valid path
		// not really necessary, they have no followups so will be removed by the first flatMap in this loop

		if (openList.length === 0) break;
	}

	return pathsFound;
}

// console.log(paths('data/input12.1.txt'));
