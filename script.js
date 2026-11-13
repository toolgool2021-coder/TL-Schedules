"use strict";

const $ = id => document.getElementById(id);

const {
  appConfig: config,
  teachersDatabase: teachers,
  weekSchedule: week
} = window.TL_APP_DATA;

const esc = value => String(value ?? "").replace(
  /[&<>"']/g,
  c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c])
);

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

// Сохраняем совместимость с заметками прежней версии.
const savedNotes = read("tlScheduleNotes", {});

let notes =
  savedNotes &&
  typeof savedNotes === "object" &&
  !Array.isArray(savedNotes)
    ? savedNotes
    : {};

let duration = Number(read("tlAppDuration", 45));

if (![30, 35, 40, 45].includes(duration)) {
  duration = 45;
}

let theme = read("tlTheme", "dark");
let low = Boolean(read("tlLow", false));

const motion = matchMedia("(prefers-reduced-motion: reduce)");

let selected = localNow().day;
let view = "day";
let lastStamp = "";
let noteId = "";
let toastTimer;

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast(
      "Не удалось сохранить на устройстве. Данные доступны до закрытия страницы."
    );
    return false;
  }
}

/* Время Кыргызстана независимо от часового пояса устройства */

function localNow(date = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bishkek",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    })
      .formatToParts(date)
      .map(x => [x.type, x.value])
  );

  const calendar = new Date(
    Date.UTC(+p.year, +p.month - 1, +p.day)
  );

  return {
    day: (calendar.getUTCDay() + 6) % 7,
    seconds: +p.hour * 3600 + +p.minute * 60 + +p.second,
    date: calendar,
    key: `${p.year}-${p.month}-${p.day}`,
    hour: +p.hour
  };
}

const hm = minutes =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:` +
  String(minutes % 60).padStart(2, "0");

function times(count) {
  let start = config.BASE_START_TIME;

  return Array.from({ length: count }, (_, i) => {
    const fixed =
      duration === 45 &&
      config.lessonTimesFixed[i];

    const a = fixed ? fixed.startMinutes : start;
    const b = fixed ? fixed.endMinutes : a + duration;

    start = b + config.BREAK_DURATION;

    return { a, b };
  });
}

/* Текущее событие и ближайшее занятие */

function state(now) {
  const lessons = week[now.day].lessons;
  const ts = times(lessons.length);
  const s = now.seconds;

  for (let i = 0; i < ts.length; i++) {
    const { a, b } = ts[i];

    if (s < a * 60) {
      return {
        kind: i ? "break" : "before",
        day: now.day,
        i,
        target: a * 60,
        start: i ? ts[i - 1].b * 60 : 0,
        end: a * 60
      };
    }

    if (s < b * 60) {
      return {
        kind: "lesson",
        day: now.day,
        i,
        target: b * 60,
        start: a * 60,
        end: b * 60
      };
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const day = (now.day + offset) % 7;

    if (week[day].lessons.length) {
      return {
        kind: lessons.length ? "done" : "rest",
        day,
        i: 0,
        target: offset * 86400 + times(1)[0].a * 60,
        offset
      };
    }
  }

  return { kind: "empty" };
}

function clock(seconds) {
  seconds = Math.max(0, Math.floor(seconds));

  const days = Math.floor(seconds / 86400);

  return (
    (days ? days + "д " : "") +
    [
      Math.floor(seconds % 86400 / 3600),
      Math.floor(seconds % 3600 / 60),
      seconds % 60
    ]
      .map(n => String(n).padStart(2, "0"))
      .join(":")
  );
}

function toast(text) {
  $("toast").textContent = text;
  $("toast").classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    $("toast").classList.remove("show");
  }, 3500);
}

/* Тема и анимации */

function applyAppearance() {
  document.documentElement.dataset.theme =
    theme === "light" ? "light" : "dark";

  document.documentElement.classList.toggle(
    "still",
    low || motion.matches
  );

  $("themeBtn").textContent =
    theme === "light" ? "☾" : "☀";

  $("themeBtn").setAttribute(
    "aria-label",
    theme === "light"
      ? "Включить тёмную тему"
      : "Включить светлую тему"
  );

  $("lowMotion").checked = low;

  document.querySelector('meta[name="theme-color"]').content =
    theme === "light" ? "#f1f4fa" : "#0b101b";
}

/* Дни текущей недели */

function renderTabs() {
  const now = localNow();

  $("days").innerHTML = week.map((d, i) => {
    const date = new Date(now.date);

    date.setUTCDate(
      date.getUTCDate() - now.day + i
    );

    return `
      <button
        class="day ${selected === i ? "active" : ""}
        ${i === now.day ? "is-today" : ""}"
        data-day="${i}"
        aria-pressed="${selected === i}"
        aria-label="${esc(d.name)}"
      >
        <span>${esc(d.short)}</span>
        <b>${date.getUTCDate()}</b>
        <i></i>
      </button>
    `;
  }).join("");
}

/* Карточки занятий */

function renderSchedule() {
  const now = localNow();
  const current = state(now);

  const query = $("search").value
    .trim()
    .toLocaleLowerCase("ru");

  const list = view === "week"
    ? week.map((_, i) => i)
    : [selected];

  $("scheduleTitle").textContent =
    view === "week"
      ? "Твоя неделя"
      : week[selected].name;

  $("days").hidden = view === "week";

  $("schedule").classList.toggle(
    "week-grid",
    view === "week"
  );

  $("schedule").innerHTML = list.map(day => {
    const lessons = week[day].lessons;
    const ts = times(lessons.length);

    const cards = lessons.map((subject, i) => {
      const t = teachers[subject] || {};
      const key = `note_${day}_${i + 1}`;

      const note = typeof notes[key] === "string"
        ? notes[key]
        : "";

      const searchable = [
        subject,
        t.name,
        t.cabinet,
        note
      ].join(" ").toLocaleLowerCase("ru");

      if (query && !searchable.includes(query)) {
        return "";
      }

      const live =
        day === now.day &&
        current.kind === "lesson" &&
        current.i === i;

      const past =
        day === now.day &&
        now.seconds >= ts[i].b * 60;

      const room = t.cabinet && t.cabinet !== "-"
        ? "Каб. " + esc(t.cabinet)
        : "Кабинет не указан";

      return `
        <article
          class="lesson ${live ? "live" : ""}
          ${past ? "past" : ""}"
          style="--i:${i}"
        >
          <div class="lesson-number">
            ${String(i + 1).padStart(2, "0")}
          </div>

          <button
            class="subject"
            data-teacher="${day}:${i}"
          >
            <strong>${esc(subject)}</strong>

            <span>
              ${hm(ts[i].a)} — ${hm(ts[i].b)} · ${room}
            </span>

            ${live ? "<em>Сейчас идёт</em>" : ""}
          </button>

          <button
            class="note-button ${note ? "filled" : ""}"
            data-note="${day}:${i}"
            aria-label="Заметка: ${esc(subject)}"
          >
            ${note ? "✎" : "+"}
          </button>

          ${
            note
              ? `<p class="note-preview">${esc(note)}</p>`
              : ""
          }
        </article>
      `;
    }).join("");

    const empty = `
      <div class="empty">
        <span>${query ? "⌕" : "☁"}</span>
        <h3>${query ? "Ничего не найдено" : "День для себя"}</h3>
        <p>
          ${
            query
              ? "Попробуй другой запрос."
              : "На этот день занятий нет."
          }
        </p>
      </div>
    `;

    return `
      <section class="day-group">
        ${
          view === "week"
            ? `
              <h3>
                ${esc(week[day].name)}
                <small>${lessons.length} ур.</small>
              </h3>
            `
            : ""
        }

        ${cards || empty}
      </section>
    `;
  }).join("");

  $("durationHint").textContent = duration === 45
    ? "Обычные звонки · большая перемена после 3-го урока"
    : "Сокращённые звонки · перемены по 5 минут";

  document.querySelectorAll("[data-duration]").forEach(b => {
    const active = +b.dataset.duration === duration;

    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", String(active));
  });
}

/* Обновление таймера без пересоздания карточек каждую секунду */

function tick(force = false) {
  const now = localNow();
  const s = state(now);

  const lessons = week[now.day].lessons;
  const ts = times(lessons.length);

  const subject = s.day === undefined
    ? ""
    : week[s.day].lessons[s.i];

  $("greeting").textContent =
    now.hour < 5 ? "Доброй ночи." :
    now.hour < 12 ? "Доброе утро." :
    now.hour < 18 ? "Добрый день." :
    "Добрый вечер.";

  $("date").textContent = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC"
  }).format(now.date);

  $("liveClock").textContent = clock(now.seconds);

  const titles = {
    lesson: subject,
    break: "Перемена. Выдохни.",
    before: "Начнём с хорошего.",
    done: "На сегодня всё.",
    rest: "Сегодня без уроков.",
    empty: "Пока без занятий."
  };

  const tags = {
    lesson: "СЕЙЧАС НА УРОКЕ",
    break: "ВРЕМЯ ПЕРЕМЕНЫ",
    before: "ДО ПЕРВОГО УРОКА",
    done: "УЧЕБНЫЙ ДЕНЬ ЗАВЕРШЁН",
    rest: "ВЫХОДНОЙ",
    empty: "РАСПИСАНИЕ ПУСТО"
  };

  $("heroTitle").textContent = titles[s.kind];
  $("status").textContent = tags[s.kind];

  $("timer").textContent = s.target === undefined
    ? "—"
    : clock(s.target - now.seconds);

  $("timerLabel").textContent = s.kind === "lesson"
    ? "до конца урока"
    : "до следующего занятия";

  $("heroSub").textContent = s.kind === "lesson"
    ? `Урок ${s.i + 1} из ${lessons.length} · кабинет ${
        teachers[subject]?.cabinet || "не указан"
      }`
    : subject
      ? `${
          s.offset
            ? week[s.day].name + " · "
            : "Далее: "
        }${subject} · ${hm(times(s.i + 1)[s.i].a)}`
      : "Добавь занятия в data.js";

  const fraction =
    s.kind === "lesson" || s.kind === "break"
      ? (now.seconds - s.start) / (s.end - s.start)
      : s.kind === "done" ? 1 : 0;

  $("progress").style.width =
    `${Math.min(100, Math.max(0, fraction * 100))}%`;

  const completed = ts.filter(
    t => now.seconds >= t.b * 60
  ).length;

  $("completed").textContent =
    `${completed} / ${lessons.length}`;

  $("finish").textContent = ts.length
    ? hm(ts[ts.length - 1].b)
    : "Выходной";

  $("noteCount").textContent = Object.values(notes).filter(
    v => typeof v === "string" && v.trim()
  ).length;

  $("nextLesson").textContent = s.kind === "lesson"
    ? lessons[s.i + 1] || "После урока свободен"
    : subject || "Нет занятий";

  const stamp =
    `${now.key}|${s.kind}|${s.i}|${duration}`;

  if (force || stamp !== lastStamp) {
    const oldDay = lastStamp.split("|")[0];

    if (oldDay && oldDay !== now.key) {
      selected = now.day;
    }

    lastStamp = stamp;

    renderTabs();
    renderSchedule();
  }
}

/* Заметки */

function openNote(day, i) {
  noteId = `note_${day}_${i + 1}`;

  $("noteTitle").textContent = week[day].lessons[i];

  $("noteCaption").textContent =
    `${week[day].name} · урок ${i + 1}. ` +
    "Постоянная заметка, хранится на этом устройстве.";

  $("noteText").value = typeof notes[noteId] === "string"
    ? notes[noteId]
    : "";

  $("noteDialog").showModal();
  $("noteText").focus();
}

/* Преподаватели */

function openTeacher(day, i) {
  const subject = week[day].lessons[i];
  const t = teachers[subject] || {};

  $("teacherTitle").textContent = subject;

  $("teacherName").textContent =
    t.name && t.name !== "-"
      ? t.name
      : "Имя преподавателя пока не указано";

  $("teacherRoom").textContent =
    "Кабинет: " +
    (
      t.cabinet && t.cabinet !== "-"
        ? t.cabinet
        : "не указан"
    );

  const phone = String(t.phone || "")
    .replace(/[^\d+]/g, "");

  $("teacherPhone").textContent =
    phone || "Телефон не указан";

  $("teacherLinks").innerHTML = phone
    ? `
      <a class="primary" href="tel:${esc(phone)}">
        Позвонить
      </a>

      <a
        class="secondary"
        href="https://wa.me/${phone.replace(/\D/g, "")}"
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
    `
    : "";

  $("teacherDialog").showModal();
}

/* Подключение интерфейса */

$("days").addEventListener("click", e => {
  const b = e.target.closest("[data-day]");
  if (!b) return;

  selected = +b.dataset.day;

  renderTabs();
  renderSchedule();
});

$("schedule").addEventListener("click", e => {
  const b = e.target.closest("[data-note],[data-teacher]");
  if (!b) return;

  const isNote = b.hasAttribute("data-note");

  const [d, i] = (
    isNote ? b.dataset.note : b.dataset.teacher
  ).split(":").map(Number);

  if (isNote) {
    openNote(d, i);
  } else {
    openTeacher(d, i);
  }
});

$("durations").addEventListener("click", e => {
  const b = e.target.closest("[data-duration]");
  if (!b) return;

  duration = +b.dataset.duration;

  persist("tlAppDuration", duration);
  tick(true);
});

function setView(value) {
  view = value;

  document.querySelectorAll("[data-view]").forEach(b => {
    const active = b.dataset.view === view;

    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", String(active));
  });

  renderSchedule();
}

document.querySelectorAll("[data-view]").forEach(b => {
  b.onclick = () => setView(b.dataset.view);
});

$("todayBtn").onclick = () => {
  selected = localNow().day;

  setView("day");
  renderTabs();

  $("planner").scrollIntoView({
    behavior: low || motion.matches ? "instant" : "smooth"
  });
};

$("search").addEventListener("input", renderSchedule);

$("saveNote").onclick = () => {
  const text = $("noteText").value.trim();

  if (text) {
    notes[noteId] = text;
  } else {
    delete notes[noteId];
  }

  const saved = persist("tlScheduleNotes", notes);

  $("noteDialog").close();
  tick(true);

  if (saved) {
    toast(text ? "Заметка сохранена" : "Заметка удалена");
  }
};

$("themeBtn").onclick = () => {
  theme = theme === "dark" ? "light" : "dark";

  persist("tlTheme", theme);
  applyAppearance();
};

$("settingsBtn").onclick = () => {
  $("settingsDialog").showModal();
};

$("lowMotion").onchange = e => {
  low = e.target.checked;

  persist("tlLow", low);
  applyAppearance();
};

motion.addEventListener("change", applyAppearance);

document.querySelectorAll("[data-close]").forEach(b => {
  b.onclick = () => b.closest("dialog").close();
});

document.querySelectorAll("dialog").forEach(d => {
  d.addEventListener("click", e => {
    if (e.target !== d) return;

    const r = d.getBoundingClientRect();

    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    ) {
      d.close();
    }
  });
});

/* Скачивание расписания */

$("exportBtn").onclick = () => {
  const text = week.map((d, day) => {
    const rows = d.lessons.map((name, i) => {
      const t = times(d.lessons.length)[i];
      const note = notes[`note_${day}_${i + 1}`];

      return (
        `${i + 1}. ${hm(t.a)}–${hm(t.b)} ${name}` +
        (
          typeof note === "string" && note
            ? "\n   " + note
            : ""
        )
      );
    }).join("\n");

    return d.name + "\n" + rows;
  }).join("\n\n");

  const url = URL.createObjectURL(
    new Blob(
      ["TL Schedules\nВремя: Кыргызстан\n\n" + text],
      { type: "text/plain;charset=utf-8" }
    )
  );

  const a = document.createElement("a");

  a.href = url;
  a.download = "TL-Schedules.txt";

  document.body.append(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/* Печать всей недели */

$("printBtn").onclick = () => {
  $("settingsDialog").close();
  $("search").value = "";

  setView("week");
  window.print();
};

/* Состояние сети */

function network() {
  $("network").textContent = navigator.onLine
    ? "Сеть доступна"
    : "Нет сети · открытая страница работает";
}

addEventListener("online", network);
addEventListener("offline", network);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    tick(true);
  }
});

/* Запуск */

applyAppearance();
network();
tick(true);

setInterval(() => {
  if (!document.hidden) {
    tick();
  }
}, 1000);
