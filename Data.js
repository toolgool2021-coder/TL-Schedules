// ===== ГЛОБАЛЬНАЯ КОНФИГУРАЦИЯ =====
// Все основные настройки находятся здесь
window.appConfig = {
  // Показывать ли недельное расписание
  SHOW_WEEK_SCHEDULE: true,

  // Включить технический перерыв
  TECH_BREAK: false,

  // Показывать ли время Кыргызстана
  SHOW_KYRGYZSTAN_TIME: true,

  // Длительность уроков по умолчанию
  DEFAULT_LESSON_DURATION: 45,

  // Базовое время начала (в минутах от 00:00)
  BASE_START_TIME: 480, // 8:00

  // Фиксированные времена уроков (для 45 минут)
  lessonTimesFixed: [
    { num: 1, start: "8:00", startMinutes: 480, end: "8:45", endMinutes: 525 },
    { num: 2, start: "8:50", startMinutes: 530, end: "9:35", endMinutes: 575 },
    { num: 3, start: "9:40", startMinutes: 580, end: "10:25", endMinutes: 625 },
    { num: 4, start: "10:40", startMinutes: 640, end: "11:25", endMinutes: 685 },
    { num: 5, start: "11:30", startMinutes: 690, end: "12:15", endMinutes: 735 },
    { num: 6, start: "12:20", startMinutes: 740, end: "13:05", endMinutes: 785 }
  ],

  // Названия дней недели
  dayNames: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],

  // Целевые значения для счётчиков статистики
  stats: {
    students: 150,
    teachers: 35,
    subjects: 14
  }
};

// ===== ДАННЫЕ РАСПИСАНИЯ =====
window.scheduleData = {
  teachersDatabase: {
    "Физкультура": { name: "-", cabinet: "спорт зал", phone: null },
    "Математика": { name: "-", cabinet: "30", phone: null },
    "Химия": { name: "-", cabinet: "39", phone: null },
    "Русская литература": { name: "Нурумова Елена", cabinet: "43", phone: "+996554603042" },
    "Русский язык": { name: "Нурумова Елена", cabinet: "43", phone: "+996554603042" },
    "Физика": { name: "-", cabinet: "38", phone: null },
    "История": { name: "-", cabinet: "19", phone: null },
    "Иностранный язык": { name: "-", cabinet: "33", phone: null },
    "Кыргыз тили": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "Кыргыз литература": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "Биология": { name: "-", cabinet: "30", phone: null },
    "ДП": { name: "-", cabinet: "7", phone: null },
    "География": { name: "-", cabinet: "41", phone: null },
    "ЧИО": { name: "-", cabinet: "19", phone: null },
    "Классный час": { name: "-", cabinet: "-", phone: null },
  },
  weekSchedule: [
    {
      name: "Понедельник",
      isWorkday: true,
      lessons: ["Физкультура", "Русская литература", "Математика", "Химия", "Русский язык", "Кыргыз тили"]
    },
    {
      name: "Вторник",
      isWorkday: true,
      lessons: ["Биология", "Физика", "Иностранный язык", "Математика", "География", "Кыргыз тили"]
    },
    {
      name: "Среда",
      isWorkday: true,
      lessons: ["ДП", "ДП", "Математика", "Русская литература", "История", "Классный час"]
    },
    {
      name: "Четверг",
      isWorkday: true,
      lessons: ["Физика", "Русский язык", "Физкультура", "ЧИО", "Иностранный язык", "Кыргыз литература"]
    },
    {
      name: "Пятница",
      isWorkday: true,
      lessons: ["Химия", "Математика", "История", "Русская литература", "Физика", "Кыргыз тили"]
    },
    {
      name: "Суббота",
      isWorkday: false,
      lessons: []
    },
    {
      name: "Воскресенье",
      isWorkday: false,
      lessons: []
    }
  ]
};
