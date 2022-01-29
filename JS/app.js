class UI {
	constructor() {
		this.cells = document.querySelectorAll(".cell");
		this.restart = document.querySelector("button.restart");
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
			this.restart.disabled = true;
			this.cells.forEach((cell, i) => {
				cell.classList.remove("filled", "x", "o");
			});
			this.field.classList.remove("won", "lost", "draw");
			this.game.restart();
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
			this.restart.disabled = false;
			this.cells.forEach((cell, i) => {
				cell.classList.add("filled");
			});
			this.score.textContent = `${playerScore}:${aiScore}`;
			if (won) {
				this.field.classList.add(winner === "computer" ? "lost" : "won");
			} else {
				this.field.classList.add("draw");
			}
		});
	}
}

new UI();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/TicTacToe/sw.js', { scope: '/TicTacToe/' }).then(function (reg) {
		// Registrierung erfolgreich
		console.log('Registrierung erfolgreich. Scope ist ' + reg.scope);
	}).catch(function (error) {
		// Registrierung fehlgeschlagen
		console.log('Registrierung fehlgeschlagen mit ' + error);
	});
};