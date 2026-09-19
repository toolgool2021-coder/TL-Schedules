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
    "Человек и общество": { name: "-", cabinet: "19", phone: null },
    "ЧИО": { name: "-", cabinet: "19", phone: null },
    "Астрономия": { name: "-", cabinet: "39", phone: null }
  },
  weekSchedule: [
    {
      name: "Понедельник",
      isWorkday: true,
      lessons: ["Иностранный язык", "Русская литература", "ЧИО", "География", "Кыргыз тили"]
    },
    {
      name: "Вторник",
      isWorkday: true,
      // Рабочий день без предметов: время уроков всё равно отображается.
      lessons: ["Свободное время", "Свободное время", "Свободное время", "Свободное время", "Свободное время", "Свободное время"]
    },
    {
      name: "Среда",
      isWorkday: true,
      lessons: ["Физика", "Химия", "Кыргыз тили"]
    },
    {
      name: "Четверг",
      isWorkday: true,
      lessons: ["Иностранный язык", "Физкультура", "Кыргыз тили", "География"]
    },
    {
      name: "Пятница",
      isWorkday: true,
      lessons: ["ЧИО", "Физика", "ДП", "ДП"]
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
