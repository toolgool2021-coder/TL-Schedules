"use strict";

(() => {
  const appConfig = {
    DEFAULT_LESSON_DURATION: 45,
    BASE_START_TIME: 480,
    BREAK_DURATION: 5,

    lessonTimesFixed: [
      { startMinutes: 480, endMinutes: 525 },
      { startMinutes: 530, endMinutes: 575 },
      { startMinutes: 580, endMinutes: 625 },
      { startMinutes: 640, endMinutes: 685 },
      { startMinutes: 690, endMinutes: 735 },
      { startMinutes: 740, endMinutes: 785 }
    ]
  };

  const teachersDatabase = {
    "Физкультура": {
      name: "-",
      cabinet: "спорт зал",
      phone: null
    },
    "Математика": {
      name: "-",
      cabinet: "30",
      phone: null
    },
    "Химия": {
      name: "-",
      cabinet: "39",
      phone: null
    },
    "Русская литература": {
      name: "Нурумова Елена",
      cabinet: "43",
      phone: "+996554603042"
    },
    "Русский язык": {
      name: "Нурумова Елена",
      cabinet: "43",
      phone: "+996554603042"
    },
    "Физика": {
      name: "-",
      cabinet: "38",
      phone: null
    },
    "История": {
      name: "-",
      cabinet: "19",
      phone: null
    },
    "Иностранный язык": {
      name: "-",
      cabinet: "33",
      phone: null
    },
    "Кыргыз тили": {
      name: "Томоева Гульзат",
      cabinet: "37",
      phone: "+996703151331"
    },
    "Кыргыз литература": {
      name: "Томоева Гульзат",
      cabinet: "37",
      phone: "+996703151331"
    },
    "Биология": {
      name: "-",
      cabinet: "30",
      phone: null
    },
    "ДП": {
      name: "-",
      cabinet: "7",
      phone: null
    },
    "География": {
      name: "-",
      cabinet: "41",
      phone: null
    },
    "ЧИО": {
      name: "-",
      cabinet: "19",
      phone: null
    },
    "Классный час": {
      name: "-",
      cabinet: "-",
      phone: null
    }
  };

  const weekSchedule = [
    {
      name: "Понедельник",
      short: "ПН",
      lessons: [
        "Физкультура",
        "Русская литература",
        "Математика",
        "Химия",
        "Русский язык",
        "Кыргыз тили"
      ]
    },
    {
      name: "Вторник",
      short: "ВТ",
      lessons: [
        "Биология",
        "Физика",
        "Иностранный язык",
        "Математика",
        "География",
        "Кыргыз тили"
      ]
    },
    {
      name: "Среда",
      short: "СР",
      lessons: [
        "ДП",
        "ДП",
        "Математика",
        "Русская литература",
        "История",
        "Классный час"
      ]
    },
    {
      name: "Четверг",
      short: "ЧТ",
      lessons: [
        "Иностранный язык",
        "Русский язык",
        "Физкультура",
        "ЧИО",
        "Физика",
        "Кыргыз литература"
      ]
    },
    {
      name: "Пятница",
      short: "ПТ",
      lessons: [
        "Химия",
        "Математика",
        "История",
        "Русская литература",
        "Физика",
        "Кыргыз тили"
      ]
    },
    {
      name: "Суббота",
      short: "СБ",
      lessons: []
    },
    {
      name: "Воскресенье",
      short: "ВС",
      lessons: []
    }
  ];

  window.TL_APP_DATA = {
    appConfig,
    teachersDatabase,
    weekSchedule
  };
})();
