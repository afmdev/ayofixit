/* El video de fondo pesa mas que el resto de la pagina junta: se pide cuando
   todo lo demas ha cargado, no antes. Hasta entonces se ve el poster. */
addEventListener('load', () => {
	const video = document.getElementById('myvideo');
	if (!video || !video.dataset.src) return;
	// Con datos limitados o ahorro de datos, el poster se queda.
	const red = navigator.connection;
	if (red && (red.saveData || /2g/.test(red.effectiveType || ''))) return;
	video.src = video.dataset.src;
	video.play().catch(() => {});
});
