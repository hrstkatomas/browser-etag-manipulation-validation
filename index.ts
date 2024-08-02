import { Hono } from "hono";
import { etag } from "./etag/etag.ts";

const app = new Hono();

app.get("/", async (c) => {
	return c.html(await Bun.file("./app/index.html").text());
});

app.use("/resource", etag());
app.get("/resource", (c) => {
	return c.text("Hello there!");
});

const port = 3000;

export default {
	port: port,
	fetch: app.fetch,
};

console.log(`Server running at http://localhost:${port}`);
