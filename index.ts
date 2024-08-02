import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = 3000;

export default {
	port: port,
	fetch: app.fetch,
};

console.log(`Server running at http://localhost:${port}`);
