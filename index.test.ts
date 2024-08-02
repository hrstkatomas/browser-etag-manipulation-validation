import { describe, expect, it } from "bun:test";
import app from ".";

describe("Server", () => {
	it("Should return 200 Response", async () => {
		const req = new Request("http://localhost/");
		const res = await app.fetch(req);
		expect(res.status).toBe(200);
	});

	it("should return 304 for matching etag", async () => {
		const req = new Request("http://localhost/");
		const res = await app.fetch(req);
		expect(res.status).toBe(200);

		const etag = res.headers.get("etag");
		if (!etag) throw "No etag provideed by the server";

		const req2 = new Request("http://localhost/", {
			headers: {
				"if-none-match": etag,
			},
		});

		const res2 = await app.fetch(req2);
		expect(res2.status).toBe(304);
	});
});
