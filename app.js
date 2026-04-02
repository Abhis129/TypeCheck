'use strict';

/* ── Word bank ── */
const WORDS = [
  'the','be','to','of','and','a','in','that','have','it',
  'for','not','on','with','he','as','you','do','at','this',
  'but','his','by','from','they','we','say','her','she','or',
  'an','will','my','one','all','would','there','their','what',
  'so','up','out','if','about','who','get','which','go','me',
  'when','make','can','like','time','no','just','him','know',
  'take','people','into','year','your','good','some','could',
  'them','see','other','than','then','now','look','only','come',
  'its','over','think','also','back','after','use','two','how',
  'our','work','first','well','way','even','new','want','because',
  'any','these','give','day','most','us','great','between','need',
  'large','often','hand','high','place','hold','turn','move','live',
  'strong','through','stand','own','under','last','never','always',
  'line','point','read','change','off','play','spell','found','still',
  'learn','plant','cover','food','sun','four','between','state','keep',
  'eye','never','last','let','thought','city','tree','cross','farm',
  'hard','start','might','story','saw','far','sea','draw','left','late',
  'run','while','press','close','night','real','life','few','north',
  'open','seem','together','next','white','children','begin','got','walk',
  'example','ease','paper','group','always','music','those','both','mark',
];

/* ── DOM refs ── */
const textDisplay  = document.getElementById('text-display');
const typeInput    = document.getElementById('type-input');
const wpmEl        = document.getElementById('wpm');
const accEl        = document.getElementById('accuracy');
const timerEl      = document.getElementById('timer');
const errorsEl     = document.getElementById('errors');
const screenTest   = document.getElementById('screen-test');
const screenResults= document.getElementById('screen-results');
const modeBtns     = document.querySelectorAll('.mode-btn');
const btnRestart   = document.getElementById('btn-restart');

/* ── State ── */
let words        = [];
let charSpans    = [];
let currentIndex = 0;
let errors       = 0;
let totalTyped   = 0;
let started      = false;
let finished     = false;
let timerInterval= null;
let timeLimit    = 60;
let timeLeft     = 60;
let startTime    = null;

/* ── Generate text ── */
function generateWords(count = 80) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return arr;
}

function buildDisplay() {
  textDisplay.innerHTML = '';
  charSpans = [];
  const fullText = words.join(' ');
  for (let i = 0; i < fullText.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = fullText[i];
    textDisplay.appendChild(span);
    charSpans.push(span);
  }
  if (charSpans.length > 0) {
    charSpans[0].classList.add('current');
  }
}

/* ── Init / Reset ── */
function init() {
  clearInterval(timerInterval);
  words        = generateWords(80);
  currentIndex = 0;
  errors       = 0;
  totalTyped   = 0;
  started      = false;
  finished     = false;
  timeLeft     = timeLimit;
  startTime    = null;

  wpmEl.textContent     = '0';
  accEl.textContent     = '100';
  timerEl.textContent   = timeLimit;
  errorsEl.textContent  = '0';
  timerEl.style.color   = '';
  document.body.classList.remove('timer-warning');

  buildDisplay();
  typeInput.value = '';
  typeInput.disabled = false;
  typeInput.focus();

  screenResults.classList.add('hidden');
  screenTest.classList.remove('hidden');
}

/* ── Timer ── */
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 10) {
      document.body.classList.add('timer-warning');
    }

    updateWPM();

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

/* ── WPM calculation ── */
function updateWPM() {
  if (!startTime) return;
  const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
  const correctChars = currentIndex - errors;
  const rawWPM  = Math.round((currentIndex / 5) / elapsed);
  const netWPM  = Math.max(0, Math.round((correctChars / 5) / elapsed));
  wpmEl.textContent = netWPM || 0;
  return { rawWPM, netWPM };
}

function calcAccuracy() {
  if (totalTyped === 0) return 100;
  return Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100));
}

/* ── Input handler ── */
typeInput.addEventListener('input', (e) => {
  if (finished) return;

  const typed = typeInput.value;
  const len   = typed.length;

  // Start timer on first keystroke
  if (!started && len > 0) {
    started = true;
    startTimer();
  }

  // Limit typing to available chars
  if (currentIndex >= charSpans.length) {
    typeInput.value = typed.slice(0, -1);
    return;
  }

  totalTyped++;

  const expectedChar = charSpans[currentIndex].textContent;
  const typedChar    = typed[len - 1];

  // Mark previous current
  charSpans[currentIndex].classList.remove('current');

  if (typedChar === expectedChar) {
    charSpans[currentIndex].classList.add('correct');
  } else {
    charSpans[currentIndex].classList.add('wrong');
    errors++;
    errorsEl.textContent = errors;
  }

  currentIndex++;

  // Set next current
  if (currentIndex < charSpans.length) {
    charSpans[currentIndex].classList.add('current');
    scrollToCurrent();
  }

  // Update accuracy
  accEl.textContent = calcAccuracy();

  // Keep input trimmed to avoid runaway length
  if (typed.length > 200) {
    typeInput.value = '';
  }
});

/* ── Scroll current char into view ── */
function scrollToCurrent() {
  if (currentIndex < charSpans.length) {
    charSpans[currentIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

/* ── End test ── */
function endTest() {
  clearInterval(timerInterval);
  finished = true;
  typeInput.disabled = true;
  document.body.classList.remove('timer-warning');

  const elapsed   = (Date.now() - startTime) / 1000 / 60;
  const correctChars = currentIndex - errors;
  const netWPM    = Math.max(0, Math.round((correctChars / 5) / elapsed));
  const rawWPM    = Math.round((currentIndex / 5) / elapsed);
  const acc       = calcAccuracy();
  const timeTaken = timeLimit - timeLeft;

  document.getElementById('res-wpm').textContent    = netWPM;
  document.getElementById('res-acc').textContent    = acc + '%';
  document.getElementById('res-raw').textContent    = rawWPM;
  document.getElementById('res-chars').textContent  = `${correctChars} / ${currentIndex}`;
  document.getElementById('res-errors').textContent = errors;
  document.getElementById('res-time').textContent   = timeTaken + 's';
  document.getElementById('res-rating').textContent = getRating(netWPM, acc);

  screenTest.classList.add('hidden');
  screenResults.classList.remove('hidden');
}

/* ── Rating ── */
function getRating(wpm, acc) {
  if (acc < 85)         return '⚠ train your fingers';
  if (wpm < 30)         return 'keep practicing';
  if (wpm < 50)         return 'getting there';
  if (wpm < 70)         return 'above average';
  if (wpm < 90)         return 'impressive';
  if (wpm < 110)        return '🔥 blazing fast';
  return                       '⚡ elite typist';
}

/* ── Mode buttons ── */
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    timeLimit = parseInt(btn.dataset.time);
    init();
  });
});

/* ── Restart button ── */
btnRestart.addEventListener('click', init);

/* ── Keyboard shortcuts ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    init();
  }
  if (e.key === 'Escape') {
    init();
  }
});

/* ── Focus input on click anywhere ── */
document.addEventListener('click', () => {
  if (!finished) typeInput.focus();
});

/* ── Boot ── */
init();
