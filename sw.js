var CACHE_NAME = 'tic-tac-toe';
var urlsToCache = [
	'/TicTacToe/',
	'/TicTacToe/index.html',
	'/TicTacToe/CSS/app.css',
	'/TicTacToe/sw.js',
	'/TicTacToe/JS/Dispatcher.js',
	'/TicTacToe/JS/Game.js',
	'/TicTacToe/JS/app.js',
];

self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				// Cache hit - return response
				if (response) {
					return response;
				}
				return fetch(event.request);
			}
			)
	);
});
