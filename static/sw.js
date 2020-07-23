importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

workbox.googleAnalytics.initialize();

// CDN caches
workbox.routing.registerRoute(
	/.*(?:cdnjs\.cloudflare|code\.jquery|storage.googleapis)\.com/,
	new workbox.strategies.CacheFirst({
		cacheName: "cdn-cache",
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200],
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
				maxEntries: 30,
			}),
		],
	})
);

// Unsplash caches
workbox.routing.registerRoute(
	/.*images.unsplash\.com\/photo/,
	new workbox.strategies.CacheFirst({
		cacheName: "unsplash-cache",
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200],
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
				maxEntries: 30,
			}),
		],
	})
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
	/^https:\/\/fonts\.googleapis\.com/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: "google-fonts-stylesheets",
	})
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
	/^https:\/\/fonts\.gstatic\.com/,
	new workbox.strategies.CacheFirst({
		cacheName: "google-fonts-webfonts",
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200],
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
				maxEntries: 30,
			}),
		],
	})
);

// Cache static resources.
workbox.routing.registerRoute(
	/\.(?:js|css)$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: "static-resources",
	})
);
workbox.routing.registerRoute(
	/.+\/$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: "static-resources",
	})
);

// Cache image files.
workbox.routing.registerRoute(
	/\.(?:png|jpg|jpeg|svg|gif)$/,
	new workbox.strategies.CacheFirst({
		cacheName: "image-cache",
		plugins: [
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
				maxEntries: 60,
			}),
		],
	})
);
