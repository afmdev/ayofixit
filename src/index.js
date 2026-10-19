// Las URLs inglesas vivian en la raiz antes de que el sitio fuese bilingue; la
// raiz es ahora el espanol, asi que se mandan a su sitio en /en/.
const VIEJAS = {
  "/about.html": "/en/about.html",
  "/faqs.html": "/en/faqs.html",
  "/contact.html": "/en/contact.html",
  "/services": "/en/services/",
  "/services/": "/en/services/",
  "/services/index.html": "/en/services/",
  "/services/battery-replacement.html": "/en/services/battery-replacement.html",
  "/services/computer-hardware.html": "/en/services/computer-hardware.html",
  "/services/custom-pc-builds.html": "/en/services/custom-pc-builds.html",
  "/services/laptop-screen-replacement.html": "/en/services/laptop-screen-replacement.html",
  "/services/software-troubleshooting.html": "/en/services/software-troubleshooting.html",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "ayofixit.com") {
      url.hostname = "www.ayofixit.com";
      return Response.redirect(url.toString(), 301);
    }

    const destino = VIEJAS[url.pathname];
    if (destino) {
      url.pathname = destino;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
