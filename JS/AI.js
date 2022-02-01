class AI {
	static winningPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
	constructor(board) {
		this.board = board;
		this.xIs = board.map((c, i) => c === "x" && i).filter(v => v !== false);
		this.oIs = board.map((c, i) => c === "o" && i).filter(v => v !== false);
	}
	getMove(difficulty) {
		let forcedMove = this._getForcedMoves();
		let winningMove = this._getWinningMove();
		let move = this._getMove();
		let noSkip = Math.random() <= difficulty; // false: skip, true: no skip
		if
			(noSkip && winningMove !== null) return winningMove;
		else if
			(noSkip && forcedMove !== null) return forcedMove;
		else
			return move;
	}
	_getForcedMoves() {
		let oneXMissingI = null;
		AI.winningPositions.some((position) => { // find first position where one x is missing to win
			let freeSpace = position.filter(cell => !this.xIs.includes(cell)); // sort out positions where xs are placed
			let isForced = freeSpace.length === 1 && !this.oIs.includes(freeSpace[0]); // its not forced, if there is a o on free space
			if (isForced) oneXMissingI = freeSpace[0]; // extracts position with one spot without a x, quit
			return isForced;
		});
		return oneXMissingI;
	}
	_getWinningMove() {
		let oneOMissingI = null;
		AI.winningPositions.some((position) => { // find first position where one o is missing to win
			let freeSpace = position.filter(cell => !this.oIs.includes(cell)); // get positions without os
			let isWinning = freeSpace.length === 1 && !this.xIs.includes(freeSpace[0]); // two os in position and no x on space
			if (isWinning) oneOMissingI = freeSpace[0]; // extracts position with one spot without a x
			return isWinning;
		});
		return oneOMissingI;
	}
	_getMove() {
		let freeCell = this.board.map((c, i) => (c !== "x" && c !== "o") && i).filter(v => v !== false);
		let cells = [0, 2, 6, 8, 1, 5, 7, 3].filter(cell => freeCell.includes(cell));
		let priority = freeCell.includes(4) ? 4 : null;
		// prioritize taking the middle, then continues with a random field
		let move = priority || cells[AI._randInt(0, cells.length - 1)];
		return move;
	}
	static _randInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}