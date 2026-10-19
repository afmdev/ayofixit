// Las URLs inglesas vivian en la raiz antes de que el sitio fuese bilingue; la
// raiz es ahora el espanol, asi que se mandan a su sitio en /en/. Los destinos
// van sin extension para no encadenar un 301 con el 307 de auto-trailing-slash.
const VIEJAS = {
  "/about.html": "/en/about",
  "/about": "/en/about",
  "/faqs.html": "/en/faqs",
  "/faqs": "/en/faqs",
  "/contact.html": "/en/contact",
  "/contact": "/en/contact",
  "/services": "/en/services/",
  "/services/": "/en/services/",
  "/services/index.html": "/en/services/",
  "/services/battery-replacement.html": "/en/services/battery-replacement",
  "/services/battery-replacement": "/en/services/battery-replacement",
  "/services/computer-hardware.html": "/en/services/computer-hardware",
  "/services/computer-hardware": "/en/services/computer-hardware",
  "/services/custom-pc-builds.html": "/en/services/custom-pc-builds",
  "/services/custom-pc-builds": "/en/services/custom-pc-builds",
  "/services/laptop-screen-replacement.html": "/en/services/laptop-screen-replacement",
  "/services/laptop-screen-replacement": "/en/services/laptop-screen-replacement",
  "/services/software-troubleshooting.html": "/en/services/software-troubleshooting",
  "/services/software-troubleshooting": "/en/services/software-troubleshooting",
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
