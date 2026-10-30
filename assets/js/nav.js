/* Мобильное меню и адаптивная шапка сайта АО «НОВЭЛ». */
(function () {
  'use strict';

  // 1. Мобильное меню (бургер)
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('mobileMenu');

  function openMenu() {
    if (!menu || !burger) return;
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-menu-open');
  }

  function closeMenu() {
    if (!menu || !burger) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-menu-open');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980 && !menu.hidden) closeMenu();
    });
  }

  // 2. Скролл шапки:
  // При скролле вниз — появляется.
  // При скролле вверх — скрывается («уезжает»).
  // В самом верху страницы — возвращается в исходное статическое положение.
  var hdr = document.querySelector('.hdr');
  if (!hdr) return;

  var lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  var SCROLL_THRESHOLD = 70;
  var ticking = false;

  // Создаем плейсхолдер для предотвращения скачка верстки при fixed-позиционировании
  var placeholder = document.createElement('div');
  placeholder.className = 'hdr-placeholder';
  hdr.parentNode.insertBefore(placeholder, hdr);

  function updateHeader() {
    if (document.body.classList.contains('is-menu-open')) {
      ticking = false;
      return;
    }

    var currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (currentScrollY < 0) currentScrollY = 0;

    var delta = currentScrollY - lastScrollY;

    if (currentScrollY <= 20) {
      // Вернулись на самый верх
      hdr.classList.remove('hdr--fixed', 'hdr--visible', 'hdr--hidden');
      placeholder.classList.remove('is-active');
    } else if (currentScrollY > SCROLL_THRESHOLD) {
      if (!hdr.classList.contains('hdr--fixed')) {
        hdr.classList.add('hdr--fixed');
        placeholder.classList.add('is-active');
      }

      if (delta > 3) {
        // Листаем вниз — шапка появляется
        hdr.classList.add('hdr--visible');
        hdr.classList.remove('hdr--hidden');
      } else if (delta < -3) {
        // Листаем вверх — шапка скрывается (уезжает)
        hdr.classList.add('hdr--hidden');
        hdr.classList.remove('hdr--visible');
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

})();
