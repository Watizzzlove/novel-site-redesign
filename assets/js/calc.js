/**
 * calc.js - Интерактивный калькулятор веса и объема продукции АО «НОВЭЛ»
 * Использует оригинальные фотографии оборудования с сайта zaonovel.ru
 */

const NOVEL_PRODUCTS = [
  {
    id: 'kev-21',
    category: 'thermal',
    categoryName: 'Тепловое оборудование',
    name: 'Электрокалорифер КЭВ-21',
    image: 'assets/img/prod-kev.jpg',
    specs: {
      power: '21.0 кВт',
      performance: '2 200 м³/ч',
      voltage: '380 В',
      dims: '400×920×430 мм'
    },
    weight: 30.0,
    volume: 0.158
  },
  {
    id: 'kev-30',
    category: 'thermal',
    categoryName: 'Тепловое оборудование',
    name: 'Электрокалорифер КЭВ-30',
    image: 'assets/img/prod-kev.jpg',
    specs: {
      power: '30.0 кВт',
      performance: '3 200 м³/ч',
      voltage: '380 В',
      dims: '460×1020×470 мм'
    },
    weight: 38.0,
    volume: 0.220
  },
  {
    id: 'pet-2',
    category: 'thermal',
    categoryName: 'Тепловое оборудование',
    name: 'Электрообогреватель ПЭТ-2 (380В)',
    image: 'assets/img/prod-pet.jpg',
    specs: {
      power: '1.0 кВт',
      performance: 'Конвекционный',
      voltage: '380 В',
      dims: '623×150×150 мм'
    },
    weight: 3.5,
    volume: 0.014
  },
  {
    id: 'pet-4',
    category: 'thermal',
    categoryName: 'Тепловое оборудование',
    name: 'Электрообогреватель ПЭТ-4 со шнуром',
    image: 'assets/img/prod-pet.jpg',
    specs: {
      power: '1.0 кВт',
      performance: 'Конвекционный',
      voltage: '220 В',
      dims: '623×150×150 мм'
    },
    weight: 3.5,
    volume: 0.014
  },
  {
    id: 'konvektor',
    category: 'thermal',
    categoryName: 'Тепловое оборудование',
    name: 'Электроконвектор плинтусный ЭВУС',
    image: 'assets/img/prod-konvektor.jpg',
    specs: {
      power: '1.5 кВт',
      performance: 'Плинтусный настенный',
      voltage: '220 В',
      dims: '1000×140×80 мм'
    },
    weight: 4.2,
    volume: 0.018
  },
  {
    id: 'tp-5-150',
    category: 'welding',
    categoryName: 'Сварочное оборудование',
    name: 'Термопенал ТП 5/150-220',
    image: 'assets/img/prod-tp5.jpg',
    specs: {
      power: '0.3 кВт',
      performance: 'Загрузка: 5 кг',
      voltage: '220 В',
      dims: '110×590×110 мм'
    },
    weight: 2.6,
    volume: 0.007
  },
  {
    id: 'tp-10-150',
    category: 'welding',
    categoryName: 'Сварочное оборудование',
    name: 'Термопенал ТП 10/150-220',
    image: 'assets/img/prod-tp10.jpg',
    specs: {
      power: '0.6 кВт',
      performance: 'Загрузка: 10 кг',
      voltage: '220 В',
      dims: '150×615×150 мм'
    },
    weight: 5.0,
    volume: 0.014
  },
  {
    id: 'tpk-5',
    category: 'welding',
    categoryName: 'Сварочное оборудование',
    name: 'Термопенал ТПК 5/150-220 (с термометром)',
    image: 'assets/img/prod-tpk.jpg',
    specs: {
      power: '0.3 кВт',
      performance: 'Загрузка: 5 кг',
      voltage: '220 В',
      dims: '155×550×110 мм'
    },
    weight: 3.0,
    volume: 0.009
  },
  {
    id: 'ove-4',
    category: 'explosion',
    categoryName: 'Взрывозащищенное оборудование',
    name: 'Обогреватель взрывозащищенный ОВЭ-4',
    image: 'assets/img/prod-ove.jpg',
    specs: {
      power: '1.8 кВт',
      performance: 'Взрывозащита 1ExdIIBT4',
      voltage: '380 В',
      dims: '175×175×1420 мм'
    },
    weight: 17.0,
    volume: 0.043
  },
  {
    id: 'tenbv-5z',
    category: 'explosion',
    categoryName: 'Взрывозащищенное оборудование',
    name: 'Блок нагревателей ТЭНБВ 5Z-220',
    image: 'assets/img/prod-tenbv.jpg',
    specs: {
      power: '5.0 кВт',
      performance: 'Взрывобезопасный блок',
      voltage: '220 В',
      dims: '500×265×245 мм'
    },
    weight: 15.0,
    volume: 0.032
  }
];

// Состояние выбранных позиций { productId: qty }
let cartState = {};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('calcItemsGrid');
  const searchInput = document.getElementById('calcSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearBtn = document.getElementById('calcClearBtn');
  const totalWeightEl = document.getElementById('totalWeight');
  const totalVolumeEl = document.getElementById('totalVolume');
  const selectedListEl = document.getElementById('selectedList');
  const selectedCountEl = document.getElementById('selectedCount');
  const submitCalcBtn = document.getElementById('submitCalcBtn');
  const inquiryTextarea = document.getElementById('message');

  let currentCategory = 'all';
  let currentSearch = '';

  // Рендер каталога
  function renderCatalog() {
    if (!container) return;
    
    const filtered = NOVEL_PRODUCTS.filter(prod => {
      const matchCat = currentCategory === 'all' || prod.category === currentCategory;
      const matchSearch = currentSearch === '' || 
        prod.name.toLowerCase().includes(currentSearch) ||
        prod.categoryName.toLowerCase().includes(currentSearch);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="background:var(--color-surface);border:1px solid var(--color-border);padding:40px;text-align:center;border-radius:var(--radius-md);">
          <p style="color:var(--color-text-muted);margin-bottom:12px;">Позиции по запросу «${escapeHtml(currentSearch)}» не найдены</p>
          <button class="btn btn--outline btn--sm" id="resetSearchBtn">Сбросить фильтры</button>
        </div>
      `;
      document.getElementById('resetSearchBtn')?.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        currentCategory = 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
        renderCatalog();
      });
      return;
    }

    container.innerHTML = filtered.map(item => {
      const inCart = cartState[item.id] || 0;
      return `
        <div class="calc-card" data-id="${item.id}">
          <div class="calc-card__thumb">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy">
          </div>
          <div class="calc-card__main">
            <div class="calc-card__badge-row">
              <span class="tech-tag tech-tag--accent">${item.categoryName}</span>
              <span class="hero__coord">${item.weight} кг · ${item.volume} м³</span>
            </div>
            <h3 class="calc-card__title">${item.name}</h3>
            <div class="calc-card__specs">
              <div class="calc-card__spec-item">
                <span class="calc-card__spec-name">Мощность</span>
                <span class="calc-card__spec-val">${item.specs.power}</span>
              </div>
              <div class="calc-card__spec-item">
                <span class="calc-card__spec-name">Сеть</span>
                <span class="calc-card__spec-val">${item.specs.voltage}</span>
              </div>
              <div class="calc-card__spec-item">
                <span class="calc-card__spec-name">Габариты</span>
                <span class="calc-card__spec-val">${item.specs.dims}</span>
              </div>
            </div>
          </div>
          <div class="calc-card__actions">
            <div class="qty-control">
              <button class="qty-btn" onclick="changeCardQty('${item.id}', -1)" aria-label="Уменьшить">-</button>
              <input type="number" class="qty-input" id="qty-${item.id}" value="${inCart > 0 ? inCart : 1}" min="1" max="999" onchange="setCardQty('${item.id}', this.value)">
              <button class="qty-btn" onclick="changeCardQty('${item.id}', 1)" aria-label="Увеличить">+</button>
            </div>
            <button class="btn ${inCart > 0 ? 'btn--accent' : 'btn--outline'} btn--sm" onclick="toggleCartItem('${item.id}')">
              ${inCart > 0 ? `В расчете (${inCart} шт)` : '+ Добавить'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Обновление сводки калькулятора
  function updateSummary() {
    let totalWeight = 0;
    let totalVolume = 0;
    let totalItems = 0;
    const selectedIds = Object.keys(cartState);

    selectedIds.forEach(id => {
      const qty = cartState[id];
      const prod = NOVEL_PRODUCTS.find(p => p.id === id);
      if (prod && qty > 0) {
        totalWeight += prod.weight * qty;
        totalVolume += prod.volume * qty;
        totalItems += qty;
      }
    });

    if (totalWeightEl) {
      totalWeightEl.textContent = totalWeight > 0 ? totalWeight.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) : '—';
    }
    if (totalVolumeEl) {
      totalVolumeEl.textContent = totalVolume > 0 ? totalVolume.toFixed(3) : '—';
    }
    if (selectedCountEl) {
      selectedCountEl.textContent = `${totalItems} шт. (${selectedIds.length} поз.)`;
    }

    if (selectedListEl) {
      if (selectedIds.length === 0) {
        selectedListEl.innerHTML = `
          <div class="calc-selected-empty">
            В расчете пока нет позиций.<br>
            Выберите нужное оборудование слева.
          </div>
        `;
      } else {
        selectedListEl.innerHTML = selectedIds.map(id => {
          const qty = cartState[id];
          const prod = NOVEL_PRODUCTS.find(p => p.id === id);
          if (!prod) return '';
          return `
            <div class="selected-row">
              <div class="selected-row__thumb">
                <img src="${prod.image}" alt="${escapeHtml(prod.name)}">
              </div>
              <div class="selected-row__info">
                <span class="selected-row__name" title="${prod.name}">${prod.name}</span>
                <span class="selected-row__stats">${(prod.weight * qty).toFixed(1)} кг · ${(prod.volume * qty).toFixed(3)} м³</span>
              </div>
              <div class="selected-row__controls">
                <span class="selected-row__qty">${qty} шт</span>
                <button class="selected-row__del" onclick="removeCartItem('${id}')" title="Удалить">✕</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Если есть кнопка перехода к форме с предзаполнением
    if (submitCalcBtn) {
      submitCalcBtn.onclick = () => {
        if (selectedIds.length === 0) {
          alert('Пожалуйста, добавьте хотя бы одну позицию в расчет.');
          return;
        }

        const lines = selectedIds.map(id => {
          const prod = NOVEL_PRODUCTS.find(p => p.id === id);
          return `• ${prod.name} — ${cartState[id]} шт. (Вес: ${(prod.weight * cartState[id]).toFixed(1)} кг, Объем: ${(prod.volume * cartState[id]).toFixed(3)} м³)`;
        });

        const prefillText = `Запрос расчета партии по калькулятору:\n${lines.join('\n')}\n\nИТОГО:\nОбщий вес: ${totalWeight.toFixed(1)} кг\nОбщий объем: ${totalVolume.toFixed(3)} м³\n\nПрошу предоставить КП и сроки поставки.`;

        if (inquiryTextarea) {
          inquiryTextarea.value = prefillText;
          document.querySelector('#request')?.scrollIntoView({ behavior: 'smooth' });
          inquiryTextarea.focus();
        }
      };
    }
  }

  // Глобальные хелперы для вызова из inline onclick
  window.changeCardQty = (id, delta) => {
    const input = document.getElementById(`qty-${id}`);
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
    if (cartState[id]) {
      cartState[id] = val;
      updateSummary();
      renderCatalog();
    }
  };

  window.setCardQty = (id, val) => {
    let num = parseInt(val) || 1;
    num = Math.max(1, num);
    if (cartState[id]) {
      cartState[id] = num;
      updateSummary();
      renderCatalog();
    }
  };

  window.toggleCartItem = (id) => {
    const input = document.getElementById(`qty-${id}`);
    const qty = input ? parseInt(input.value) || 1 : 1;
    if (cartState[id]) {
      delete cartState[id];
    } else {
      cartState[id] = qty;
    }
    updateSummary();
    renderCatalog();
  };

  window.removeCartItem = (id) => {
    delete cartState[id];
    updateSummary();
    renderCatalog();
  };

  // Поиск
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      renderCatalog();
    });
  }

  // Фильтры категорий
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'all';
      renderCatalog();
    });
  });

  // Очистка
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cartState = {};
      updateSummary();
      renderCatalog();
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Инициализация первого рендера
  renderCatalog();
  updateSummary();
});
