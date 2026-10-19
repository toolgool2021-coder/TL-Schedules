// Script_v2.js — Telegram banner logic, cleaned of console logs

function initTelegramBanner() {
  const telegramLink = document.querySelector('.telegram-link');
  if (!telegramLink) return;

  telegramLink.addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.add('clicked');
    trackTelegramClick();
    setTimeout(() => {
      const href = this.getAttribute('href');
      window.open(href, '_blank');
      this.classList.remove('clicked');
    }, 800);
  });

  telegramLink.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    setTimeout(() => this.style.animation = '', 10);
  });

  telegramLink.addEventListener('focus', function() {
    this.style.outline = '2px solid #00d4ff';
    this.style.outlineOffset = '4px';
  });

  telegramLink.addEventListener('blur', function() { this.style.outline = 'none'; });

  animateBannerOnLoad();
}

function animateBannerOnLoad(){
  const container = document.querySelector('.telegram-banner-container');
  if (!container) return;
  container.style.opacity = '0';
  container.style.transform = 'translateY(10px)';
  setTimeout(()=>{ container.style.transition='all .6s cubic-bezier(.25,.46,.45,.94)'; container.style.opacity='1'; container.style.transform='translateY(0)'; }, 200);
}

function trackTelegramClick(){
  const telegramStats = JSON.parse(localStorage.getItem('telegramStats') || '{"clicks":0,"lastClick":null}');
  telegramStats.clicks += 1;
  telegramStats.lastClick = new Date().toISOString();
  localStorage.setItem('telegramStats', JSON.stringify(telegramStats));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTelegramBanner); else initTelegramBanner();
