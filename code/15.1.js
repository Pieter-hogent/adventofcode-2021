const fs = require('fs');
const { resolve } = require('path');

// works, but too slow,
// didn't feel like optimising A* in javascript 😬, so googled a decent implementation and used that in the .x version

function riskLevel(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n')
		.map((x) => x.trim().split('').map(Number));

	// A*

	const targetNode = [data.length - 1, data[0].length - 1];
	const getLastNode = (path) => path.path[path.path.length - 1];
	const isTargetNode = (path) => {
		let lastNode = getLastNode(path);
		return lastNode[0] === targetNode[0] && lastNode[1] === targetNode[1];
	};

	const getNeighbour = (path, { x, y }) => {
		let lastNode = getLastNode(path);
		return [lastNode[0] + x, lastNode[1] + y];
	};

	const popNextPath = (list) => {
		list = list.sort(
			(p1, p2) => p1.cost + p1.heuristic - p2.cost - p2.heuristic
		);
		return list.shift();
	};
	const makesCycle = (path, [x, y]) => {
		return path.path.some(([pathX, pathY]) => pathX === x && pathY === y);
	};
	const manhattanDistance = ([x1, y1], [x2, y2] = targetNode) => {
		return Math.abs(x2 - x1) + Math.abs(y2 - y1);
	};

	const openList = [{ path: [[0, 0]], cost: 0, heuristic: 0 }];

	let solution = null;
	let steps = 10000;
	while (true) {
		const expandPath = popNextPath(openList);
		if (steps-- < 0) {
			console.log(`number of paths to consider ${openList.length}`);
			steps = 10000;
		}
		if (isTargetNode(expandPath)) {
			solution = expandPath;
			break;
		}
		[
			[0, 1],
			[1, 0],
			[-1, 0],
			[0, -1],
		].forEach(([dx, dy]) => {
			const neighbourCoord = getNeighbour(expandPath, { x: dx, y: dy });
			const costForNeighbour = data?.[neighbourCoord[0]]?.[neighbourCoord[1]];
			if (costForNeighbour === undefined) return;
			// remove cycles
			if (makesCycle(expandPath, neighbourCoord)) return;

			const neighbourPath = {
				path: [...expandPath.path, neighbourCoord],
				cost: expandPath.cost + costForNeighbour,
				heuristic: manhattanDistance(neighbourCoord),
			};
			// neighbourPath.path.push(neighbourCoord);
			// neighbourPath.cost += costForNeighbour;
			openList.push(neighbourPath);
		});
	}
	return solution.cost;
}

console.log(riskLevel('./data/input15.1.txt'));
