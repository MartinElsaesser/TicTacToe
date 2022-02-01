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