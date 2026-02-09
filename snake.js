(() => {
  'use strict';

  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('snake-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlaySubtitle = document.getElementById('overlay-subtitle');
  const resumeBtn = document.getElementById('resume-btn');
  const restartBtn = document.getElementById('restart-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const restartBtnSide = document.getElementById('restart-btn-side');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const skinButtons = Array.from(document.querySelectorAll('.skin-chip'));
  const dpadButtons = Array.from(document.querySelectorAll('.dpad-btn'));
  const mobileActionButtons = Array.from(document.querySelectorAll('.mobile-actions button'));
  const board = document.querySelector('.snake-board');
  const leaderboardList = document.getElementById('leaderboard-list');
  const scoreEntry = document.getElementById('score-entry');
  const scoreForm = document.getElementById('score-form');
  const scoreInitials = document.getElementById('score-initials');
  const scorePeriod = document.getElementById('score-period');
  const scoreEntryScore = document.getElementById('score-entry-score');
  const scoreCancel = document.getElementById('score-cancel');

  const GRID = { cols: 24, rows: 18 };
  const TICK_MS = 120;
  const SCORE_PER_FOOD = 10;
  const BEST_SCORE_KEY = 'bulldog_rally_best';
  const SCORE_STORAGE_KEY = 'bulldog_rally_top_scores';
  const LEADERBOARD_LIMIT = 8;
  const CONFIG = {
    // Paste your deployed Apps Script web app URL here.
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbzvlZDa8QlpVhbhWvMKP85k1NmWrozz5i040vbFMLpBi9QQ-rxQMRVPYD8ZpwkQrJY/exec',
    topLimit: LEADERBOARD_LIMIT
  };

  const SKINS = {
    ember: 'Ember',
    neon: 'Neon',
    frost: 'Frost'
  };

  let layout = {
    width: 0,
    height: 0,
    cell: 0,
    offsetX: 0,
    offsetY: 0
  };

  let theme = readTheme();
  let state = createInitialState(Date.now() % 2147483647);
  let queuedDir = null;
  let paused = false;
  let accumulator = 0;
  let lastTime = performance.now();
  let bestScore = readBestScore();
  let leaderboard = [];
  let leaderboardStatus = 'loading';
  let pendingScore = null;

  const noiseCanvas = buildNoiseTexture(120, 120);

  function readBestScore() {
    const value = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY), 10);
    return Number.isFinite(value) ? value : 0;
  }

  function writeBestScore(score) {
    bestScore = Math.max(bestScore, score);
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    bestEl.textContent = String(bestScore);
  }

  function readTheme() {
    const styles = getComputedStyle(document.body);
    return {
      boardGlow: styles.getPropertyValue('--board-glow').trim(),
      grid: styles.getPropertyValue('--grid-lines').trim(),
      carBody: styles.getPropertyValue('--car-body').trim(),
      carHighlight: styles.getPropertyValue('--car-highlight').trim(),
      carGlow: styles.getPropertyValue('--car-glow').trim(),
      dust: styles.getPropertyValue('--dust').trim(),
      dustGlow: styles.getPropertyValue('--dust-glow').trim(),
      trophy: styles.getPropertyValue('--trophy').trim(),
      trophyGlow: styles.getPropertyValue('--trophy-glow').trim()
    };
  }

  function normalizeInitials(value) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  }

  function sanitizeScoreEntry(entry) {
    return {
      initials: normalizeInitials(entry.initials || ''),
      period: Number(entry.period) || 0,
      score: Number(entry.score) || 0,
      createdAt: entry.createdAt || new Date().toISOString()
    };
  }

  function sortScores(entries) {
    return [...entries].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.createdAt).localeCompare(String(b.createdAt));
    });
  }

  function loadLocalScores() {
    const raw = localStorage.getItem(SCORE_STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return sortScores(parsed.map(sanitizeScoreEntry));
    } catch {
      return [];
    }
  }

  function saveLocalScores(entries) {
    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(entries));
  }

  function renderLeaderboard() {
    if (!leaderboardList) return;
    leaderboardList.innerHTML = '';
    if (leaderboardStatus === 'loading') {
      leaderboardList.innerHTML = '<li class="leaderboard-item">Loading...</li>';
      return;
    }
    if (!leaderboard.length) {
      leaderboardList.innerHTML = '<li class="leaderboard-item">No scores yet</li>';
      return;
    }

    leaderboard.slice(0, CONFIG.topLimit).forEach((entry, index) => {
      const item = document.createElement('li');
      item.className = 'leaderboard-item';
      const rank = document.createElement('span');
      rank.className = 'leaderboard-rank';
      rank.textContent = `#${index + 1}`;
      const name = document.createElement('span');
      name.textContent = `${entry.initials} • P${entry.period}`;
      const score = document.createElement('span');
      score.className = 'leaderboard-score';
      score.textContent = String(entry.score);
      item.append(rank, name, score);
      leaderboardList.appendChild(item);
    });
  }

  function setLeaderboard(entries) {
    leaderboard = sortScores(entries).slice(0, CONFIG.topLimit);
    leaderboardStatus = 'ready';
    renderLeaderboard();
  }

  async function loadLeaderboard() {
    leaderboardStatus = 'loading';
    renderLeaderboard();
    if (!CONFIG.appsScriptUrl) {
      setLeaderboard(loadLocalScores());
      return;
    }
    try {
      const response = await fetch(`${CONFIG.appsScriptUrl}?action=top&limit=${CONFIG.topLimit}`, {
        method: 'GET',
        mode: 'cors'
      });
      const payload = await response.json();
      if (payload && Array.isArray(payload.scores)) {
        setLeaderboard(payload.scores.map(sanitizeScoreEntry));
      } else {
        throw new Error('Invalid leaderboard payload');
      }
    } catch {
      leaderboardStatus = 'error';
      setLeaderboard(loadLocalScores());
    }
  }

  function isTopScore(score) {
    if (score <= 0) return false;
    if (!leaderboard.length) return true;
    if (leaderboard.length < CONFIG.topLimit) return true;
    const lowest = leaderboard[leaderboard.length - 1].score;
    return score > lowest;
  }

  async function submitScore(entry) {
    const sanitized = sanitizeScoreEntry(entry);
    if (!CONFIG.appsScriptUrl) {
      const updated = sortScores([...leaderboard, sanitized]).slice(0, CONFIG.topLimit);
      setLeaderboard(updated);
      saveLocalScores(updated);
      return;
    }

    try {
      const response = await fetch(CONFIG.appsScriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized)
      });
      const payload = await response.json().catch(() => null);
      if (payload && Array.isArray(payload.scores)) {
        setLeaderboard(payload.scores.map(sanitizeScoreEntry));
        return;
      }
    } catch {
      // Fall back to local storage if network fails.
    }

    const updated = sortScores([...leaderboard, sanitized]).slice(0, CONFIG.topLimit);
    setLeaderboard(updated);
    saveLocalScores(updated);
  }

  function openScoreEntry(score) {
    pendingScore = score;
    scoreEntryScore.textContent = `Score: ${score}`;
    scoreEntry.classList.remove('hidden');
    scoreInitials.value = '';
    scorePeriod.value = '';
    scoreInitials.focus();
  }

  function closeScoreEntry() {
    pendingScore = null;
    scoreEntry.classList.add('hidden');
  }

  function setSkin(id) {
    if (!SKINS[id]) return;
    document.body.dataset.skin = id;
    skinButtons.forEach((btn) => {
      const active = btn.dataset.skin === id;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    theme = readTheme();
    render(performance.now());
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cell = Math.max(8, Math.floor(Math.min(rect.width / GRID.cols, rect.height / GRID.rows)));
    const boardWidth = cell * GRID.cols;
    const boardHeight = cell * GRID.rows;
    layout = {
      width: boardWidth,
      height: boardHeight,
      cell,
      offsetX: Math.floor((rect.width - boardWidth) / 2),
      offsetY: Math.floor((rect.height - boardHeight) / 2)
    };
  }

  function lcg(seed) {
    const next = (seed * 1664525 + 1013904223) >>> 0;
    return { seed: next, value: next / 4294967296 };
  }

  function placeTrophy(dustTrail, seed) {
    const occupied = new Set(dustTrail.map((segment) => `${segment.x},${segment.y}`));
    const open = [];
    for (let y = 0; y < GRID.rows; y += 1) {
      for (let x = 0; x < GRID.cols; x += 1) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) open.push({ x, y });
      }
    }
    if (open.length === 0) return { trophy: null, seed };
    const roll = lcg(seed);
    const index = Math.floor(roll.value * open.length);
    return { trophy: open[index], seed: roll.seed };
  }

  function createInitialState(seed) {
    const startX = Math.floor(GRID.cols / 2);
    const startY = Math.floor(GRID.rows / 2);
    const dustTrail = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY }
    ];
    const { trophy, seed: nextSeed } = placeTrophy(dustTrail, seed);
    return {
      dustTrail,
      direction: { x: 1, y: 0 },
      trophy,
      score: 0,
      seed: nextSeed,
      over: false,
      won: false
    };
  }

  function isOpposite(a, b) {
    return a.x + b.x === 0 && a.y + b.y === 0;
  }

  function stepState(prev, inputDir) {
    if (prev.over) return prev;
    let direction = prev.direction;
    if (inputDir && !isOpposite(inputDir, prev.direction)) {
      direction = inputDir;
    }

    const head = {
      x: prev.dustTrail[0].x + direction.x,
      y: prev.dustTrail[0].y + direction.y
    };

    if (head.x < 0 || head.x >= GRID.cols || head.y < 0 || head.y >= GRID.rows) {
      return { ...prev, direction, over: true };
    }

    const eating = prev.trophy && head.x === prev.trophy.x && head.y === prev.trophy.y;
    const body = eating ? prev.dustTrail : prev.dustTrail.slice(0, -1);
    if (body.some((segment) => segment.x === head.x && segment.y === head.y)) {
      return { ...prev, direction, over: true };
    }

    const nextDust = [head, ...prev.dustTrail];
    if (!eating) nextDust.pop();

    let score = prev.score;
    let seed = prev.seed;
    let trophy = prev.trophy;
    let won = false;

    if (eating) {
      score += SCORE_PER_FOOD;
      const placement = placeTrophy(nextDust, seed);
      trophy = placement.trophy;
      seed = placement.seed;
      if (!trophy) {
        won = true;
      }
    }

    return {
      ...prev,
      dustTrail: nextDust,
      direction,
      score,
      seed,
      trophy,
      over: won,
      won
    };
  }

  function queueDirection(dir) {
    if (state.over || paused) return;
    const basis = queuedDir || state.direction;
    if (dir.x === basis.x && dir.y === basis.y) return;
    if (isOpposite(basis, dir)) return;
    queuedDir = dir;
  }

  function updateScores() {
    scoreEl.textContent = String(state.score);
    writeBestScore(state.score);
  }

  function restart() {
    state = createInitialState(Date.now() % 2147483647);
    queuedDir = null;
    accumulator = 0;
    paused = false;
    closeScoreEntry();
    updateScores();
    setOverlay(null);
  }

  function setOverlay(mode) {
    if (!mode) {
      overlay.classList.add('hidden');
      return;
    }

    overlay.classList.remove('hidden');
    if (mode === 'paused') {
      overlayTitle.textContent = 'Paused';
      overlaySubtitle.textContent = 'Press space to resume.';
      resumeBtn.style.display = '';
      return;
    }

    if (mode === 'win') {
      overlayTitle.textContent = 'You Win';
      overlaySubtitle.textContent = 'Restart for another run.';
      resumeBtn.style.display = 'none';
      return;
    }

    overlayTitle.textContent = 'Game Over';
    overlaySubtitle.textContent = 'Press R to restart.';
    resumeBtn.style.display = 'none';
  }

  function togglePause() {
    if (state.over) return;
    paused = !paused;
    if (paused) setOverlay('paused');
    else setOverlay(null);
  }

  function handleGameOver() {
    updateScores();
    setOverlay(state.won ? 'win' : 'over');
    if (isTopScore(state.score)) {
      openScoreEntry(state.score);
    }
  }

  function handleStep(deltaMs) {
    if (paused || state.over) return;
    accumulator += deltaMs;
    while (accumulator >= TICK_MS) {
      const next = stepState(state, queuedDir);
      queuedDir = null;
      const scoreBefore = state.score;
      state = next;
      accumulator -= TICK_MS;
      if (state.score !== scoreBefore) {
        updateScores();
      }
      if (state.over) {
        handleGameOver();
        break;
      }
    }
  }

  function drawBackground(time) {
    const { offsetX, offsetY, width, height } = layout;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(offsetX, offsetY, offsetX + width, offsetY + height);
    gradient.addColorStop(0, 'rgba(10, 12, 20, 0.95)');
    gradient.addColorStop(1, 'rgba(2, 2, 6, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(offsetX, offsetY, width, height);

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.drawImage(noiseCanvas, offsetX, offsetY, width, height);
    ctx.restore();

    ctx.strokeStyle = theme.grid || 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= GRID.cols; x += 1) {
      const px = offsetX + x * layout.cell + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, offsetY);
      ctx.lineTo(px, offsetY + height);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID.rows; y += 1) {
      const py = offsetY + y * layout.cell + 0.5;
      ctx.beginPath();
      ctx.moveTo(offsetX, py);
      ctx.lineTo(offsetX + width, py);
      ctx.stroke();
    }

    const sweep = ((time / 1000) % 3) / 3;
    const sweepY = offsetY + height * sweep;
    const sweepGradient = ctx.createLinearGradient(offsetX, sweepY - height * 0.4, offsetX, sweepY + height * 0.4);
    sweepGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGradient.addColorStop(0.5, theme.boardGlow || 'rgba(255, 209, 102, 0.14)');
    sweepGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sweepGradient;
    ctx.fillRect(offsetX, offsetY, width, height);
  }

  function roundRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawCarAndDust(time) {
    const wobble = Math.sin(time / 120);
    state.dustTrail.forEach((segment, index) => {
      if (index === 0) {
        drawCar(segment, time);
        return;
      }

      const centerX = layout.offsetX + segment.x * layout.cell + layout.cell / 2;
      const centerY = layout.offsetY + segment.y * layout.cell + layout.cell / 2;
      const puffBase = layout.cell * 0.22;
      const pulse = 0.8 + 0.2 * Math.sin(time / 160 + index);
      const alpha = Math.max(0.1, 0.75 - index * 0.03);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = theme.dustGlow;
      ctx.shadowBlur = layout.cell * 0.5;
      ctx.fillStyle = theme.dust;
      for (let i = 0; i < 3; i += 1) {
        const radius = puffBase * (1 + i * 0.35) * pulse;
        const offsetX = (i - 1) * (layout.cell * 0.1 + wobble * 0.3);
        const offsetY = (i % 2 === 0 ? -1 : 1) * (layout.cell * 0.08);
        ctx.beginPath();
        ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawCar(segment, time) {
    const centerX = layout.offsetX + segment.x * layout.cell + layout.cell / 2;
    const centerY = layout.offsetY + segment.y * layout.cell + layout.cell / 2;
    const bodyWidth = layout.cell * 0.92;
    const bodyHeight = layout.cell * 0.58;
    const wheelRadius = layout.cell * 0.12;
    const hoodStripeWidth = bodyWidth * 0.12;
    const headlightSize = layout.cell * 0.12;
    const angle = getCarAngle();
    const pulse = 1 + 0.03 * Math.sin(time / 120);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.scale(pulse, pulse);

    ctx.save();
    ctx.shadowColor = theme.carGlow;
    ctx.shadowBlur = layout.cell * 0.8;
    ctx.fillStyle = theme.carBody;
    roundRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight, layout.cell * 0.2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = theme.carHighlight;
    ctx.fillRect(-hoodStripeWidth / 2, -bodyHeight / 2, hoodStripeWidth, bodyHeight);

    ctx.fillStyle = 'rgba(18, 20, 28, 0.85)';
    ctx.beginPath();
    ctx.arc(-bodyWidth * 0.22, -bodyHeight / 2, wheelRadius, 0, Math.PI * 2);
    ctx.arc(-bodyWidth * 0.22, bodyHeight / 2, wheelRadius, 0, Math.PI * 2);
    ctx.arc(bodyWidth * 0.22, -bodyHeight / 2, wheelRadius, 0, Math.PI * 2);
    ctx.arc(bodyWidth * 0.22, bodyHeight / 2, wheelRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme.carHighlight;
    ctx.fillRect(bodyWidth / 2 - headlightSize * 0.8, -bodyHeight * 0.32, headlightSize, headlightSize * 0.45);
    ctx.fillRect(bodyWidth / 2 - headlightSize * 0.8, bodyHeight * 0.06, headlightSize, headlightSize * 0.45);

    ctx.restore();
  }

  function getCarAngle() {
    if (state.direction.x === 1) return 0;
    if (state.direction.x === -1) return Math.PI;
    if (state.direction.y === 1) return Math.PI / 2;
    return -Math.PI / 2;
  }

  function drawTrophy(time) {
    if (!state.trophy) return;
    const pulse = 0.5 + 0.5 * Math.sin(time / 180);
    const size = layout.cell * (0.4 + pulse * 0.08);
    const centerX = layout.offsetX + state.trophy.x * layout.cell + layout.cell / 2;
    const centerY = layout.offsetY + state.trophy.y * layout.cell + layout.cell / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.shadowColor = theme.trophyGlow;
    ctx.shadowBlur = layout.cell * 0.7;
    ctx.fillStyle = theme.trophy;

    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.35, Math.PI, 0, false);
    ctx.lineTo(size * 0.35, size * 0.05);
    ctx.lineTo(-size * 0.35, size * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(-size * 0.12, size * 0.05, size * 0.24, size * 0.28);
    ctx.fillRect(-size * 0.3, size * 0.35, size * 0.6, size * 0.2);
    ctx.restore();
  }

  function render(time) {
    resizeCanvas();
    drawBackground(time);
    drawTrophy(time);
    drawCarAndDust(time);

    if (paused) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(layout.offsetX, layout.offsetY, layout.width, layout.height);
      ctx.restore();
    }
  }

  function loop(now) {
    const delta = now - lastTime;
    lastTime = now;
    handleStep(delta);
    render(now);
    requestAnimationFrame(loop);
  }

  function buildNoiseTexture(width, height) {
    const noise = document.createElement('canvas');
    noise.width = width;
    noise.height = height;
    const nctx = noise.getContext('2d');
    const imageData = nctx.createImageData(width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const shade = 200 + Math.floor(Math.random() * 55);
      imageData.data[i] = shade;
      imageData.data[i + 1] = shade;
      imageData.data[i + 2] = shade;
      imageData.data[i + 3] = Math.random() * 18;
    }
    nctx.putImageData(imageData, 0, 0);
    return noise;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      board.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }

  function handleKeydown(event) {
    const { code } = event;
    if (!scoreEntry.classList.contains('hidden')) {
      if (code === 'Escape') closeScoreEntry();
      return;
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
      event.preventDefault();
    }
    if (code === 'ArrowUp' || code === 'KeyW') queueDirection({ x: 0, y: -1 });
    if (code === 'ArrowDown' || code === 'KeyS') queueDirection({ x: 0, y: 1 });
    if (code === 'ArrowLeft' || code === 'KeyA') queueDirection({ x: -1, y: 0 });
    if (code === 'ArrowRight' || code === 'KeyD') queueDirection({ x: 1, y: 0 });
    if (code === 'Space') togglePause();
    if (code === 'KeyR') restart();
    if (code === 'KeyF') toggleFullscreen();
  }

  function handleDpadPress(event) {
    event.preventDefault();
    const dir = event.currentTarget.dataset.dir;
    if (dir === 'up') queueDirection({ x: 0, y: -1 });
    if (dir === 'down') queueDirection({ x: 0, y: 1 });
    if (dir === 'left') queueDirection({ x: -1, y: 0 });
    if (dir === 'right') queueDirection({ x: 1, y: 0 });
  }

  function handleMobileAction(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    if (action === 'pause') togglePause();
    if (action === 'restart') restart();
  }

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', () => render(performance.now()));
  document.addEventListener('fullscreenchange', () => render(performance.now()));

  skinButtons.forEach((btn) => {
    btn.addEventListener('click', () => setSkin(btn.dataset.skin));
  });

  dpadButtons.forEach((btn) => {
    btn.addEventListener('pointerdown', handleDpadPress);
  });

  mobileActionButtons.forEach((btn) => {
    btn.addEventListener('pointerdown', handleMobileAction);
  });

  pauseBtn.addEventListener('click', togglePause);
  restartBtnSide.addEventListener('click', restart);
  restartBtn.addEventListener('click', restart);
  resumeBtn.addEventListener('click', () => {
    paused = false;
    setOverlay(null);
  });
  scoreInitials.addEventListener('input', () => {
    scoreInitials.value = normalizeInitials(scoreInitials.value);
  });
  scoreCancel.addEventListener('click', closeScoreEntry);
  scoreForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pendingScore === null) {
      closeScoreEntry();
      return;
    }
    const initials = normalizeInitials(scoreInitials.value);
    const period = Number(scorePeriod.value);
    if (!initials || initials.length < 1 || !period) {
      scoreInitials.value = initials;
      return;
    }
    const scoreValue = pendingScore;
    closeScoreEntry();
    await submitScore({ initials, period, score: scoreValue });
  });

  updateScores();
  loadLeaderboard();
  resizeCanvas();
  render(performance.now());
  requestAnimationFrame(loop);

  window.render_game_to_text = () => {
    const car = state.dustTrail[0];
    const payload = {
      mode: state.over ? (state.won ? 'win' : 'gameover') : (paused ? 'paused' : 'play'),
      grid: {
        cols: GRID.cols,
        rows: GRID.rows,
        origin: 'top-left',
        axis: 'x right, y down',
        cell: layout.cell
      },
      car,
      dust: state.dustTrail.slice(1),
      direction: state.direction,
      trophy: state.trophy,
      score: state.score,
      best: bestScore,
      topScores: leaderboard,
      tickMs: TICK_MS
    };
    return JSON.stringify(payload);
  };

  window.advanceTime = (ms) => {
    handleStep(ms);
    render(performance.now());
  };
})();
