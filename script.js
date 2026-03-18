// ===== ПОЛНЫЙ СКРИПТ: ТАЙМЕР + СНЕГ + КОНФЕТТИ + АНИМАЦИИ =====
let timerInterval = null;
let targetTime = null;
let confettiLaunched = false;

// ===== DOM ЭЛЕМЕНТЫ =====
const timerBox = document.getElementById("timerBox");
const noTimer = document.getElementById("noTimer");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const millisecondsEl = document.getElementById("milliseconds");
const refreshBtn = document.getElementById("refreshBtn");

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

// ===== ПОЛУЧЕНИЕ ВРЕМЕНИ С СЕРВЕРА (НАДЁЖНЫЙ СПОСОБ) =====
async function getServerTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
            method: 'HEAD',
            cache: 'no-store'
        });
        
        const serverTime = new Date(response.headers.get('date')).getTime();
        const localTime = Date.now();
        
        localStorage.setItem('timeDiff', serverTime - localTime);
        
        return serverTime;
    } catch (e) {
        console.log("Ошибка получения времени сервера, используем локальное");
        const savedDiff = localStorage.getItem('timeDiff');
        if (savedDiff) {
            return Date.now() + parseInt(savedDiff);
        }
        return Date.now();
    }
}

// ===== ЗАГРУЗКА ДАТЫ И ТАЙМЕР =====
async function loadTargetDate() {
    try {
        const cacheBreaker = new Date().getTime();
        const url = `https://raw.githubusercontent.com/toolgool2021-coder/Time/main/date.json?t=${cacheBreaker}`;
        
        const res = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });
        
        if (!res.ok) {
            throw new Error('Не удалось загрузить дату');
        }
        
        const data = await res.json();
        
        const serverTime = await getServerTime();
        const timeDiff = Date.now() - serverTime;
        
        targetTime = new Date(data.target).getTime() - timeDiff;
        
        localStorage.setItem('targetTime', targetTime);
        localStorage.setItem('targetTimeSet', Date.now());
        
        startCountdown();
    } catch (e) {
        console.error("Ошибка загрузки даты:", e);
        const savedTargetTime = localStorage.getItem('targetTime');
        const savedTimeSet = localStorage.getItem('targetTimeSet');
        
        if (savedTargetTime && savedTimeSet) {
            const timePassed = Date.now() - parseInt(savedTimeSet);
            targetTime = parseInt(savedTargetTime) + timePassed;
            startCountdown();
        } else {
            showNoTimer();
        }
    }
}

// ===== ТАЙМЕР =====
function startCountdown() {
    updateDisplay();
    if (timerInterval) cancelAnimationFrame(timerInterval);
    timerInterval = requestAnimationFrame(updateDisplay);
}

function updateDisplay() {
    if (!targetTime) return;

    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        millisecondsEl.textContent = "000";

        cancelAnimationFrame(timerInterval);
        timerBox.style.display = "none";
        noTimer.style.display = "block";

        if (!confettiLaunched) {
            confettiLaunched = true;
            launchConfettiBurst();
        }

        return;
    }

    const totalMilliseconds = diff;
    const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(totalMilliseconds % 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
    millisecondsEl.textContent = String(milliseconds).padStart(3, "0");

    showTimer();
    timerInterval = requestAnimationFrame(updateDisplay);
}

// ===== КНОПКА ОБНОВИТЬ =====
refreshBtn.addEventListener("click", () => {
    loadTargetDate();
    animateButton();
});

// ===== ПОКАЗАТЬ / СКРЫТЬ ТАЙМЕР =====
function showTimer() {
    timerBox.style.display = "block";
    noTimer.style.display = "none";
}

function showNoTimer() {
    timerBox.style.display = "none";
    noTimer.style.display = "block";
}

// ===== КОНФЕТТИ =====
function launchConfettiBurst() {
    for (let i = 0; i < 3; i++) {
        confetti({
            particleCount: 30,
            spread: 100,
            origin: { x: Math.random(), y: Math.random() * 0.5 },
            colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1b1']
        });
    }
    timerBox.style.animation = 'pulse 0.5s ease-in-out 3';
}

// ===== АНИМАЦИИ =====
function animateButton() {
    refreshBtn.style.opacity = '0.7';
    setTimeout(() => refreshBtn.style.opacity = '1', 300);
}

const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0%,100%{
        transform:scale(1);
        box-shadow:0 0 40px rgba(168,85,247,0.4);
    }
    50%{
        transform:scale(1.05);
        box-shadow:0 0 60px rgba(0,255,255,0.6);
    }
}`;
document.head.appendChild(style);

// ===== ЗАГРУЗКА ПРИ ОТКРЫТИИ СТРАНИЦЫ =====
window.addEventListener("load", loadTargetDate);

// ===== ПЕРИОДИЧЕСКАЯ СИНХРОНИЗАЦИЯ =====
setInterval(() => {
    loadTargetDate();
}, 5 * 60 * 1000);