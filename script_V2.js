// ===== ФУНКЦИОНАЛЬНОСТЬ ТЕЛЕГРАМ БАННЕРА =====
// Этот файл содержит все скрипты для телеграм баннера

/**
 * Инициализация телеграм баннера
 * Добавляет интерактивные эффекты и отслеживание
 */
function initTelegramBanner() {
  const telegramLink = document.querySelector('.telegram-link');
  
  if (!telegramLink) {
    console.warn('Телеграм баннер не найден на странице');
    return;
  }

  // Отслеживание нажатия с задержкой до конца анимации
  telegramLink.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Добавляем класс для активной анимации
    this.classList.add('clicked');
    console.log('✅ Нажата кнопка Telegram');
    trackTelegramClick();
    
    // Ждём конца анимации (2s) перед переходом
    setTimeout(() => {
      const href = this.getAttribute('href');
      window.open(href, '_blank');
      this.classList.remove('clicked');
    }, 2000);
  });

  // Отслеживание наведения
  telegramLink.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    setTimeout(() => {
      this.style.animation = '';
    }, 10);
  });

  // Эффект фокуса для доступности
  telegramLink.addEventListener('focus', function() {
    this.style.outline = '2px solid #00d4ff';
    this.style.outlineOffset = '4px';
  });

  telegramLink.addEventListener('blur', function() {
    this.style.outline = 'none';
  });

  // Анимация открытия банера при загрузке
  animateBannerOnLoad();
}

/**
 * Анимация появления баннера при загрузке страницы
 */
function animateBannerOnLoad() {
  const container = document.querySelector('.telegram-banner-container');
  
  if (!container) return;

  // Скрытие до загрузки
  container.style.opacity = '0';
  container.style.transform = 'translateY(20px)';
  
  // Плавное появление
  setTimeout(() => {
    container.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 300);
}

/**
 * Отслеживание клика на телеграм ссылку (для аналитики)
 * Можно интегрировать с Google Analytics или другим сервисом
 */
function trackTelegramClick() {
  // Google Analytics отслеживание
  if (typeof gtag !== 'undefined') {
    gtag('event', 'telegram_banner_click', {
      'event_category': 'engagement',
      'event_label': 'schedule_section',
      'value': 1
    });
  }

  // Собственная аналитика
  const telegramStats = JSON.parse(localStorage.getItem('telegramStats') || '{"clicks": 0, "lastClick": null}');
  telegramStats.clicks += 1;
  telegramStats.lastClick = new Date().toISOString();
  localStorage.setItem('telegramStats', JSON.stringify(telegramStats));

  console.log('📊 Статистика кликов:', telegramStats);
}

/**
 * Получить статистику кликов
 */
function getTelegramStats() {
  const stats = JSON.parse(localStorage.getItem('telegramStats') || '{"clicks": 0, "lastClick": null}');
  return stats;
}

/**
 * Проверка: открыть Telegram ссылку в новой вкладке или окне
 * Адаптирует поведение в зависимости от устройства
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPok|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Обработка клавиатуры для доступности
 */
document.addEventListener('DOMContentLoaded', () => {
  const telegramLink = document.querySelector('.telegram-link');
  
  if (telegramLink) {
    // Enter и Space открывают ссылку
    telegramLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        telegramLink.click();
      }
    });
  }
});

/**
 * Проверка мобильного браузера и открытие в соответствующем приложении
 */
function handleTelegramLinkClick(e) {
  if (isMobileDevice()) {
    const telegramUrl = e.currentTarget.href;
    
    // Попытка открыть в Telegram приложении вместо веб-версии
    const tgDeepLink = telegramUrl.replace('https://t.me/', 'tg://resolve?domain=');
    
    // Проверка доступности приложения
    const fallbackTimeout = setTimeout(() => {
      window.open(telegramUrl, '_blank');
    }, 500);

    // Попытка открыть приложение
    window.location.href = tgDeepLink;
    
    // Отмена fallback если приложение открылось
    window.addEventListener('blur', () => {
      clearTimeout(fallbackTimeout);
    }, { once: true });
  }
}

/**
 * Инициализация при загрузке DOM
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTelegramBanner);
} else {
  initTelegramBanner();
}

// ===== КОНЕЦ СКРИПТОВ ТЕЛЕГРАМ БАННЕРА =====

console.log('✅ Script_V2.js загружен успешно');
