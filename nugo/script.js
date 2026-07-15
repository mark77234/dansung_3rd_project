// 왁뿌의 기기 내 기록과 사운드 설정
const STORAGE_KEY = 'wakppu-state-v1';
const now = new Date();
const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
const state = {
  today: saved.date === todayKey ? Number(saved.today || 0) : 0,
  best: Number(saved.best || 0),
  sound: saved.sound !== false,
  toy: saved.toy || 'bubble'
};

const toyInfo = {
  bubble: { title: '뽁뽁이 타임', help: '동그라미를 마음껏 터뜨려 봐!' },
  keycap: { title: '키캡 타임', help: '키캡을 눌러 나만의 리듬을 만들어 봐!' },
  ball: { title: '왁뿌볼 타임', help: '말랑한 볼을 꾹꾹 눌러 봐!' },
  slime: { title: '슬라임 타임', help: '슬라임을 잡고 이리저리 늘려 봐!' }
};

const playZone = document.querySelector('#playZone');
const combo = document.querySelector('#combo');
let audioContext;
let masterGain;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, date: todayKey }));
}

function updateStats() {
  document.querySelector('#todayCount').textContent = state.today.toLocaleString('ko-KR');
  document.querySelector('#bestCount').textContent = state.best.toLocaleString('ko-KR');
}

// 음량을 충분히 확보하면서 갑작스러운 피크는 컴프레서로 부드럽게 잡는다.
function prepareAudio() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (!masterGain) {
    masterGain = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();
    masterGain.gain.value = 1.45;
    compressor.threshold.value = -12;
    compressor.knee.value = 8;
    compressor.ratio.value = 5;
    masterGain.connect(compressor).connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') audioContext.resume();
}

function tone(start, from, to, duration, volume, wave = 'sine') {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  osc.connect(gain).connect(masterGain);
  osc.start(start); osc.stop(start + duration);
}

function noise(start, duration, volume, frequency, q = 1) {
  const length = Math.ceil(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  filter.type = 'bandpass'; filter.frequency.value = frequency; filter.Q.value = q;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  source.connect(filter).connect(gain).connect(masterGain);
  source.start(start); source.stop(start + duration);
}

// 장난감마다 질감이 다른 합성 ASMR 효과음을 재생한다.
function playSound(type) {
  if (!state.sound) return;
  prepareAudio();
  const start = audioContext.currentTime;

  if (type === 'bubble') {
    tone(start, 260, 72, .085, .22);
    noise(start, .045, .12, 1900, 1.3);
  }

  if (type === 'keycap') {
    // 청축 특유의 높은 클릭음 + 바닥을 치는 낮은 타건음
    noise(start, .022, .24, 4200, 2.8);
    tone(start, 1650, 720, .028, .16, 'square');
    tone(start + .026, 240, 115, .055, .18, 'triangle');
    noise(start + .028, .035, .13, 1100, 1.8);
  }

  if (type === 'ball') {
    // 서로 다른 높이의 짧은 파열음을 겹쳐 바사삭 질감을 만든다.
    for (let i = 0; i < 8; i += 1) {
      const offset = i * .018 + Math.random() * .012;
      noise(start + offset, .035 + Math.random() * .025, .12, 1300 + Math.random() * 3100, 2.2);
      tone(start + offset, 320 + Math.random() * 260, 90, .04, .055, 'triangle');
    }
    noise(start, .19, .11, 2600, .7);
  }

  if (type === 'slime') {
    // 크기가 다른 기포 세 개가 차례로 터지는 촉촉한 팝 사운드
    [0, .035, .075].forEach((offset, index) => {
      tone(start + offset, 290 + index * 90, 70 + index * 12, .075, .18 - index * .025);
      noise(start + offset, .035, .095, 900 + index * 550, 1.4);
    });
  }
}

function score(type) {
  state.today += 1;
  state.best = Math.max(state.best, state.today);
  playSound(type);
  updateStats();
  saveState();
  combo.classList.remove('show');
  void combo.offsetWidth;
  combo.classList.add('show');
  if (navigator.vibrate) navigator.vibrate(12);
}

function bubbleGame() {
  const board = document.createElement('div');
  board.className = 'bubble-board';
  for (let i = 0; i < 16; i += 1) {
    const bubble = document.createElement('button');
    bubble.className = 'pop-bubble';
    bubble.type = 'button';
    bubble.setAttribute('aria-label', `${i + 1}번 뽁뽁이`);
    bubble.addEventListener('click', () => {
      if (bubble.classList.contains('popped')) return;
      bubble.classList.add('popped');
      bubble.setAttribute('aria-label', `${i + 1}번 터짐`);
      score('bubble');
    });
    board.append(bubble);
  }
  playZone.append(board);
}

function keycapGame() {
  const chars = ['W','A','K','P','P','U','♥','!','Z','E','N','♬'];
  const board = document.createElement('div');
  board.className = 'key-board';
  chars.forEach(char => {
    const key = document.createElement('button');
    key.className = 'key'; key.type = 'button'; key.textContent = char;
    key.addEventListener('click', () => { key.classList.add('hit'); setTimeout(() => key.classList.remove('hit'), 90); score('keycap'); });
    board.append(key);
  });
  playZone.append(board);
}

function ballGame() {
  const wrap = document.createElement('div');
  wrap.className = 'squish-wrap';
  const ball = document.createElement('button');
  ball.className = 'squish-ball'; ball.type = 'button'; ball.setAttribute('aria-label', '말랑한 왁뿌볼 누르기');
  const shell = document.createElement('span'); shell.className = 'wax-shell'; shell.setAttribute('aria-hidden', 'true');
  const cracks = document.createElement('span'); cracks.className = 'wax-cracks';
  for (let i = 0; i < 6; i += 1) cracks.append(document.createElement('i'));
  shell.append(cracks); ball.append(shell);
  ball.addEventListener('pointerdown', () => ball.classList.add('squished'));
  ball.addEventListener('click', () => {
    ball.classList.remove('cracked'); void ball.offsetWidth; ball.classList.add('cracked');
    for (let i = 0; i < 7; i += 1) {
      const chip = document.createElement('span'); chip.className = 'wax-chip';
      const angle = Math.random() * Math.PI * 2; const distance = 70 + Math.random() * 70;
      chip.style.setProperty('--chip-x', `${Math.cos(angle) * distance}px`);
      chip.style.setProperty('--chip-y', `${Math.sin(angle) * distance}px`);
      chip.style.setProperty('--chip-r', `${Math.round(Math.random() * 300 - 150)}deg`);
      ball.append(chip); setTimeout(() => chip.remove(), 700);
    }
    score('ball');
  });
  ball.addEventListener('pointerup', () => ball.classList.remove('squished'));
  ball.addEventListener('pointerleave', () => ball.classList.remove('squished'));
  wrap.append(ball); playZone.append(wrap);
}

function slimeGame() {
  const zone = document.createElement('div'); zone.className = 'slime-zone';
  const blob = document.createElement('div'); blob.className = 'slime-blob'; blob.setAttribute('role','button'); blob.tabIndex = 0; blob.setAttribute('aria-label','슬라임 늘리기');
  let dragging = false;
  const move = event => {
    if (!dragging) return;
    const rect = zone.getBoundingClientRect();
    const centerX = rect.width / 2; const centerY = rect.height / 2;
    const x = Math.max(20, Math.min(rect.width - 20, event.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, event.clientY - rect.top));
    const dx = x - centerX; const dy = y - centerY;
    const distance = Math.min(190, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    blob.style.left = `${centerX + dx * .48}px`; blob.style.top = `${centerY + dy * .48}px`;
    blob.style.width = `${180 + distance * .8}px`;
    blob.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleY(${Math.max(.55, 1 - distance / 430)})`;
  };
  const release = () => {
    dragging = false; blob.classList.remove('stretching');
    blob.style.left = '50%'; blob.style.top = '50%'; blob.style.width = '180px'; blob.style.transform = 'translate(-50%,-50%)';
  };
  blob.addEventListener('pointerdown', event => { dragging = true; blob.classList.add('stretching'); blob.setPointerCapture(event.pointerId); score('slime'); });
  blob.addEventListener('pointermove', move);
  blob.addEventListener('pointerup', release);
  blob.addEventListener('pointercancel', release);
  blob.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); score('slime'); } });
  zone.append(blob); playZone.append(zone);
}

function renderToy() {
  playZone.replaceChildren();
  document.querySelector('#studioTitle').textContent = toyInfo[state.toy].title;
  document.querySelector('#instruction').textContent = toyInfo[state.toy].help;
  ({ bubble: bubbleGame, keycap: keycapGame, ball: ballGame, slime: slimeGame })[state.toy]();
  document.querySelectorAll('.toy-card').forEach(card => {
    const selected = card.dataset.toy === state.toy;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
}

document.querySelectorAll('.toy-card').forEach(card => card.addEventListener('click', () => {
  state.toy = card.dataset.toy; saveState(); renderToy();
  document.querySelector('.studio').scrollIntoView({ behavior: 'smooth', block: 'center' });
}));

document.querySelector('#refreshToy').addEventListener('click', renderToy);
document.querySelector('#soundToggle').addEventListener('click', event => {
  state.sound = !state.sound;
  event.currentTarget.setAttribute('aria-pressed', String(state.sound));
  document.querySelector('#soundLabel').textContent = `사운드 ${state.sound ? 'ON' : 'OFF'}`;
  saveState();
});
document.querySelector('#resetStats').addEventListener('click', () => {
  if (!confirm('왁뿌 기록을 모두 지울까요?')) return;
  state.today = 0; state.best = 0; updateStats(); saveState();
});

document.querySelector('#soundToggle').setAttribute('aria-pressed', String(state.sound));
document.querySelector('#soundLabel').textContent = `사운드 ${state.sound ? 'ON' : 'OFF'}`;
updateStats();
renderToy();
