class Game extends Dispatcher {
	static winningPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
	board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
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
		let ai = new AI(this.board, this.difficulty);
		let move = ai.getMove(this.difficulty);
		setTimeout(() => {
			this._makeMove(move, false)
			this._calculateWin();
		}, Game._randInt(100, 500));
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
	_calculateWin() {
		let xIs = this.board.map((c, i) => c === "x" && i).filter(v => v !== false);
		let oIs = this.board.map((c, i) => c === "o" && i).filter(v => v !== false);

		let playerWon;
		let aiWon;

		Game.winningPositions.forEach((position) => {
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
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}