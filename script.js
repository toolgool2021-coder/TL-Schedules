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
        lessons: ["Кыргызский язык", "Физика", "Русская литература", "География", "Кыргызская литература", "ЧИО"]
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
const closeBtn = document.querySelector('.close');

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
    fetch('download/offline.html')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'TL-Schedules-Offline.html';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            alert('Ошибка при скачивании файла. Проверьте наличие файла download/offline.html в репозитории.');
            console.error('Download error:', error);
        });
});

// ===== ФУНКЦИИ ДЛЯ РАСПИСАНИЯ И ТАЙМЕРА =====
function isWeekend() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    return dayOfWeek === 5 || dayOfWeek === 6;
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

function updateDisplay() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const dayOfWeek = now.getDay();
    const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

    document.getElementById('currentDate').textContent = dateStr;
    document.getElementById('currentDay').textContent = dayName;

    const lessonInfo = getCurrentLessonInfo();
    const statusEl = document.getElementById('lessonStatus');

    if (isWeekend()) {
        document.getElementById('currentLesson').textContent = '🎉 Выходной день!';
        document.getElementById('timerValue').textContent = '🎉';
        statusEl.textContent = '🌟 Время отдыхать!';
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
            <div class="lesson-name">${lessonName}</div>
            <div class="lesson-time">${lesson.start} - ${lesson.end}</div>
            <div class="note-controls">
                ${hasNote ? `<button class="note-view-btn" data-day="${dayOfWeek}" data-lesson="${lesson.num}">👁️</button>` : ''}
                <button class="note-edit-btn" data-day="${dayOfWeek}" data-lesson="${lesson.num}">📝</button>
                ${hasNote ? `<button class="note-delete-btn" data-day="${dayOfWeek}" data-lesson="${lesson.num}">✕</button>` : ''}
            </div>
        `;

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
                            <div class="day-lesson-name">${lessonName}</div>
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

        // Добавляем обработчики для кнопок в полном расписании
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

// ===== СКАЧИВАНИЕ ОФФЛАЙН ВЕРСИИ =====
document.getElementById('downloadOfflineBtn').addEventListener('click', function() {
    // Создаем HTML контент оффлайн версии
    const offlineHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#a855f7">
    <meta name="description" content="TL Schedules - Расписание уроков в реальном времени (Оффлайн версия)">
    <title>TL Schedules - Расписание Уроков (Оффлайн)</title>
    
    <style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    background: #0a0a0a;
    font-family: 'Arial', sans-serif;
    color: white;
    overflow-x: hidden;
}

#snowCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.container {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.beta-info-block {
    background: rgba(168, 85, 247, 0.08);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 12px;
    padding: 20px 25px;
    margin-bottom: 40px;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.15);
}

.beta-badge {
    display: inline-block;
    font-weight: bold;
    color: #a855f7;
    font-size: 13px;
    letter-spacing: 1px;
    text-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
    margin-bottom: 10px;
}

.beta-description {
    font-size: 13px;
    color: #ccc;
    line-height: 1.6;
    font-weight: 400;
}

.project-header {
    text-align: center;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.logo-container {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(168, 85, 247, 0.1);
    border: 2px solid rgba(168, 85, 247, 0.3);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
    animation: logoGlow 3s ease-in-out infinite;
}

.project-logo {
    width: 70px;
    height: 70px;
    font-size: 50px;
}

@keyframes logoGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.2); }
    50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.4); }
}

.project-title {
    font-size: 32px;
    font-weight: bold;
    background: linear-gradient(135deg, #a855f7 0%, #00ffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.project-subtitle {
    font-size: 14px;
    color: #00ffff;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
    letter-spacing: 1px;
    margin: 0;
}

.info-section {
    text-align: center;
    margin-bottom: 50px;
    padding: 30px;
    background: rgba(168, 85, 247, 0.1);
    border: 2px solid #a855f7;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.current-date {
    font-size: 24px;
    font-weight: bold;
    color: #00ffff;
    text-shadow: 0 0 10px #00ffff;
}

.current-day {
    font-size: 20px;
    color: #a855f7;
    text-shadow: 0 0 8px #a855f7;
    margin: 10px 0;
}

.current-lesson {
    font-size: 18px;
    color: #fff;
    font-weight: 600;
    margin: 10px 0;
}

.lesson-status {
    font-size: 14px;
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
    margin-top: 5px;
}

.duration-control {
    text-align: center;
    margin-bottom: 50px;
    padding: 20px;
    background: rgba(168, 85, 247, 0.05);
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 12px;
}

.duration-label {
    font-size: 14px;
    color: #a855f7;
    margin-bottom: 15px;
    font-weight: 600;
    letter-spacing: 1px;
}

.duration-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.duration-btn {
    padding: 8px 18px;
    border: 2px solid #a855f7;
    border-radius: 8px;
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.duration-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
    border-color: #00ffff;
    color: #00ffff;
}

.duration-btn.active {
    background: rgba(168, 85, 247, 0.3);
    border-color: #00ffff;
    color: #00ffff;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
}

.timer-section {
    text-align: center;
    margin-bottom: 60px;
}

.timer-display {
    padding: 50px;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 255, 200, 0.1));
    border: 3px solid #a855f7;
    border-radius: 20px;
    margin-bottom: 15px;
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
}

.timer-value {
    font-size: 80px;
    font-weight: bold;
    color: #00ffff;
    text-shadow: 0 0 20px #00ffff, 0 0 40px #a855f7;
    font-family: 'Courier New', monospace;
    letter-spacing: 5px;
    animation: timerGlow 2s ease-in-out infinite;
}

@keyframes timerGlow {
    0%, 100% { text-shadow: 0 0 20px #00ffff, 0 0 40px #a855f7; }
    50% { text-shadow: 0 0 30px #00ffff, 0 0 60px #a855f7; }
}

.timer-label {
    font-size: 18px;
    color: #a855f7;
    text-shadow: 0 0 10px #a855f7;
}

.schedule-section {
    margin-bottom: 60px;
    background: rgba(168, 85, 247, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 2px solid rgba(168, 85, 247, 0.3);
}

.schedule-section h2 {
    color: #00ffff;
    margin-bottom: 25px;
    font-size: 24px;
    text-shadow: 0 0 10px #00ffff;
}

.schedule-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.schedule-item {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 255, 200, 0.05));
    border: 2px solid #a855f7;
    border-radius: 10px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
}

.schedule-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
}

.schedule-item.active {
    background: linear-gradient(135deg, rgba(0, 255, 200, 0.3), rgba(168, 85, 247, 0.2));
    border-color: #00ffff;
    box-shadow: 0 0 30px rgba(0, 255, 200, 0.6);
}

.schedule-item.finished {
    opacity: 0.5;
}

.lesson-number {
    font-size: 14px;
    color: #a855f7;
    margin-bottom: 5px;
    font-weight: bold;
}

.lesson-name {
    font-size: 18px;
    color: #fff;
    margin-bottom: 10px;
    font-weight: 600;
}

.lesson-time {
    font-size: 14px;
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
    margin-bottom: 15px;
}

.note-controls {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.note-view-btn, .note-edit-btn, .note-delete-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 5px 10px;
    border-radius: 5px;
}

.note-view-btn:hover { background: rgba(0, 255, 255, 0.2); transform: scale(1.1); }
.note-edit-btn:hover { background: rgba(255, 170, 0, 0.2); transform: scale(1.1); }
.note-delete-btn:hover { background: rgba(255, 107, 107, 0.2); transform: scale(1.1); }

.full-schedule-section {
    background: rgba(168, 85, 247, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 2px solid rgba(168, 85, 247, 0.3);
    margin-bottom: 60px;
}

.full-schedule-section h2 {
    color: #00ffff;
    margin-bottom: 25px;
    font-size: 24px;
    text-shadow: 0 0 10px #00ffff;
}

.week-schedule {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.day-schedule {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(0, 255, 200, 0.05));
    border: 2px solid #a855f7;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
}

.day-schedule.weekend {
    background: linear-gradient(135deg, rgba(255, 170, 0, 0.15), rgba(255, 200, 0, 0.05));
    border-color: #ffaa00;
}

.day-name {
    font-size: 18px;
    font-weight: bold;
    color: #00ffff;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #a855f7;
    text-shadow: 0 0 10px #00ffff;
}

.day-schedule.weekend .day-name {
    color: #ffaa00;
    border-bottom-color: #ffaa00;
}

.day-lessons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.day-lesson {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(168, 85, 247, 0.1);
    border-radius: 8px;
    transition: all 0.2s ease;
    justify-content: space-between;
}

.day-lesson:hover {
    background: rgba(168, 85, 247, 0.2);
}

.day-lesson-number {
    min-width: 30px;
    color: #a855f7;
    font-weight: bold;
    font-size: 12px;
}

.day-lesson-info {
    flex: 1;
}

.day-lesson-name {
    font-size: 14px;
    color: #fff;
    font-weight: 600;
}

.day-lesson-time {
    font-size: 12px;
    color: #00ffff;
}

.day-note-controls {
    display: flex;
    gap: 6px;
}

.day-note-view, .day-note-edit, .day-note-delete {
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 3px 6px;
    border-radius: 3px;
}

.day-note-view:hover { background: rgba(0, 255, 255, 0.2); }
.day-note-edit:hover { background: rgba(255, 170, 0, 0.2); }
.day-note-delete:hover { background: rgba(255, 107, 107, 0.2); }

.no-lessons {
    text-align: center;
    padding: 40px;
    color: #a855f7;
    font-size: 18px;
}

.contact-section {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 60px;
}

.contact-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 30px;
    border: 2px solid;
    border-radius: 10px;
    color: white;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.contact-link:hover {
    transform: translateY(-3px) scale(1.05);
}

.telegram-link {
    border-color: #0088cc;
    background: rgba(0, 136, 204, 0.1);
    box-shadow: 0 0 20px rgba(0, 136, 204, 0.3);
}

.telegram-link:hover {
    border-color: #00c8ff;
    background: rgba(0, 136, 204, 0.3);
    box-shadow: 0 0 40px rgba(0, 136, 204, 0.8);
    color: #00c8ff;
}

.mail-link {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

.mail-link:hover {
    border-color: #ff5252;
    background: rgba(255, 107, 107, 0.3);
    box-shadow: 0 0 40px rgba(255, 107, 107, 0.8);
    color: #ff5252;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 255, 200, 0.1));
    border: 2px solid #a855f7;
    border-radius: 15px;
    margin: 5% auto;
    padding: 30px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #a855f7;
    padding-bottom: 15px;
}

.modal-header h2 {
    color: #00ffff;
    margin: 0;
}

.close {
    color: #a855f7;
    font-size: 28px;
    cursor: pointer;
}

.close:hover {
    color: #00ffff;
}

.note-textarea {
    width: 100%;
    height: 200px;
    padding: 15px;
    background: rgba(10, 10, 10, 0.8);
    border: 2px solid #a855f7;
    border-radius: 10px;
    color: #fff;
    font-family: Arial;
    font-size: 14px;
    resize: vertical;
    margin-bottom: 20px;
}

.note-textarea:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.btn-modal {
    padding: 10px 25px;
    border: 2px solid;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
}

.btn-modal.save {
    border-color: #00ffaa;
    background: rgba(0, 255, 170, 0.1);
    color: #00ffaa;
}

.btn-modal.save:hover {
    box-shadow: 0 0 15px rgba(0, 255, 170, 0.6);
}

.btn-modal.cancel {
    border-color: #a855f7;
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
}

.btn-modal.cancel:hover {
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
}

@media (max-width: 768px) {
    .container { padding: 20px 10px; }
    .project-title { font-size: 24px; }
    .timer-value { font-size: 50px; }
    .timer-display { padding: 30px; }
    .schedule-list { grid-template-columns: 1fr; }
    .week-schedule { grid-template-columns: 1fr; }
    .modal-content { width: 95%; }
}

@media (max-width: 480px) {
    .container { padding: 15px 10px; }
    .project-title { font-size: 20px; }
    .timer-value { font-size: 35px; }
    .current-date { font-size: 18px; }
}
    </style>
</head>
<body>

<canvas id="snowCanvas"></canvas>

<div class="container">
    <div class="beta-info-block">
        <span class="beta-badge">[ ОФФЛАЙН ВЕРСИЯ ]</span>
        <p class="beta-description">
            Данная версия работает полностью оффлайн. Все данные хранятся локально на вашем устройстве. 
            Заметки сохраняются и не пропадают при обновлении страницы. 
            Все функции работают без интернета! ✨
        </p>
    </div>

    <div class="project-header">
        <div class="logo-container">
            <div class="project-logo">📅</div>
        </div>
        <h1 class="project-title">TL Schedules</h1>
        <p class="project-subtitle">Расписание занятий в реальном времени</p>
    </div>
    
    <div class="info-section">
        <p class="current-date" id="currentDate">00.00.0000</p>
        <p class="current-day" id="currentDay">День</p>
        <p class="current-lesson" id="currentLesson">Урок загружается...</p>
        <p class="lesson-status" id="lessonStatus"></p>
    </div>

    <div class="duration-control">
        <p class="duration-label">Длительность урока:</p>
        <div class="duration-buttons">
            <button class="duration-btn active" data-duration="45">45 мин</button>
            <button class="duration-btn" data-duration="40">40 мин</button>
            <button class="duration-btn" data-duration="35">35 мин</button>
        </div>
    </div>

    <div class="timer-section">
        <div class="timer-display">
            <span class="timer-value" id="timerValue">00:00:00</span>
        </div>
        <p class="timer-label">Осталось до конца урока</p>
    </div>

    <div class="schedule-section">
        <h2 id="scheduleTitle">Расписание на сегодня</h2>
        <div class="schedule-list" id="scheduleList"></div>
    </div>

    <div class="full-schedule-section">
        <h2>Полное расписание</h2>
        <div class="week-schedule" id="weekSchedule"></div>
    </div>

    <div class="contact-section">
        <a href="https://t.me/Toolgool" target="_blank" class="contact-link telegram-link">
            ✈️ Telegram
        </a>
        <a href="mailto:Toolgool2021@gmail.com" class="contact-link mail-link">
            ✉️ Email
        </a>
    </div>
</div>

<div id="noteModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Заметка</h2>
            <span class="close">&times;</span>
        </div>
        <textarea id="noteText" class="note-textarea" placeholder="Введите заметку..."></textarea>
        <div class="modal-buttons">
            <button id="saveNoteBtn" class="btn-modal save">Сохранить</button>
            <button id="closeNoteBtn" class="btn-modal cancel">Закрыть</button>
        </div>
    </div>
</div>

<script>
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
    if (lessonDuration === 45) return lessonTimesFixed;
    const lessons = [];
    let currentTime = baseStartTime;
    for (let i = 1; i <= 6; i++) {
        lessons.push({
            num: i,
            start: formatTime(currentTime),
            startMinutes: currentTime,
            end: formatTime(currentTime + lessonDuration),
            endMinutes: currentTime + lessonDuration
        });
        currentTime += lessonDuration + 5;
    }
    return lessons;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return \`\${String(hours).padStart(2, '0')}:\${String(mins).padStart(2, '0')}\`;
}

let lessonTimes = generateLessonTimes();

const weekSchedule = {
    0: { name: "Понедельник", lessons: ["Физкультура", "Математика", "Химия", "Русская литература", "Русский язык", "Физика"] },
    1: { name: "Вторник", lessons: ["Математика", "История", "Химия", "Физика", "Иностранный язык", "Кыргыз"] },
    2: { name: "Среда", lessons: ["Биология", "ДП", "Математика", "Русская литература", "ДП"] },
    3: { name: "Четверг", lessons: ["Математика", "Кыргыз тили", "Русский язык", "История", "Физкультура", "Кыргызска литература"] },
    4: { name: "Пятница", lessons: ["Кыргызский язык", "Физика", "Русская литература", "География", "Кыргызская литература", "ЧИО"] },
    5: { name: "Суббота", lessons: [] },
    6: { name: "Воскресенье", lessons: [] }
};

const dayNames = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = [];
for (let i = 0; i < 100; i++) {
    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5
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

const modal = document.getElementById('noteModal');
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const closeNoteBtn = document.getElementById('closeNoteBtn');
const closeBtn = document.querySelector('.close');

let currentNoteKey = null;
let notes = JSON.parse(localStorage.getItem('tlScheduleNotes')) || {};

function openNoteModal(dayOfWeek, lessonNum, lessonName) {
    currentNoteKey = \`note_\${dayOfWeek}_\${lessonNum}\`;
    const savedNote = notes[currentNoteKey] || '';
    document.getElementById('modalTitle').textContent = \`Заметка: \${dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]} - Урок \${lessonNum} (\${lessonName})\`;
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
    const noteKey = \`note_\${dayOfWeek}_\${lessonNum}\`;
    delete notes[noteKey];
    localStorage.setItem('tlScheduleNotes', JSON.stringify(notes));
    updateTodaySchedule();
    updateFullSchedule();
}

function viewNote(dayOfWeek, lessonNum) {
    const noteKey = \`note_\${dayOfWeek}_\${lessonNum}\`;
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

function isWeekend() {
    const now = new Date();
    return now.getDay() === 5 || now.getDay() === 6;
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

function updateDisplay() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const dayOfWeek = now.getDay();
    const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

    document.getElementById('currentDate').textContent = dateStr;
    document.getElementById('currentDay').textContent = dayName;

    const lessonInfo = getCurrentLessonInfo();
    const statusEl = document.getElementById('lessonStatus');

    if (isWeekend()) {
        document.getElementById('currentLesson').textContent = '🎉 Выходной день!';
        document.getElementById('timerValue').textContent = '🎉';
        statusEl.textContent = '🌟 Время отдыхать!';
    } else if (lessonInfo.hasLesson && lessonInfo.currentLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const lessonName = lessons[lessonInfo.currentLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = \`Урок \${lessonInfo.currentLesson.num}: \${lessonName}\`;
        statusEl.textContent = '🔴 Сейчас идёт урок';
        const timeLeftMinutes = lessonInfo.currentLesson.endMinutes - lessonInfo.currentMinutes;
        updateTimer(timeLeftMinutes);
    } else if (lessonInfo.nextLesson) {
        const lessons = weekSchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1].lessons;
        const nextLessonName = lessons[lessonInfo.nextLesson.num - 1] || 'Урок';
        document.getElementById('currentLesson').textContent = \`Урок \${lessonInfo.nextLesson.num}: \${nextLessonName}\`;
        const timeLeftMinutes = lessonInfo.nextLesson.startMinutes - lessonInfo.currentMinutes;
        const hours = Math.floor(timeLeftMinutes / 60);
        const mins = Math.floor(timeLeftMinutes % 60);
        statusEl.textContent = \`⏳ До начала \${hours > 0 ? hours + 'ч ' : ''}\${mins}м\`;
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
    document.getElementById('timerValue').textContent = 
        \`\${String(hours).padStart(2, '0')}:\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
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
        const noteKey = \`note_\${dayOfWeek}_\${lesson.num}\`;
        const hasNote = notes[noteKey] !== undefined;
        
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';

        if (currentMinutes >= lesson.startMinutes && currentMinutes <= lesson.endMinutes) {
            scheduleItem.classList.add('active');
        } else if (lesson.endMinutes < currentMinutes) {
            scheduleItem.classList.add('finished');
        }

        scheduleItem.innerHTML = \`
            <div class="lesson-number">Урок \${lesson.num}</div>
            <div class="lesson-name">\${lessonName}</div>
            <div class="lesson-time">\${lesson.start} - \${lesson.end}</div>
            <div class="note-controls">
                \${hasNote ? \`<button class="note-view-btn" data-day="\${dayOfWeek}" data-lesson="\${lesson.num}">👁️</button>\` : ''}
                <button class="note-edit-btn" data-day="\${dayOfWeek}" data-lesson="\${lesson.num}">📝</button>
                \${hasNote ? \`<button class="note-delete-btn" data-day="\${dayOfWeek}" data-lesson="\${lesson.num}">✕</button>\` : ''}
            </div>
        \`;

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

    scheduleTitle.textContent = \`Расписание на \${dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]}\`;
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
                const noteKey = \`note_\${day}_\${lessonTime.num}\`;
                const hasNote = notes[noteKey] !== undefined;

                lessonsHtml += \`
                    <div class="day-lesson">
                        <div class="day-lesson-number">\${i + 1}</div>
                        <div class="day-lesson-info">
                            <div class="day-lesson-name">\${lessonName}</div>
                            <div class="day-lesson-time">\${lessonTime.start} - \${lessonTime.end}</div>
                        </div>
                        <div class="day-note-controls">
                            \${hasNote ? \`<button class="day-note-view" data-day="\${day}" data-lesson="\${lessonTime.num}">👁️</button>\` : ''}
                            <button class="day-note-edit" data-day="\${day}" data-lesson="\${lessonTime.num}">📝</button>
                            \${hasNote ? \`<button class="day-note-delete" data-day="\${day}" data-lesson="\${lessonTime.num}">✕</button>\` : ''}
                        </div>
                    </div>
                \`;
            }
        }

        dayDiv.innerHTML = \`
            <div class="day-name">\${dayInfo.name}</div>
            <div class="day-lessons">\${lessonsHtml}</div>
        \`;

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
</script>

</body>
</html>`;

    // Создаем Blob из HTML
    const blob = new Blob([offlineHTML], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'TL-Schedules-Offline.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
});
