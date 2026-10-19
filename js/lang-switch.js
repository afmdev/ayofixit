/* El <details> del selector de idioma abre y cierra por su cuenta; aqui solo
   se le anaden las dos cosas que no trae: cerrar al pulsar fuera y con Escape. */
(() => {
	const cajas = document.querySelectorAll('.lang-switch__box');
	if (!cajas.length) return;

	const cerrarTodas = salvo => cajas.forEach(caja => {
		if (caja !== salvo) caja.open = false;
	});

	cajas.forEach(caja => caja.addEventListener('toggle', () => {
		if (caja.open) cerrarTodas(caja);
	}));

	document.addEventListener('click', evento => {
		if (!evento.target.closest('.lang-switch__box')) cerrarTodas(null);
	});

	document.addEventListener('keydown', evento => {
		if (evento.key !== 'Escape') return;
		cerrarTodas(null);
	});
})();
