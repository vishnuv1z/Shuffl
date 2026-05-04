/* ========== DOODLE BACKGROUND IMAGES ========== */
const DOODLE_IMAGES = [
  './assets/bg-element1.jpg',
  './assets/bg-element2.jpg',
  './assets/bg-element3.jpg',
  './assets/bg-element4.jpg',
  './assets/bg-element5.jpg',
  './assets/bg-element6.jpg',
  './assets/bg-element7.jpg'
];

/**
 * Intentional anchor-point positions across the viewport.
 * Designed to feel like a hand-decorated notebook page —
 * not a grid, not random, but purposefully scattered.
 * Each entry: { top%, left%, width(px), opacity, rotation(deg) }
 */
const DOODLE_PLACEMENTS = [
  // --- Top row ---
  { top: 8,   left: 6,   w: 70,  op: 0.45, rot: -7  },
  { top: 5,   left: 38,  w: 55,  op: 0.40, rot: 4   },
  { top: 10,  left: 72,  w: 65,  op: 0.42, rot: -3  },
  { top: 3,   left: 90,  w: 60,  op: 0.45, rot: 9   },
  // --- Upper-mid ---
  { top: 22,  left: 15,  w: 50,  op: 0.40, rot: 6   },
  { top: 28,  left: 80,  w: 75,  op: 0.42, rot: -8  },
  // --- Middle row ---
  { top: 42,  left: 5,   w: 80,  op: 0.48, rot: -5  },
  { top: 48,  left: 55,  w: 55,  op: 0.40, rot: 10  },
  { top: 45,  left: 88,  w: 65,  op: 0.45, rot: -4  },
  // --- Lower-mid ---
  { top: 62,  left: 12,  w: 60,  op: 0.42, rot: 7   },
  { top: 58,  left: 75,  w: 70,  op: 0.40, rot: -9  },
  // --- Bottom row ---
  { top: 78,  left: 8,   w: 75,  op: 0.45, rot: -6  },
  { top: 82,  left: 45,  w: 60,  op: 0.42, rot: 3   },
  { top: 76,  left: 85,  w: 55,  op: 0.48, rot: -10 },
  // --- Interior accents (light touches) ---
  { top: 35,  left: 30,  w: 50,  op: 0.40, rot: 5   },
  { top: 68,  left: 40,  w: 55,  op: 0.40, rot: -2  },
  { top: 90,  left: 25,  w: 65,  op: 0.42, rot: 8   },
  { top: 15,  left: 55,  w: 50,  op: 0.40, rot: -6  },
];

function createDoodleLayer() {
  const layer = document.getElementById('doodle-layer');
  layer.innerHTML = '';

  DOODLE_PLACEMENTS.forEach((pos, i) => {
    const img = document.createElement('img');
    img.src = DOODLE_IMAGES[i % DOODLE_IMAGES.length];
    img.alt = '';
    img.draggable = false;
    img.style.top = pos.top + '%';
    img.style.left = pos.left + '%';
    img.style.width = pos.w + 'px';
    img.style.opacity = pos.op;
    img.style.transform = `rotate(${pos.rot}deg)`;
    layer.appendChild(img);
  });
}

/* ========== PAGE NAVIGATION ========== */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const target = document.getElementById(pageId);
  target.style.display = 'flex';
  // Force reflow for transition
  void target.offsetWidth;
  target.classList.add('active');
}

function goToApp() {
  showPage('app-page');
}

function goToHome() {
  showPage('landing-page');
  // Clear the grid
  document.getElementById('seat-grid').innerHTML = '';
  showEmptyState();
}

/* ========== RIPPLE EFFECT ========== */
function createRipple(event) {
  const btn = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  const rect = btn.getBoundingClientRect();
  circle.style.width = circle.style.height = diameter + 'px';
  circle.style.left = (event.clientX - rect.left - radius) + 'px';
  circle.style.top = (event.clientY - rect.top - radius) + 'px';
  circle.classList.add('ripple');
  // Remove existing ripple
  const existing = btn.querySelector('.ripple');
  if (existing) existing.remove();
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

/* ========== FISHER-YATES SHUFFLE ========== */
function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ========== EMPTY STATE ========== */
function showEmptyState() {
  const grid = document.getElementById('seat-grid');
  grid.style.gridTemplateColumns = '1fr';
  grid.innerHTML = `
    <div class="empty-state">
      <img src="./assets/seat-top-view.png" alt="Seat" class="empty-icon">
      <p>Enter the details and hit Shuffle!</p>
    </div>
  `;
}

/* ========== SHUFFLE SEATS ========== */
function shuffleSeats() {
  const totalInput = document.getElementById('total-students');
  const rowsInput = document.getElementById('num-rows');
  const colsInput = document.getElementById('num-cols');

  const total = parseInt(totalInput.value);
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);

  // Validation
  if (!total || !rows || !cols || total < 1 || rows < 1 || cols < 1) {
    shakeInput(totalInput);
    shakeInput(rowsInput);
    shakeInput(colsInput);
    return;
  }

  if (rows * cols < total) {
    alert('Not enough seats! Rows x Columns must be >= Students.');
    return;
  }

  // Generate and shuffle roll numbers
  const rolls = [];
  for (let i = 1; i <= total; i++) rolls.push(i);
  const shuffled = fisherYatesShuffle(rolls);

  // Build the grid
  const grid = document.getElementById('seat-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  let index = 0;
  const totalCells = rows * cols;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'seat-cell';
    // Random slight rotation for realism
    const rotation = (Math.random() * 4 - 2).toFixed(1);
    cell.style.transform = `rotate(${rotation}deg)`;
    cell.style.animationDelay = `${i * 0.06}s`;

    const img = document.createElement('img');
    img.src = './assets/seat-top-view.png';
    img.alt = 'Seat';
    img.draggable = false;

    const rollSpan = document.createElement('span');
    rollSpan.className = 'roll-number';

    if (index < total) {
      rollSpan.textContent = shuffled[index];
      index++;
    } else {
      rollSpan.textContent = '\u2014'; // em-dash
      cell.classList.add('empty');
    }

    cell.appendChild(img);
    cell.appendChild(rollSpan);
    grid.appendChild(cell);
  }
}

/* ========== INPUT SHAKE ========== */
function shakeInput(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shakeAnim 0.4s ease';
  el.style.borderColor = '#e74c3c';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 800);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeAnim {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  createDoodleLayer();
  showPage('landing-page');
  showEmptyState();

  // Ripple on buttons
  document.querySelectorAll('.landing-btn, .shuffle-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
});
