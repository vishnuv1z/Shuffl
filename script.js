/* ========== DOODLE BACKGROUND ========== */
const DOODLES = ['✏️','📚','⭐','✨','📐','📏','🎒','✍️','🔢','➕','➖','✖️','➗','💡','🎵','😊','📎','🖍️','∞','π','Σ','∆','α','β','≈','∴','♪','☆','→','←','↑','↓'];

function createDoodleOverlay() {
  const overlay = document.getElementById('doodle-overlay');
  const count = 40;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = DOODLES[Math.floor(Math.random() * DOODLES.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.top = Math.random() * 100 + '%';
    span.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
    span.style.transform = `rotate(${Math.random() * 360}deg)`;
    span.style.animationDuration = (15 + Math.random() * 15) + 's';
    span.style.animationDelay = (Math.random() * 10) + 's';
    overlay.appendChild(span);
  }
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
      <div class="icon">🪑</div>
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
    alert('Not enough seats! Rows × Columns must be ≥ Students.');
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
      rollSpan.textContent = '—';
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
  createDoodleOverlay();
  showPage('landing-page');
  showEmptyState();

  // Ripple on buttons
  document.querySelectorAll('.landing-btn, .shuffle-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
});
