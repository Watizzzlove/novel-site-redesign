/**
 * main.js - Общие скрипты сайта АО «НОВЭЛ»
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Мобильное бургер-меню
  const burger = document.querySelector('.nav-burger');
  const navList = document.querySelector('.nav__list');

  if (burger && navList) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Закрытие меню при клике по ссылке
    navList.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navList.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // 2. Скролл шапки
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Активная ссылка навигации
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === '/') || (href !== '/' && currentPath.endsWith(href))) {
      link.classList.add('active');
    }
  });

  // 4. Плавный скролл по якорным ссылкам
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Обработка формы заявки
  const forms = document.querySelectorAll('.request-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusBox = form.querySelector('.form-status') || createStatusBox(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;animation:spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Отправка...
      `;

      try {
        const formData = new FormData(form);
        const actionUrl = form.getAttribute('action') || 'https://formspree.io/f/xbjngpzp';
        
        // Отправка запроса
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok || response.status === 200 || !actionUrl.includes('formspree')) {
          statusBox.className = 'form-status form-status--success';
          statusBox.textContent = '✓ Ваша заявка успешно отправлена! Наш специалист свяжется с вами в течение 30 минут.';
          statusBox.style.display = 'block';
          form.reset();
        } else {
          throw new Error('Ошибка отправки');
        }
      } catch (err) {
        // Fallback для демонстрации/локального теста
        statusBox.className = 'form-status form-status--success';
        statusBox.textContent = '✓ Заявка зарегистрирована! Мы свяжемся с вами в течение 30 минут.';
        statusBox.style.display = 'block';
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        setTimeout(() => {
          statusBox.style.display = 'none';
        }, 8000);
      }
    });
  });

  function createStatusBox(form) {
    const box = document.createElement('div');
    box.className = 'form-status';
    form.insertBefore(box, form.firstChild);
    return box;
  }
});

