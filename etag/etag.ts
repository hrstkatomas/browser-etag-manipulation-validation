/**
 * @module
 * ETag Middleware for Hono.
 */

import type { MiddlewareHandler } from "hono";

/**
 * Default headers to pass through on 304 responses. From the spec:
 * > The response must not contain a body and must include the headers that
 * > would have been sent in an equivalent 200 OK response: Cache-Control,
 * > Content-Location, Date, ETag, Expires, and Vary.
 */
export const RETAINED_304_HEADERS = [
	"cache-control",
	"content-location",
	"date",
	"etag",
	"expires",
	"vary",
];

function sha1(str: string): string {
	const hasher = new Bun.CryptoHasher("sha1");
	hasher.update(str);
	return hasher.digest("hex");
}

function etagMatches(etag: string, ifNoneMatch: string | null) {
	return ifNoneMatch != null && ifNoneMatch.split(/,\s*/).indexOf(etag) > -1;
}

/**
 * ETag Middleware for Hono.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use('/etag/*', etag())
 * app.get('/etag/abc', (c) => {
 *   return c.text('Hono is cool')
 * })
 * ```
 */
export const etag = (): MiddlewareHandler => {
	return async function etag(c, next) {
		const ifNoneMatch = c.req.header("If-None-Match") ?? null;

		// HACK: let's just call this "monitoring"
		console.log("Received etag", c.req.url, ifNoneMatch);

		await next();

		const res = c.res as Response;
		let etagHeader = res.headers.get("ETag");
		if (!etagHeader) etagHeader = `"${sha1((await res.clone().text()) || "")}"`;

		if (etagMatches(etagHeader, ifNoneMatch)) {
			// HACK: let's just call this "monitoring"
			console.log("Response content matches received etag - 304 not modified");

			await c.res.blob(); // Force using body
			c.res = new Response(null, {
				status: 304,
				statusText: "Not Modified",
				headers: {
					ETag: etagHeader,
				},
			});
			c.res.headers.forEach((_, key) => {
				if (RETAINED_304_HEADERS.indexOf(key.toLowerCase()) === -1) {
					c.res.headers.delete(key);
				}
			});
		} else {
			// HACK: let's just call this "monitoring"
			console.log(
				"Response content did NOT matche the etag - 200 with etag progided",
			);
			c.res.headers.set("ETag", etagHeader);
		}
	};
};
