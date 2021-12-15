// https://dodona.ugent.be/en/courses/961/series/10676/activities/1382601853/
const fs = require('fs');
const { resolve } = require('path');

function hasBingo(board) {
	// console.log(board);
	let done = false;
	board.forEach((row) => {
		// search for rows with only 'null' (fully drawn row)
		if (row.filter((y) => y !== null).length === 0) {
			done = true;
			return;
		}
	});
	if (done) return true;
	// search for columns, simply loop over elements in the first row, and look at all the others
	// boards[0].forEach((_, c) => {
	for (let [idx, row] of board.entries()) {
		let done = true;
		for (let r = 0; r < board.length; ++r) {
			if (board[r][idx] !== null) {
				done = false;
				break;
			}
		}
		// found one
		if (done) {
			return true;
		}
	}
	return false;
}

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

		if (boards.length > 1) {
			let newBoards = boards.filter((b) => !hasBingo(b));
			// if we had more than one and the last number causes them all to bingo, keep the last one
			if (newBoards.length == 0) newBoards = [boards[boards.length - 1]];
			boards = newBoards;
			// console.log(`filtered, left ${boards.length}`);
		}
		if (boards.length === 1) {
			if (hasBingo(boards[0])) {
				bingoBoard = boards[0];
				bingoNumber = x;
				break;
			}
		}
	}
	return (
		bingoBoard
			.flat()
			.filter((x) => x)
			.reduce((total, el) => total + el, 0) * bingoNumber
	);
}

// console.log(score('data/input4.1.txt'));
