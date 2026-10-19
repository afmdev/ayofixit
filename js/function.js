(function ($) {
    "use strict";
	
	var $window = $(window);

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$window.on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}	
	
	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	/* El boton que genera slicknav es un <a> sin texto: sin esto, un lector de
	   pantalla solo anuncia "enlace". */
	$('.slicknav_btn').attr('aria-label',
		document.documentElement.lang === 'es' ? 'Abrir el menu' : 'Open the menu');

	/* testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 1000,
			spaceBetween: 80,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.testimonial-btn-next',
				prevEl: '.testimonial-btn-prev',
			},
			breakpoints: {
				768:{
					slidesPerView: 1,
				},
				991:{
					slidesPerView: 2,
				}
			}
		});
	}

	/* Init Counter: cuenta al entrar en pantalla, sin waypoints (forzaba reflow) */
	document.querySelectorAll('.counter').forEach(function (el) {
		var text = el.textContent.trim();
		var target = parseFloat(text);
		if (isNaN(target)) return;
		var decimals = (text.split('.')[1] || '').length;
		var io = new IntersectionObserver(function (entries) {
			if (!entries[0].isIntersecting) return;
			io.disconnect();
			var start = performance.now();
			(function step(now) {
				var progress = Math.min((now - start) / 3000, 1);
				el.textContent = (target * progress).toFixed(decimals);
				if (progress < 1) requestAnimationFrame(step);
			})(start);
		});
		io.observe(el);
	});

	/* Scroll effects: Lenis inertia, headings and images driven by scroll position */
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		/* .reveal starts hidden in css, so make it visible when we skip the animation */
		gsap.set('.reveal', { visibility: 'visible' });
	} else {
		gsap.registerPlugin(ScrollTrigger, SplitText);

		var lenis = new Lenis({ duration: 2, smoothWheel: true });
		window.lenis = lenis;
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
		gsap.ticker.lagSmoothing(0);

		/* Headings: characters go from dim to solid as the page scrolls past them */
		function textReveal() {
			document.querySelectorAll('h1, h2').forEach(function (el) {
				if (el.closest('header, footer, nav')) return;

				SplitText.create(el, {
					type: 'lines,words,chars',
					linesClass: 'split-line',
					autoSplit: true,
					onSplit: function (self) {
						gsap.set(self.chars, { opacity: 0.3, x: -7 });
						return gsap.to(self.chars, {
							scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 60%', scrub: 1 },
							x: 0,
							opacity: 1,
							duration: 0.7,
							stagger: 0.02,
						});
					}
				});
			});
		}

		/* Images: lateral wipe with a touch of zoom on the way in */
		function imageReveal() {
			document.querySelectorAll('.reveal').forEach(function (box) {
				var img = box.querySelector('img');
				if (!img) return;
				gsap.set(box, { visibility: 'visible' });
				gsap.set(img, { clipPath: 'inset(0 100% 0 0)', scale: 1.12 });
				gsap.to(img, {
					scrollTrigger: { trigger: box, start: 'top 88%', toggleActions: 'play none none none' },
					clipPath: 'inset(0 0% 0 0)',
					scale: 1,
					duration: 1.1,
					ease: 'power2.out',
					/* hand the image back to css so hover effects keep working */
					onComplete: function () { gsap.set(img, { clearProps: 'transform,clipPath,scale' }); }
				});
			});
		}

		/* Section entrances: the theme tags them .wow, we animate them here so
		   every scroll effect runs off the same ScrollTrigger */
		gsap.utils.toArray('.wow').forEach(function (el) {
			/* set + to, never from: a from() tween re-applies its hidden start
			   state on every ScrollTrigger refresh and strands the element */
			gsap.set(el, { y: 40, autoAlpha: 0 });
			gsap.to(el, {
				scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
				y: 0,
				autoAlpha: 1,
				duration: 0.8,
				ease: 'power2.out',
				delay: parseFloat(el.dataset.wowDelay) || 0,
			});
		});

		/* SplitText measures wrong while webfonts are still loading */
		(document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
			textReveal();
			imageReveal();
			ScrollTrigger.refresh();
		});
	}

	/* Hero background video: ios blocks autoplay in low power mode and after a
	   bfcache restore, so keep asking until it plays */
	var heroVideo = document.getElementById('myvideo');
	if (heroVideo) {
		function playHeroVideo() {
			var attempt = heroVideo.play();
			if (attempt) { attempt.catch(function () {}); }
		}
		playHeroVideo();
		heroVideo.addEventListener('pause', playHeroVideo);
		document.addEventListener('visibilitychange', function () {
			if (!document.hidden) { playHeroVideo(); }
		});
		['touchstart', 'click'].forEach(function (evt) {
			document.addEventListener(evt, playHeroVideo, { once: true, passive: true });
		});
	}


})(jQuery);