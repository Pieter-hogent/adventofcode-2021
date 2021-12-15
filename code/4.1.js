// https://dodona.ugent.be/en/courses/961/series/10675/activities/2071006632/
const fs = require('fs');
const { resolve } = require('path');

function score(filename) {
	let data = fs
		.readFileSync(resolve(process.cwd(), filename), 'utf8')
		.trim()
		.split('\n');

	let numbers = data[0].split(',').map(Number);
	let boards = data.slice(1).map((x) => x.trim().split(/\s+/).map(Number));
	// array of lines, empty line, X lines forming a board, split into array of arrays
	boards = boards.reduce((allBoards, row) => {
		row.length === 1 && row[0] === 0
			? allBoards.push([])
			: allBoards[allBoards.length - 1].push(row);
		return allBoards;
	}, []);

	let bingoBoard = null;
	let bingoNumber = -1;

	for (let x of numbers) {
		// if the number is drawn, erase that element
		boards = boards.map((board) =>
			board.map((row) => row.map((y) => (y === x ? null : y)))
		);

		for (let board of boards) {
			board.forEach((row) => {
				// search for rows with only 'null' (fully drawn row)
				if (row.filter((y) => y !== null).length === 0) {
					bingoBoard = board;
					bingoNumber = x;
					return;
				}
			});
			if (bingoBoard) break;
			// search for columns, simply loop over elements in the first row, and look at all the others
			// boards[0].forEach((_, c) => {
			for (let [idx, row] of board.entries()) {
				bingoBoard = board;
				bingoNumber = x;
				for (let r = 0; r < board.length; ++r) {
					if (board[r][idx] !== null) {
						bingoBoard = null;
						bingoNumber = -1;
						break;
					}
				}
				// found one
				if (bingoBoard !== null) {
					break;
				}
			}
		}
		if (bingoBoard) break;
	}
	return (
		bingoBoard
			.flat()
			.filter((x) => x)
			.reduce((total, el) => total + el, 0) * bingoNumber
	);
}

// console.log(score('data/input4.1.txt'));
