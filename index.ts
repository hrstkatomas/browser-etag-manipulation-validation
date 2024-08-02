import { Hono } from "hono";
import { etag } from "hono/etag";

const app = new Hono();

app.use("/*", etag());
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = 3000;

export default {
	port: port,
	fetch: app.fetch,
};

console.log(`Server running at http://localhost:${port}`);
