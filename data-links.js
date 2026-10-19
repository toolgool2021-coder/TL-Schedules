// Дополнения к Data.js: секция links (телеграм/поддержка/лицензия/разработчик)
// Добавим аккуратно в конец существующей конфигурации, не ломая структуру.

if (!window.appConfig) window.appConfig = {};
window.appConfig.links = window.appConfig.links || {
  telegram: "", // Например: "https://t.me/Toolgool"
  support: "", // Страница поддержки/поддержки платежей
  license: "license-1.html",
  developer: "https://t.me/Toolgool"
};

console.log('✅ Data.js links section initialized');
