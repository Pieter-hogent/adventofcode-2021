// https://dodona.ugent.be/en/courses/961/series/10747/activities/1354492260/
const fs = require('fs');
const { resolve } = require('path');

// .##. ###. .##. ###. #### #### .##. #..# ..## #..# #... .##. ###. ###. .### #..# ####
// #..# #..# #..# #..# #... #... #..# #..# ...# #.#. #... #..# #..# #..# #... #..# ...#
// #..# ###. #... #..# ###. ###. #... #### ...# ##.. #... #..# #..# #..# #... #..# ..#.
// #### #..# #... #..# #... #... #.## #..# ...# #.#. #... #..# ###. ###. .##. #..# .#..
// #..# #..# #..# #..# #... #... #..# #..# #..# #.#. #... #..# #... #.#. ...# #..# #...
// #..# ###. .##. ###. #### #... .### #..# .##. #..# #### .##. #... #..# ###. .##. ####

function constructLetterMapping() {
	let lettersCoded =
		`.##. ###. .##. ###. #### #### .##. #..# ..## #..# #... .##. ###. ###. .### #..# ####
  #..# #..# #..# #..# #... #... #..# #..# ...# #.#. #... #..# #..# #..# #... #..# ...#
  #..# ###. #... #..# ###. ###. #... #### ...# ##.. #... #..# #..# #..# #... #..# ..#.
  #### #..# #... #..# #... #... #.## #..# ...# #.#. #... #..# ###. ###. .##. #..# .#..
  #..# #..# #..# #..# #... #... #..# #..# #..# #.#. #... #..# #... #.#. ...# #..# #...
  #..# ###. .##. ###. #### #... .### #..# .##. #..# #### .##. #... #..# ###. .##. ####`
			.trim()
			.split('\n')
			.map((x) => x.trim().split(''))
			.map((x) => x.filter((y) => y !== ' '))
			.map((row) => row.map((x) => (x === '#' ? 1 : 0)));

	let letters = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'J',
		'K',
		'L',
		'O',
		'P',
		'R',
		'S',
		'U',
		'Z',
	];

	return letters.reduce((letterMap, letter, idx) => {
		letterMap[letter] = lettersCoded
			.map((row) => row.slice(4 * idx, 4 * (idx + 1)))
			.flat() // comment this and two rows underneath, log result and see the letters in action (flat/stringify/join is for easier comparison)
			.map(JSON.stringify)
			.join();
		return letterMap;
	}, {});
}

function dots(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n');

	let foldInstructions = data
		.filter((x) => x.startsWith('fold along '))
		.map((y) => y.substring('fold along '.length))
		.map((z) => z.trim().split('='))
		.map(([dir, amount]) => [dir, Number(amount)]);
	data = data
		.map((x) => x.trim().split(',').map(Number))
		.filter((y) => y.length == 2); // remove fold along and emtpy lines

	// initialize zero grid
	let [maxX, maxY] = data.reduce(
		(total, el) => [Math.max(total[0], el[0]), Math.max(total[1], el[1])],
		[0, 0]
	);
	let dotGrid = new Array(maxY + 1).fill([]);
	dotGrid = dotGrid.map((row) => new Array(maxX + 1).fill(0));
	// add dots
	data.forEach(([x, y]) => (dotGrid[y][x] = 1));

	// helpers
	const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]));
	const foldY = (m, pos) => {
		let foldUnto = m.slice(pos + 1).reverse();
		m = m.slice(0, pos);
		let foldUntoOffset = m.length - foldUnto.length;

		m = m.map((row, rowIdx) => {
			if (rowIdx < foldUntoOffset) return row;
			return row.map(
				(x, colIdx) => (x |= foldUnto?.[rowIdx - foldUntoOffset]?.[colIdx])
			);
		});
		return m;
	};

	foldInstructions.forEach(([dir, pos]) => {
		if (dir === 'y') {
			dotGrid = foldY(dotGrid, pos);
		}
		if (dir === 'x') {
			dotGrid = transpose(foldY(transpose(dotGrid), pos));
		}
	});

	const letterMapping = constructLetterMapping();

	let resultString = '';
	for (let i = 0; i <= dotGrid[0].length - 4; i += 5) {
		let dotGridLetter = dotGrid
			.map((row) => row.slice(i, i + 4))
			.flat() // comment this and two rows underneath, log result and see the letters in action (flat/stringify/join is for easier comparison)
			.map(JSON.stringify)
			.join();

		resultString += Object.keys(letterMapping).find(
			(key) => letterMapping[key] === dotGridLetter
		);
	}
	return resultString;

	// let firstLetter = dotGrid.map((row) => row.slice(0, 5).join()).join();
	// console.log(firstLetter);
	// console.log(
	// 	dotGrid
	// 		.map((row) => row.map((x) => (x ? '#' : '.')))
	// 		.map((row) => row.join(' '))
	// );
}

// console.log(dots('data/input13.1.txt'));
