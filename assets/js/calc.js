/* Транспортный калькулятор — АО «НОВЭЛ».
   Данные позиций — с сайта завода (zaonovel.ru): масса и объём упаковки. */
(function () {
  'use strict';

  var PRODUCTS = [
    { id: 'kev-21', category: 'thermal', categoryName: 'Тепловое', sub: 'kev',
      name: 'Электрокалорифер КЭВ-21', image: 'assets/img/prod-kev.jpg',
      power: '21 кВт', voltage: '380 В', dims: '400×920×430', weight: 30, volume: 0.158 },

    { id: 'kev-30', category: 'thermal', categoryName: 'Тепловое', sub: 'kev',
      name: 'Электрокалорифер КЭВ-30', image: 'assets/img/prod-kev.jpg',
      power: '30 кВт', voltage: '380 В', dims: '460×1020×470', weight: 38, volume: 0.220 },

    { id: 'pet-2', category: 'thermal', categoryName: 'Тепловое', sub: 'pet',
      name: 'Обогреватель ПЭТ-2 (380 В)', image: 'assets/img/prod-pet.jpg',
      power: '1 кВт', voltage: '380 В', dims: '623×150×150', weight: 3.5, volume: 0.014 },

    { id: 'pet-4', category: 'thermal', categoryName: 'Тепловое', sub: 'pet',
      name: 'Обогреватель ПЭТ-4 со шнуром', image: 'assets/img/prod-pet.jpg',
      power: '1 кВт', voltage: '220 В', dims: '623×150×150', weight: 3.5, volume: 0.014 },

    { id: 'evus', category: 'thermal', categoryName: 'Тепловое', sub: 'conv',
      name: 'Конвектор плинтусный ЭВУС', image: 'assets/img/prod-konvektor.jpg',
      power: '1.5 кВт', voltage: '220 В', dims: '1000×140×80', weight: 4.2, volume: 0.018 },

    { id: 'tp-5', category: 'welding', categoryName: 'Сварочное', sub: 'tp',
      name: 'Термопенал ТП 5/150-220', image: 'assets/img/prod-tp5.jpg',
      power: '0.3 кВт', voltage: '220 В', dims: '110×590×110', weight: 2.6, volume: 0.007 },

    { id: 'tp-10', category: 'welding', categoryName: 'Сварочное', sub: 'tp',
      name: 'Термопенал ТП 10/150-220', image: 'assets/img/prod-tp10.jpg',
      power: '0.6 кВт', voltage: '220 В', dims: '150×615×150', weight: 5, volume: 0.014 },

    { id: 'tpk-5', category: 'welding', categoryName: 'Сварочное', sub: 'tp',
      name: 'Термопенал ТПК 5/150-220', image: 'assets/img/prod-tpk.jpg',
      power: '0.3 кВт', voltage: '220 В', dims: '155×550×110', weight: 3, volume: 0.009 },

    { id: 'ove-4', category: 'explosion', categoryName: 'Взрывозащита', sub: 'ove',
      name: 'Обогреватель ОВЭ-4', image: 'assets/img/prod-ove.jpg',
      power: '1.8 кВт', voltage: '380 В', dims: '175×175×1420', weight: 17, volume: 0.043 },

    { id: 'tenbv-5z', category: 'explosion', categoryName: 'Взрывозащита', sub: 'tenbv',
      name: 'Блок ТЭНБВ 5Z-220', image: 'assets/img/prod-tenbv.jpg',
      power: '5 кВт', voltage: '220 В', dims: '500×265×245', weight: 15, volume: 0.032 }
  ];

  var cart = {};
  var filterCategory = 'all';
  var filterSub = '';
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
    var items = PRODUCTS.filter(function (p) {
      var okCat = filterCategory === 'all' || p.category === filterCategory;
      var okSub = !filterSub || p.sub === filterSub;
      var okSearch = !filterSearch ||
        p.name.toLowerCase().indexOf(filterSearch) > -1 ||
        p.categoryName.toLowerCase().indexOf(filterSearch) > -1;
      return okCat && okSub && okSearch;
    });

    if (!items.length) {
      listEl.innerHTML =
        '<p class="calc__empty">Ничего не нашлось. <button type="button" class="chip" data-reset="1">Сбросить фильтры</button></p>';
      return;
    }

    listEl.innerHTML = items.map(function (p) {
      var qty = cart[p.id] || 0;
      var isIn = qty > 0;
      return '' +
        '<article class="pcard' + (isIn ? ' is-in' : '') + '" data-id="' + p.id + '">' +
          '<div class="pcard__media">' +
            '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy">' +
          '</div>' +
          '<div class="pcard__body">' +
            '<span class="pcard__cat">' + esc(p.categoryName) + '</span>' +
            '<h3 class="pcard__name">' + esc(p.name) + '</h3>' +
            '<ul class="pcard__specs">' +
              '<li><span>Мощность</span><b>' + esc(p.power) + '</b></li>' +
              '<li><span>Сеть</span><b>' + esc(p.voltage) + '</b></li>' +
              '<li><span>Габариты, мм</span><b>' + esc(p.dims) + '</b></li>' +
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
  function markFilters() {
    if (!filtersEl) return;
    Array.prototype.forEach.call(filtersEl.querySelectorAll('[data-category]'), function (b) {
      var cat = b.dataset.category || 'all';
      b.classList.toggle('is-active', filterCategory === cat && !filterSub);
    });
    Array.prototype.forEach.call(filtersEl.querySelectorAll('[data-sub]'), function (b) {
      b.classList.toggle('is-active', filterSub === b.dataset.sub);
    });
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
      filterSearch = '';
      filterCategory = 'all';
      filterSub = '';
      if (searchEl) searchEl.value = '';
      if (filtersEl) {
        Array.prototype.forEach.call(filtersEl.querySelectorAll('.filters__item'), function (i) {
          i.classList.remove('is-open');
        });
      }
      markFilters();
      renderList();
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
      var subBtn = e.target.closest('[data-sub]');
      if (subBtn) {
        var same = filterSub === subBtn.dataset.sub;
        if (same) {
          filterSub = '';
        } else {
          filterSub = subBtn.dataset.sub;
          var parent = subBtn.closest('.filters__item');
          var catBtn = parent ? parent.querySelector('[data-category]') : null;
          if (catBtn) filterCategory = catBtn.dataset.category;
        }
        markFilters();
        renderList();
        return;
      }

      var catBtn2 = e.target.closest('[data-category]');
      if (!catBtn2) return;
      var cat = catBtn2.dataset.category || 'all';
      var item = catBtn2.closest('.filters__item');

      if (cat === 'all') {
        filterCategory = 'all';
        filterSub = '';
      } else if (filterCategory === cat) {
        filterCategory = 'all';
        filterSub = '';
        if (item) item.classList.remove('is-open');
      } else {
        filterCategory = cat;
        filterSub = '';
        if (item) item.classList.add('is-open');
      }
      markFilters();
      renderList();
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

  renderAll();
})();
