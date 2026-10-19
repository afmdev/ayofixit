import assert from "node:assert";
import worker from "./src/index.js";

const env = { ASSETS: { fetch: () => new Response("asset") } };
const hit = (u) => worker.fetch(new Request(u), env);

const r = await hit("https://ayofixit.com/services/");
assert.equal(r.status, 301);
assert.equal(r.headers.get("location"), "https://www.ayofixit.com/services/");
assert.equal((await hit("https://www.ayofixit.com/")).status, 200);
assert.equal((await hit("https://ayofixit.crixto-050.workers.dev/")).status, 200);
console.log("ok");
