import assert from "node:assert";
import worker from "./src/index.js";

const env = { ASSETS: { fetch: () => new Response("asset") } };
const hit = (u) => worker.fetch(new Request(u), env);
const destino = async (u) => (await hit(u)).headers.get("location");

// el apex manda a www, conservando la ruta
const r = await hit("https://ayofixit.com/servicios/");
assert.equal(r.status, 301);
assert.equal(r.headers.get("location"), "https://www.ayofixit.com/servicios/");

// las URLs inglesas viejas van a su equivalente en /en/
assert.equal(await destino("https://www.ayofixit.com/about.html"), "https://www.ayofixit.com/en/about.html");
assert.equal(await destino("https://www.ayofixit.com/services/battery-replacement.html"),
  "https://www.ayofixit.com/en/services/battery-replacement.html");
assert.equal(await destino("https://www.ayofixit.com/services"), "https://www.ayofixit.com/en/services/");

// el espanol en la raiz y el ingles en /en/ se sirven tal cual
assert.equal((await hit("https://www.ayofixit.com/")).status, 200);
assert.equal((await hit("https://www.ayofixit.com/sobre-mi.html")).status, 200);
assert.equal((await hit("https://www.ayofixit.com/en/about.html")).status, 200);
assert.equal((await hit("https://ayofixit.crixto-050.workers.dev/")).status, 200);

console.log("ok");
