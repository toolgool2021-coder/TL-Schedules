// ===== РАСПИСАНИЕ УРОКОВ =====
let lessonDuration = 45;

const baseStartTime = 480;

const lessonTimesFixed = [
    { num: 1, start: "8:00", startMinutes: 480, end: "8:45", endMinutes: 525 },
    { num: 2, start: "8:50", startMinutes: 530, end: "9:35", endMinutes: 575 },
    { num: 3, start: "9:40", startMinutes: 580, end: "10:25", endMinutes: 625 },
    { num: 4, start: "10:40", startMinutes: 640, end: "11:25", endMinutes: 685 },
    { num: 5, start: "11:30", startMinutes: 690, end: "12:15", endMinutes: 735 },
    { num: 6, start: "12:20", startMinutes: 740, end: "13:05", endMinutes: 785 }
];

function generateLessonTimes() {
    if (lessonDuration === 45) {
        return lessonTimesFixed;
    }

    const lessons = [];
    let currentTime = baseStartTime;
    let breakDuration = 5;

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

// ===== БАЗА ДАННЫХ УЧИТЕЛЕЙ =====
const teachersDatabase = {
    "Физкультура": { name: "Моношева Айгерим", cabinet: "спорт зал", phone: null },
    "Математика": { name: "Калыбаева Кульжан", cabinet: "30", phone: "+996558337747" },
    "Химия": { name: "Калыбаева Кульжан", cabinet: "30", phone: "+996558337747" },
    "Русская литература": { name: "Нурумова Елена", cabinet: "43", phone: "+996554603042" },
    "Русский язык": { name: "Нурумова Елена", cabinet: "43", phone: "+996554603042" },
    "Физика": { name: "Рубцов Андрей", cabinet: "39", phone: "+996776979884" },
    "История": { name: "Корголдоев Алишер", cabinet: "19", phone: "+996505904065" },
    "Иностранный язык": { name: "Темирова Элес", cabinet: "35", phone: "+996708681464" },
    "Кыргыз": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "Биология": { name: "Калыбаева Кульжан", cabinet: "30", phone: "+996554202642" },
    "ДП": { name: "Томоева Гульзат", cabinet: "37", phone: "+996500703906" },
    "Кыргыз тили": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "Кыргызска литература": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "Кыргызский язык": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "Кыргызская литература": { name: "Томоева Гульзат", cabinet: "37", phone: "+996558337747" },
    "География": { name: "Эсенгулова Жыпаргул", cabinet: "41", phone: "+996559312013" },
    "Человек и общество": { name: "Корголдоев Алишер", cabinet: "19", phone: "+996505904065" },
    "ЧИО": { name: "Корголдоев Алишер", cabinet: "19", phone: "+996505904065" },
    "Астрономия": { name: "Рубцов Андрей", cabinet: "39", phone: "+996776979884" }
};

const weekSchedule = {
    0: {
        name: "Понедельник",
        lessons: ["Физкультура", "Математика", "Химия", "Русская литература", "Русский язык", "Физика"]
    },
    1: {
        name: "Вторник",
        lessons: ["Математика", "История", "Химия", "Физика", "Иностранный язык", "Кыргыз"]
    },
    2: {
        name: "Среда",
        lessons: ["Биология", "ДП", "Математика", "Русская литература", "ДП"]
    },
    3: {
        name: "Четверг",
        lessons: ["Математика", "Кыргыз тили", "Русский язык", "История", "Физкультура", "Кыргызска литература"]
    },
    4: {
        name: "Пятница",
        lessons: ["Иностранный язык", "Физика", "Русская литература", "География", "Кыргызская литература", "ЧИО"]
    },
    5: { name: "Суббота", lessons: [] },
    6: { name: "Воскресенье", lessons: [] }
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

// ===== ЗАМЕТКИ (С LOCALSTORAGE) =====
const modal = document.getElementById('noteModal');
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const closeNoteBtn = document.getElementById('closeNoteBtn');
const closeBtn = document.querySelector('#noteModal .close');

// ===== МОДАЛЬНОЕ ОКНО ДЛЯ ПОДРОБНОСТЕЙ УЧИТЕЛЯ =====
const teacherModal = document.getElementById('teacherModal');
const teacherCloseBtn = document.querySelector('#teacherModal .close');

function openTeacherModal(lessonName) {
    const teacher = teachersDatabase[lessonName];
    
    if (!teacher) {
        alert('Информация о преподавателе не найдена');
        return;
    }

    document.getElementById('teacherName').textContent = teacher.name || '-';
    document.getElementById('teacherSource').textContent = 'взято с Э-күндөлүк, поэтому информация может быть не точная';
    document.getElementById('teacherCabinet').textContent = `🚪 Кабинет: ${teacher.cabinet || '-'}`;
    document.getElementById('teacherSubject').textContent = `📚 Предмет: ${lessonName}`;
    
    const phoneEl = document.getElementById('teacherPhone');
    const buttonsEl = document.getElementById('teacherButtons');
    
    if (teacher.phone) {
        phoneEl.textContent = `☎️ ${teacher.phone}`;
        const phoneClean = teacher.phone.replace(/\D/g, '');
        buttonsEl.innerHTML = `
            <a href="tel:+${phoneClean}" class="teacher-btn-call" title="Позвонить">
                <i class="fas fa-phone"></i>
            </a>
            <a href="https://wa.me/${phoneClean}" target="_blank" class="teacher-btn-whatsapp" title="WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
    } else {
        phoneEl.textContent = `☎️ -`;
        buttonsEl.innerHTML = '<span class="teacher-btn-disabled"><i class="fas fa-phone"></i></span>';
    }
    
    teacherModal.style.display = 'block';
}

function closeTeacherModal() {
    teacherModal.style.display = 'none';
}

if (teacherCloseBtn) {
    teacherCloseBtn.addEventListener('click', closeTeacherModal);
}

window.addEventListener('click', (event) => {
    if (event.target === teacherModal) {
        closeTeacherModal();
    }
});

let currentNoteKey = null;
let notes = JSON.parse(localStorage.getItem('tlScheduleNotes')) || {};

function openNoteModal(dayOfWeek, lessonNum, lessonName) {
    currentNoteKey = `note_${dayOfWeek}_${lessonNum}`;
    const savedNote = notes[currentNoteKey] || '';
    
    document.getElementById('modalTitle').textContent = `Заметка: ${dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]} - Урок ${lessonNum} (${lessonName})`;
    noteText.value = savedNote;
    modal.style.display = 'block';
    noteText.focus();
}

function closeNoteModal() {
    modal.style.display = 'none';
}

function saveNote() {
    if (noteText.value.trim()) {
        notes[currentNoteKey] = noteText.value;
    } else {
        delete notes[currentNoteKey];
    }
    localStorage.setItem('tlScheduleNotes', JSON.stringify(notes));
    closeNoteModal();
    updateTodaySchedule();
    updateFullSchedule();
}

function deleteNote(dayOfWeek, lessonNum) {
    const noteKey = `note_${dayOfWeek}_${lessonNum}`;
    delete notes[noteKey];
    localStorage.setItem('tlScheduleNotes', JSON.stringify(notes));
    updateTodaySchedule();
    updateFullSchedule();
}

function viewNote(dayOfWeek, lessonNum) {
    const noteKey = `note_${dayOfWeek}_${lessonNum}`;
    const note = notes[noteKey];
    if (note) {
        alert(note);
    }
}

if (saveNoteBtn) saveNoteBtn.addEventListener('click', saveNote);
if (closeNoteBtn) closeNoteBtn.addEventListener('click', closeNoteModal);
if (closeBtn) closeBtn.addEventListener('click', closeNoteModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) closeNoteModal();
});

// ===== ЗАГРУЗКА ВЫБРАННОЙ ДЛИТЕЛЬНОСТИ =====
function loadDurationPreference() {
    const saved = localStorage.getItem('lessonDuration');
    if (saved) {
        lessonDuration = parseInt(saved);
        lessonTimes = generateLessonTimes();
        updateDurationButtons();
    }
}

function updateDurationButtons() {
    document.querySelectorAll('.duration-btn').forEach(btn => {
        if (parseInt(btn.dataset.duration) === lessonDuration) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        lessonDuration = parseInt(this.dataset.duration);
        lessonTimes = generateLessonTimes();
        localStorage.setItem('lessonDuration', lessonDuration);
        updateDurationButtons();
        updateDisplay();
    });
});

// ===== СКАЧИВАНИЕ ОФФЛАЙН ВЕРСИИ =====
document.getElementById('downloadOfflineBtn').addEventListener('click', function() {
    fetch('https://raw.githubusercontent.com/toolgool2021-coder/TL-Schedules/main/download/offline.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('GitHub недоступен');
            }
            return response.text();
        })
        .then(html => {
            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'TL-Schedules-Offline.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        })
        .catch(error => {
            const link = document.createElement('a');
            link.href = 'download/offline.html';
            link.download = 'TL-Schedules-Offline.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
});

// ===== ФУНКЦИИ ДЛЯ РАСПИСАНИЯ И ТАЙМЕРА =====
function isWeekend() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    return dayOfWeek === 6;
}

function getCurrentLessonInfo() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();

    if (isWeekend()) {
        return { hasLesson: false, currentLesson: null, nextLesson: null, allLessonsFinished: true };
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

    return { hasLesson: !!currentLesson, currentLesson, nextLesson, allLessonsFinished, currentMinutes };
}

// ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ СЛЕДУЮЩЕГО УРОКА =====
function getNextLesson(dayOfWeek, currentLessonNum) {
    const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
    if (currentLessonNum < lessons.length) {
        return {
            num: currentLessonNum + 1,
            name: lessons[currentLessonNum]
        };
    }
    return null;
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
    const nextLessonEl = document.getElementById('nextLesson');

    if (isWeekend()) {
        document.getElementById('currentLesson').textContent = '🎉 Выходной день!';
        document.getElementById('timerValue').textContent = '🎉';
        statusEl.textContent = '🌟 Время отдыхать!';
        nextLessonEl.textContent = 'Отдыхаем! 🏠';
    } else if (lessonInfo.hasLesson && lessonInfo.currentLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const lessonName = lessons[lessonInfo.currentLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = `Урок ${lessonInfo.currentLesson.num}: ${lessonName}`;
        statusEl.textContent = '🔴 Сейчас идёт урок';
        const nextLesson = getNextLesson(dayOfWeek, lessonInfo.currentLesson.num);
        if (nextLesson) {
            nextLessonEl.textContent = `Следующий урок: Урок ${nextLesson.num} - ${nextLesson.name}`;
        } else {
            nextLessonEl.textContent = 'Следующий урок: Домой! 🏠';
        }
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
        const nextLesson = getNextLesson(dayOfWeek, lessonInfo.nextLesson.num);
        if (nextLesson) {
            nextLessonEl.textContent = `После этого: Урок ${nextLesson.num} - ${nextLesson.name}`;
        } else {
            nextLessonEl.textContent = 'После этого: Домой! 🏠';
        }
        updateTimer(timeLeftMinutes);
    } else if (lessonInfo.allLessonsFinished) {
        document.getElementById('currentLesson').textContent = 'Все уроки закончились! 🎉';
        document.getElementById('timerValue').textContent = '✨';
        statusEl.textContent = '✅ Занятия закончены';
        nextLessonEl.textContent = 'Следующий урок: Домой! 🏠';
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

    if (isWeekend()) {
        scheduleList.innerHTML = '<div class="no-lessons">🎉 Выходной день! Отдыхай! 🎉</div>';
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
        const noteKey = `note_${dayOfWeek}_${lesson.num}`;
        const hasNote = notes[noteKey] !== undefined;
        
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';

        if (currentMinutes >= lesson.startMinutes && currentMinutes <= lesson.endMinutes) {
            scheduleItem.classList.add('active');
        } else if (lesson.endMinutes < currentMinutes) {
            scheduleItem.classList.add('finished');
        }

        scheduleItem.innerHTML = `
            <div class="lesson-number">Урок ${lesson.num}</div>
            <div class="lesson-name" style="cursor: pointer;">${lessonName}</div>
            <div class="lesson-time">${lesson.start} - ${lesson.end}</div>
            <div class="note-controls">
                ${hasNote ? `<button class="note-view-btn" data-day="${dayOfWeek}" data-lesson="${lesson.num}">👁️</button>` : ''}
                <button class="note-edit-btn" data-day="${dayOfWeek}" data-lesson="${lesson.num}">📝</button>
                ${hasNote ? `<button class="note-delete-btn" data-day="${dayOfWeek}" data-lesson="${lesson.num}">✕</button>` : ''}
            </div>
        `;

        const lessonNameEl = scheduleItem.querySelector('.lesson-name');
        lessonNameEl.addEventListener('click', (e) => {
            e.stopPropagation();
            openTeacherModal(lessonName);
        });

        const noteEditBtn = scheduleItem.querySelector('.note-edit-btn');
        noteEditBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openNoteModal(dayOfWeek, lesson.num, lessonName);
        });

        const noteViewBtn = scheduleItem.querySelector('.note-view-btn');
        if (noteViewBtn) {
            noteViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                viewNote(dayOfWeek, lesson.num);
            });
        }

        const noteDeleteBtn = scheduleItem.querySelector('.note-delete-btn');
        if (noteDeleteBtn) {
            noteDeleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Удалить заметку?')) {
                    deleteNote(dayOfWeek, lesson.num);
                }
            });
        }

        scheduleList.appendChild(scheduleItem);
    }

    scheduleTitle.textContent = `Расписание на ${dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]}`;
}

function updateFullSchedule() {
    const weekScheduleDiv = document.getElementById('weekSchedule');
    weekScheduleDiv.innerHTML = '';

    for (let day = 0; day < 7; day++) {
        const dayInfo = weekSchedule[day];
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-schedule';
        
        if (day === 5 || day === 6) {
            dayDiv.classList.add('weekend');
        }

        let lessonsHtml = '';
        if (dayInfo.lessons.length === 0) {
            lessonsHtml = '<div class="no-lessons">Выходной день</div>';
        } else {
            for (let i = 0; i < dayInfo.lessons.length; i++) {
                const lessonTime = lessonTimes[i];
                const lessonName = dayInfo.lessons[i];
                const noteKey = `note_${day}_${lessonTime.num}`;
                const hasNote = notes[noteKey] !== undefined;

                lessonsHtml += `
                    <div class="day-lesson">
                        <div class="day-lesson-number">${i + 1}</div>
                        <div class="day-lesson-info">
                            <div class="day-lesson-name" style="cursor: pointer;">${lessonName}</div>
                            <div class="day-lesson-time">${lessonTime.start} - ${lessonTime.end}</div>
                        </div>
                        <div class="day-note-controls">
                            ${hasNote ? `<button class="day-note-view" data-day="${day}" data-lesson="${lessonTime.num}">👁️</button>` : ''}
                            <button class="day-note-edit" data-day="${day}" data-lesson="${lessonTime.num}">📝</button>
                            ${hasNote ? `<button class="day-note-delete" data-day="${day}" data-lesson="${lessonTime.num}">✕</button>` : ''}
                        </div>
                    </div>
                `;
            }
        }

        dayDiv.innerHTML = `
            <div class="day-name">${dayInfo.name}</div>
            <div class="day-lessons">${lessonsHtml}</div>
        `;

        const lessonNames = dayDiv.querySelectorAll('.day-lesson-name');
        lessonNames.forEach((el, index) => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                openTeacherModal(dayInfo.lessons[index]);
            });
        });

        const editBtns = dayDiv.querySelectorAll('.day-note-edit');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayIdx = parseInt(btn.getAttribute('data-day'));
                const lessonNum = parseInt(btn.getAttribute('data-lesson'));
                const lessonName = weekSchedule[dayIdx].lessons[lessonNum - 1];
                openNoteModal(dayIdx, lessonNum, lessonName);
            });
        });

        const viewBtns = dayDiv.querySelectorAll('.day-note-view');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayIdx = parseInt(btn.getAttribute('data-day'));
                const lessonNum = parseInt(btn.getAttribute('data-lesson'));
                viewNote(dayIdx, lessonNum);
            });
        });

        const deleteBtns = dayDiv.querySelectorAll('.day-note-delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayIdx = parseInt(btn.getAttribute('data-day'));
                const lessonNum = parseInt(btn.getAttribute('data-lesson'));
                if (confirm('Удалить заметку?')) {
                    deleteNote(dayIdx, lessonNum);
                }
            });
        });

        weekScheduleDiv.appendChild(dayDiv);
    }
}

loadDurationPreference();
updateDisplay();
setInterval(updateDisplay, 1000);
