/* Транспортный калькулятор — АО «НОВЭЛ».
   Данные позиций — с сайта завода (zaonovel.ru): масса и объём упаковки. */
(function () {
  'use strict';

  var PRODUCTS = [
    { id: 'kev-21', category: 'thermal', categoryName: 'Тепловое', sub: 'kev',
      name: 'Электрокалорифер КЭВ-21', image: 'assets/img/prod-kev.png',
      power: '21 кВт', voltage: '380 В', dims: '400×920×430 мм', weight: 30, volume: 0.158 },

    { id: 'kev-30', category: 'thermal', categoryName: 'Тепловое', sub: 'kev',
      name: 'Электрокалорифер КЭВ-30', image: 'assets/img/prod-kev.png',
      power: '30 кВт', voltage: '380 В', dims: '460×1020×470 мм', weight: 38, volume: 0.220 },

    { id: 'pet-2', category: 'thermal', categoryName: 'Тепловое', sub: 'pet',
      name: 'Обогреватель ПЭТ-2 (380 В)', image: 'assets/img/prod-pet.png',
      power: '1 кВт', voltage: '380 В', dims: '623×150×150 мм', weight: 3.5, volume: 0.014 },

    { id: 'pet-4', category: 'thermal', categoryName: 'Тепловое', sub: 'pet',
      name: 'Обогреватель ПЭТ-4 со шнуром', image: 'assets/img/prod-pet.png',
      power: '1 кВт', voltage: '220 В', dims: '623×150×150 мм', weight: 3.5, volume: 0.014 },

    { id: 'evus', category: 'thermal', categoryName: 'Тепловое', sub: 'conv',
      name: 'Конвектор плинтусный ЭВУС', image: 'assets/img/prod-konvektor.png',
      power: '1.5 кВт', voltage: '220 В', dims: '1000×140×80 мм', weight: 4.2, volume: 0.018 },

    { id: 'tp-5', category: 'welding', categoryName: 'Сварочное', sub: 'tp',
      name: 'Термопенал ТП 5/150-220', image: 'assets/img/prod-tp5.png',
      power: '0.3 кВт', voltage: '220 В', dims: '110×590×110 мм', weight: 2.6, volume: 0.007,
      capacity: '5 кг' },

    { id: 'tp-10', category: 'welding', categoryName: 'Сварочное', sub: 'tp',
      name: 'Термопенал ТП 10/150-220', image: 'assets/img/prod-tp10.png',
      power: '0.6 кВт', voltage: '220 В', dims: '150×615×150 мм', weight: 5, volume: 0.014,
      capacity: '10 кг' },

    { id: 'tpk-5', category: 'welding', categoryName: 'Сварочное', sub: 'tp',
      name: 'Термопенал ТПК 5/150-220', image: 'assets/img/prod-tpk.png',
      power: '0.3 кВт', voltage: '220 В', dims: '155×550×110 мм', weight: 3, volume: 0.009,
      capacity: '5 кг' },

    { id: 'ove-4', category: 'explosion', categoryName: 'Взрывозащита', sub: 'ove',
      name: 'Обогреватель ОВЭ-4', image: 'assets/img/prod-ove.png',
      power: '1.8 кВт', voltage: '380 В', dims: '175×175×1420 мм', weight: 17, volume: 0.043 },

    { id: 'tenbv-5z', category: 'explosion', categoryName: 'Взрывозащита', sub: 'tenbv',
      name: 'Блок ТЭНБВ 5Z-220', image: 'assets/img/prod-tenbv.png',
      power: '5 кВт', voltage: '220 В', dims: '500×265×245 мм', weight: 15, volume: 0.032,
      capacity: '1 шт.' }
  ];

  var cart = {};
  var selCats = {};   /* категории, выбранные целиком */
  var selSubs = {};   /* подкатегории, выбранные по одной */
  var filterSearch = '';

  var listEl = document.getElementById('calcItemsGrid');
  if (!listEl) return;

  var searchEl = document.getElementById('calcSearch');
  var filtersEl = document.getElementById('calcFilters');
  var filtersBox = document.getElementById('filters');
  var filtersToggle = document.getElementById('filtersToggle');
  var clearBtn = document.getElementById('calcClearBtn');
  var totalWeightEl = document.getElementById('totalWeight');
  var totalVolumeEl = document.getElementById('totalVolume');
  var selectedListEl = document.getElementById('selectedList');
  var selectedCountEl = document.getElementById('selectedCount');
  var messageEl = document.getElementById('calcMessage');
  var ctaEl = document.getElementById('csumCta');

  /* мобильные элементы */
  var sideEl = document.getElementById('calcSide');
  var fabEl = document.getElementById('calcFab');
  var backdropEl = document.getElementById('calcBackdrop');
  var barEl = document.getElementById('calcBar');
  var barWeightEl = document.getElementById('barWeight');
  var barVolumeEl = document.getElementById('barVolume');
  var barCountEl = document.getElementById('barCount');
  var barThumbsEl = document.getElementById('barThumbs');

  function isMobile() {
    return window.matchMedia('(max-width: 980px)').matches;
  }

  /* ---------- утилиты ---------- */
  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function fmtWeight(n) {
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
  }

  function fmtVolume(n) {
    return n.toLocaleString('ru-RU', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- каталог ---------- */
  function renderList() {
    var anyFilter = hasFilters();
    var items = PRODUCTS.filter(function (p) {
      var okFilter = !anyFilter || selCats[p.category] || selSubs[p.sub];
      var okSearch = !filterSearch ||
        p.name.toLowerCase().indexOf(filterSearch) > -1 ||
        p.categoryName.toLowerCase().indexOf(filterSearch) > -1;
      return okFilter && okSearch;
    });

    if (!items.length) {
      listEl.innerHTML =
        '<p class="calc__empty">Ничего не нашлось. <button type="button" class="chip" data-reset="1">Сбросить фильтры</button></p>';
      return;
    }

    listEl.innerHTML = items.map(function (p) {
      var qty = cart[p.id] || 0;
      var isIn = qty > 0;
      var specs = [
        '<li><span>Мощность</span><b>' + esc(p.power) + '</b></li>',
        '<li><span>Сеть</span><b>' + esc(p.voltage) + '</b></li>'
      ];
      if (p.capacity) {
        specs.push('<li><span>' + (p.category === 'welding' ? 'Электроды' : 'ТЭНов') + '</span><b>' + esc(p.capacity) + '</b></li>');
      }
      specs.push('<li><span>Габариты</span><b>' + esc(p.dims) + '</b></li>');

      return '' +
        '<article class="pcard' + (isIn ? ' is-in' : '') + '" data-id="' + p.id + '">' +
          '<div class="pcard__media">' +
            '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy">' +
          '</div>' +
          '<div class="pcard__body">' +
            '<span class="pcard__cat">' + esc(p.categoryName) + '</span>' +
            '<h3 class="pcard__name">' + esc(p.name) + '</h3>' +
            '<ul class="pcard__specs">' +
              specs.join('') +
            '</ul>' +
          '</div>' +
          '<div class="pcard__foot">' +
            '<p class="pcard__mass"><b>' + fmtWeight(p.weight) + ' кг</b> · ' + fmtVolume(p.volume) + ' м³</p>' +
            '<div class="pcard__ctrl">' +
              '<div class="stepper">' +
                '<button type="button" data-act="dec" aria-label="Меньше">−</button>' +
                '<input type="number" min="1" max="999" value="' + (isIn ? qty : 1) + '" aria-label="Количество">' +
                '<button type="button" data-act="inc" aria-label="Больше">+</button>' +
              '</div>' +
              '<button type="button" class="pcard__add" data-act="toggle"' +
                (isIn ? ' title="Убрать из расчёта"' : '') + '>' +
                (isIn ? 'В расчёте · ' + qty : 'Добавить') +
              '</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  /* ---------- сводка ---------- */
  function totals() {
    var weight = 0, volume = 0, count = 0, positions = 0;
    Object.keys(cart).forEach(function (id) {
      var p = byId(id);
      if (!p) return;
      var qty = cart[id];
      weight += p.weight * qty;
      volume += p.volume * qty;
      count += qty;
      positions += 1;
    });
    return { weight: weight, volume: volume, count: count, positions: positions };
  }

  function renderSummary() {
    var t = totals();

    if (totalWeightEl) totalWeightEl.textContent = t.weight ? fmtWeight(t.weight) : '—';
    if (totalVolumeEl) totalVolumeEl.textContent = t.volume ? fmtVolume(t.volume) : '—';
    if (selectedCountEl) selectedCountEl.textContent = t.count + ' шт. · ' + t.positions + ' поз.';

    if (selectedListEl) {
      if (!t.positions) {
        selectedListEl.innerHTML = '<p class="csum__empty">В расчёте пока пусто.<br>Отметьте оборудование в каталоге.</p>';
      } else {
        selectedListEl.innerHTML = Object.keys(cart).map(function (id) {
          var p = byId(id);
          if (!p) return '';
          var qty = cart[id];
          return '' +
            '<div class="csum-item">' +
              '<img class="csum-item__img" src="' + p.image + '" alt="">' +
              '<span class="csum-item__info">' +
                '<span class="csum-item__name">' + esc(p.name) + '</span>' +
                '<span class="csum-item__stats">' + fmtWeight(p.weight * qty) + ' кг · ' + fmtVolume(p.volume * qty) + ' м³</span>' +
              '</span>' +
              '<span class="csum-item__qty">' + qty + ' шт</span>' +
              '<button type="button" class="csum-item__del" data-del="' + p.id + '" aria-label="Убрать">✕</button>' +
            '</div>';
        }).join('');
      }
    }

    /* нижняя плашка на мобильных */
    if (barEl) {
      barEl.hidden = !t.positions;
      if (barWeightEl) barWeightEl.textContent = fmtWeight(t.weight);
      if (barVolumeEl) barVolumeEl.textContent = fmtVolume(t.volume);
      if (barCountEl) barCountEl.textContent = t.count + ' шт.';
      if (barThumbsEl) {
        var ids = Object.keys(cart).slice(0, 3);
        var html = ids.map(function (id) {
          var p = byId(id);
          return p ? '<img src="' + p.image + '" alt="">' : '';
        }).join('');
        var rest = Object.keys(cart).length - ids.length;
        if (rest > 0) html += '<span>+' + rest + '</span>';
        barThumbsEl.innerHTML = html;
      }
    }
  }

  function renderAll() {
    renderList();
    renderSummary();
  }

  /* ---------- предзаполнение заявки ---------- */
  function buildSpec() {
    var lines = Object.keys(cart).map(function (id) {
      var p = byId(id);
      var qty = cart[id];
      return '• ' + p.name + ' — ' + qty + ' шт. (' + fmtWeight(p.weight * qty) + ' кг, ' + fmtVolume(p.volume * qty) + ' м³)';
    });
    var t = totals();
    return 'Расчёт партии по калькулятору:\n' + lines.join('\n') +
      '\n\nИтого: ' + fmtWeight(t.weight) + ' кг · ' + fmtVolume(t.volume) + ' м³ (' + t.count + ' шт.)' +
      '\n\nПрошу предоставить КП, сроки поставки и стоимость доставки.';
  }

  /* ---------- фильтры ---------- */
  function hasFilters() {
    return Object.keys(selCats).length > 0 || Object.keys(selSubs).length > 0;
  }

  function subsOfCategory(cat) {
    var out = [];
    PRODUCTS.forEach(function (p) {
      if (p.category === cat && out.indexOf(p.sub) === -1) out.push(p.sub);
    });
    return out;
  }

  function selectedSubsCount() {
    var n = 0;
    Object.keys(selCats).forEach(function (cat) { n += subsOfCategory(cat).length; });
    n += Object.keys(selSubs).length;
    return n;
  }

  function isSubActive(sub) {
    if (selSubs[sub]) return true;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].sub === sub && selCats[PRODUCTS[i].category]) return true;
    }
    return false;
  }

  function resetFilters() {
    selCats = {};
    selSubs = {};
    filterSearch = '';
    if (searchEl) searchEl.value = '';
    if (filtersEl) {
      Array.prototype.forEach.call(filtersEl.querySelectorAll('.filters__item'), function (i) {
        i.classList.remove('is-open');
      });
    }
    markFilters();
    renderList();
  }

  function markFilters() {
    if (!filtersEl) return;

    /* «Все позиции» активна, только когда ничего не выбрано */
    var allBtn = filtersEl.querySelector('[data-reset-all]');
    if (allBtn) allBtn.classList.toggle('is-active', !hasFilters());

    Array.prototype.forEach.call(filtersEl.querySelectorAll('[data-category]'), function (b) {
      b.classList.toggle('is-active', !!selCats[b.dataset.category]);
    });

    Array.prototype.forEach.call(filtersEl.querySelectorAll('[data-sub]'), function (b) {
      b.classList.toggle('is-active', isSubActive(b.dataset.sub));
    });

    updateFab();
  }

  function toggleCategory(cat, item) {
    if (selCats[cat]) {
      delete selCats[cat];
      subsOfCategory(cat).forEach(function (sub) { delete selSubs[sub]; });
    } else {
      selCats[cat] = true;
      subsOfCategory(cat).forEach(function (sub) { delete selSubs[sub]; });
      if (item) item.classList.add('is-open');
    }
    markFilters();
    renderList();
  }

  function toggleSub(sub, cat, item) {
    if (isSubActive(sub)) {
      if (selCats[cat]) {
        /* категория была выбрана целиком — снимаем её и оставляем остальные подкатегории */
        delete selCats[cat];
        subsOfCategory(cat).forEach(function (s2) { if (s2 !== sub) selSubs[s2] = true; });
      } else {
        delete selSubs[sub];
      }
    } else {
      selSubs[sub] = true;
      var all = subsOfCategory(cat);
      var everySelected = all.every(function (s2) {
        return s2 === sub ? true : !!selSubs[s2];
      });
      if (everySelected) {
        selCats[cat] = true;
        all.forEach(function (s2) { delete selSubs[s2]; });
        if (item) item.classList.add('is-open');
      }
    }
    markFilters();
    renderList();
  }

  function updateFab() {
    if (!fabEl) return;
    var n = selectedSubsCount();
    var label = fabEl.querySelector('span');
    if (label) label.textContent = n ? 'Выбрано ' + n : 'Фильтр';
    fabEl.classList.toggle('has-filters', n > 0);
    fabEl.setAttribute('aria-label', n ? 'Фильтры, выбрано ' + n : 'Фильтры');
  }

  function setFiltersOpen(open) {
    if (!filtersBox) return;
    filtersBox.dataset.open = open ? 'true' : 'false';
    if (filtersToggle) filtersToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  /* ---------- мобильная шторка ---------- */
  function openSheet() {
    if (!sideEl) return;
    setFiltersOpen(true);
    sideEl.classList.add('is-open');
    if (backdropEl) { backdropEl.hidden = false; backdropEl.classList.add('is-on'); }
    if (fabEl) fabEl.setAttribute('aria-expanded', 'true');
  }

  function closeSheet() {
    if (!sideEl) return;
    sideEl.classList.remove('is-open');
    if (backdropEl) { backdropEl.classList.remove('is-on'); backdropEl.hidden = true; }
    if (fabEl) fabEl.setAttribute('aria-expanded', 'false');
  }

  /* ---------- события ---------- */
  listEl.addEventListener('click', function (e) {
    var resetBtn = e.target.closest('[data-reset]');
    if (resetBtn) {
      resetFilters();
      return;
    }

    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var card = btn.closest('.pcard');
    if (!card) return;

    var id = card.dataset.id;
    var input = card.querySelector('.stepper input');
    var value = Math.max(1, Math.min(999, parseInt(input.value, 10) || 1));
    var act = btn.dataset.act;

    if (act === 'inc') value += 1;
    if (act === 'dec') value -= 1;
    value = Math.max(1, Math.min(999, value));
    input.value = value;

    if (act === 'toggle') {
      if (cart[id]) delete cart[id];
      else cart[id] = value;
    } else if (cart[id]) {
      cart[id] = value;
    }

    renderAll();
  });

  listEl.addEventListener('change', function (e) {
    var input = e.target.closest('.stepper input');
    if (!input) return;
    var card = input.closest('.pcard');
    var value = Math.max(1, Math.min(999, parseInt(input.value, 10) || 1));
    input.value = value;
    if (cart[card.dataset.id]) {
      cart[card.dataset.id] = value;
      renderAll();
    }
  });

  if (searchEl) {
    searchEl.addEventListener('input', function () {
      filterSearch = this.value.trim().toLowerCase();
      renderList();
    });
  }

  if (filtersToggle) {
    filtersToggle.addEventListener('click', function () {
      setFiltersOpen(filtersBox.dataset.open !== 'true');
    });
  }

  if (filtersEl) {
    filtersEl.addEventListener('click', function (e) {
      var allBtn = e.target.closest('[data-reset-all]');
      if (allBtn) {
        resetFilters();
        return;
      }

      var subBtn = e.target.closest('[data-sub]');
      if (subBtn) {
        var itemSub = subBtn.closest('.filters__item');
        var catBtnSub = itemSub ? itemSub.querySelector('[data-category]') : null;
        toggleSub(subBtn.dataset.sub, catBtnSub ? catBtnSub.dataset.category : '', itemSub);
        return;
      }

      var catBtn = e.target.closest('[data-category]');
      if (!catBtn) return;
      toggleCategory(catBtn.dataset.category, catBtn.closest('.filters__item'));
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      cart = {};
      renderAll();
    });
  }

  if (selectedListEl) {
    selectedListEl.addEventListener('click', function (e) {
      var del = e.target.closest('[data-del]');
      if (!del) return;
      delete cart[del.dataset.del];
      renderAll();
    });
  }

  if (ctaEl) {
    ctaEl.addEventListener('click', function () {
      if (messageEl && Object.keys(cart).length) messageEl.value = buildSpec();
      if (isMobile()) closeSheet();
    });
  }

  if (fabEl) {
    fabEl.addEventListener('click', function () {
      if (sideEl && sideEl.classList.contains('is-open')) closeSheet();
      else openSheet();
    });
  }

  if (backdropEl) {
    backdropEl.addEventListener('click', closeSheet);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });

  /* на десктопе фильтры развёрнуты, на мобильных свёрнуты */
  setFiltersOpen(!isMobile());

  /* Скрывать кнопку фильтров, когда каталог скрывается из поля зрения */
  var gridEl = document.getElementById('calcItemsGrid');
  var requestEl = document.getElementById('request');

  function checkFabVisibility() {
    if (!fabEl) return;
    if (!gridEl) return;

    var gridRect = gridEl.getBoundingClientRect();
    var gridInView = (gridRect.bottom > 80 && gridRect.top < window.innerHeight - 60);

    var reqRect = requestEl ? requestEl.getBoundingClientRect() : null;
    var reqVisible = reqRect && (reqRect.top < window.innerHeight - 180);

    if (gridInView && !reqVisible) {
      fabEl.classList.remove('is-hidden');
    } else {
      fabEl.classList.add('is-hidden');
    }
  }

  window.addEventListener('scroll', checkFabVisibility, { passive: true });
  window.addEventListener('resize', checkFabVisibility, { passive: true });
  checkFabVisibility();

  renderAll();
})();
