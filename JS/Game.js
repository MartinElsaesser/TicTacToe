class Game extends Dispatcher {
	board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
	winningPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
	gameEnd = false;
	waitingForAi = false;
	difficulty = 0.1;
	playerScore = 0;
	aiScore = 0;
	playerMove(cellI) {
		// cellId is a number from 0-8
		if (this.gameEnd) return;
		if (this.waitingForAi) return this.dispatch("waiting-for-ai");

		this._makeMove(cellI, true);
		this._calculateWin();
	}
	aiMove() {
		if (this.gameEnd || !this.waitingForAi) return;
		let xIs = this.board.map((c, i) => c === "x" && i).filter(v => v !== false);
		let oIs = this.board.map((c, i) => c === "o" && i).filter(v => v !== false);

		let forcedMove = this._getForcedMoves(xIs, oIs);
		let winningMove = this._getWinningMove(xIs, oIs);
		let move = this._getMove();
		let error = Math.random() <= this.difficulty;

		setTimeout(() => {
			// movement code
			if (error && forcedMove) this._makeMove(forcedMove, false);
			else if (error && winningMove) this._makeMove(winningMove, false);
			else this._makeMove(move, false)
			this._calculateWin();
		}, Game._randInt(100, 1000));
	}
	restart() {
		this.board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
		this.gameEnd = false;
		this.waitingForAi = false;
	}
	_makeMove(cellI, isPlayer) {
		let type = isPlayer ? "x" : "o";
		if (this.board[cellI] === ".") {
			this.waitingForAi = isPlayer;
			this.board[cellI] = type;
			this.dispatch("set", { type, cellI });
			return true;
		}
		return false
	}
	_getForcedMoves(xIs, oIs) {
		let oneXMissingI = null;
		this.winningPositions.some((position) => { // find first position where one x is missing to win
			let freeSpace = position.filter(cell => !xIs.includes(cell)); // sort out positions where xs are placed
			let isForced = freeSpace.length === 1 && !oIs.includes(freeSpace[0]); // its not forced, if there is a o on free space
			if (isForced) oneXMissingI = freeSpace[0]; // extracts position with one spot without a x, quit
			return isForced;
		});
		return oneXMissingI;
	}
	_getWinningMove(xIs, oIs) {
		let oneOMissingI = null;
		this.winningPositions.some((position) => { // find first position where one o is missing to win
			let freeSpace = position.filter(cell => !oIs.includes(cell)); // get positions without os
			let isWinning = freeSpace.length === 1 && !xIs.includes(freeSpace[0]); // two os in position and no x on space
			if (isWinning) oneOMissingI = freeSpace[0]; // extracts position with one spot without a x
			return isWinning;
		});
		return oneOMissingI;
	}
	_getMove() {
		let freeCell = this.board.map((c, i) => (c !== "x" && c !== "o") && i).filter(v => v !== false);
		let priority = [4, 0, 2, 6, 8, 1, 5, 7, 3];
		let move = priority.find(cell => freeCell.includes(cell));
		return move;
	}
	_calculateWin() {
		let xIs = this.board.map((c, i) => c === "x" && i).filter(v => v !== false);
		let oIs = this.board.map((c, i) => c === "o" && i).filter(v => v !== false);

		let playerWon;
		let aiWon;

		this.winningPositions.forEach((position) => {
			if (!playerWon) playerWon = position.every(pos => xIs.includes(pos));
			if (!aiWon) aiWon = position.every(pos => oIs.includes(pos));
		});

		if (playerWon || aiWon) this.gameEnd = true;
		if (playerWon) {
			this.playerScore++;
			this.difficulty = Math.min(this.difficulty + this.difficulty * 0.5, 1);
			this.dispatch("end", { won: true, winner: "player", playerScore: this.playerScore, aiScore: this.aiScore });
		} else if (aiWon) {
			this.aiScore++;
			this.dispatch("end", { won: true, winner: "computer", playerScore: this.playerScore, aiScore: this.aiScore });
		} else if (!this.board.includes(".")) { // no one won and all tiles are filed -> draw
			this.dispatch("end", { won: false, playerScore: this.playerScore, aiScore: this.aiScore }); // draw
		}
	}
	static _randInt(min, max) {
		Math.floor(Math.random() * (max - min + 1)) + min;
	}
}