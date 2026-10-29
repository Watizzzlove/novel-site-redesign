/* НОВЭЛ — главная: модальное окно заявки, просмотр благодарственных писем. */
(function () {
  'use strict';

  var lastFocused = null;

  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
  }

  function restoreFocus() {
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  /* ---------- заявка ---------- */
  var modal = document.getElementById('modal');

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    lockScroll();
    var first = modal.querySelector('input, textarea') || modal.querySelector('button');
    if (first) first.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    unlockScroll();
    restoreFocus();
  }

  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  /* ---------- письмо ---------- */
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightboxImg');
  var boxCap = document.getElementById('lightboxCap');

  function openLetter(trigger) {
    if (!box || !boxImg) return;
    lastFocused = trigger;
    boxImg.src = trigger.getAttribute('data-lightbox');
    if (boxCap) boxCap.textContent = trigger.getAttribute('data-caption') || '';
    box.hidden = false;
    lockScroll();
    var close = box.querySelector('.lightbox__close');
    if (close) close.focus();
  }

  function closeLetter() {
    if (!box) return;
    box.hidden = true;
    boxImg.src = '';
    unlockScroll();
    restoreFocus();
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openLetter(trigger);
    });
  });

  document.querySelectorAll('[data-lightbox-close]').forEach(function (btn) {
    btn.addEventListener('click', closeLetter);
  });

  /* ---------- Esc ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (box && !box.hidden) closeLetter();
    else if (modal && !modal.hidden) closeModal();
  });

  /* ---------- отправка формы ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submit = form.querySelector('button[type="submit"]');
      var label = submit.querySelector('span');
      var original = label ? label.textContent : '';

      if (label) label.textContent = 'Заявка отправлена';
      submit.disabled = true;

      window.setTimeout(function () {
        form.reset();
        submit.disabled = false;
        if (label) label.textContent = original;
        closeModal();
      }, 1800);
    });
  }
})();
