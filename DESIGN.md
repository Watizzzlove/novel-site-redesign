# DESIGN.md — АО «НОВЭЛ» Design System & Tokens

Single Source of Truth: референс 2 (ASC Technology Solutions) × реальный контент
[zaonovel.ru](https://zaonovel.ru/).

## 1. Design Dials

| Parameter | Value (0-100) | Notes |
|---|---|---|
| **Posture: Expression** | `95` | Brutalist, bold, architectural display typography |
| **Posture: Density** | `85` | High information density, compact technical labels, metadata |
| **Posture: Brand Presence**| `85` | Dominant orange-red `#DE3C0D` panels |
| **Character: Energy** | `80` | Контрастные зоны: светлый лист → чёрная полоса → лист → алая панель |
| **Character: Roundness** | `12` | Скругления только на карточках и кнопках, язычок полосы — срез 45° |
| **Character: Depth** | `85` | Один крупный 3D-объект (взрыв-схема) + реальные фотографии производства |
| **Character: Colorfulness** | `20` | Монохромная архитектура + один горячий акцент + цвет продукта |
| **Character: Warmth** | `30` | Холодная сталь + тёплое свечение ТЭНов |

## 2. Design Tokens (CSS Custom Properties)

Реализованы в `assets/css/index.css` (главная страница). `variables.css` — общий набор
для внутренних страниц (`about.html`, `calc.html`).

```css
:root {
  /* Canvas & Surfaces */
  --paper: #EDEDED;
  --paper-2: #E4E4E4;
  --card: #F2F2F2;        /* сплошная заливка карточки */
  --dark: #101113;
  --dark-2: #16181C;
  --white: #FFFFFF;

  /* Ink & Accent */
  --ink: #0E0F11;
  --ink-2: #2C2E33;
  --ink-3: #47494F;
  --accent: #DE3C0D;
  --accent-2: #F1541F;

  --muted: #6D7077;
  --muted-2: #9C9FA5;
  --dim: #A0A0A0;          /* приглушённая строка крупного заголовка */

  /* Structural Dividers */
  --line: rgba(14, 15, 17, 0.16);
  --line-soft: rgba(14, 15, 17, 0.09);
  --line-dark: rgba(255, 255, 255, 0.16);
  --line-dark-soft: rgba(255, 255, 255, 0.09);

  /* Fonts */
  --f-display: 'Inter Tight', 'Inter', system-ui, sans-serif;
  --f-body: 'Inter', system-ui, sans-serif;
  --f-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Grid */
  --pad: clamp(18px, 5.2vw, 88px);
  --hdr-h: clamp(64px, 6.1vw, 92px);
}
```

## 3. Type Scale (1440–1472 px baseline)

| Role | Size | Notes |
|---|---|---|
| Hero H1 | `clamp(31px, 5.05vw, 76px)` | uppercase, `line-height: .92`, `letter-spacing: -.05em` |
| Section H2 | `clamp(26px, 3.3vw, 50px)` | uppercase, `line-height: .98–1` |
| Metrics / stat number | `clamp(21px, 2.2vw, 33px)` | display, weight 500 |
| Card title | `clamp(14px, 1.2vw, 17.5px)` | weight 600 |
| Body / lead | `clamp(11.5px, .85vw, 13px)` | `line-height: 1.6` |
| Eyebrow / index | `clamp(10px, .82vw, 12px)` | uppercase, `letter-spacing: .13em` |
| Mono meta | `clamp(8px, .62vw, 9.5px)` | координаты, маркировки |

## 4. Homepage Structure

| Блок | Разметка | Правило |
|---|---|---|
| Header | `.hdr` | высота 6.1vw, навигация по центру, pill-CTA «Оставить заявку», телефон завода |
| 01 Hero | `.hero` | сетка 54/46, крупный заголовок-перечисление (Тепло. Сварка. Взрывозащита.), взрыв-схема калорифера, логотипы партнёров + «4 000 компаний» |
| 02 Focus | `.focus` | чёрная полоса с фото-заливкой (`mask-image` растворяет края), язычок со срезом 45°, метрики завода с линиями-выносками |
| 03 Solutions | `.sol` | три направления завода: карточки сплошной заливки, реальные фото производства |
| 04 Reviews | `.rev` | благодарственные письма: превью + подпись, клик открывает оригинал (lightbox) |
| 05 Closing + footer | `.close` | фото цеха · CTA · алая панель со срезом + подвал в правой трети |

## 5. Content Rules

- Все цифры — с [zaonovel.ru](https://zaonovel.ru/): 4 000+ контрагентов, 121 город, 8 стран,
  40 видов оборудования, производство 4 000 м², основание 1989, первая партия ТЭНов 1995.
- Контакты: +7 (3513) 570-510, market@zaonovel.ru, Миасс, ул. Лихачёва, 16.
- Партнёры: Газпром, Сибнефть, Башнефть, РЖД, Кувалда.ру, Сварби.
- Не использовать неподтверждённые метрики (проценты надёжности, «250+ предприятий» и т.п.).
- Изображения производства — `assets/img/real/`, оригиналы писем — оттуда же.

## 6. Motion & Accessibility

- Переходы — `cubic-bezier(.22, .8, .24, 1)`, 250–400 ms; `prefers-reduced-motion` отключает анимации.
- Фокус: `outline: 2px solid var(--accent); outline-offset: 3px`.
- Модалка заявки и просмотр письма: `role="dialog"`, `aria-modal`, Escape, возврат фокуса.
- Декоративные элементы (язычок, крестики, координаты) — `aria-hidden="true"`.
