
const 
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	burger = document.querySelector('.header__burger'),
	header = document.querySelector('.header');

function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveID = (typeof arg == 'object') ? (arg['saveID']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				if(popup.classList.contains('popup')) {

					popup.style.display = 'flex';

					body.classList.remove('_popup-active');
					html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
					body.classList.add('_popup-active');

					if (saveID) history.pushState('', "", id);

					setTimeout(() => {
						if (!initStart) {
							popup.classList.add('_active');
							function openFunc() {
								popupCheck = true;
								popup.removeEventListener('transitionend', openFunc);
							}
							popup.addEventListener('transitionend', openFunc)
						} else {
							popup.classList.add('_transition-none');
							popup.classList.add('_active');
							popupCheck = true;
						}

						/* if(popup.classList.contains('stories-popup')) {
							setTimeout(() => {
								const video = popup.querySelector('.splide__slide.is-active .stories-popup__video'),
								loader = popup.querySelector('.splide__slide.is-active .stories-popup__loader');
					
								video.parentElement.style.width = video.offsetWidth + 'px';
					
								video.addEventListener('loadeddata', function () {
									video.parentElement.style.removeProperty('width');
									setTimeout(() => {
										loader.classList.remove('is-active');
										setTimeout(() => {
											if(video.closest('.splide__slide.is-active')) {
												video.classList.add('is-playing');
												video.play();
											}
										},300)
									},1000)
								});
					
								loader.classList.add('is-active');
								
								video.load();
							},0)
						} */

					}, 0)
				}

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveID) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.style.display = 'none';

					if(popup.classList.contains('stories-popup')) {
						const video = popup.querySelector('.splide__slide.is-active .stories-popup__video'),
						image = popup.querySelector('.splide__slide.is-active .stories-popup__image');

						if(video) {
							setTimeout(() => {
								video.pause();
								video.classList.remove('is-playing');
								video.currentTime = 0;
							},200)
						} else if(image) {
							const imageProgressBar = image.querySelector('.stories-popup__image-progress');
							imageProgressBar.style.removeProperty('--transition');
							imageProgressBar.style.setProperty('--progress', '0%');
							clearInterval(imageSliderInterval);
							clearTimeout(imageSliderTimeout);
						}
						
					}
				}

				setTimeout(() => {
					closeFunc()
				},300)
				

			}, 50)

		}
	}

	return {

		open: function (id) {
			open(id);

		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			body.addEventListener('keyup', function (event) {

				if(event.code == 27 && document.querySelector('.popup._active')) {
					close(document.querySelector('.popup._active'));
				}

			});

			if (saveID) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup();

popup.init();


const cartCount = document.querySelectorAll('.cart-count');

function checkProductsLength() {
	if(document.querySelectorAll('.cart-popup__item').length >= 1) {
		cartCount.forEach(cartCountItem => {
			cartCountItem.setAttribute('data-counter', document.querySelectorAll('.cart-popup__item').length);
		})
	} else {
		cartCount.forEach(cartCountItem => {
			cartCountItem.removeAttribute('data-counter');
		})
	}
}

function updatePrice() {

	const prices = document.querySelectorAll('[data-price]'),
	addPrices = document.querySelectorAll('[data-add-price]'),
	resultPriceInput = document.querySelectorAll('[data-result-price-input]'),
	resultPriceSum = document.querySelectorAll('[data-result-price-sum]'),
	resultPrice = document.querySelectorAll('[data-result-price]');

	let result = 0, resultAdd = 0;

	prices.forEach(price => {
		if(price.value > 0) {
			result += Number(price.dataset.price) * price.value;
		}
	})

	addPrices.forEach(price => {
		if(prices.length) resultAdd += Number(price.dataset.addPrice);
	})

	resultPrice.forEach(resultPrice => {
		resultPrice.textContent = (resultAdd + result).toLocaleString() + ' ' + resultPrice.dataset.resultCurrency;
	})
	
	resultPriceInput.forEach(resultPriceInput => {
		resultPriceInput.value = result + resultAdd;
	})

	resultPriceSum.forEach(resultPriceSum => {
		resultPriceSum.textContent = result.toLocaleString() + ' ' + resultPriceSum.dataset.resultCurrency;
	})

	checkProductsLength();
	
}

setTimeout(() => {
	updatePrice()
},0)

const productLengthInput = document.querySelectorAll('.product-length__input');
productLengthInput.forEach(input => {
	input.addEventListener('blur', function (event) {
		setTimeout(() => {
			updatePrice();
		},0)
	})
})

// =-=-=-=-=-=-=-=-=-=- <image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-

const imageAspectRatio = document.querySelectorAll('.image-aspect-ratio, figure');
imageAspectRatio.forEach(imageAspectRatio => {
	const img = imageAspectRatio.querySelector('img'), style = getComputedStyle(imageAspectRatio);
	if(img) {
		if(img.getAttribute('width') && img.getAttribute('height') && style.position == "relative")
		imageAspectRatio.style.setProperty('--padding-aspect-ratio', Number(img.getAttribute('height')) / Number(img.getAttribute('width')) * 100 + '%');
	}
	
})

// =-=-=-=-=-=-=-=-=-=- </image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-


// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

let rangeArray = [];

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger') || $('.header__nav--background')) {
		menu.forEach(element => {
			element.classList.toggle('_mob-menu-active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-

	

	// =-=-=-=-=-=-=-=-=-=-=-=- <header-language> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerLangTarget = $(".header__lang--target")
	if(headerLangTarget) {
	
		headerLangTarget.classList.toggle('is-active')
	
	} else if(!$('.header__lang') && document.querySelector('.header__lang--target.is-active')) {
		document.querySelector('.header__lang--target.is-active').classList.remove('is-active')
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-language> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <footer-language> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const footerLangTarget = $(".footer__lang--target")
	if(footerLangTarget) {
	
		footerLangTarget.classList.toggle('is-active')
	
	} else if(!$('.footer__lang') && document.querySelector('.footer__lang--target.is-active')) {
		document.querySelector('.footer__lang--target.is-active').classList.remove('is-active')
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </footer-language> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <products-filter-group-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const productsFilterGroupTarget = $(".products-filter__group-target")
	if(productsFilterGroupTarget) {
	
		const parent = productsFilterGroupTarget.parentElement,
		block = parent.querySelector('.products-filter__group-block > div');

		parent.classList.toggle('is-active');
		
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </products-filter-group-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <products-filter> -=-=-=-=-=-=-=-=-=-=-=-=

	const productsFilterOpen = $(".products__open-filter")
	if(productsFilterOpen) {
	
		document.querySelector('.products-filter').classList.add('is-active');
		body.classList.add('is-overflow-hidden');
	
	}
	
	const productsFilterClose = $(".products-filter__close")
	if(productsFilterClose) {
	
		document.querySelector('.products-filter').classList.remove('is-active');
		body.classList.remove('is-overflow-hidden');
	
	}

	const productsFilterBackground = $(".products-filter__background")
	if(productsFilterBackground) {
	
		document.querySelector('.products-filter').classList.remove('is-active');
		body.classList.remove('is-overflow-hidden');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </products-filter> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <product-info-item-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const productInfoItemTarget = $(".product__info-item--target")
	if(productInfoItemTarget) {
	
		productInfoItemTarget.parentElement.classList.toggle('is-active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </product-info-item-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <blog-categories> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const blogOpenCategories = $(".blog__open-categories")
	if(blogOpenCategories) {
	
		blogOpenCategories.classList.toggle('is-active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </blog-categories> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <account-history-orders> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const accountHistoryOrdersItemHeader = $(".account-history-orders__item-header")
	if(accountHistoryOrdersItemHeader) {
	
		accountHistoryOrdersItemHeader.classList.toggle('is-active')
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </account-history-orders> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <cart> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const cartItemLengthBtn = $(".product-length__btn")
	if(cartItemLengthBtn) {

		const input = cartItemLengthBtn.parentElement.querySelector('input');
	
		if(cartItemLengthBtn.classList.contains('to-minus')) {
			if(input.value <= 1) {
				input.value = input.getAttribute('min');
			} else {
				input.value--;
			}
		}

		if(cartItemLengthBtn.classList.contains('to-plus')) {
			input.value++
		}

		updatePrice();
	
	}

	const cartItemRemove = $(".cart-item__remove")
	if(cartItemRemove) {

		const cart = cartItemRemove.closest('.cart-item');
		cart.classList.add('is-removing');
		setTimeout(() => {
			cart.remove();

			setTimeout(() => {
				updatePrice();
			},0)
		},400)
	
	}

	const checkoutCartItemRemove = $(".checkout-cart__item--remove")
	if(checkoutCartItemRemove) {
	
		const item = checkoutCartItemRemove.closest('.checkout-cart__item');
		item.classList.add('is-removing');
		if(item) {
			setTimeout(() => {
				item.remove()
				setTimeout(() => {
					updatePrice();
				},0)
			},300)
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </cart> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <favorite-btn> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const favoriteBtn = $(".favorite-btn")
	if(favoriteBtn) {
	
		favoriteBtn.classList.toggle('is-active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </favorite-btn> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <cookies> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const cookiesAgree = $(".cookies-agree")
	if(cookiesAgree) {
	
		const cookies = cookiesAgree.closest('.cookies');
		cookies.classList.add('fade-out');

		setTimeout(() => {
			cookies.remove();
			localStorage.setItem('twins-cookies', "true")
		},400)
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </cookies> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <account-favorited> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const accountFavoritedRemove = $(".account-favorited__remove")
	if(accountFavoritedRemove) {
	
		const accountFavoritedItem = accountFavoritedRemove.closest('.account-favorited__item');
		accountFavoritedItem.classList.add('is-removing');

		setTimeout(() => {
			accountFavoritedItem.remove();
		},500)
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </account-favorited> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <checkout> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const checkoutAddItemTarget = $(".checkout__add-item--target")
	if(checkoutAddItemTarget) {
	
		checkoutAddItemTarget.classList.toggle('is-active')
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </checkout> -=-=-=-=-=-=-=-=-=-=-=-=


})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let windowSize = 0;

const heroProductBackground = document.querySelector('.hero__product--background'),
aboutCompanyBackground = document.querySelector('.about-company__background');

function resize() {

	if(heroProductBackground) heroProductBackground.style.setProperty('--height', heroProductBackground.offsetHeight + 'px');
	if(aboutCompanyBackground) aboutCompanyBackground.style.setProperty('--height', aboutCompanyBackground.offsetHeight + 'px');

	html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
	if(windowSize != window.innerWidth) {
		html.style.setProperty("--svh", window.innerHeight * 0.01 + "px");
	}
	
	windowSize = window.innerWidth;
	
}

resize();

window.addEventListener('resize', resize)

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

document.querySelectorAll('.hero__slider').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		type: "fade",
		perPage: 1,
		rewind: true,
		speed: 700,
		easing: "ease",

		breakpoints: {
			
		}

	});

	slider.mount();

})

document.querySelectorAll('.blog-section__slider').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		perPage: 1,
		perMove: 1,
		speed: 700,
		easing: "ease",
		gap: 15,
		mediaQuery: "min",

		arrows: false,
		drag: false,

		breakpoints: {

			550: {
				perPage: 2,
			},

			992: {
				perPage: 3,
			},
	
		}

	});

	slider.on('mounted resize', function (event) {
		slider.root.classList.remove('is-active-drag')
		if(windowSize >= 992) {
			if(slider.length > 3) {
				slider.options.drag = true;
				slider.root.classList.add('is-active-drag')
			}
		} else if(windowSize >= 550) {
			if(slider.length > 2) {
				slider.options.drag = true;
				slider.root.classList.add('is-active-drag')
			}
		} else {
			if(slider.length > 1) {
				slider.options.drag = true;
				slider.root.classList.add('is-active-drag')
			}
		}

		
	})

	slider.mount();

})

document.querySelectorAll('.hero__product--background-marquee').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		type: "loop",
		direction: "ttb",
		autoHeight:true,
		height: "100%",
		arrows: false,
		pagination: false,
		autoScroll: {
			speed: sliderElement.dataset.direction == "prev" ? 1 : -1,
		},
		breakpoints: {
			550: {
				autoScroll: {
					speed: sliderElement.dataset.direction == "prev" ? 0.5 : -0.5,
				},
			}
		}

	});

	if(heroProductBackground) heroProductBackground.style.setProperty('--height', heroProductBackground.offsetHeight + 'px');

	slider.mount(window.splide.Extensions);

})

document.querySelectorAll('.stories__slider').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		gap: 15,
		autoWidth: true,
		arrows: false,
		pagination: false,
		speed: 500,
		easing: "ease",
		mediaQuery: "min",

		breakpoints: {
			992: {
				destroy: true
			}
		}

	});

	slider.mount();

})

document.querySelectorAll('.product__gallery').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		type: "fade",
		perPage: 1,
		speed: 700,
		easing: "ease",

		arrows: false,
		pagination: false,

	});

	const paginationSlides = sliderElement.parentElement.querySelector('.product__gallery-pagination--slide');

	const sliderPagination = new Splide(sliderElement.parentElement.querySelector('.product__gallery-pagination'), {

		perPage: 4,
		drag: paginationSlides.length > 4 ? false : true,

		gap: 10,
		speed: 500,
		easing: "ease",
		mediaQuery: "min",

		isNavigation: true,
		arrows: true,
		pagination: false,

		breakpoints: {
			992: {
				gap: 18,
				perPage: 5,
				drag: paginationSlides.length > 5 ? false : true,
			},
		}

	});

	slider.sync(sliderPagination);
	slider.mount();
	sliderPagination.mount();

})

document.querySelectorAll('.similar-products__slider').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		type: "loop",
		perPage: 4,
		speed: 700,
		perMove: 1,
		easing: "ease",
		gap: 20,
		pagination: false,

		breakpoints: {
			1400: {
				perPage: 3,
			},

			992: {
				perPage: 2,
			},

			550: {
				gap: 5,
			}
		}

	});

	slider.mount();

})

function updateProgressBar(bar, video) {
	const currentTime = video.currentTime;
	const duration = video.duration;
	const progress = (currentTime / duration) * 100;
	
	bar.style.setProperty('--progress', progress + "%");
}

function playVideo(video) {
	video.play();
}

let imageSliderTimeout, imageSliderInterval, imageProgress = 0;

document.querySelectorAll('.stories-popup__slider').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		autoWidth: true,
		
		pagination: false,
		speed: 1000,
		easing: "ease",
		updateOnMove: true,

	});

	const storiesPopupVolume = slider.root.closest('.popup').querySelector('.stories-popup__volume');
	storiesPopupVolume.addEventListener('click', function (event) {

		if(!storiesPopupVolume.classList.contains('is-muted')) {
			localStorage.setItem('twins-stories-muted', true);
			storiesPopupVolume.classList.add('is-muted');
			storiesPopupVolume.querySelector('use').setAttribute('xlink:href', storiesPopupVolume.dataset.volumeNoneIcon);
		} else {
			localStorage.setItem('twins-stories-muted', false);
			storiesPopupVolume.classList.remove('is-muted');
			storiesPopupVolume.querySelector('use').setAttribute('xlink:href', storiesPopupVolume.dataset.volumeActiveIcon);
		}

		slides.forEach(slide => {
			const video = slide.querySelector('video');
			if(video) video.muted = !video.muted;
		})
	})

	const slides = slider.root.querySelectorAll('.splide__slide');

	slider.root.querySelectorAll('.stories-popup__video').forEach((video, index) => {

		let currentTimeVal = 0;

		video.addEventListener('ended', function (event) {
			setTimeout(() => {
				slider.go('>');
			},200)
		})
		
		const progress = video.closest('.splide__slide').querySelector('.stories-popup__video-progress');
		setInterval(() => {
			video.addEventListener("timeupdate", updateProgressBar(progress, video));
		},500)
		
		video.addEventListener('click', function () {
			
			//slider.go(index);

			if(video.classList.contains('is-playing')) {
				video.classList.remove('is-playing');
				currentTimeVal = video.currentTime;
				video.pause()
			} else {
				video.classList.add('is-playing');
				video.currentTime = currentTimeVal;
				video.play()
			}
		})

		if(localStorage.getItem('twins-stories-muted') == "true") {
			video.muted = true;
			storiesPopupVolume.classList.add('is-muted');
			storiesPopupVolume.querySelector('use').setAttribute('xlink:href', storiesPopupVolume.dataset.volumeNoneIcon);
		}
		
	})

	slider.root.querySelectorAll('.stories-popup__image').forEach((image, index) => {
		
		const imageProgressBar = image.closest('.splide__slide').querySelector('.stories-popup__image-progress'),
		timeout = Number(image.closest('.splide__slide').dataset.timeout);
		
		image.addEventListener('click', function () {
			
			slider.go(index);

			if(image.classList.contains('is-playing')) {
				image.classList.remove('is-playing');
				clearInterval(imageSliderInterval);
				clearTimeout(imageSliderTimeout);
				
			} else {
				image.classList.add('is-playing');

				imageSliderInterval = setInterval(() => {
					imageProgressBar.style.setProperty('--progress', `${Math.min(100, imageProgress++)}%`);	
					if(imageProgress >= 100) {
						slider.go('>');
						clearInterval(imageSliderInterval)
					}
				}, timeout / 125)
			}
		})

		if(localStorage.getItem('twins-stories-muted') == "true") {
			video.muted = true;
			storiesPopupVolume.classList.add('is-muted');
			storiesPopupVolume.querySelector('use').setAttribute('xlink:href', storiesPopupVolume.dataset.volumeNoneIcon);
		}
		
	})

	slider.on('move', function (newIndex, prevIndex, destIndex) {
		if(slider.root.closest('.popup._active')) {
			const video = slides[prevIndex].querySelector('.stories-popup__video'),
			image = slides[prevIndex].querySelector('.stories-popup__image');
		
			if(video) {

				video.pause();
				slides[prevIndex].classList.remove('is-active-video');
				video.classList.remove('is-playing');
				video.currentTime = 0;

			} else if(image) {

				const imageProgressBar = image.querySelector('.stories-popup__image-progress');
				imageProgressBar.style.removeProperty('--transition');
				image.classList.remove('is-playing');
				clearInterval(imageSliderInterval);
				clearTimeout(imageSliderTimeout);
				imageProgressBar.style.setProperty('--progress', '0%');

			}
		}
	})

	

	slider.on('active', function (slide) {
		if(slider.root.closest('.popup._active')) {
			const video = slide.slide.querySelector('.stories-popup__video'),
			image = slide.slide.querySelector('.stories-popup__image'),
			loader = slide.slide.querySelector('.stories-popup__loader');

			if(video) {

				video.parentElement.style.width = video.offsetWidth + 'px';

				video.addEventListener('loadeddata', function () {
					video.parentElement.style.removeProperty('width');
					setTimeout(() => {
						loader.classList.remove('is-active');
						setTimeout(() => {
							if(video.closest('.splide__slide.is-active')) {
								slide.slide.classList.add('is-active-video');
								video.classList.add('is-playing');
								video.play();
							}
						},1000)
					},1000)
				});

				loader.classList.add('is-active');
				
				video.load();

			} else if(image && slide.slide.dataset.timeout) {
				const imageProgressBar = image.querySelector('.stories-popup__image-progress');
				imageProgressBar.style.setProperty('--transition', `width 0.1s linear`);
				setTimeout(() => {
					
					if(imageSliderTimeout) clearTimeout(imageSliderTimeout);
					image.classList.add('is-playing');

					imageProgress = 0;
					imageSliderInterval = setInterval(() => {
						imageProgressBar.style.setProperty('--progress', `${Math.min(100, imageProgress++)}%`);	
						if(imageProgress >= 100) {
							slider.go('>');
							clearInterval(imageSliderInterval)
						}
					}, Number(slide.slide.dataset.timeout) / 125)

				},0)
			}
		}
	})

	const storiesList = document.querySelectorAll('.stories__list');
	storiesList.forEach(list => {
		const slides = list.querySelectorAll('.stories__item--body');
		slides.forEach((slide, index) => {
			slide.setAttribute('data-index', index);
			slide.addEventListener('click', function (event) {
				setTimeout(() => {
					slider.refresh()
					slider.go(index);
				},100)
			})
		})
	})

	slider.mount();

})

document.querySelectorAll('.products-slider__body').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		type: "loop",
		perPage: 4,
		gap: 20,
		speed: 700,
		easing: "ease",
		perMove: 1,
		pagination: false,

		breakpoints: {
			1300: {
				perPage: 3
			},
			992: {
				perPage: 2,
			},

			550: {
				gap: 5,
			}
		}

	});

	slider.mount();

})

// =-=-=-=-=-=-=-=-=-=- <Get-device-type> -=-=-=-=-=-=-=-=-=-=-

const getDeviceType = () => {

	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}

	if (
		/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
		ua
		)
	) {
		return "mobile";
	}
	return "desktop";

};

// =-=-=-=-=-=-=-=-=-=- </Get-device-type> -=-=-=-=-=-=-=-=-=-=-


document.querySelectorAll('.product-card__image-gallery').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		type: "fade",
		drag: false,
		rewind: true,
		speed: 700,
		easing: "ease",
		arrows: false,
		pagination: false,
		//drag: false,
		/* autoScroll: {
			speed: 0.5,
		}, */

	});
	
	let isHovered = false;
	let autoplayTimeout;

	function startAutoplay() {
		if (!isHovered) {
			slider.go('>');
		  autoplayTimeout = setInterval(() => {
			slider.go('>');
		  }, 2000);
		}
	  }

	slider.mount();

	sliderElement.addEventListener('pointerenter', function () {
		if(getDeviceType() == "desktop") {	
			isHovered = false;
			startAutoplay();
		}
	})

	sliderElement.addEventListener('pointerleave', function () {
		if(getDeviceType() == "desktop") {
			isHovered = true;
			slider.go(0)
			clearInterval(autoplayTimeout);
		}
	})

})

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <custom-scrollbar> -=-=-=-=-=-=-=-=-=-=-=-=

document.querySelectorAll('[data-simplebar]').forEach(scrollbar => {
	new SimpleBar(scrollbar, {autoHide: false});
})

// =-=-=-=-=-=-=-=-=-=-=-=- </custom-scrollbar> -=-=-=-=-=-=-=-=-=-=-=-=

function rangeSlider() {
	document.querySelectorAll('.products-filter__range').forEach(range => {

		const minInput = range.querySelector('[data-is-min]'),
		maxInput = range.querySelector('[data-is-max]'),
		rangeElement = range.querySelector('.products-filter__range--element');

		const rangeEl = new window.JSR.JSR({
			modules: [
			  new window.JSR.ModuleLimit({
				min: Number(rangeElement.dataset.min),
				max: Number(rangeElement.dataset.max),
			  }),
			  new window.JSR.ModuleRail(),
			  new window.JSR.ModuleSlider(),
			  new window.JSR.ModuleBar(),
			  new window.JSR.ModuleLabel(),
			],
			
			config: {
				min: Number(rangeElement.dataset.min),
				max: Number(rangeElement.dataset.max),
				step: 1,
				initialValues: [Number(rangeElement.dataset.minValue), Number(rangeElement.dataset.maxValue)],
				container: document.querySelector('.products-filter__range--element div'),
			}
		});
		
		rangeEl.onValueChange(function (ValueChangeHandler) {
			if(ValueChangeHandler['index'] == 0) {
				minInput.value = ValueChangeHandler['real'];
			} else if(ValueChangeHandler['index'] == 1) {
				maxInput.value = ValueChangeHandler['real'];
			}
		})	
	})
}

rangeSlider();




// =-=-=-=-=-=-=-=-=-=-=-=- <animation> -=-=-=-=-=-=-=-=-=-=-=-=

/* AOS.init({
	disable: "mobile",
	once: true,
	//duration: 1500,
}); */

document.querySelectorAll('.leave-review__file').forEach(file => {	
	if(file.querySelector('input')) {
		file.querySelector('input').addEventListener('change', function (event) {
			let text = '';
			Array.from(event.target.files).forEach((fileEl, index) => {
				if(index != 0) {
					text = ', ' + fileEl.name;
				} else {
					text = fileEl.name;
				}
				
			})

			file.querySelector('span').querySelector('span').textContent = text;
		})
	}
})

document.querySelectorAll('.leave-review__rating--list input').forEach(input => {
	input.addEventListener('change', function (event) {
		if(input.checked) {
			const label = input.closest('label'),
			list = input.closest('.leave-review__rating--list');

			if(list.querySelector('label.is-active')) {
				list.querySelector('label.is-active').classList.remove('is-active');
			}

			label.classList.add('is-active');

		}
	})
})

// =-=-=-=-=-=-=-=-=-=-=-=- </animation> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <timer> -=-=-=-=-=-=-=-=-=-=-=-=
/*
<div class="timer" data-timer-year="" data-timer-month="" data-timer-day="" data-timer-hour="" data-timer-minute="">
	<span class="timer-days"><span class="timer-days-value"></span></d>
	<span class="timer-hours"><span class="timer-hours-value"></span></span>
	<span class="timer-minutes"><span class="timer-minutes-value"></span></span>
	<span class="timer-seconds"><span class="timer-seconds-value"></span></span>
</div>
*/

function timerSetString(result, value) {
	if(value <= 9) {
		result.innerHTML = `<span>0</span><span>${value.toString()}</span>`;
	} else {
		result.innerHTML = '';
		Array.from(value.toString().split('')).forEach(value => {
			//console.log(result)
			result.insertAdjacentHTML("beforeend", `<span>${value}</span>`);
			//console.log(result[0])
		})
	}
}

function timer() {
	const timerElems = document.querySelectorAll('.shares-timer');

	let deadline;

	timerElems.forEach(thisTimerElem => {

		let timerData = thisTimerElem.dataset.timer;
		if(timerData) timerData = timerData.split('-');
		

		deadline = new Date(

		timerData[0],
		Number(timerData[1] - 1),
		timerData[2],
		0,
		0);

		const
		//day = thisTimerElem.querySelectorAll('.shares-timer__days span'),
		hour = thisTimerElem.querySelector('.shares-timer__hours'),
		minute = thisTimerElem.querySelector('.shares-timer__minutes'),
		second = thisTimerElem.querySelector('.shares-timer__seconds');

		const diff = deadline - new Date(),
		days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0,
		//hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0,
		hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) : 0,
		minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0,
		seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

		//console.log(Math.floor(diff / 1000 / 60 / 60))
		timerSetString(hour, hours);
		timerSetString(minute, minutes);
		timerSetString(second, seconds);
		
		/* hour.textContent = hours.toString();
		minute.textContent = minutes.toString();
		second.textContent = seconds.toString(); */
		//console.log(hours.toString().split(''))

	});

}

timer();

setInterval(() => {
	timer();
},1000)

// =-=-=-=-=-=-=-=-=-=-=-=- </timer> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <datepicker> -=-=-=-=-=-=-=-=-=-=-=-=

Datepicker.locales.uk = {
    days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
	daysShort: ["Нед", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
	daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
	monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
	today: "Сьогодні",
	clear: "Очистити",
	format: "dd.mm.yyyy",
	weekStart: 1
};
  

const datesInputs = document.querySelectorAll('.date-input');
datesInputs.forEach(input => {
	const datepicker = new window.Datepicker(input, {
		language:"uk"
	  }); 
})


// =-=-=-=-=-=-=-=-=-=-=-=- </datepicker> -=-=-=-=-=-=-=-=-=-=-=-=

const cookies = document.querySelector('.cookies');

setTimeout(() => {

	if(cookies) {
		if(localStorage.getItem('twins-cookies') != "true") {
			cookies.classList.add('fade-in');
		} else {
			cookies.remove();
		}
	}
	
},3000)

document.querySelectorAll('.checkout__select--element').forEach(element => {
	const select = new SlimSelect({
		select: element,
		settings: {
			showSearch: false,
		},
		events: {
			afterChange: (newVal) => {
				Array.from(select.getData()).forEach(select => {
					
					if(select['value'] == newVal[0]['value']) {
						document.querySelector(`#${select['value']}`).classList.add('is-visible');
						//console.log(document.querySelector(`#${select['value']}`))
					} else {
						document.querySelector(`#${select['value']}`).classList.remove('is-visible');
						//console.log(document.querySelector(`#${select['value']}`))
					}
					
				})
			}
		}
	})

	//console.log(select)
})
