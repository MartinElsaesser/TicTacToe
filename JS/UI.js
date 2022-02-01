class UI {
	constructor() {
		this.cells = document.querySelectorAll(".cell");
		this.restart = document.querySelector("button.restart");
		this.newRound = document.querySelector("button.new-round");
		this.field = document.querySelector("#game")
		this.score = document.querySelector(".score")
		this.game = new Game();
		this.listenToGame();
		this.listenToUI();
	}
	listenToUI() {
		// cells
		this.cells.forEach((cell, i) => {
			cell.addEventListener("click", _ => {
				this.game.playerMove(i);
				this.game.aiMove();
			})
		});
		// restart button
		this.restart.addEventListener("click", () => {
			this.newRound.disabled = true;
			this.emptyCells();
			this.field.classList.remove("won", "lost", "draw");
			this.game.restart();
		});
		// new game button
		this.newRound.addEventListener("click", () => {
			this.newRound.disabled = true;
			this.emptyCells();
			this.field.classList.remove("won", "lost", "draw");
			this.game.newRound();
		});
	}
	listenToGame() {
		// set new cell
		this.game.on("set", ({ type, cellI }) => {
			let cell = cellI + 1;
			let cellUI = document.querySelector(`#cell-${cell}`);
			cellUI.classList.add(type);
			cellUI.classList.add("filled");
		});
		// wait for ai move
		this.game.on("waiting-for-ai", () => {
			console.log("It's the computers turn");
		});
		// game ended
		this.game.on("end", ({ won, winner, playerScore, aiScore }) => {
			this.newRound.disabled = false;
			this.cells.forEach((cell, i) => {
				cell.classList.add("filled");
			});
			if (won) {
				this.field.classList.add(winner === "computer" ? "lost" : "won");
			} else {
				this.field.classList.add("draw");
			}
		});
		// update score
		this.game.on("update-score", ({ playerScore, aiScore }) => {
			this.score.textContent = `${playerScore}:${aiScore}`;
		})
	}
	emptyCells() {
		this.cells.forEach((cell, i) => {
			cell.classList.remove("filled", "x", "o");
		});
	}
}