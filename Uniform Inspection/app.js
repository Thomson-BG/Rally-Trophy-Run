const CONFIG = {
  // Set dataMode to 'apps_script' and paste your deployed Apps Script web app URL.
  dataMode: 'apps_script',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxiHJpn_BODl6DWdLCR07PWHg0AFtoZR989WyO3EaEz5ub8xwpyyLw-UtUgkDAbXJueFA/exec'
};

const PERIODS = [1, 2, 3, 4, 5, 6];
const ARCHIVE_WINDOW_MS = 72 * 60 * 60 * 1000;

const state = {
  currentPeriod: 1,
  role: null,
  user: null,
  pendingInspections: {},
  inspectionRecordsCache: [],
  inspectionRecordsReady: false,
  inspectionRecordsPromise: null
};

const elements = {
  splash: document.getElementById('splash'),
  auth: document.getElementById('auth'),
  app: document.getElementById('app'),
  admin: document.getElementById('admin'),
  loadingProgress: document.getElementById('loading-progress'),
  splashAudio: document.getElementById('splash-audio'),
  splashStatus: document.getElementById('splash-status'),
  splashContinue: document.getElementById('splash-continue'),
  loginForm: document.getElementById('login-form'),
  signupForm: document.getElementById('signup-form'),
  adminLoginBtn: document.getElementById('admin-login-btn'),
  adminLoginModal: document.getElementById('admin-login-modal'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminCancel: document.getElementById('admin-cancel'),
  userMeta: document.getElementById('user-meta'),
  adminDashboardBtn: document.getElementById('admin-dashboard-btn'),
  adminBackBtn: document.getElementById('admin-back-btn'),
  signoutBtn: document.getElementById('signout-btn'),
  periodTabs: document.getElementById('period-tabs'),
  periodTitle: document.getElementById('period-title'),
  periodStatus: document.getElementById('period-status'),
  pendingCount: document.getElementById('pending-count'),
  submitInspectionsBtn: document.getElementById('submit-inspections-btn'),
  clearInspectionsBtn: document.getElementById('clear-inspections-btn'),
  studentList: document.getElementById('student-list'),
  pendingList: document.getElementById('pending-list'),
  activeList: document.getElementById('active-list'),
  studentPeriodSelect: document.getElementById('student-period-select'),
  studentAddForm: document.getElementById('student-add-form'),
  studentName: document.getElementById('student-name'),
  studentId: document.getElementById('student-id'),
  studentAdminList: document.getElementById('student-admin-list'),
  historyFrom: document.getElementById('history-from'),
  historyTo: document.getElementById('history-to'),
  historyRecent: document.getElementById('history-recent'),
  historyArchive: document.getElementById('history-archive'),
  exportSummary: document.getElementById('export-summary'),
  exportFrom: document.getElementById('export-from'),
  exportTo: document.getElementById('export-to'),
  adminPasswordForm: document.getElementById('admin-password-form'),
  adminPasswordInput: document.getElementById('admin-password'),
  toast: document.getElementById('toast'),
  historyStatusInputs: Array.from(document.querySelectorAll('[data-history-status]')),
  exportStatusInputs: Array.from(document.querySelectorAll('[data-export-status]')),
  exportModeInputs: Array.from(document.querySelectorAll('input[name="export-mode"]'))
};

let store;
const soundState = {
  context: null,
  lastHoverAt: 0
};

function getSoundContext() {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  if (!soundState.context) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    soundState.context = new Ctx();
  }
  return soundState.context;
}

function unlockSoundContext() {
  const ctx = getSoundContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

function playTone({ frequency, type = 'sine', duration = 0.12, volume = 0.06, startOffset = 0 }) {
  const ctx = getSoundContext();
  if (!ctx) return;
  const now = ctx.currentTime + startOffset;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playHoverSound() {
  const now = performance.now();
  if (now - soundState.lastHoverAt < 60) return;
  soundState.lastHoverAt = now;
  unlockSoundContext();
  playTone({ frequency: 830, type: 'triangle', duration: 0.07, volume: 0.02 });
}

function playClickSound() {
  unlockSoundContext();
  playTone({ frequency: 280, type: 'triangle', duration: 0.09, volume: 0.04 });
  playTone({ frequency: 350, type: 'sine', duration: 0.07, volume: 0.02, startOffset: 0.04 });
}

function playPassSound() {
  unlockSoundContext();
  playTone({ frequency: 523.25, type: 'sine', duration: 0.16, volume: 0.07 });
  playTone({ frequency: 659.25, type: 'sine', duration: 0.16, volume: 0.06, startOffset: 0.08 });
  playTone({ frequency: 783.99, type: 'triangle', duration: 0.22, volume: 0.07, startOffset: 0.16 });
}

function playFailSound() {
  unlockSoundContext();
  playTone({ frequency: 320, type: 'triangle', duration: 0.16, volume: 0.06 });
  playTone({ frequency: 246.94, type: 'sawtooth', duration: 0.24, volume: 0.06, startOffset: 0.12 });
}

function playAbsentSound() {
  unlockSoundContext();
  playTone({ frequency: 120, type: 'square', duration: 0.38, volume: 0.13 });
  playTone({ frequency: 95, type: 'square', duration: 0.34, volume: 0.11, startOffset: 0.16 });
}

function playImpactSound() {
  const ctx = getSoundContext();
  if (!ctx) return;
  unlockSoundContext();
  const start = ctx.currentTime;
  const burstDuration = 0.2;
  const bufferSize = Math.floor(ctx.sampleRate * burstDuration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.setValueAtTime(420, start);
  band.Q.setValueAtTime(1.5, start);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.001, start);
  noiseGain.gain.exponentialRampToValueAtTime(0.25, start + 0.015);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, start + burstDuration);
  noise.connect(band);
  band.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  const metallic = ctx.createOscillator();
  metallic.type = 'square';
  metallic.frequency.setValueAtTime(150, start);
  metallic.frequency.exponentialRampToValueAtTime(58, start + 0.16);
  const metallicGain = ctx.createGain();
  metallicGain.gain.setValueAtTime(0.001, start);
  metallicGain.gain.exponentialRampToValueAtTime(0.18, start + 0.01);
  metallicGain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
  metallic.connect(metallicGain);
  metallicGain.connect(ctx.destination);

  noise.start(start);
  noise.stop(start + burstDuration);
  metallic.start(start);
  metallic.stop(start + 0.2);
}

function attachButtonSounds(root = document) {
  root.querySelectorAll('button').forEach((button) => {
    if (button.dataset.soundBound === '1') return;
    button.dataset.soundBound = '1';
    button.addEventListener('mouseenter', playHoverSound);
    button.addEventListener('click', () => {
      const status = button.dataset.status;
      if (status === 'Passed') {
        playPassSound();
        return;
      }
      if (status === 'Failed') {
        playFailSound();
        return;
      }
      if (status === 'Absent') {
        playAbsentSound();
        return;
      }
      playClickSound();
    });
  });
}

function showScreen(name) {
  [elements.splash, elements.auth, elements.app, elements.admin].forEach((screen) => {
    screen.classList.remove('active');
  });
  elements[name].classList.add('active');
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(elements.toast.timer);
  elements.toast.timer = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2800);
}

async function hashPassword(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest));
  return btoa(String.fromCharCode(...bytes));
}

function isValidSchoolEmail(email) {
  return email.toLowerCase().endsWith('@stu.hemet.usd');
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatTimestamp(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseTimestamp(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return new Date(value);
  }
  if (typeof value === 'string') {
    const numeric = value.trim();
    if (/^\d{12,}$/.test(numeric)) {
      const millis = Number(numeric);
      if (Number.isFinite(millis)) {
        const dateFromMillis = new Date(millis);
        if (!Number.isNaN(dateFromMillis.getTime())) return dateFromMillis;
      }
    }
    if (value.includes('T')) {
      const iso = new Date(value);
      if (!Number.isNaN(iso.getTime())) return iso;
    }
    const [datePart, timePart] = value.split(' ');
    if (datePart && timePart) {
      const [month, day, year] = datePart.split('/').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      const parsed = new Date(year, month - 1, day, hour, minute);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    const fallback = new Date(value);
    if (!Number.isNaN(fallback.getTime())) return fallback;
  }
  return null;
}

function formatDate(value) {
  const date = parseTimestamp(value);
  return date ? formatTimestamp(date) : '';
}

function getDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createId(prefix) {
  if (crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function setSession(user, role) {
  state.user = user;
  state.role = role;
  sessionStorage.setItem('uniform-role', role);
  sessionStorage.setItem('uniform-user', user ? user.id : '');
}

async function restoreSession() {
  const role = sessionStorage.getItem('uniform-role');
  const userId = sessionStorage.getItem('uniform-user');
  if (!role) return false;
  if (role === 'admin') {
    state.role = 'admin';
    state.user = { id: 'admin', email: 'Admin' };
    return true;
  }
  const users = await store.listUsers();
  const user = users.find((item) => item.id === userId && item.status === 'active');
  if (user) {
    state.role = 'leader';
    state.user = user;
    return true;
  }
  sessionStorage.clear();
  return false;
}

function startSplash() {
  return new Promise((resolve) => {
    const duration = 4000 + Math.random() * 4000;
    const start = performance.now();
    let audioStarted = false;
    let isReady = false;
    let hasContinued = false;

    const tryPlayAudio = () => {
      if (!elements.splashAudio || audioStarted) return;
      audioStarted = true;
      elements.splashAudio.volume = 0.42;
      elements.splashAudio.play().catch(() => {});
    };

    const stopAudio = () => {
      if (!elements.splashAudio) return;
      elements.splashAudio.pause();
      elements.splashAudio.currentTime = 0;
    };

    const cleanup = () => {
      document.removeEventListener('keydown', handleUserSignal);
      document.removeEventListener('click', handleUserSignal);
      document.removeEventListener('touchstart', handleUserSignal);
    };

    const continueFromSplash = () => {
      if (hasContinued || !isReady) return;
      hasContinued = true;
      playImpactSound();
      stopAudio();
      cleanup();
      setTimeout(() => {
        resolve();
      }, 180);
    };

    const handleUserSignal = (event) => {
      tryPlayAudio();
      unlockSoundContext();
      if (!isReady) return;
      if (event.type === 'keydown') {
        continueFromSplash();
        return;
      }
      continueFromSplash();
    };

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const percent = Math.floor(progress * 100);
      if (elements.loadingProgress) {
        elements.loadingProgress.style.width = `${percent}%`;
      }
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      isReady = true;
      if (elements.splashStatus) {
        elements.splashStatus.textContent = 'System Ready';
      }
      if (elements.splashContinue) {
        elements.splashContinue.classList.add('ready');
      }
    };

    if (elements.splashContinue) {
      elements.splashContinue.classList.remove('ready');
    }
    document.addEventListener('keydown', handleUserSignal);
    document.addEventListener('click', handleUserSignal);
    document.addEventListener('touchstart', handleUserSignal);
    requestAnimationFrame(step);
  });
}

function setupAuthTabs() {
  document.querySelectorAll('.auth-tabs .tab').forEach((tab) => {
    if (tab.id === 'admin-login-btn') return;
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tabs .tab').forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-panels .panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });
}

function setupAdminTabs() {
  document.querySelectorAll('.admin-tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs .tab').forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.adminTab;
      document.querySelectorAll('.admin-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.adminPanel === target);
      });
      if (target === 'history') {
        renderHistory();
      }
      if (target === 'export') {
        updateExportSummary();
      }
    });
  });
}

function setupPeriodTabs() {
  elements.periodTabs.innerHTML = '';
  PERIODS.forEach((period) => {
    const button = document.createElement('button');
    button.textContent = `Period ${period}`;
    button.dataset.period = period;
    button.addEventListener('click', () => {
      state.currentPeriod = period;
      renderStudents();
      document.querySelectorAll('.period-tabs button').forEach((btn) => {
        btn.classList.toggle('active', Number(btn.dataset.period) === period);
      });
    });
    elements.periodTabs.appendChild(button);
  });
  const first = elements.periodTabs.querySelector('button');
  if (first) first.classList.add('active');
}

function setupStudentPeriodSelect() {
  elements.studentPeriodSelect.innerHTML = '';
  PERIODS.forEach((period) => {
    const option = document.createElement('option');
    option.value = period;
    option.textContent = `Period ${period}`;
    elements.studentPeriodSelect.appendChild(option);
  });
}

function getPendingForPeriod(period) {
  if (!state.pendingInspections[period]) {
    state.pendingInspections[period] = {};
  }
  return state.pendingInspections[period];
}

function getPendingCount(period) {
  const pending = getPendingForPeriod(period);
  return Object.keys(pending).length;
}

function clearPendingPeriod(period) {
  state.pendingInspections[period] = {};
}

function setPendingStatus(period, student, nextStatus) {
  const pending = getPendingForPeriod(period);
  if (!nextStatus || nextStatus === student.status) {
    delete pending[student.id];
    return;
  }
  pending[student.id] = {
    studentId: student.id,
    status: nextStatus,
    studentName: student.name
  };
}

function updatePendingUi(canEdit, canAccess) {
  if (!elements.pendingCount || !elements.submitInspectionsBtn || !elements.clearInspectionsBtn) return;
  const count = getPendingCount(state.currentPeriod);
  const canSubmit = canEdit && canAccess && count > 0;
  const visible = canEdit && canAccess;
  elements.pendingCount.textContent = visible
    ? (count ? `${count} pending change${count === 1 ? '' : 's'}` : 'No pending changes')
    : '';
  elements.submitInspectionsBtn.disabled = !canSubmit;
  elements.clearInspectionsBtn.disabled = !visible || count === 0;
  elements.submitInspectionsBtn.style.display = visible ? 'inline-flex' : 'none';
  elements.clearInspectionsBtn.style.display = visible ? 'inline-flex' : 'none';
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!isValidSchoolEmail(email)) {
    showToast('Use your @stu.hemet.usd email.');
    return;
  }
  const passwordHash = await hashPassword(password);
  const user = await store.loginUser(email, passwordHash);
  if (!user) {
    showToast('Login failed or account not approved.');
    return;
  }
  setSession(user, 'leader');
  await enterApp();
}

async function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  if (!isValidSchoolEmail(email)) {
    showToast('Email must end with @stu.hemet.usd');
    return;
  }
  const passwordHash = await hashPassword(password);
  const result = await store.registerUser(email, passwordHash);
  if (!result.ok) {
    showToast(result.message || 'Account request failed.');
    return;
  }
  showToast('Request submitted. Await admin approval.');
  event.target.reset();
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const password = document.getElementById('admin-password-input').value;
  const passwordHash = await hashPassword(password);
  const ok = await store.adminLogin(passwordHash);
  if (!ok) {
    showToast('Admin password incorrect.');
    return;
  }
  elements.adminLoginModal.classList.add('hidden');
  setSession({ id: 'admin', email: 'Admin' }, 'admin');
  await enterApp();
}

async function enterApp() {
  showScreen('app');
  state.pendingInspections = {};
  invalidateInspectionRecordsCache();
  elements.adminDashboardBtn.style.display = state.role === 'admin' ? 'inline-flex' : 'none';
  elements.userMeta.textContent = state.role === 'admin'
    ? 'Signed in as Admin'
    : `Signed in as ${state.user.email}`;
  setupPeriodTabs();
  attachButtonSounds(document);
  await renderStudents();
}

function signOut() {
  sessionStorage.clear();
  state.user = null;
  state.role = null;
  state.pendingInspections = {};
  invalidateInspectionRecordsCache();
  showScreen('auth');
}

async function renderStudents() {
  const period = state.currentPeriod;
  elements.periodTitle.textContent = `Period ${period}`;
  const students = await store.listStudents(period);
  const canAccess = state.role === 'admin' || (state.user && state.user.periods.includes(period));
  const canEdit = state.role === 'admin' || (canAccess && state.user && state.user.canEdit);
  const pending = getPendingForPeriod(period);
  elements.periodStatus.textContent = canAccess
    ? (canEdit ? 'Inspection enabled' : 'View only')
    : 'Access not granted';
  elements.studentList.innerHTML = '';

  if (!students.length) {
    const empty = document.createElement('div');
    empty.className = 'subtle';
    empty.textContent = 'No students added yet.';
    elements.studentList.appendChild(empty);
    updatePendingUi(canEdit, canAccess);
    return;
  }

  students.forEach((student) => {
    const pendingSelection = pending[student.id];
    const activeStatus = pendingSelection ? pendingSelection.status : student.status;
    const timestamp = student.updatedAt ? formatDate(student.updatedAt) : 'Unknown time';

    const card = document.createElement('div');
    card.className = 'student-card';
    card.classList.toggle('status-passed', activeStatus === 'Passed');
    card.classList.toggle('status-failed', activeStatus === 'Failed');
    card.classList.toggle('status-absent', activeStatus === 'Absent');
    card.classList.toggle('status-pending', Boolean(pendingSelection));
    const title = document.createElement('div');
    title.className = 'student-name';
    title.textContent = student.name;
    const meta = document.createElement('div');
    meta.className = 'student-id';
    meta.textContent = student.studentId ? `ID: ${student.studentId}` : 'ID: —';
    const stamp = document.createElement('div');
    stamp.className = 'student-stamp';
    if (pendingSelection) {
      stamp.textContent = `Pending: ${pendingSelection.status} (not submitted)`;
    } else if (student.status) {
      stamp.textContent = `${student.status} @ ${timestamp}`;
    } else {
      stamp.textContent = 'Not inspected';
    }
    const buttons = document.createElement('div');
    buttons.className = 'status-buttons';

    [
      { label: 'Passed', icon: '✓' },
      { label: 'Failed', icon: '✕' },
      { label: 'Absent', icon: '⦸' }
    ].forEach(({ label, icon }) => {
      const btn = document.createElement('button');
      btn.textContent = icon;
      btn.dataset.status = label;
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.disabled = !canEdit;
      if (activeStatus === label) btn.classList.add('active');
      btn.addEventListener('click', async () => {
        if (!canEdit) return;
        const nextStatus = activeStatus === label ? student.status : label;
        setPendingStatus(period, student, nextStatus);
        await renderStudents();
      });
      buttons.appendChild(btn);
    });

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(stamp);
    card.appendChild(buttons);
    if (!canAccess) {
      card.style.opacity = '0.5';
    }
    elements.studentList.appendChild(card);
  });
  updatePendingUi(canEdit, canAccess);
  attachButtonSounds(elements.studentList);
}

async function clearPendingInspections() {
  clearPendingPeriod(state.currentPeriod);
  await renderStudents();
}

async function submitPendingInspections() {
  const period = state.currentPeriod;
  const pending = getPendingForPeriod(period);
  const updates = Object.values(pending);
  if (!updates.length) {
    showToast('No pending inspections to submit.');
    return;
  }

  elements.submitInspectionsBtn.disabled = true;
  elements.clearInspectionsBtn.disabled = true;
  try {
    await store.setStudentStatusesBulk(period, updates, state.user?.email || 'Admin');
    clearPendingPeriod(period);
    invalidateInspectionRecordsCache();
    showToast(`Submitted ${updates.length} inspection update${updates.length === 1 ? '' : 's'}.`);
    if (elements.admin.classList.contains('active')) {
      await renderHistory();
      await updateExportSummary();
    }
  } catch (error) {
    showToast(error.message || 'Failed to submit inspections.');
  } finally {
    await renderStudents();
  }
}

async function renderAdminDashboard() {
  await renderAccounts();
  await renderStudentAdmin();
  await renderHistory();
  await updateExportSummary();
  attachButtonSounds(document);
}

function buildPeriodSelector(user, disabled) {
  const wrapper = document.createElement('div');
  wrapper.className = 'period-selector';
  PERIODS.forEach((period) => {
    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.3rem';
    label.style.marginRight = '0.5rem';
    label.style.fontSize = '0.75rem';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = period;
    checkbox.checked = user.periods.includes(period);
    checkbox.disabled = disabled;
    label.appendChild(checkbox);
    label.append(`P${period}`);
    wrapper.appendChild(label);
  });
  return wrapper;
}

function getSelectedPeriods(wrapper) {
  return Array.from(wrapper.querySelectorAll('input[type="checkbox"]'))
    .filter((input) => input.checked)
    .map((input) => Number(input.value));
}

async function renderAccounts() {
  const users = await store.listUsers();
  const pending = users.filter((user) => user.status === 'pending');
  const active = users.filter((user) => user.status !== 'pending');

  elements.pendingList.innerHTML = '';
  elements.activeList.innerHTML = '';

  if (!pending.length) {
    const empty = document.createElement('div');
    empty.className = 'subtle';
    empty.textContent = 'No pending requests.';
    elements.pendingList.appendChild(empty);
  }

  pending.forEach((user) => {
    const card = document.createElement('div');
    card.className = 'account-card';
    card.innerHTML = `
      <strong>${user.email}</strong>
      <div class="subtle">Requested: ${formatDate(user.createdAt)}</div>
    `;
    const periods = buildPeriodSelector(user, false);
    const canEditToggle = document.createElement('label');
    canEditToggle.style.display = 'inline-flex';
    canEditToggle.style.alignItems = 'center';
    canEditToggle.style.gap = '0.4rem';
    const canEditInput = document.createElement('input');
    canEditInput.type = 'checkbox';
    canEditInput.checked = user.canEdit;
    canEditToggle.appendChild(canEditInput);
    canEditToggle.append('Can Edit Inspections');

    const actions = document.createElement('div');
    actions.className = 'account-actions';
    const approveBtn = document.createElement('button');
    approveBtn.className = 'primary';
    approveBtn.textContent = 'Approve';
    approveBtn.addEventListener('click', async () => {
      const selected = getSelectedPeriods(periods);
      await store.updateUser(user.id, {
        status: 'active',
        periods: selected,
        canEdit: canEditInput.checked
      });
      await renderAccounts();
    });
    const denyBtn = document.createElement('button');
    denyBtn.className = 'ghost';
    denyBtn.textContent = 'Deny';
    denyBtn.addEventListener('click', async () => {
      await store.deleteUser(user.id);
      await renderAccounts();
    });
    actions.appendChild(approveBtn);
    actions.appendChild(denyBtn);

    card.appendChild(periods);
    card.appendChild(canEditToggle);
    card.appendChild(actions);
    elements.pendingList.appendChild(card);
  });

  if (!active.length) {
    const empty = document.createElement('div');
    empty.className = 'subtle';
    empty.textContent = 'No active accounts.';
    elements.activeList.appendChild(empty);
  }

  active.forEach((user) => {
    const card = document.createElement('div');
    card.className = 'account-card';
    card.innerHTML = `
      <strong>${user.email}</strong>
      <div class="subtle">Status: ${user.status}</div>
    `;
    const periods = buildPeriodSelector(user, user.status === 'disabled');
    const canEditToggle = document.createElement('label');
    canEditToggle.style.display = 'inline-flex';
    canEditToggle.style.alignItems = 'center';
    canEditToggle.style.gap = '0.4rem';
    const canEditInput = document.createElement('input');
    canEditInput.type = 'checkbox';
    canEditInput.checked = user.canEdit;
    canEditInput.disabled = user.status === 'disabled';
    canEditToggle.appendChild(canEditInput);
    canEditToggle.append('Can Edit Inspections');

    const actions = document.createElement('div');
    actions.className = 'account-actions';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      const selected = getSelectedPeriods(periods);
      await store.updateUser(user.id, {
        periods: selected,
        canEdit: canEditInput.checked
      });
      await renderAccounts();
    });

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'ghost';
    toggleBtn.textContent = user.status === 'disabled' ? 'Enable' : 'Disable';
    toggleBtn.addEventListener('click', async () => {
      await store.updateUser(user.id, { status: user.status === 'disabled' ? 'active' : 'disabled' });
      await renderAccounts();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'ghost';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', async () => {
      await store.deleteUser(user.id);
      await renderAccounts();
    });

    actions.appendChild(saveBtn);
    actions.appendChild(toggleBtn);
    actions.appendChild(removeBtn);

    card.appendChild(periods);
    card.appendChild(canEditToggle);
    card.appendChild(actions);
    elements.activeList.appendChild(card);
  });
  attachButtonSounds(elements.pendingList);
  attachButtonSounds(elements.activeList);
}

async function renderStudentAdmin() {
  const period = Number(elements.studentPeriodSelect.value) || 1;
  const students = await store.listStudents(period);
  elements.studentAdminList.innerHTML = '';

  if (!students.length) {
    const empty = document.createElement('div');
    empty.className = 'subtle';
    empty.textContent = 'No students in this period.';
    elements.studentAdminList.appendChild(empty);
    return;
  }

  students.forEach((student) => {
    const row = document.createElement('div');
    row.className = 'student-row';
    const nameInput = document.createElement('input');
    nameInput.value = student.name;
    const idInput = document.createElement('input');
    idInput.value = student.studentId || '';
    idInput.placeholder = 'Student ID';
    const status = document.createElement('div');
    status.className = 'subtle';
    status.textContent = `Status: ${student.status || 'Unmarked'}`;

    const actions = document.createElement('div');
    actions.className = 'student-actions';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      await store.updateStudent(period, student.id, {
        name: nameInput.value.trim() || student.name,
        studentId: idInput.value.trim()
      });
      await renderStudentAdmin();
      await renderStudents();
    });
    const removeBtn = document.createElement('button');
    removeBtn.className = 'ghost';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', async () => {
      await store.removeStudent(period, student.id);
      await renderStudentAdmin();
      await renderStudents();
    });
    actions.appendChild(saveBtn);
    actions.appendChild(removeBtn);

    row.appendChild(nameInput);
    row.appendChild(idInput);
    row.appendChild(status);
    row.appendChild(actions);
    elements.studentAdminList.appendChild(row);
  });
  attachButtonSounds(elements.studentAdminList);
}

function getSelectedStatuses(inputs) {
  return inputs.filter((input) => input.checked).map((input) => input.value);
}

function getDateRange(fromInput, toInput) {
  const fromValue = fromInput?.value ? new Date(fromInput.value) : null;
  const toValue = toInput?.value ? new Date(toInput.value) : null;
  const toInclusive = toValue && !Number.isNaN(toValue.getTime())
    ? new Date(toValue.getTime() + (59 * 1000) + 999)
    : null;
  return {
    from: fromValue && !Number.isNaN(fromValue.getTime()) ? fromValue : null,
    to: toInclusive
  };
}

function normalizeRecords(records) {
  return records
    .map((record) => {
      const inspectedAt = record.inspectedAt || record.updatedAt || '';
      const inspectedDate = parseTimestamp(inspectedAt);
      return {
        id: record.id,
        studentName: record.studentName || record.name || 'Unknown',
        studentNumber: record.studentNumber || record.studentId || '',
        period: Number(record.period) || 0,
        status: record.status || '',
        inspectedAt,
        inspectedBy: record.inspectedBy || record.updatedBy || '',
        inspectedDate
      };
    })
    .filter((record) => record.inspectedDate);
}

async function fetchInspectionRecords() {
  const records = normalizeRecords(await store.listInspectionLog());
  if (records.length) return records;
  const studentRecords = [];
  for (const period of PERIODS) {
    const students = await store.listStudents(period);
    students.forEach((student) => {
      if (!student.status || !student.updatedAt) return;
      studentRecords.push({
        id: `${student.id}-${period}-${student.updatedAt}`,
        studentName: student.name,
        studentNumber: student.studentId || '',
        status: student.status,
        period,
        inspectedAt: student.updatedAt,
        inspectedBy: student.updatedBy || ''
      });
    });
  }
  return normalizeRecords(studentRecords);
}

function invalidateInspectionRecordsCache() {
  state.inspectionRecordsCache = [];
  state.inspectionRecordsReady = false;
  state.inspectionRecordsPromise = null;
}

async function ensureInspectionRecords(force = false) {
  if (!force && state.inspectionRecordsReady) {
    return state.inspectionRecordsCache;
  }
  if (!force && state.inspectionRecordsPromise) {
    return state.inspectionRecordsPromise;
  }
  state.inspectionRecordsPromise = fetchInspectionRecords()
    .then((records) => {
      state.inspectionRecordsCache = records;
      state.inspectionRecordsReady = true;
      return records;
    })
    .finally(() => {
      state.inspectionRecordsPromise = null;
    });
  return state.inspectionRecordsPromise;
}

function applyRecordFilters(records, { from, to, statuses }) {
  return records.filter((record) => {
    if (statuses.length && !statuses.includes(record.status)) return false;
    if (from && record.inspectedDate < from) return false;
    if (to && record.inspectedDate > to) return false;
    return true;
  });
}

function splitArchive(records) {
  const now = Date.now();
  const recent = [];
  const archive = [];
  records.forEach((record) => {
    const isArchived = now - record.inspectedDate.getTime() > ARCHIVE_WINDOW_MS;
    if (isArchived) {
      archive.push(record);
    } else {
      recent.push(record);
    }
  });
  return { recent, archive };
}

function renderHistoryList(container, records) {
  container.innerHTML = '';
  if (!records.length) {
    const empty = document.createElement('div');
    empty.className = 'subtle';
    empty.textContent = 'No records found.';
    container.appendChild(empty);
    return;
  }
  records.forEach((record) => {
    const row = document.createElement('div');
    row.className = 'account-card history-row';
    const meta = document.createElement('div');
    meta.className = 'history-meta';
    const title = document.createElement('strong');
    title.textContent = record.studentName;
    const info = document.createElement('div');
    info.className = 'subtle';
    info.textContent = `Period ${record.period}${record.studentNumber ? ` • ID: ${record.studentNumber}` : ''}`;
    const time = document.createElement('div');
    time.className = 'subtle';
    const inspectedAt = record.inspectedAt ? formatDate(record.inspectedAt) : '';
    time.textContent = `${inspectedAt}${record.inspectedBy ? ` • ${record.inspectedBy}` : ''}`;
    meta.appendChild(title);
    meta.appendChild(info);
    meta.appendChild(time);

    const pill = document.createElement('span');
    pill.className = `status-pill ${record.status.toLowerCase()}`;
    pill.textContent = record.status;

    row.appendChild(meta);
    row.appendChild(pill);
    container.appendChild(row);
  });
}

async function renderHistory() {
  if (!elements.historyRecent || !elements.historyArchive) return;
  const records = await ensureInspectionRecords();
  const statuses = getSelectedStatuses(elements.historyStatusInputs);
  const { from, to } = getDateRange(elements.historyFrom, elements.historyTo);
  const filtered = applyRecordFilters(records, { from, to, statuses });
  const sorted = filtered.sort((a, b) => b.inspectedDate - a.inspectedDate);
  const { recent, archive } = splitArchive(sorted);
  renderHistoryList(elements.historyRecent, recent);
  renderHistoryList(elements.historyArchive, archive);
}

function getExportMode() {
  const selected = elements.exportModeInputs.find((input) => input.checked);
  return selected ? selected.value : 'last-failed';
}

function getExportFilters() {
  const statuses = getSelectedStatuses(elements.exportStatusInputs);
  const { from, to } = getDateRange(elements.exportFrom, elements.exportTo);
  return { statuses, from, to };
}

function getLatestInspectionKey(records) {
  if (!records.length) return null;
  const latest = records.reduce((max, record) => Math.max(max, record.inspectedDate.getTime()), 0);
  if (!latest) return null;
  return getDateKey(new Date(latest));
}

function buildReportFromRecords(records) {
  const report = {};
  PERIODS.forEach((period) => {
    report[period] = [];
  });
  records.forEach((record) => {
    if (!report[record.period]) report[record.period] = [];
    report[record.period].push({
      name: record.studentName,
      studentId: record.studentNumber,
      status: record.status,
      inspectedAt: record.inspectedAt ? formatDate(record.inspectedAt) : '',
      inspectedBy: record.inspectedBy
    });
  });
  return report;
}

async function updateExportSummary() {
  if (!elements.exportSummary) return;
  const records = await ensureInspectionRecords();
  const mode = getExportMode();
  let filtered = [];
  if (mode === 'filtered') {
    const filters = getExportFilters();
    filtered = applyRecordFilters(records, filters);
  } else {
    const latestKey = getLatestInspectionKey(records);
    filtered = records.filter((record) => getDateKey(record.inspectedDate) === latestKey && record.status === 'Failed');
  }
  const report = buildReportFromRecords(filtered);
  const lines = PERIODS.map((period) => {
    const count = report[period]?.length || 0;
    return `P${period}: ${count}`;
  });
  elements.exportSummary.textContent = `${filtered.length} records • ${lines.join(' | ')}`;
}

function buildReportContent(report, title) {
  const now = formatTimestamp(new Date());
  const header = `Bulldog Garage Uniform Inspection\n${title}\nReport generated: ${now}\n\n`;
  let body = '';
  PERIODS.forEach((period) => {
    body += `Period ${period}\n`;
    const students = report[period] || [];
    if (!students.length) {
      body += '  - No records\n\n';
      return;
    }
    students.forEach((student) => {
      const idPart = student.studentId ? ` (ID: ${student.studentId})` : '';
      const inspector = student.inspectedBy ? ` • ${student.inspectedBy}` : '';
      body += `  - ${student.name}${idPart} — ${student.status} @ ${student.inspectedAt}${inspector}\n`;
    });
    body += '\n';
  });
  return header + body;
}

function downloadBlob(blob, filename, options = {}) {
  const { fallbackOpen = false } = options;
  const url = URL.createObjectURL(blob);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '');
  const isFileProtocol = window.location.protocol === 'file:';
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
  }

  if (fallbackOpen && (isSafari || isFileProtocol)) {
    const popup = window.open(url, '_blank', 'noopener');
    if (!popup) {
      showToast('Enable pop-ups if the download preview is blocked.');
    }
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapePdfText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function crc32(bytes) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < bytes.length; i += 1) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let j = 0; j < 8; j += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    table[i] = value >>> 0;
  }
  return table;
})();

function createZipBlob(entries) {
  const encoder = new TextEncoder();
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  const now = new Date();
  const dosTime = ((now.getHours() & 0x1f) << 11) | ((now.getMinutes() & 0x3f) << 5) | ((Math.floor(now.getSeconds() / 2)) & 0x1f);
  const dosDate = (((now.getFullYear() - 1980) & 0x7f) << 9) | (((now.getMonth() + 1) & 0x0f) << 5) | (now.getDate() & 0x1f);

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = typeof entry.data === 'string' ? encoder.encode(entry.data) : entry.data;
    const crc = crc32(dataBytes);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, dataBytes.length, true);
    localView.setUint32(22, dataBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localChunks.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, dataBytes.length, true);
    centralView.setUint32(24, dataBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centralChunks.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  });

  const centralSize = centralChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...localChunks, ...centralChunks, endRecord], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

function toExcelColumn(index) {
  let col = '';
  let value = index + 1;
  while (value > 0) {
    const modulo = (value - 1) % 26;
    col = String.fromCharCode(65 + modulo) + col;
    value = Math.floor((value - modulo) / 26);
  }
  return col;
}

function buildSheetXml(rows) {
  const xmlRows = rows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const cells = row.map((cell, colIndex) => {
      const reference = `${toExcelColumn(colIndex)}${rowNumber}`;
      const text = escapeXml(cell ?? '');
      return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${text}</t></is></c>`;
    }).join('');
    return `<row r="${rowNumber}">${cells}</row>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${xmlRows}</sheetData></worksheet>`;
}

function buildXlsxBlob(report) {
  const sheets = PERIODS.map((period) => {
    const rows = [['Name', 'Student ID', 'Status', 'Inspected At', 'Inspector']];
    (report[period] || []).forEach((student) => {
      rows.push([student.name, student.studentId || '', student.status, student.inspectedAt, student.inspectedBy || '']);
    });
    return {
      name: `Period ${period}`,
      xml: buildSheetXml(rows)
    };
  });

  const sheetOverrides = sheets.map((_, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ).join('');

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${sheetOverrides}
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookSheets = sheets.map((sheet, index) =>
    `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
  ).join('');

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${workbookSheets}</sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join('')}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

  const entries = [
    { name: '[Content_Types].xml', data: contentTypes },
    { name: '_rels/.rels', data: rootRels },
    { name: 'xl/workbook.xml', data: workbook },
    { name: 'xl/_rels/workbook.xml.rels', data: workbookRels },
    { name: 'xl/styles.xml', data: styles }
  ];

  sheets.forEach((sheet, index) => {
    entries.push({ name: `xl/worksheets/sheet${index + 1}.xml`, data: sheet.xml });
  });

  return createZipBlob(entries);
}

function buildPdfBlob(content) {
  const lines = content.split('\n');
  const linesPerPage = 46;
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  if (!pages.length) pages.push(['']);

  const objects = [];
  const pageObjectIds = [];
  pages.forEach((_, index) => {
    pageObjectIds.push(3 + (index * 2));
  });
  const fontObjectId = 3 + (pages.length * 2);

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;

  pages.forEach((pageLines, pageIndex) => {
    const pageId = 3 + (pageIndex * 2);
    const contentId = pageId + 1;
    const pageText = pageLines.map((line, index) =>
      index === 0 ? `(${escapePdfText(line || ' ')}) Tj` : `T* (${escapePdfText(line || ' ')}) Tj`
    ).join('\n');
    const stream = `BT\n/F1 12 Tf\n14 TL\n50 760 Td\n${pageText}\nET`;
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  objects[fontObjectId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  const maxId = fontObjectId;
  let pdf = '%PDF-1.4\n';
  const offsets = new Array(maxId + 1).fill(0);

  for (let id = 1; id <= maxId; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let id = 1; id <= maxId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

function exportReport(format, records) {
  const mode = getExportMode();
  let filteredRecords = [];
  let title = 'Inspection Report';
  if (mode === 'filtered') {
    const filters = getExportFilters();
    filteredRecords = applyRecordFilters(records, filters);
    title = 'Filtered Inspection Report';
  } else {
    const latestKey = getLatestInspectionKey(records);
    filteredRecords = records.filter((record) => getDateKey(record.inspectedDate) === latestKey && record.status === 'Failed');
    title = 'Failed (Last Inspection)';
  }

  const report = buildReportFromRecords(filteredRecords);
  const filenameBase = `inspection-report-${getDateKey(new Date())}`;

  if (format === 'txt') {
    const content = buildReportContent(report, title);
    downloadBlob(new Blob([content], { type: 'text/plain' }), `${filenameBase}.txt`);
    return;
  }

  if (format === 'csv') {
    let csv = 'Period,Name,Student ID,Status,Inspected At,Inspector\n';
    PERIODS.forEach((period) => {
      (report[period] || []).forEach((student) => {
        csv += `${period},"${student.name}","${student.studentId || ''}","${student.status}","${student.inspectedAt}","${student.inspectedBy || ''}"\n`;
      });
    });
    downloadBlob(new Blob([csv], { type: 'text/csv' }), `${filenameBase}.csv`);
    return;
  }

  if (format === 'doc') {
    const content = buildReportContent(report, title)
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;');
    const html = `<!doctype html><html><body>${content}</body></html>`;
    downloadBlob(new Blob([html], { type: 'application/msword' }), `${filenameBase}.doc`);
    return;
  }

  if (format === 'pdf') {
    const content = buildReportContent(report, title);
    downloadBlob(buildPdfBlob(content), `${filenameBase}.pdf`, { fallbackOpen: true });
    return;
  }

  if (format === 'xlsx') {
    downloadBlob(buildXlsxBlob(report), `${filenameBase}.xlsx`, { fallbackOpen: true });
    return;
  }
}

function handleExportClick(event) {
  const format = event.target.dataset.export;
  if (!format) return;

  if (!state.inspectionRecordsReady) {
    ensureInspectionRecords()
      .then(() => {
        showToast('Export data ready. Click export again.');
      })
      .catch((error) => {
        showToast(error.message || 'Unable to load export data.');
      });
    showToast('Preparing export data...');
    return;
  }

  try {
    exportReport(format, state.inspectionRecordsCache);
    showToast(`Exported ${format.toUpperCase()} report.`);
  } catch (error) {
    showToast(error.message || 'Export failed.');
  }
}

async function handleAdminPasswordUpdate(event) {
  event.preventDefault();
  const password = elements.adminPasswordInput.value;
  const passwordHash = await hashPassword(password);
  await store.setAdminPassword(passwordHash);
  elements.adminPasswordForm.reset();
  showToast('Admin password updated.');
}

function wireEvents() {
  const unlock = () => unlockSoundContext();
  document.addEventListener('pointerdown', unlock, { passive: true });
  document.addEventListener('keydown', unlock);

  elements.loginForm.addEventListener('submit', handleLogin);
  elements.signupForm.addEventListener('submit', handleSignup);
  elements.adminLoginBtn.addEventListener('click', () => {
    elements.adminLoginModal.classList.remove('hidden');
  });
  elements.adminCancel.addEventListener('click', () => {
    elements.adminLoginModal.classList.add('hidden');
  });
  elements.adminLoginForm.addEventListener('submit', handleAdminLogin);
  elements.signoutBtn.addEventListener('click', signOut);
  elements.adminDashboardBtn.addEventListener('click', async () => {
    showScreen('admin');
    await renderAdminDashboard();
  });
  elements.adminBackBtn.addEventListener('click', () => showScreen('app'));
  elements.submitInspectionsBtn.addEventListener('click', submitPendingInspections);
  elements.clearInspectionsBtn.addEventListener('click', clearPendingInspections);
  elements.studentPeriodSelect.addEventListener('change', renderStudentAdmin);
  [elements.historyFrom, elements.historyTo, ...elements.historyStatusInputs].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', renderHistory);
  });
  [elements.exportFrom, elements.exportTo, ...elements.exportStatusInputs, ...elements.exportModeInputs].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', updateExportSummary);
  });
  elements.studentAddForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const period = Number(elements.studentPeriodSelect.value);
    await store.addStudent(period, elements.studentName.value.trim(), elements.studentId.value.trim());
    elements.studentAddForm.reset();
    await renderStudentAdmin();
    await renderStudents();
  });
  document.querySelectorAll('[data-export]').forEach((button) => {
    button.addEventListener('click', handleExportClick);
  });
  elements.adminPasswordForm.addEventListener('submit', handleAdminPasswordUpdate);
  setupAuthTabs();
  setupAdminTabs();
  attachButtonSounds(document);
}

async function init() {
  try {
    await store.init();
  } catch (error) {
    if (CONFIG.dataMode === 'apps_script') {
      showToast('Apps Script unavailable. Falling back to local storage.');
      store = new LocalStore();
      await store.init();
    } else {
      throw error;
    }
  }
  setupStudentPeriodSelect();
  wireEvents();
  if (CONFIG.dataMode === 'apps_script' && !CONFIG.appsScriptUrl) {
    showToast('Apps Script URL missing. Using local storage.');
  }

  const restored = await restoreSession();
  await startSplash();
  if (restored) {
    await enterApp();
    return;
  }
  showScreen('auth');
}

class LocalStore {
  constructor() {
    this.key = 'bulldog-uniform-db';
  }

  async init() {
    const existing = this.load();
    if (existing) return;
    const adminHash = await hashPassword('Bulldog1!');
    const db = {
      admin: { passwordHash: adminHash, updatedAt: formatTimestamp(new Date()) },
      users: [],
      inspections: [],
      students: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }
    };
    this.save(db);
  }

  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  save(db) {
    localStorage.setItem(this.key, JSON.stringify(db));
  }

  async adminLogin(passwordHash) {
    const db = this.load();
    return db.admin.passwordHash === passwordHash;
  }

  async setAdminPassword(passwordHash) {
    const db = this.load();
    db.admin.passwordHash = passwordHash;
    db.admin.updatedAt = formatTimestamp(new Date());
    this.save(db);
  }

  async registerUser(email, passwordHash) {
    const db = this.load();
    const exists = db.users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: 'Account already exists.' };
    db.users.push({
      id: createId('user'),
      email,
      passwordHash,
      status: 'pending',
      canEdit: true,
      periods: [],
      createdAt: formatTimestamp(new Date())
    });
    this.save(db);
    return { ok: true };
  }

  async loginUser(email, passwordHash) {
    const db = this.load();
    const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || user.status !== 'active') return null;
    if (user.passwordHash !== passwordHash) return null;
    return user;
  }

  async listUsers() {
    const db = this.load();
    return db.users;
  }

  async updateUser(userId, updates) {
    const db = this.load();
    const user = db.users.find((item) => item.id === userId);
    if (!user) return null;
    Object.assign(user, updates);
    this.save(db);
    return user;
  }

  async deleteUser(userId) {
    const db = this.load();
    db.users = db.users.filter((item) => item.id !== userId);
    this.save(db);
  }

  async listStudents(period) {
    const db = this.load();
    return db.students[period] || [];
  }

  async addStudent(period, name, studentId) {
    if (!name) return null;
    const db = this.load();
    const student = {
      id: createId('student'),
      name,
      studentId: studentId || '',
      status: '',
      updatedAt: '',
      updatedBy: null
    };
    db.students[period].push(student);
    this.save(db);
    return student;
  }

  async updateStudent(period, studentId, updates) {
    const db = this.load();
    const student = db.students[period].find((item) => item.id === studentId);
    if (!student) return null;
    Object.assign(student, updates);
    this.save(db);
    return student;
  }

  async removeStudent(period, studentId) {
    const db = this.load();
    db.students[period] = db.students[period].filter((item) => item.id !== studentId);
    this.save(db);
  }

  async setStudentStatus(period, studentId, status, updatedBy) {
    const updated = await this.setStudentStatusesBulk(period, [{ studentId, status }], updatedBy);
    return updated.find((student) => student.id === studentId) || null;
  }

  async setStudentStatusesBulk(period, updates, updatedBy) {
    const db = this.load();
    const map = new Map();
    updates.forEach((entry) => {
      if (entry && entry.studentId && entry.status) {
        map.set(entry.studentId, entry.status);
      }
    });
    const periodStudents = db.students[period] || [];
    const touched = [];
    db.inspections = db.inspections || [];
    periodStudents.forEach((student) => {
      if (!map.has(student.id)) return;
      const status = map.get(student.id);
      const inspectedAt = formatTimestamp(new Date());
      student.status = status;
      student.updatedAt = inspectedAt;
      student.updatedBy = updatedBy;
      db.inspections.push({
        id: createId('inspect'),
        studentRecordId: student.id,
        studentName: student.name,
        studentNumber: student.studentId || '',
        period,
        status,
        inspectedAt,
        inspectedBy: updatedBy || ''
      });
      touched.push(student);
    });
    this.save(db);
    return touched;
  }

  async listInspectionLog() {
    const db = this.load();
    return db.inspections || [];
  }
}

class SheetStore {
  constructor(url) {
    this.url = url;
  }

  async init() {
    if (!this.url) {
      throw new Error('Apps Script URL not set in CONFIG.appsScriptUrl');
    }
    await this.call('init', {});
  }

  async adminLogin(passwordHash) {
    const result = await this.call('adminLogin', { passwordHash });
    return result.ok;
  }

  async setAdminPassword(passwordHash) {
    await this.call('setAdminPassword', { passwordHash });
  }

  async registerUser(email, passwordHash) {
    return await this.call('registerUser', { email, passwordHash });
  }

  async loginUser(email, passwordHash) {
    const result = await this.call('loginUser', { email, passwordHash });
    return result.user || null;
  }

  async listUsers() {
    const result = await this.call('listUsers', {});
    return result.users || [];
  }

  async updateUser(userId, updates) {
    const result = await this.call('updateUser', { userId, updates });
    return result.user || null;
  }

  async deleteUser(userId) {
    await this.call('deleteUser', { userId });
  }

  async listStudents(period) {
    const result = await this.call('listStudents', { period });
    return result.students || [];
  }

  async addStudent(period, name, studentId) {
    const result = await this.call('addStudent', { period, name, studentId });
    return result.student || null;
  }

  async updateStudent(period, studentId, updates) {
    const result = await this.call('updateStudent', { period, studentId, updates });
    return result.student || null;
  }

  async removeStudent(period, studentId) {
    await this.call('removeStudent', { period, studentId });
  }

  async setStudentStatus(period, studentId, status, updatedBy) {
    const result = await this.call('setStudentStatus', { period, studentId, status, updatedBy });
    return result.student || null;
  }

  async setStudentStatusesBulk(period, updates, updatedBy) {
    try {
      const result = await this.call('setStudentStatusesBulk', { period, updates, updatedBy });
      return result.students || [];
    } catch (error) {
      const message = String(error.message || '');
      if (!message.includes('Unknown action')) {
        throw error;
      }
      const touched = [];
      for (const update of updates) {
        const student = await this.setStudentStatus(period, update.studentId, update.status, updatedBy);
        if (student) touched.push(student);
      }
      return touched;
    }
  }

  async listInspectionLog() {
    const result = await this.call('listInspectionLog', {});
    return result.records || [];
  }

  async call(action, payload) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload })
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }
}

const useAppsScript = CONFIG.dataMode === 'apps_script' && CONFIG.appsScriptUrl;
store = useAppsScript ? new SheetStore(CONFIG.appsScriptUrl) : new LocalStore();

init();
