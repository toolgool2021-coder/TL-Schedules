// ===== РАСПИСАНИЕ УРОКОВ =====
let lessonDuration = 45; // По умолчанию 45 минут

const baseStartTime = 480; // 8:00 в минутах

// Фиксированное расписание для 45 минут
const lessonTimesFixed = [
    { num: 1, start: "8:00", startMinutes: 480, end: "8:45", endMinutes: 525 },
    { num: 2, start: "8:50", startMinutes: 530, end: "9:35", endMinutes: 575 },
    { num: 3, start: "9:40", startMinutes: 580, end: "10:25", endMinutes: 625 },
    { num: 4, start: "10:40", startMinutes: 640, end: "11:25", endMinutes: 685 },
    { num: 5, start: "11:30", startMinutes: 690, end: "12:15", endMinutes: 735 },
    { num: 6, start: "12:20", startMinutes: 740, end: "13:05", endMinutes: 785 }
];

// Вычисляем расписание на основе длительности (для 40 и 35 минут)
function generateLessonTimes() {
    if (lessonDuration === 45) {
        return lessonTimesFixed;
    }

    const lessons = [];
    let currentTime = baseStartTime;
    let breakDuration = 5; // Перемена 5 минут

    for (let i = 1; i <= 6; i++) {
        lessons.push({
            num: i,
            start: formatTime(currentTime),
            startMinutes: currentTime,
            end: formatTime(currentTime + lessonDuration),
            endMinutes: currentTime + lessonDuration
        });
        
        currentTime += lessonDuration + breakDuration;
    }

    return lessons;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

let lessonTimes = generateLessonTimes();

const weekSchedule = {
    0: {
        name: "Понедельник",
        lessons: [
            "Физкультура",
            "Математика",
            "Химия",
            "Русская литература",
            "Русский язык",
            "Физика"
        ]
    },
    1: {
        name: "Вторник",
        lessons: [
            "Математика",
            "История",
            "Химия",
            "Физика",
            "Иностранный язык",
            "Кыргыз"
        ]
    },
    2: {
        name: "Среда",
        lessons: [
            "Биология",
            "ДП",
            "Математика",
            "Русская литература",
            "ДП"
        ]
    },
    3: {
        name: "Четверг",
        lessons: [
            "Математика",
            "Кыргыз тили",
            "Русский язык",
            "История",
            "Физкультура",
            "Кыргызска литература"
        ]
    },
    4: {
        name: "Пятница",
        lessons: [
            "Кыргызский язык",
            "Физика",
            "Русская литература",
            "География",
            "Кыргызская литература",
            "ЧИО"
        ]
    },
    5: {
        name: "Суббота",
        lessons: []
    },
    6: {
        name: "Воскресенье",
        lessons: []
    }
};

const dayNames = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

// ===== СНЕГ =====
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = [];
const maxFlakes = 100;

for (let i = 0; i < maxFlakes; i++) {
    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();

    for (let f of snowflakes) {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }

    ctx.fill();
    updateSnow();
}

function updateSnow() {
    for (let f of snowflakes) {
        f.y += f.speed;
        f.x += Math.sin(f.y / height * Math.PI * 2) * 0.5;

        if (f.y > height) f.y = 0;
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
    }

    requestAnimationFrame(drawSnow);
}

drawSnow();

// ===== ЗАГРУЗКА ВЫБРАННОЙ ДЛИТЕЛЬНОСТИ =====
function loadDurationPreference() {
    const saved = localStorage.getItem('lessonDuration');
    if (saved) {
        lessonDuration = parseInt(saved);
        lessonTimes = generateLessonTimes();
        updateDurationButtons();
    }
}

// ===== ОБНОВЛЕНИЕ КНОПОК ДЛИТЕЛЬНОСТИ =====
function updateDurationButtons() {
    document.querySelectorAll('.duration-btn').forEach(btn => {
        if (parseInt(btn.dataset.duration) === lessonDuration) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===== ПЕРЕКЛЮЧЕНИЕ ДЛИТЕЛЬНОСТИ =====
document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        lessonDuration = parseInt(this.dataset.duration);
        lessonTimes = generateLessonTimes();
        localStorage.setItem('lessonDuration', lessonDuration);
        updateDurationButtons();
        updateDisplay();
    });
});

// ===== ФУНКЦИИ ДЛЯ РАСПИСАНИЯ И ТАЙМЕРА =====
function getCurrentLessonInfo() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 5 || dayOfWeek === 6) {
        return {
            hasLesson: false,
            currentLesson: null,
            nextLesson: null,
            allLessonsFinished: true
        };
    }

    let currentLesson = null;
    let nextLesson = null;

    for (let lesson of lessonTimes) {
        if (currentMinutes >= lesson.startMinutes && currentMinutes <= lesson.endMinutes) {
            currentLesson = lesson;
            break;
        }
    }

    if (!currentLesson) {
        for (let lesson of lessonTimes) {
            if (lesson.startMinutes > currentMinutes) {
                nextLesson = lesson;
                break;
            }
        }
    }

    const allLessonsFinished = lessonTimes.every(lesson => lesson.endMinutes <= currentMinutes);

    return {
        hasLesson: !!currentLesson,
        currentLesson: currentLesson,
        nextLesson: nextLesson,
        allLessonsFinished: allLessonsFinished,
        currentMinutes: currentMinutes
    };
}

function updateDisplay() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const dayOfWeek = now.getDay();
    const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

    document.getElementById('currentDate').textContent = dateStr;
    document.getElementById('currentDay').textContent = dayName;

    const lessonInfo = getCurrentLessonInfo();
    const statusEl = document.getElementById('lessonStatus');

    if (dayOfWeek === 5 || dayOfWeek === 6) {
        document.getElementById('currentLesson').textContent = '🎉 Выходной день!';
        document.getElementById('timerValue').textContent = '🎉';
        statusEl.textContent = '';
    } else if (lessonInfo.hasLesson && lessonInfo.currentLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const lessonName = lessons[lessonInfo.currentLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = `Урок ${lessonInfo.currentLesson.num}: ${lessonName}`;
        statusEl.textContent = '🔴 Сейчас идёт урок';

        const endTimeMinutes = lessonInfo.currentLesson.endMinutes;
        const timeLeftMinutes = endTimeMinutes - lessonInfo.currentMinutes;
        updateTimer(timeLeftMinutes);
    } else if (lessonInfo.nextLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const nextLessonName = lessons[lessonInfo.nextLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = `Урок ${lessonInfo.nextLesson.num}: ${nextLessonName}`;
        
        const startTimeMinutes = lessonInfo.nextLesson.startMinutes;
        const timeLeftMinutes = startTimeMinutes - lessonInfo.currentMinutes;
        
        const hours = Math.floor(timeLeftMinutes / 60);
        const mins = Math.floor(timeLeftMinutes % 60);
        statusEl.textContent = `⏳ До начала ${hours > 0 ? hours + 'ч ' : ''}${mins}м`;
        
        updateTimer(timeLeftMinutes);
    } else if (lessonInfo.allLessonsFinished) {
        document.getElementById('currentLesson').textContent = 'Все уроки закончились! 🎉';
        document.getElementById('timerValue').textContent = '✨';
        statusEl.textContent = '✅ Занятия закончены';
    }

    updateTodaySchedule();
    updateFullSchedule();
}

function updateTimer(minutes) {
    if (minutes < 0) {
        document.getElementById('timerValue').textContent = '00:00:00';
        return;
    }

    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);

    const timerStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('timerValue').textContent = timerStr;
}

function updateTodaySchedule() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const scheduleList = document.getElementById('scheduleList');
    const scheduleTitle = document.getElementById('scheduleTitle');

    scheduleList.innerHTML = '';

    if (dayOfWeek === 5 || dayOfWeek === 6) {
        scheduleList.innerHTML = '<div class="no-lessons">🎉 Выходной день! 🎉</div>';
        scheduleTitle.textContent = 'Выходной';
        return;
    }

    const todayLessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;

    if (todayLessons.length === 0) {
        scheduleList.innerHTML = '<div class="no-lessons">Нет занятий</div>';
        return;
    }

    for (let i = 0; i < todayLessons.length; i++) {
        const lesson = lessonTimes[i];
        const lessonName = todayLessons[i];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';

        if (currentMinutes >= lesson.startMinutes && currentMinutes <= lesson.endMinutes) {
            scheduleItem.classList.add('active');
        } else if (lesson.endMinutes < currentMinutes) {
            scheduleItem.classList.add('finished');
        }

        scheduleItem.innerHTML = `
            <div class="lesson-number">Урок ${lesson.num}</div>
            <div class="lesson-name">${lessonName}</div>
            <div class="lesson-time">${lesson.start} - ${lesson.end}</div>
        `;

        scheduleList.appendChild(scheduleItem);
    }

    scheduleTitle.textContent = `Расписание на ${dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]}`;
}

function updateFullSchedule() {
    const weekScheduleDiv = document.getElementById('weekSchedule');
    weekScheduleDiv.innerHTML = '';

    for (let day = 0; day < 5; day++) {
        const dayInfo = weekSchedule[day];
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-schedule';

        let lessonsHtml = '';

        if (dayInfo.lessons.length === 0) {
            lessonsHtml = '<div class="no-lessons">Нет занятий</div>';
        } else {
            for (let i = 0; i < dayInfo.lessons.length; i++) {
                const lessonTime = lessonTimes[i];
                const lessonName = dayInfo.lessons[i];

                lessonsHtml += `
                    <div class="day-lesson">
                        <div class="day-lesson-number">${i + 1}</div>
                        <div class="day-lesson-info">
                            <div class="day-lesson-name">${lessonName}</div>
                            <div class="day-lesson-time">${lessonTime.start} - ${lessonTime.end}</div>
                        </div>
                    </div>
                `;
            }
        }

        dayDiv.innerHTML = `
            <div class="day-name">${dayInfo.name}</div>
            <div class="day-lessons">${lessonsHtml}</div>
        `;

        weekScheduleDiv.appendChild(dayDiv);
    }
}

// ===== ОБНОВЛЯЕМ ДИСПЛЕЙ КАЖДУЮ СЕКУНДУ =====
loadDurationPreference();
updateDisplay();
setInterval(updateDisplay, 1000);