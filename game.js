const board = document.querySelector('#board');
const scoreEl = document.querySelector('#score');
const timeEl = document.querySelector('#time');
const bestEl = document.querySelector('#best');
const statusEl = document.querySelector('#status');
const startBtn = document.querySelector('#startBtn');
const soundBtn = document.querySelector('#soundBtn');
const dialog = document.querySelector('#resultDialog');
const againBtn = document.querySelector('#againBtn');
const achievementEl = document.querySelector('#achievement');

let score = 0, time = 30, active = false, current = -1, popTimer, clockTimer, achievementTimer, soundOn = true, achievementUnlocked = false;
let best = Number(localStorage.getItem('roommateBugBest') || 0);
bestEl.textContent = String(best).padStart(2, '0');

const SMUG_SPRITE = 'assets/roommate-smug.png';
const CRY_SPRITE = 'assets/roommate-cry.png';

// Preload both states so a hit swaps instantly instead of flashing an empty image.
[SMUG_SPRITE, CRY_SPRITE].forEach(src => { const image = new Image(); image.src = src; });

for (let i = 0; i < 9; i += 1) {
  const hole = document.createElement('button');
  hole.className = 'hole';
  hole.type = 'button';
  hole.setAttribute('aria-label', `观察点 ${i + 1}`);
  const bug = document.createElement('img');
  bug.className = 'bug';
  bug.src = SMUG_SPRITE;
  bug.alt = '正在得意的室友虫';
  hole.appendChild(bug);
  hole.addEventListener('click', () => catchBug(i, hole));
  board.appendChild(hole);
}

const holes = [...document.querySelectorAll('.hole')];
const phrases = ['她在偷听！', '捕获一只熬夜型室友', '抓到了，但她说她没动', '宿舍生态暂时稳定', '此虫疑似会点外卖'];

function beep(freq = 520, duration = .07) {
  if (!soundOn) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.frequency.value = freq; gain.gain.value = .05; osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration); osc.stop(ctx.currentTime + duration);
}

function showBug() {
  if (!active) return;
  holes.forEach(h => {
    h.classList.remove('up', 'hit');
    const bug = h.querySelector('.bug');
    bug.src = SMUG_SPRITE;
    bug.alt = '正在得意的室友虫';
  });
  let next;
  do { next = Math.floor(Math.random() * holes.length); } while (next === current);
  current = next;
  holes[current].classList.add('up');
  const delay = Math.max(330, 850 - score * 16) + Math.random() * 250;
  popTimer = setTimeout(showBug, delay);
}

function catchBug(index, hole) {
  if (!active) return;
  if (index === current && hole.classList.contains('up') && !hole.classList.contains('hit')) {
    score += 1; scoreEl.textContent = String(score).padStart(2, '0');
    const bug = hole.querySelector('.bug');
    bug.src = CRY_SPRITE;
    bug.alt = '被点中后动漫大哭的室友虫';
    hole.classList.add('hit'); statusEl.textContent = phrases[score % phrases.length]; beep(650 + score * 8);
    if (score === 8 && !achievementUnlocked) unlockAchievement();
    clearTimeout(popTimer);
    setTimeout(showBug, 420);
  } else {
    score = Math.max(0, score - 1); scoreEl.textContent = String(score).padStart(2, '0');
    statusEl.textContent = '误伤床板，信誉值 -1'; beep(150, .12);
  }
}

function unlockAchievement() {
  achievementUnlocked = true;
  localStorage.setItem('roommateBirthdayAchievement', 'unlocked');
  clearTimeout(achievementTimer);
  achievementEl.classList.add('show');
  achievementEl.setAttribute('aria-hidden', 'false');
  statusEl.textContent = '隐藏档案：8 月 8 日';
  beep(1046, .25);
  achievementTimer = setTimeout(() => {
    achievementEl.classList.remove('show');
    achievementEl.setAttribute('aria-hidden', 'true');
  }, 4200);
}

function startGame() {
  clearTimeout(popTimer); clearInterval(clockTimer);
  score = 0; time = 30; active = true; current = -1; achievementUnlocked = false;
  clearTimeout(achievementTimer);
  achievementEl.classList.remove('show');
  achievementEl.setAttribute('aria-hidden', 'true');
  scoreEl.textContent = '00'; timeEl.textContent = time; statusEl.textContent = '检测到室友虫活动';
  startBtn.disabled = true; dialog.close(); showBug();
  clockTimer = setInterval(() => { time -= 1; timeEl.textContent = time; if (time <= 0) endGame(); }, 1000);
}

function endGame() {
  active = false; clearTimeout(popTimer); clearInterval(clockTimer);
  holes.forEach(h => h.classList.remove('up', 'hit')); startBtn.disabled = false;
  if (score > best) { best = score; localStorage.setItem('roommateBugBest', best); bestEl.textContent = String(best).padStart(2, '0'); }
  const rank = score >= 20 ? '宿舍灭虫宗师' : score >= 12 ? '资深室友观察员' : score >= 6 ? '见习捕虫员' : '床帘后勤专员';
  document.querySelector('#resultTitle').textContent = rank;
  document.querySelector('#resultText').textContent = `你在 30 秒内捕获了 ${score} 只室友虫。档案已自动归入“这也能没点到”分类。`;
  statusEl.textContent = '本轮围捕结束'; dialog.showModal(); beep(880, .2);
}

startBtn.addEventListener('click', startGame);
againBtn.addEventListener('click', startGame);
soundBtn.addEventListener('click', () => { soundOn = !soundOn; soundBtn.textContent = soundOn ? '有声' : '静音'; });
