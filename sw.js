var CACHE_NAME = 'tik-tak-toe';
var urlsToCache = [
	'/TikTakToe/',
	'/TikTakToe/index.html',
	'/TikTakToe/CSS/app.css',
	'/TikTakToe/sw.js',
	'/TikTakToe/JS/Dispatcher.js',
	'/TikTakToe/JS/Game.js',
	'/TikTakToe/JS/app.css',
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
