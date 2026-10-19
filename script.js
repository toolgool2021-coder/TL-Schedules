// Main application script adapted to new index.html structure
// Uses Data.js (window.appConfig, window.scheduleData)

const $ = id => document.getElementById(id);

const appConfig = window.appConfig || {};
let duration = Number(localStorage.getItem("tlAppDuration") || appConfig.DEFAULT_LESSON_DURATION || 45);

// Use schedule data
let scheduleData = window.scheduleData || {};
let weekSchedule = scheduleData.weekSchedule || [];
let teachersDatabase = scheduleData.teachersDatabase || {};

const fixedTimes = (appConfig.lessonTimesFixed || []).map(t => ({start: t.start, end: t.end, a: t.startMinutes, b: t.endMinutes}));

function minutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function timeAt(n) {
  const h = Math.floor(n / 60) % 24;
  const m = n % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

function getTimes() {
  if (duration === 45) {
    return fixedTimes.map(t => ({start: t.start, end: t.end, a: t.a, b: t.b}));
  }

  const result = [];
  let current = appConfig.BASE_START_TIME || 480;
  const br = appConfig.BREAK_DURATION || 5;
  for (let i = 0; i < 6; i++) {
    result.push({ start: timeAt(current), end: timeAt(current + duration), a: current, b: current + duration });
    current += duration + br;
  }
  return result;
}

function todayIndex() {
  return (new Date().getDay() + 6) % 7;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function renderTabs() {
  const tabEl = $('dayTabs');
  tabEl.innerHTML = weekSchedule.map((d, i) => `\n    <button class="day-tab ${i===selectedDay? 'active':''}" data-day="${i}">\n      <small>${escapeHTML(d.short || d.name.slice(0,2).toUpperCase())}</small>\n      <strong>${i===todayIndex() ? '•' : (i+1)}</strong>\n    </button>\n  `).join('');

  tabEl.querySelectorAll('[data-day]').forEach(btn => {
    btn.onclick = () => { selectedDay = Number(btn.dataset.day); renderTabs(); renderLessons(); };
  });
}

function renderLessons() {
  const list = $('lessonList');
  const day = weekSchedule[selectedDay] || { lessons: [] };
  const times = getTimes();
  const now = new Date();
  const currentMinutes = now.getHours()*60 + now.getMinutes();
  const isToday = selectedDay === todayIndex();

  $('selectedDayLabel').textContent = isToday ? 'Сегодня' : (day.name || '');

  if (!day.lessons || day.lessons.length === 0) {
    list.innerHTML = `\n      <div class="empty">\n        ☁<br><br>\n        На этот день уроков нет<br>\n        <span class="muted">Можно немного отдохнуть</span>\n      </div>\n    `;
    return;
  }

  list.innerHTML = day.lessons.map((name, i) => {
    const time = times[i] || {start: '—', end: '—', a:0, b:0};
    const key = noteKey(selectedDay, i+1);
    const hasNote = Boolean(notes[key]);
    const active = isToday && currentMinutes >= time.a && currentMinutes < time.b;
    const past = isToday && currentMinutes >= time.b;

    return `\n      <article class="lesson-card ${active ? 'current':''} ${past ? 'past':''}">\n        <div class="lesson-index">${String(i+1).padStart(2,'0')}</div>\n        <div class="lesson-main">\n          <div class="lesson-name">${escapeHTML(name)}</div>\n          <div class="lesson-time">${time.start} – ${time.end}${active ? ' · Сейчас' : ''}</div>\n        </div>\n        <button class="mini-btn ${hasNote? 'has-note':''}" data-edit="${i}" title="Заметка">${hasNote? '✎':'＋'}</button>\n      </article>\n    `;
  }).join('');

  list.querySelectorAll('[data-edit]').forEach(btn => {
    btn.onclick = () => { const i = Number(btn.dataset.edit); openNote(selectedDay, i+1, weekSchedule[selectedDay].lessons[i]); };
  });
}

function renderWeek() {
  const grid = $('weekGrid');
  const times = getTimes();
  grid.innerHTML = weekSchedule.map((day, i) => `\n    <article class="week-card ${i===todayIndex()? 'today':''}">\n      <div class="week-card-head">\n        <div class="week-day-name">${escapeHTML(day.name)}</div>\n        ${i===todayIndex() ? '<span class="today-label">СЕГОДНЯ</span>':''}\n      </div>\n      ${day.lessons && day.lessons.length ? day.lessons.map((s,j)=>`\n        <div class="week-item">\n          <span class="week-num">${j+1}</span>\n          <span class="week-subject">${escapeHTML(s)}</span>\n          <span class="week-time">${times[j] ? times[j].start : '—'}</span>\n        </div>\n      `).join('') : '<div class="rest">День без занятий</div>'}\n    </article>\n  `).join('');
}

function clock(seconds) {
  const h = String(Math.floor(seconds/3600)).padStart(2,'0');
  const m = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
  const s = String(seconds%60).padStart(2,'0');
  return `${h}:${m}:${s}`;
}

function updateHero() {
  const now = new Date();
  const day = todayIndex();
  const currentMinutes = now.getHours()*60 + now.getMinutes() + now.getSeconds()/60;
  const times = getTimes();
  const lessons = weekSchedule[day] ? (weekSchedule[day].lessons||[]) : [];

  const hour = now.getHours();
  $('greeting').textContent = hour < 5 ? 'Доброй ночи' : hour <12 ? 'Доброе утро' : hour<18 ? 'Добрый день' : 'Добрый вечер';
  $('dateLine').textContent = now.toLocaleDateString('ru-RU', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) + ' · ' + now.toLocaleTimeString('ru-RU');

  if (day>=5) {
    $('currentLesson').textContent = 'Сегодня можно отдохнуть';
    $('lessonCaption').textContent = 'На сегодня уроки не запланированы';
    $('statusPill').textContent = '✦ ВЫХОДНОЙ';
    $('heroEyebrow').textContent = 'ВРЕМЯ ДЛЯ СЕБЯ';
    $('timerValue').textContent = '✦';
    $('timerLabel').textContent = 'Перезагрузка тоже важна';
    $('timerFrom').textContent = 'Отдых';
    $('timerTo').textContent = '';
    $('progressBar').style.width = '0%';
    return;
  }

  const currentIndex = times.findIndex(t => currentMinutes >= t.a && currentMinutes < t.b);
  const nextIndex = times.findIndex(t => t.a > currentMinutes);
  let time = null;
  let progress = 0;

  if (currentIndex >= 0) {
    time = times[currentIndex];
    $('currentLesson').textContent = 'Урок ' + (currentIndex+1) + ': ' + (lessons[currentIndex] || 'Урок');
    $('lessonCaption').textContent = 'Занятие завершится в ' + time.end;
    $('statusPill').textContent = '● ИДЁТ УРОК';
    $('heroEyebrow').textContent = 'СЕЙЧАС';
    $('timerLabel').textContent = 'До конца урока';

    const remaining = Math.max(0, Math.floor(time.b*60 - now.getHours()*3600 - now.getMinutes()*60 - now.getSeconds()));
    $('timerValue').textContent = clock(remaining);
    progress = (currentMinutes - time.a) / (time.b - time.a) * 100;
  } else if (nextIndex >= 0) {
    time = times[nextIndex];
    $('currentLesson').textContent = 'Далее: ' + (lessons[nextIndex] || 'Урок');
    $('lessonCaption').textContent = 'Начало в ' + time.start + ' · Урок ' + (nextIndex+1);
    $('statusPill').textContent = '◷ СКОРО НАЧАЛО';
    $('heroEyebrow').textContent = 'СЛЕДУЮЩЕЕ СОБЫТИЕ';
    $('timerLabel').textContent = 'До начала следующего урока';

    const remaining = Math.max(0, Math.floor(time.a*60 - now.getHours()*3600 - now.getMinutes()*60 - now.getSeconds()));
    $('timerValue').textContent = clock(remaining);
  } else {
    $('currentLesson').textContent = 'Уроки на сегодня завершены';
    $('lessonCaption').textContent = 'Все занятия закончились';
    $('statusPill').textContent = '✓ ГОТОВО';
    $('heroEyebrow').textContent = 'УЧЕБНЫЙ ДЕНЬ';
    $('timerLabel').textContent = 'Можно выдохнуть';
    $('timerValue').textContent = '✓';
    progress = 100;
  }

  $('timerFrom').textContent = time ? time.start : '08:00';
  $('timerTo').textContent = time ? time.end : '13:05';
  $('progressBar').style.width = Math.max(0, Math.min(100, progress)) + '%';
}

// Notes and modals
let currentNoteKey = null;
let notes = {};
try { notes = JSON.parse(localStorage.getItem('tlScheduleNotes') || '{}') || {}; } catch(e){ notes = {}; }

function noteKey(day, number){ return 'note_' + day + '_' + number; }

function openNote(day, number, name){
  currentNoteKey = noteKey(day, number);
  $('modalTitle').textContent = name || 'Заметка';
  $('modalSubtitle').textContent = (weekSchedule[day] ? weekSchedule[day].name : '') + ' · Урок ' + number;
  $('noteText').value = notes[currentNoteKey] || '';
  $('noteModal').classList.add('open');
  $('noteText').focus();
}

function closeNote(){
  $('noteModal').classList.remove('open');
  currentNoteKey = null;
}

$('saveNote').onclick = () => {
  if (!currentNoteKey) return;
  const value = $('noteText').value.trim();
  if (value) notes[currentNoteKey] = value; else delete notes[currentNoteKey];
  localStorage.setItem('tlScheduleNotes', JSON.stringify(notes));
  closeNote(); renderLessons(); renderWeek(); showToast('Заметка сохранена');
};

$('cancelNote').onclick = closeNote;
$('noteModal').onclick = e => { if (e.target === $('noteModal')) closeNote(); };

function showToast(msg){ const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(showToast.timeout); showToast.timeout = setTimeout(()=>t.classList.remove('show'), 2000); }

// Teacher modal
function openTeacher(dayIndex, lessonNum){
  const day = weekSchedule[dayIndex];
  const name = day && day.lessons ? day.lessons[lessonNum-1] : null;
  const teacher = teachersDatabase[name];
  if (!teacher){ alert('Информация о преподавателе не найдена'); return; }
  $('teacherName').textContent = teacher.name || '-';
  $('teacherCabinet').textContent = `🚪 Кабинет: ${teacher.cabinet || '-'}`;
  $('teacherSubject').textContent = `📚 Предмет: ${name}`;
  const phoneEl = $('teacherPhone'); const buttonsEl = $('teacherButtons');
  if (teacher.phone){ phoneEl.textContent = `☎️ ${teacher.phone}`; const phoneClean = teacher.phone.replace(/\D/g,''); buttonsEl.innerHTML = `<a href="tel:+${phoneClean}" class="teacher-btn-call">📞</a><a href="https://wa.me/${phoneClean}" target="_blank" class="teacher-btn-whatsapp">💬</a>`; } else { phoneEl.textContent = '☎️ -'; buttonsEl.innerHTML = '<span class="teacher-btn-disabled">—</span>'; }
  $('teacherModal').hidden = false;
}
$('teacherClose')?.addEventListener('click', ()=>{$('teacherModal').hidden = true;});

// Wire up navigation bottom
let selectedDay = todayIndex();

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i===btn));
    const t = btn.dataset.target;
    if (t === 'today'){ selectedDay = todayIndex(); renderTabs(); renderLessons(); }
    $(t).scrollIntoView({ behavior:'smooth', block:'start' });
  };
});

// Duration buttons
$('durationButtons').querySelectorAll('button').forEach(b => { b.onclick = () => setDuration(Number(b.dataset.duration)); });
$('durationSelect').onchange = e => setDuration(Number(e.target.value));

function setDuration(val){ duration = val; localStorage.setItem('tlAppDuration', String(val)); $('durationSelect').value = String(val); $('durationButtons').querySelectorAll('button').forEach(button => button.classList.toggle('active', Number(button.dataset.duration)===val)); renderLessons(); renderWeek(); updateHero(); }

// Snow canvas (from original repo)
(function initSnow(){ try{ const canvas = document.createElement('canvas'); canvas.id='snowCanvas'; canvas.style.position='fixed'; canvas.style.left=0; canvas.style.top=0; canvas.style.zIndex=5; canvas.style.pointerEvents='none'; document.body.appendChild(canvas); const ctx=canvas.getContext('2d'); let w=canvas.width=window.innerWidth; let h=canvas.height=window.innerHeight; window.addEventListener('resize', ()=>{w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight;}); const flakes=[]; for(let i=0;i<80;i++) flakes.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*3+1,s:Math.random()*1+0.5,o:Math.random()*0.5+0.2}); function draw(){ ctx.clearRect(0,0,w,h); ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.beginPath(); for(const f of flakes){ ctx.moveTo(f.x,f.y); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); } ctx.fill(); for(const f of flakes){ f.y += f.s; f.x += Math.sin(f.y/h*Math.PI*2)*0.5; if(f.y>h) f.y=0; if(f.x>w) f.x=0; if(f.x<0) f.x=w; } requestAnimationFrame(draw); } draw(); }catch(e){ console.warn(e); } })();

// Initial render
renderTabs(); renderLessons(); renderWeek(); setDuration(duration); updateHero();
setInterval(()=>{ updateHero(); if (selectedDay === todayIndex()) renderLessons(); }, 1000);

console.log('✅ script.js (new) loaded');
