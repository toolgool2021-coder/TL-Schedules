// ===== РАСПИСАНИЕ УРОКОВ =====
const lessonTimes = [
    { num: 1, start: "8:00", startMinutes: 480, end: "8:45", endMinutes: 525 },
    { num: 2, start: "8:50", startMinutes: 530, end: "9:35", endMinutes: 575 },
    { num: 3, start: "9:40", startMinutes: 580, end: "10:25", endMinutes: 625 },
    { num: 4, start: "10:40", startMinutes: 640, end: "11:25", endMinutes: 685 },
    { num: 5, start: "11:30", startMinutes: 690, end: "12:15", endMinutes: 735 },
    { num: 6, start: "12:20", startMinutes: 740, end: "13:05", endMinutes: 785 }
];

const weekSchedule = {
    0: { // Понедельник
        name: "Понедельник",
        lessons: [
            "Физкультура",
            "Математика",
            "Химия",
            "Русская литература",
            "Русск��й язык",
            "Физика"
        ]
    },
    1: { // Вторник
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
    2: { // Среда
        name: "Среда",
        lessons: [
            "Биология",
            "ДП",
            "Математика",
            "Русская литература",
            "ДП"
        ]
    },
    3: { // Четверг
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
    4: { // Пятница
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
    5: { // Суббота
        name: "Суббота",
        lessons: []
    },
    6: { // Воскресенье
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
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.5 + 0.2
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
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
        f.x += Math.sin(f.y / height * Math.PI * 2) * 0.3;

        if (f.y > height) f.y = 0;
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
    }

    requestAnimationFrame(drawSnow);
}

drawSnow();

// ===== ФУНКЦИИ ДЛЯ РАСПИСАНИЯ И ТАЙМЕРА =====

function getCurrentLessonInfo() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();

    // Если суббота или воскресенье
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

    // Ищем текущий урок
    for (let lesson of lessonTimes) {
        if (currentMinutes >= lesson.startMinutes && currentMinutes <= lesson.endMinutes) {
            currentLesson = lesson;
            break;
        }
    }

    // Ищем следующий урок
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
    // Обновляем дату и день
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const dayOfWeek = now.getDay();
    const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Переводим на правильный день (1-7 вместо 0-6)

    document.getElementById('currentDate').textContent = dateStr;
    document.getElementById('currentDay').textContent = dayName;

    // Получаем информацию о текущем уроке
    const lessonInfo = getCurrentLessonInfo();

    // Обновляем информацию о текущ��м уроке
    if (dayOfWeek === 5 || dayOfWeek === 6) {
        document.getElementById('currentLesson').textContent = '🎉 Выходной день!';
        document.getElementById('timerLabel').textContent = 'Отдыхай!';
        document.getElementById('timerValue').textContent = '🎉';
    } else if (lessonInfo.hasLesson && lessonInfo.currentLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const lessonName = lessons[lessonInfo.currentLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = `Урок ${lessonInfo.currentLesson.num}: ${lessonName}`;
        document.getElementById('timerLabel').textContent = 'Осталось до конца урока';

        // Обновляем таймер
        const endTimeMinutes = lessonInfo.currentLesson.endMinutes;
        const timeLeft = endTimeMinutes - lessonInfo.currentMinutes;
        updateTimer(timeLeft);
    } else if (lessonInfo.nextLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const nextLessonName = lessons[lessonInfo.nextLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = `Урок ${lessonInfo.nextLesson.num}: ${nextLessonName} в ${lessonInfo.nextLesson.start}`;
        document.getElementById('timerLabel').textContent = 'Осталось до начала урока';

        // Обновляем таймер
        const startTimeMinutes = lessonInfo.nextLesson.startMinutes;
        const timeLeft = startTimeMinutes - lessonInfo.currentMinutes;
        updateTimer(timeLeft);
    } else if (lessonInfo.allLessonsFinished) {
        document.getElementById('currentLesson').textContent = 'Все уроки закончились! 🎉';
        document.getElementById('timerLabel').textContent = 'Отдыхай!';
        document.getElementById('timerValue').textContent = '✨';
    }

    // Обновляем расписание на сегодня
    updateTodaySchedule();

    // Обновляем полное расписание
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
    const lessonInfo = getCurrentLessonInfo();
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

    for (let day = 0; day < 5; day++) { // Только будни (понедельник-пятница)
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
updateDisplay();
setInterval(updateDisplay, 1000);

// ===== ЭФФЕКТЫ ПРИ КЛИКЕ =====
document.addEventListener('click', (e) => {
    createClickWave(e.clientX, e.clientY);
});

function createClickWave(x, y) {
    const wave = document.createElement('div');
    wave.style.position = 'fixed';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    wave.style.width = '10px';
    wave.style.height = '10px';
    wave.style.borderRadius = '50%';
    wave.style.border = '2px solid #a855f7';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '3';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.animation = 'ripple 0.6s ease-out forwards';
    
    document.body.appendChild(wave);
    
    setTimeout(() => wave.remove(), 600);
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===== ЧАСТИЦЫ ПРИ ДВИЖЕНИИ МЫШИ =====
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        createMouseParticles(e.clientX, e.clientY);
    }
});

function createMouseParticles(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '3';
    particle.style.boxShadow = '0 0 8px #a855f7';
    particle.style.animation = 'particleFloat 1s ease-out forwards';
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(${Math.random() * 100 - 50}px, -50px) scale(0);
        }
    }
`;
document.head.appendChild(particleStyle);