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
  const mobileActionButtons = Array.from(document.querySelectorAll('.mobile-actions button'));
  const dpadButtons = Array.from(document.querySelectorAll('.dpad-btn[data-dir]'));
  const boardCanvas = document.getElementById('snake-canvas');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = document.getElementById('settings-close');
  const soundSetting = document.getElementById('sound-setting');
  const virtualControlsSetting = document.getElementById('virtual-controls-setting');
  const scoreboardBtn = document.getElementById('scoreboard-btn');
  const scoreboardModal = document.getElementById('scoreboard-modal');
  const scoreboardClose = document.getElementById('scoreboard-close');
  const mobileControlsContainer = document.querySelector('.snake-mobile-controls');
  const joystick = document.getElementById('joystick');
  const joystickHandle = document.getElementById('joystick-handle');
  const leaderboardList = document.getElementById('leaderboard-list');
  const scoreEntry = document.getElementById('score-entry');
  const scoreForm = document.getElementById('score-form');
  const scoreInitials = document.getElementById('score-initials');
  const scoreIdLabel = document.getElementById('score-id-label');
  const scorePeriod = document.getElementById('score-period');
  const scoreEntryScore = document.getElementById('score-entry-score');
  const scoreEntryError = document.getElementById('score-entry-error');
  const scoreCancel = document.getElementById('score-cancel');
  const welcomeModal = document.getElementById('welcome-modal');
  const welcomeMessage = document.getElementById('welcome-message');
  const welcomeAction = document.getElementById('welcome-action');
  const dragModal = document.getElementById('drag-modal');
  const dragCanvas = document.getElementById('drag-canvas');
  const dragPhaseLabel = document.getElementById('drag-phase-label');
  const dragSubtitle = document.getElementById('drag-subtitle');
  const dragQuality = document.getElementById('drag-quality');
  const dragMilestone = document.getElementById('drag-milestone');
  const dragRank = document.getElementById('drag-rank');
  const dragGear = document.getElementById('drag-gear');
  const dragSpeed = document.getElementById('drag-speed');
  const dragTime = document.getElementById('drag-time');
  const dragDistance = document.getElementById('drag-distance');
  const dragRpmValue = document.getElementById('drag-rpm-value');
  const dragRpmFill = document.getElementById('drag-rpm-fill');
  const dragPoints = document.getElementById('drag-points');
  const dragTree = document.getElementById('drag-tree');
  const dragResults = document.getElementById('drag-results');
  const dragResultsRank = document.getElementById('drag-results-rank');
  const dragResultsReward = document.getElementById('drag-results-reward');
  const dragResultsBuff = document.getElementById('drag-results-buff');
  const dragContinueBtn = document.getElementById('drag-continue-btn');
  const dragLaunchBtn = document.getElementById('drag-launch-btn');
  const dragShiftBtn = document.getElementById('drag-shift-btn');
  const dragShiftOverlayBtn = document.getElementById('drag-shift-overlay-btn');
  const slotModal = document.getElementById('slot-modal');
  const slotAction = document.getElementById('slot-action');
  const slotMessage = document.getElementById('slot-message');
  const slotJackpotBanner = document.getElementById('slot-jackpot-banner');
  const slotPullsLeft = document.getElementById('slot-pulls-left');
  const slotReels = [
    document.getElementById('slot-reel-1'),
    document.getElementById('slot-reel-2'),
    document.getElementById('slot-reel-3')
  ];
  const resumeModal = document.getElementById('resume-modal');
  const resumeAction = document.getElementById('resume-action');
  const resumeMessage = document.getElementById('resume-message');
  const splashModal = document.getElementById('splash-modal');
  const splashLogo = document.getElementById('splash-logo');
  const splashPrompt = document.getElementById('splash-prompt');

  const GRID = { cols: 24, rows: 18 };
  const BASE_TICK_MS = 120;
  const SCORE_PER_FOOD = 10;
  const TROPHY_BLINK_MS = 5000;
  const TROPHY_EXPIRE_MS = 10000;
  const TROPHY_RESPAWN_MS = 3000;
  const TROPHY_PENALTY = 5;
  const SPEED_INCREMENT = 1.02;

  const CLOCK_SPAWN_MIN_MS = 15000;
  const CLOCK_SPAWN_MAX_MS = 60000;
  const CLOCK_LIFETIME_MS = 10000;
  const CLOCK_BLINK_START_MS = 5000;
  const CLOCK_BLINK_FAST_MS = 7000;
  const CLOCK_SCORE = 10;
  const CLOCK_SLOW_MS = 10000;

  const TIRE_SPAWN_MIN_MS = 0;
  const TIRE_SPAWN_MAX_MS = 120000;
  const TIRE_LIFETIME_MS = 5000;
  const TIRE_SCORE = 30;

  const OIL_SPAWN_MIN_MS = 30000;
  const OIL_SPAWN_MAX_MS = 180000;
  const OIL_LIFETIME_MS = 7000;
  const OIL_REVERSE_MS = 4000;
  const OIL_SIZE = 2;

  const POLICE_SPAWN_MIN_MS = 22500;
  const POLICE_SPAWN_MAX_MS = 90000;
  const POLICE_LIFETIME_MS = 15000;

  const COIN_SPAWN_MIN_MS = 12500;
  const COIN_SPAWN_MAX_MS = 120000;
  const COIN_LIFETIME_MS = 7000;
  const COIN_BLINK_START_MS = 3000;
  const COIN_SCORE = 250;
  const COIN_SIZE = 4;
  const CHERRY_SPAWN_MIN_MS = 10000;
  const CHERRY_SPAWN_MAX_MS = 120000;
  const CHERRY_LIFETIME_MS = 5000;
  const CHERRY_BLINK_START_MS = 2000;

  const DRAG_FIRST_TRIGGER_TROPHY = 3;
  const DRAG_TRIGGER_INTERVAL = 20;
  const DRAG_CINEMATIC_MS = 6000;
  const DRAG_SPLASH_MS = 2600;
  const DRAG_COUNTDOWN_MS = 3500;
  const DRAG_RACE_MS = 45000;
  const DRAG_RESULTS_MS = 5000;
  const DRAG_TOTAL_DISTANCE_M = 1920;
  const DRAG_NPC_COUNT = 1;
  const DRAG_SHIFT_COOLDOWN_MS = 160;
  const DRAG_FALSE_START_PENALTY_MS = 900;
  const DRAG_SHIFT_LOCKOUT_MS = 5000;
  const DRAG_SHIFT_TARGET_MPH = 110;
  const DRAG_SHIFT_TARGET_MPS = 49.17;
  const DRAG_MAX_POINTS = 15000;
  const DRAG_LAUNCH_MAX_POINTS = 7500;
  const DRAG_SHIFT_MAX_POINTS = 7500;
  const DRAG_NO_SHIFT_LOSS_POINTS = 300;
  const DRAG_BUFF_MULTIPLIER = 1.15;
  const DRAG_BUFF_DURATION_MS = 15000;
  const DRAG_IDLE_RPM = 1050;
  const DRAG_REDLINE_RPM = 9100;
  const DRAG_GEAR_RATIOS = [3.42, 1.28];
  const DRAG_PLAYER_LANE_OFFSET = 0.28;
  const DRAG_OPPONENT_LANE_OFFSET = -0.28;
  const DRAG_LANE_RENDER_FACTOR = 0.34;
  const DRAG_SCORED_SHIFT_KEYS = new Set(['1-2']);
  const DRAG_SHIFT_PERFECT_MIN_MPH = 108;
  const DRAG_SHIFT_PERFECT_MAX_MPH = 112;
  const DRAG_SHIFT_GREAT_MIN_MPH = 104;
  const DRAG_SHIFT_GREAT_MAX_MPH = 116;
  const DRAG_SHIFT_GOOD_MIN_MPH = 98;
  const DRAG_SHIFT_GOOD_MAX_MPH = 122;
  const DRAG_SHIFT_VALID_MIN_MPH = 86;
  const DRAG_SHIFT_VALID_MAX_MPH = 160;
  const DRAG_FINAL_DRIVE = 1.45;
  const DRAG_WHEEL_RADIUS_M = 0.34;
  const DRAG_VEHICLE_MASS_KG = 1460;
  const DRAG_DRAG_COEFFICIENT_AREA = 0.69;
  const DRAG_ROLLING_COEFF = 0.014;
  const DRAG_AIR_DENSITY = 1.225;
  const DRAG_DRIVETRAIN_EFF = 0.86;
  const DRAG_GRAVITY = 9.81;
  const DRAG_BASE_GRIP = 1.22;
  const DRAG_MAX_SPEED_MPS = 155;
  const DRAG_PARTICLE_MAX = { high: 320, medium: 200, low: 110 };
  const DRAG_VISUAL_ASSET_PATHS = {
    cockpit_frame_hd: 'assets/drag/cockpit_frame_hd.svg',
    dashboard_cluster_hd: 'assets/drag/dashboard_cluster_hd.svg',
    track_skyline_hd: 'assets/drag/track_skyline_hd.svg',
    grandstand_strip_hd: 'assets/drag/grandstand_strip_hd.svg',
    asphalt_detail_tile: 'assets/drag/asphalt_detail_tile.svg'
  };
  const DRAG_AUDIO_SAMPLE_PATHS = {
    engine_idle_loop: 'assets/audio/drag/engine_idle_loop.ogg',
    engine_launch_burst: 'assets/audio/drag/engine_launch_burst.ogg',
    engine_highgear_loop: 'assets/audio/drag/engine_highgear_loop.ogg',
    shift_clutch_hit: 'assets/audio/drag/shift_clutch_hit.ogg',
    rev_limiter_chop: 'assets/audio/drag/rev_limiter_chop.ogg',
    crowd_ambience_loop: 'assets/audio/drag/crowd_ambience_loop.ogg'
  };

  const STOP_SIGN_INITIAL_MIN_MS = 60000;
  const STOP_SIGN_INITIAL_MAX_MS = 120000;
  const STOP_SIGN_RESPAWN_MIN_MS = 120000;
  const STOP_SIGN_RESPAWN_MAX_MS = 180000;
  const STOP_SIGN_LIFETIME_MS = 7000;
  const SPLASH_GROW_MS = 4000;
  const SPLASH_SHRINK_MS = 2000;
  const SPLASH_TOTAL_MS = SPLASH_GROW_MS + SPLASH_SHRINK_MS;
  const SPLASH_MIN_SCALE = 0.02;
  const SPLASH_PEAK_SCALE = 1.2;
  const SPLASH_PROMPT_SOUND_MS = 1200;
  const BEST_SCORE_KEY = 'bulldog_rally_best';
  const SCORE_STORAGE_KEY = 'bulldog_rally_top_scores';
  const VIRTUAL_CONTROLS_KEY = 'bulldog_rally_virtual_controls';
  const LEADERBOARD_LIMIT = 8;
  const SLOT_JACKPOT_ODDS = 75;
  const SLOT_REEL_ROWS = 3;
  const SLOT_CENTER_ROW = 1;
  const SLOT_SPIN_TICK_MS = 72;
  const SLOT_REEL_CONFIG = [
    { startDelay: 0, duration: 1950, rotations: 12 },
    { startDelay: 120, duration: 2350, rotations: 15 },
    { startDelay: 260, duration: 2750, rotations: 18 }
  ];
  const CONFIG = {
    // Paste your deployed Apps Script web app URL here.
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxtRGiUjTs-R2tEL-voXWlCljNS3cxWLB6_Kl6qz1MGAYpTGb5ubugFZOwkwtFgbwH0Lw/exec',
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
  let scoreHandled = false;
  let joystickPointerId = null;
  let joystickCenter = { x: 0, y: 0 };
  let joystickRadius = 48;
  let joystickActive = false;
  let swipeStart = null;
  let mobileGestureLockActive = false;
  let lastMobileTouchEndMs = 0;
  let welcomeStep = 0;
  let welcomeDismissed = false;
  let audioContext = null;
  let dragEngineAudio = null;
  let dragSampleAudio = null;
  let dragAudioSamples = null;
  let dragAudioSamplesPromise = null;
  let dragAudioMode = 'off';
  let audioEnabled = false;
  let soundEffectsEnabled = true;
  let virtualControlsEnabled = readVirtualControlsEnabled();
  let utilityModalPaused = false;
  let dragState = null;
  let slotState = null;
  let slotJackpotTimer = null;
  let resumeCountdownMs = 0;
  let resumeWaiting = false;
  let frameSampleMs = 16.7;
  let splashState = createInitialSplashState();
  const dragCtx = dragCanvas ? dragCanvas.getContext('2d') : null;
  const dragBloomCanvas = dragCtx ? document.createElement('canvas') : null;
  const dragBloomCtx = dragBloomCanvas ? dragBloomCanvas.getContext('2d') : null;
  const dragAssetRegistry = createDragAssetRegistry(DRAG_VISUAL_ASSET_PATHS);
  const dragAsphaltPatternCache = { pattern: null, source: null };
  const slotReelViews = slotReels.map((reel) => ({
    root: reel,
    strip: reel ? reel.querySelector('.slot-strip') : null,
    translateY: 0,
    tickIndex: 0
  }));

  const noiseCanvas = buildNoiseTexture(120, 120);

  function createDragAssetRegistry(paths) {
    const registry = {};
    Object.entries(paths).forEach(([key, src]) => {
      registry[key] = {
        key,
        src,
        image: null,
        loaded: false,
        failed: false
      };
    });
    return registry;
  }

  function loadDragVisualAssets() {
    Object.values(dragAssetRegistry).forEach((asset) => {
      if (!asset || asset.image || asset.loaded || asset.failed) return;
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        asset.loaded = true;
        asset.failed = false;
      };
      image.onerror = () => {
        asset.failed = true;
      };
      image.src = asset.src;
      asset.image = image;
    });
  }

  function getDragVisualAsset(key) {
    const asset = dragAssetRegistry[key];
    if (!asset || !asset.loaded || !asset.image) return null;
    return asset.image;
  }

  function getDragAsphaltPattern() {
    if (!dragCtx) return null;
    const image = getDragVisualAsset('asphalt_detail_tile');
    if (!image) return null;
    if (dragAsphaltPatternCache.source !== image || !dragAsphaltPatternCache.pattern) {
      dragAsphaltPatternCache.source = image;
      dragAsphaltPatternCache.pattern = dragCtx.createPattern(image, 'repeat');
    }
    return dragAsphaltPatternCache.pattern;
  }

  function createInitialSplashState() {
    return {
      active: Boolean(splashModal && splashLogo),
      phase: 'splash_grow',
      elapsedMs: 0,
      promptSoundMs: SPLASH_PROMPT_SOUND_MS,
      riseCuePlayed: false,
      impactCuePlayed: false,
      settleCuePlayed: false
    };
  }

  function initAudio() {
    if (audioContext) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();
  }

  function enableAudio() {
    initAudio();
    if (!audioContext) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    audioEnabled = true;
    void loadDragAudioSamples();
    if (dragState && soundEffectsEnabled) {
      startDragEngineAudio();
    }
  }

  function playTone({ freq, duration, type = 'sine', volume = 0.2, slide, delay = 0 }) {
    if (!audioContext || !audioEnabled) return;
    const now = audioContext.currentTime + delay;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slide) {
      osc.frequency.exponentialRampToValueAtTime(slide, now + duration);
    }
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playNoise({ duration = 0.25, volume = 0.2, filterType = 'highpass', filterFreq = 800, delay = 0 }) {
    if (!audioContext || !audioEnabled) return;
    const now = audioContext.currentTime + delay;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    source.start(now);
    source.stop(now + duration);
  }

  function playSound(name) {
    if (!audioContext || !audioEnabled || !soundEffectsEnabled) return;
    switch (name) {
      case 'turn':
        playNoise({ duration: 0.12, volume: 0.12, filterType: 'bandpass', filterFreq: 1200 });
        break;
      case 'trophy':
        playTone({ freq: 720, slide: 1200, duration: 0.18, type: 'triangle', volume: 0.22 });
        break;
      case 'clock':
        playTone({ freq: 520, duration: 0.08, type: 'square', volume: 0.16 });
        playTone({ freq: 420, duration: 0.08, type: 'square', volume: 0.16, delay: 0.12 });
        break;
      case 'tire':
        playTone({ freq: 180, slide: 120, duration: 0.2, type: 'sawtooth', volume: 0.2 });
        break;
      case 'oil':
        playTone({ freq: 420, slide: 180, duration: 0.25, type: 'sine', volume: 0.18 });
        break;
      case 'coin':
        playTone({ freq: 900, slide: 1400, duration: 0.16, type: 'triangle', volume: 0.2 });
        playTone({ freq: 1400, slide: 1000, duration: 0.12, type: 'triangle', volume: 0.15, delay: 0.1 });
        break;
      case 'stop':
        playNoise({ duration: 0.18, volume: 0.12, filterType: 'bandpass', filterFreq: 900 });
        playTone({ freq: 300, slide: 180, duration: 0.2, type: 'sawtooth', volume: 0.14 });
        break;
      case 'cherry':
        playTone({ freq: 600, slide: 900, duration: 0.18, type: 'triangle', volume: 0.22 });
        break;
      case 'wall':
        playNoise({ duration: 0.35, volume: 0.3, filterType: 'lowpass', filterFreq: 600 });
        playTone({ freq: 140, duration: 0.25, type: 'square', volume: 0.18 });
        break;
      case 'police':
        playNoise({ duration: 0.4, volume: 0.28, filterType: 'bandpass', filterFreq: 700 });
        playTone({ freq: 240, slide: 120, duration: 0.3, type: 'square', volume: 0.2 });
        break;
      case 'crash':
        playNoise({ duration: 0.32, volume: 0.24, filterType: 'lowpass', filterFreq: 500 });
        break;
      case 'bonus':
        playTone({ freq: 500, slide: 900, duration: 0.3, type: 'triangle', volume: 0.22 });
        break;
      case 'drag_intro':
        playNoise({ duration: 0.5, volume: 0.14, filterType: 'highpass', filterFreq: 640 });
        playTone({ freq: 180, slide: 520, duration: 0.58, type: 'sawtooth', volume: 0.14 });
        break;
      case 'drag_impact':
        playNoise({ duration: 0.24, volume: 0.2, filterType: 'lowpass', filterFreq: 420 });
        playTone({ freq: 100, slide: 62, duration: 0.22, type: 'triangle', volume: 0.16 });
        break;
      case 'drag_tree':
        playTone({ freq: 760, duration: 0.08, type: 'square', volume: 0.12 });
        break;
      case 'drag_green':
        playTone({ freq: 920, slide: 1360, duration: 0.15, type: 'triangle', volume: 0.19 });
        playTone({ freq: 560, slide: 920, duration: 0.18, type: 'sawtooth', volume: 0.12, delay: 0.04 });
        break;
      case 'drag_launch':
        playNoise({ duration: 0.14, volume: 0.12, filterType: 'bandpass', filterFreq: 860 });
        playTone({ freq: 260, slide: 380, duration: 0.17, type: 'square', volume: 0.13 });
        break;
      case 'drag_shift_miss':
        playNoise({ duration: 0.12, volume: 0.16, filterType: 'bandpass', filterFreq: 520 });
        playTone({ freq: 170, slide: 130, duration: 0.16, type: 'sawtooth', volume: 0.13 });
        break;
      case 'drag_perfect_shift':
        playTone({ freq: 680, slide: 980, duration: 0.18, type: 'triangle', volume: 0.2 });
        playTone({ freq: 980, slide: 1320, duration: 0.16, type: 'triangle', volume: 0.16, delay: 0.05 });
        break;
      case 'drag_hit':
        playNoise({ duration: 0.25, volume: 0.22, filterType: 'lowpass', filterFreq: 680 });
        playTone({ freq: 220, slide: 140, duration: 0.19, type: 'square', volume: 0.15 });
        break;
      case 'drag_finish':
        playTone({ freq: 480, slide: 760, duration: 0.22, type: 'triangle', volume: 0.2 });
        playTone({ freq: 720, slide: 980, duration: 0.2, type: 'triangle', volume: 0.16, delay: 0.08 });
        break;
      case 'drag_finish_win':
        playTone({ freq: 520, slide: 980, duration: 0.2, type: 'triangle', volume: 0.24 });
        playTone({ freq: 860, slide: 1300, duration: 0.24, type: 'triangle', volume: 0.24, delay: 0.08 });
        playTone({ freq: 1250, slide: 930, duration: 0.3, type: 'square', volume: 0.22, delay: 0.18 });
        break;
      case 'slot':
        playTone({ freq: 420, slide: 620, duration: 0.18, type: 'square', volume: 0.19 });
        playTone({ freq: 280, slide: 380, duration: 0.16, type: 'sawtooth', volume: 0.12, delay: 0.06 });
        break;
      case 'slot_lever':
        playNoise({ duration: 0.08, volume: 0.1, filterType: 'bandpass', filterFreq: 1200 });
        playTone({ freq: 230, slide: 120, duration: 0.12, type: 'triangle', volume: 0.17 });
        playTone({ freq: 150, slide: 110, duration: 0.12, type: 'square', volume: 0.12, delay: 0.06 });
        break;
      case 'slot_spin':
        playTone({ freq: 410, duration: 0.045, type: 'square', volume: 0.085 });
        playTone({ freq: 220, duration: 0.05, type: 'triangle', volume: 0.06, delay: 0.02 });
        break;
      case 'slot_stop':
        playNoise({ duration: 0.08, volume: 0.14, filterType: 'bandpass', filterFreq: 860 });
        playTone({ freq: 260, duration: 0.1, type: 'triangle', volume: 0.14 });
        playTone({ freq: 160, duration: 0.1, type: 'square', volume: 0.1, delay: 0.03 });
        break;
      case 'slot_win':
        playTone({ freq: 680, slide: 980, duration: 0.2, type: 'triangle', volume: 0.24 });
        playTone({ freq: 920, slide: 1240, duration: 0.22, type: 'triangle', volume: 0.26, delay: 0.1 });
        playTone({ freq: 1160, slide: 890, duration: 0.2, type: 'square', volume: 0.19, delay: 0.2 });
        break;
      case 'jackpot':
        playNoise({ duration: 0.55, volume: 0.32, filterType: 'highpass', filterFreq: 740 });
        playTone({ freq: 520, slide: 1700, duration: 0.62, type: 'sawtooth', volume: 0.34 });
        playTone({ freq: 780, slide: 1280, duration: 0.66, type: 'square', volume: 0.31, delay: 0.05 });
        playTone({ freq: 1320, slide: 980, duration: 0.58, type: 'triangle', volume: 0.26, delay: 0.12 });
        break;
      case 'penalty':
        playTone({ freq: 240, slide: 120, duration: 0.25, type: 'sine', volume: 0.16 });
        break;
      case 'splash_rise':
        playNoise({ duration: 0.9, volume: 0.11, filterType: 'highpass', filterFreq: 540 });
        playTone({ freq: 140, slide: 560, duration: 1.1, type: 'sawtooth', volume: 0.08 });
        break;
      case 'splash_impact':
        playNoise({ duration: 0.28, volume: 0.2, filterType: 'lowpass', filterFreq: 420 });
        playTone({ freq: 85, slide: 40, duration: 0.26, type: 'triangle', volume: 0.12 });
        break;
      case 'splash_settle':
        playTone({ freq: 420, slide: 220, duration: 0.34, type: 'triangle', volume: 0.08 });
        break;
      case 'splash_prompt':
        playTone({ freq: 760, duration: 0.08, type: 'sine', volume: 0.05 });
        break;
      case 'splash_start':
        playTone({ freq: 520, slide: 920, duration: 0.14, type: 'triangle', volume: 0.11 });
        break;
      default:
        break;
    }
  }

  function createLoopNoiseBuffer(durationSec = 2.2) {
    if (!audioContext) return null;
    const frameCount = Math.floor(audioContext.sampleRate * durationSec);
    const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < frameCount; i += 1) {
      const white = Math.random() * 2 - 1;
      // Simple low-passed noise for combustion/exhaust texture.
      last = (last * 0.985) + (white * 0.15);
      data[i] = last;
    }
    return buffer;
  }

  async function loadDragAudioSamples() {
    initAudio();
    if (!audioContext) return null;
    if (dragAudioSamples) return dragAudioSamples;
    if (dragAudioSamplesPromise) return dragAudioSamplesPromise;

    dragAudioSamplesPromise = (async () => {
      const buffers = {};
      const entries = Object.entries(DRAG_AUDIO_SAMPLE_PATHS);
      for (let i = 0; i < entries.length; i += 1) {
        const [key, path] = entries[i];
        try {
          const response = await fetch(path, { cache: 'force-cache' });
          if (!response.ok) continue;
          const arrayBuffer = await response.arrayBuffer();
          // Some Safari versions need a detached copy.
          const bufferCopy = arrayBuffer.slice(0);
          const decoded = await audioContext.decodeAudioData(bufferCopy);
          if (decoded) {
            buffers[key] = decoded;
          }
        } catch (error) {
          // Optional asset: keep fallback audio active.
        }
      }
      if (!Object.keys(buffers).length) return null;
      dragAudioSamples = buffers;
      return buffers;
    })();

    try {
      return await dragAudioSamplesPromise;
    } finally {
      dragAudioSamplesPromise = null;
    }
  }

  function stopDragSynthAudio() {
    if (!dragEngineAudio) return;
    const parts = [
      dragEngineAudio.idleOsc,
      dragEngineAudio.lowOsc,
      dragEngineAudio.highOsc,
      dragEngineAudio.noiseSource
    ];
    parts.forEach((node) => {
      if (!node) return;
      try {
        node.stop();
      } catch (error) {
        // ignore stop errors for already-stopped nodes
      }
      try {
        node.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
    });
    try {
      dragEngineAudio.masterGain.disconnect();
    } catch (error) {
      // ignore disconnect errors
    }
    dragEngineAudio = null;
  }

  function stopDragSampleAudio() {
    if (!dragSampleAudio) return;
    const stopNode = (node) => {
      if (!node) return;
      try {
        node.stop();
      } catch (error) {
        // ignore stop errors for already-stopped nodes
      }
      try {
        node.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
    };
    const { layers } = dragSampleAudio;
    if (layers) {
      Object.values(layers).forEach((layer) => {
        if (!layer) return;
        stopNode(layer.source);
        try {
          layer.gain.disconnect();
        } catch (error) {
          // ignore disconnect errors
        }
      });
    }
    try {
      dragSampleAudio.masterGain.disconnect();
    } catch (error) {
      // ignore disconnect errors
    }
    dragSampleAudio = null;
  }

  function stopDragEngineAudio() {
    stopDragSampleAudio();
    stopDragSynthAudio();
    dragAudioMode = 'off';
  }

  function startDragSynthAudio() {
    if (!audioContext || !audioEnabled || !soundEffectsEnabled) return;
    if (dragEngineAudio) return;

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -28;
    compressor.knee.value = 20;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.16;

    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.001;

    const idleOsc = audioContext.createOscillator();
    idleOsc.type = 'sawtooth';
    const idleFilter = audioContext.createBiquadFilter();
    idleFilter.type = 'lowpass';
    idleFilter.frequency.value = 210;
    const idleGain = audioContext.createGain();
    idleGain.gain.value = 0.001;

    const lowOsc = audioContext.createOscillator();
    lowOsc.type = 'triangle';
    const lowFilter = audioContext.createBiquadFilter();
    lowFilter.type = 'bandpass';
    lowFilter.frequency.value = 160;
    lowFilter.Q.value = 0.7;
    const lowGain = audioContext.createGain();
    lowGain.gain.value = 0.001;

    const highOsc = audioContext.createOscillator();
    highOsc.type = 'square';
    const highFilter = audioContext.createBiquadFilter();
    highFilter.type = 'highpass';
    highFilter.frequency.value = 220;
    const highGain = audioContext.createGain();
    highGain.gain.value = 0.001;

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = createLoopNoiseBuffer();
    noiseSource.loop = true;
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 640;
    noiseFilter.Q.value = 0.7;
    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = 0.001;

    idleOsc.connect(idleFilter);
    idleFilter.connect(idleGain);
    idleGain.connect(masterGain);

    lowOsc.connect(lowFilter);
    lowFilter.connect(lowGain);
    lowGain.connect(masterGain);

    highOsc.connect(highFilter);
    highFilter.connect(highGain);
    highGain.connect(masterGain);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    idleOsc.start();
    lowOsc.start();
    highOsc.start();
    noiseSource.start();

    dragEngineAudio = {
      masterGain,
      idleOsc,
      idleFilter,
      idleGain,
      lowOsc,
      lowFilter,
      lowGain,
      highOsc,
      highFilter,
      highGain,
      noiseSource,
      noiseFilter,
      noiseGain
    };
    dragAudioMode = 'synth';
  }

  function createDragSampleLoop(buffer, destination, initialGain = 0.001) {
    if (!audioContext || !buffer) return null;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = audioContext.createGain();
    gain.gain.value = initialGain;
    source.connect(gain);
    gain.connect(destination);
    source.start();
    return {
      source,
      gain
    };
  }

  function startDragSampleAudio() {
    if (!audioContext || !audioEnabled || !soundEffectsEnabled) return false;
    if (!dragAudioSamples) return false;
    if (dragSampleAudio) return true;

    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.001;

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 24;
    compressor.ratio.value = 7;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.18;

    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    const layers = {
      idle: createDragSampleLoop(dragAudioSamples.engine_idle_loop, masterGain, 0.001),
      high: createDragSampleLoop(dragAudioSamples.engine_highgear_loop, masterGain, 0.001),
      crowd: createDragSampleLoop(dragAudioSamples.crowd_ambience_loop, masterGain, 0.001)
    };

    if (!layers.idle && !layers.high && !layers.crowd) {
      try {
        masterGain.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
      return false;
    }

    dragSampleAudio = {
      masterGain,
      layers,
      nextLimiterAt: 0
    };
    dragAudioMode = 'sample';
    return true;
  }

  function playDragSampleOneShot(sampleKey, options = {}) {
    if (!audioContext || !audioEnabled || !soundEffectsEnabled || !dragSampleAudio || !dragAudioSamples) {
      return false;
    }
    const buffer = dragAudioSamples[sampleKey];
    if (!buffer) return false;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = options.playbackRate || 1;
    const gain = audioContext.createGain();
    gain.gain.value = options.volume ?? 0.9;
    source.connect(gain);
    gain.connect(dragSampleAudio.masterGain);
    source.start();
    source.onended = () => {
      try {
        source.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
      try {
        gain.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
    };
    return true;
  }

  function startDragEngineAudio() {
    if (!audioContext || !audioEnabled || !soundEffectsEnabled) return;
    if (dragSampleAudio || dragEngineAudio) return;

    if (dragAudioSamples && startDragSampleAudio()) {
      return;
    }

    startDragSynthAudio();
    void loadDragAudioSamples().then((samples) => {
      if (!samples) return;
      if (!dragState || !audioEnabled || !soundEffectsEnabled) return;
      if (dragSampleAudio) return;
      stopDragSynthAudio();
      startDragSampleAudio();
    });
  }

  function updateDragEngineAudio() {
    if (!dragState || !audioContext || !audioEnabled || !soundEffectsEnabled) {
      stopDragEngineAudio();
      return;
    }
    if (!dragSampleAudio && !dragEngineAudio) {
      startDragEngineAudio();
      if (!dragSampleAudio && !dragEngineAudio) return;
    }

    const player = dragState.player;
    const rpmNorm = clamp((player.rpm - DRAG_IDLE_RPM) / (DRAG_REDLINE_RPM - DRAG_IDLE_RPM), 0, 1);
    const speedNorm = clamp(player.speed / DRAG_MAX_SPEED_MPS, 0, 1);

    let throttle = 0.22;
    if (dragState.phase === 'countdown') {
      throttle = 0.3 + Math.sin(dragState.phaseMs / 180) * 0.04;
    } else if (dragState.phase === 'race') {
      throttle = player.launched ? 0.88 : 0.35;
      if (player.falseStartPenaltyMs > 0) throttle *= 0.6;
    } else if (dragState.phase === 'results') {
      throttle = 0.14;
    }
    const launchBoost = player.shiftBoostMs > 0 ? 0.18 : 0;
    const now = audioContext.currentTime;

    if (dragSampleAudio) {
      const shifted = player.gear >= DRAG_GEAR_RATIOS.length || player.hasShifted;
      const idleLayer = dragSampleAudio.layers.idle;
      const highLayer = dragSampleAudio.layers.high;
      const crowdLayer = dragSampleAudio.layers.crowd;

      dragSampleAudio.masterGain.gain.setTargetAtTime(0.17 + throttle * 0.2, now, 0.04);
      if (idleLayer) {
        idleLayer.gain.gain.setTargetAtTime(shifted ? 0.04 : 0.12 + (1 - rpmNorm) * 0.08, now, 0.05);
        idleLayer.source.playbackRate.setTargetAtTime(0.72 + rpmNorm * 0.58, now, 0.06);
      }
      if (highLayer) {
        highLayer.gain.gain.setTargetAtTime(shifted ? 0.15 + speedNorm * 0.14 : 0.001, now, 0.05);
        highLayer.source.playbackRate.setTargetAtTime(0.82 + rpmNorm * 0.66 + speedNorm * 0.18, now, 0.05);
      }
      if (crowdLayer) {
        crowdLayer.gain.gain.setTargetAtTime(0.015 + speedNorm * 0.04, now, 0.08);
        crowdLayer.source.playbackRate.setTargetAtTime(0.94 + speedNorm * 0.18, now, 0.08);
      }

      const limiterCondition = dragState.phase === 'race'
        && player.launched
        && !player.hasShifted
        && player.launchElapsedMs >= DRAG_SHIFT_LOCKOUT_MS
        && player.rpm >= DRAG_REDLINE_RPM - 120;
      if (limiterCondition && now >= dragSampleAudio.nextLimiterAt) {
        playDragSampleOneShot('rev_limiter_chop', { volume: 0.58, playbackRate: 1 + Math.random() * 0.08 });
        dragSampleAudio.nextLimiterAt = now + 0.18;
      }
      dragAudioMode = 'sample';
      return;
    }

    if (!dragEngineAudio) return;
    dragEngineAudio.masterGain.gain.setTargetAtTime(0.12 + throttle * 0.2, now, 0.03);
    dragEngineAudio.idleOsc.frequency.setTargetAtTime(26 + rpmNorm * 34, now, 0.02);
    dragEngineAudio.idleGain.gain.setTargetAtTime(0.05 + (1 - rpmNorm) * 0.08, now, 0.03);
    dragEngineAudio.idleFilter.frequency.setTargetAtTime(180 + rpmNorm * 280, now, 0.03);

    dragEngineAudio.lowOsc.frequency.setTargetAtTime(60 + rpmNorm * 170, now, 0.02);
    dragEngineAudio.lowGain.gain.setTargetAtTime(0.045 + throttle * 0.09 + launchBoost * 0.08, now, 0.03);
    dragEngineAudio.lowFilter.frequency.setTargetAtTime(140 + rpmNorm * 540, now, 0.03);

    dragEngineAudio.highOsc.frequency.setTargetAtTime(120 + rpmNorm * 420, now, 0.02);
    dragEngineAudio.highGain.gain.setTargetAtTime(0.02 + throttle * 0.065 + speedNorm * 0.03, now, 0.03);
    dragEngineAudio.highFilter.frequency.setTargetAtTime(180 + rpmNorm * 1500, now, 0.03);

    dragEngineAudio.noiseFilter.frequency.setTargetAtTime(460 + rpmNorm * 2400 + speedNorm * 700, now, 0.03);
    dragEngineAudio.noiseGain.gain.setTargetAtTime(0.02 + throttle * 0.08 + launchBoost * 0.05, now, 0.04);
    dragAudioMode = 'synth';
  }

  function playDragEngineTransient(sampleKey, synthFallback, options = {}) {
    const played = playDragSampleOneShot(sampleKey, options);
    if (!played && synthFallback) {
      playSound(synthFallback);
    }
  }

  function readBestScore() {
    const value = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY), 10);
    return Number.isFinite(value) ? value : 0;
  }

  function writeBestScore(score) {
    bestScore = Math.max(bestScore, score);
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    bestEl.textContent = String(bestScore);
  }

  function readVirtualControlsEnabled() {
    const saved = localStorage.getItem(VIRTUAL_CONTROLS_KEY);
    if (saved === null) return true;
    return saved !== 'off';
  }

  function isMobileViewport() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 900;
  }

  function applyVirtualControlsPreference() {
    const showControls = isMobileViewport() && virtualControlsEnabled;
    document.body.classList.toggle('virtual-controls-hidden', !showControls);
    if (mobileControlsContainer) {
      mobileControlsContainer.setAttribute('aria-hidden', showControls ? 'false' : 'true');
    }
    if (virtualControlsSetting) {
      virtualControlsSetting.value = virtualControlsEnabled ? 'on' : 'off';
    }
  }

  function blockMobileTouchScroll(event) {
    if (!isMobileViewport()) return;
    event.preventDefault();
  }

  function blockMobileDoubleTapZoom(event) {
    if (!isMobileViewport()) return;
    const now = Date.now();
    if (now - lastMobileTouchEndMs < 320) {
      event.preventDefault();
    }
    lastMobileTouchEndMs = now;
  }

  function blockMobileGestureZoom(event) {
    if (!isMobileViewport()) return;
    event.preventDefault();
  }

  function applyMobileGestureLock() {
    const enableLock = isMobileViewport();
    document.documentElement.classList.toggle('mobile-gesture-lock', enableLock);
    document.body.classList.toggle('mobile-gesture-lock', enableLock);

    if (enableLock && !mobileGestureLockActive) {
      document.addEventListener('touchmove', blockMobileTouchScroll, { passive: false });
      document.addEventListener('touchend', blockMobileDoubleTapZoom, { passive: false });
      document.addEventListener('gesturestart', blockMobileGestureZoom, { passive: false });
      document.addEventListener('gesturechange', blockMobileGestureZoom, { passive: false });
      mobileGestureLockActive = true;
      return;
    }

    if (!enableLock && mobileGestureLockActive) {
      document.removeEventListener('touchmove', blockMobileTouchScroll);
      document.removeEventListener('touchend', blockMobileDoubleTapZoom);
      document.removeEventListener('gesturestart', blockMobileGestureZoom);
      document.removeEventListener('gesturechange', blockMobileGestureZoom);
      mobileGestureLockActive = false;
    }
  }

  function readTheme() {
    const styles = getComputedStyle(document.body);
    return {
      boardGlow: styles.getPropertyValue('--board-glow').trim(),
      boardFill: styles.getPropertyValue('--board-fill').trim(),
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

  function normalizeStudentId(value, allowLetters = true) {
    const pattern = allowLetters ? /[^A-Z0-9]/g : /[^0-9]/g;
    return String(value || '')
      .toUpperCase()
      .replace(pattern, '')
      .slice(0, 6);
  }

  function normalizeStaffName(value) {
    return String(value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9 .'-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10);
  }

  function normalizePeriod(value) {
    if (value === null || value === undefined) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    if (/^\d+$/.test(trimmed)) {
      return String(Number(trimmed));
    }
    return trimmed;
  }

  function isStaffPeriod(period) {
    return normalizePeriod(period).toLowerCase() === 'staff';
  }

  function sanitizeScoreEntry(entry) {
    const period = normalizePeriod(entry.period);
    const rawIdentifier = entry.studentId || entry.initials || entry.id || entry.displayName || '';
    const numericStudentId = normalizeStudentId(rawIdentifier, false);
    const studentId = numericStudentId
      ? numericStudentId.padStart(6, '0').slice(-6)
      : normalizeStudentId(rawIdentifier, true);
    const staffName = normalizeStaffName(entry.staffName || entry.name || entry.displayName || rawIdentifier);
    const displayName = isStaffPeriod(period)
      ? staffName || 'STAFF'
      : studentId || normalizeStudentId(rawIdentifier, true) || '------';
    return {
      studentId,
      staffName,
      displayName,
      initials: displayName,
      period,
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

  function formatPeriodLabel(period) {
    if (!period) return '';
    const raw = String(period);
    if (/^\d+$/.test(raw)) {
      return `P${raw}`;
    }
    return raw;
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
      const periodLabel = formatPeriodLabel(entry.period);
      const displayName = entry.displayName || entry.staffName || entry.studentId || entry.initials || '------';
      name.textContent = periodLabel ? `${displayName} • ${periodLabel}` : displayName;
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
    if (state.over && pendingScore === null && shouldPromptForScore(state.score)) {
      openScoreEntry(state.score);
    }
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
    if (leaderboardStatus !== 'ready') return false;
    if (!leaderboard.length) return true;
    if (leaderboard.length < CONFIG.topLimit) return true;
    const lowest = leaderboard[leaderboard.length - 1].score;
    return score > lowest;
  }

  function shouldPromptForScore(score) {
    if (scoreHandled) return false;
    return isTopScore(score);
  }

  async function submitScore(entry) {
    const sanitized = sanitizeScoreEntry(entry);
    if (!CONFIG.appsScriptUrl) {
      const updated = sortScores([...leaderboard, sanitized]).slice(0, CONFIG.topLimit);
      setLeaderboard(updated);
      saveLocalScores(updated);
      return { ok: true };
    }

    let updatedFromServer = false;
    try {
      const response = await fetch(CONFIG.appsScriptUrl, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(sanitized)
      });
      if (!response.ok) {
        return { ok: false, message: `Save failed (${response.status}).` };
      }
      const payload = await response.json().catch(() => null);
      if (payload && payload.ok === false) {
        return { ok: false, message: payload.message || 'Unable to save score.' };
      }
      if (payload && Array.isArray(payload.scores)) {
        setLeaderboard(payload.scores.map(sanitizeScoreEntry));
        updatedFromServer = true;
      }
    } catch {
      // Fall back to local storage if network fails.
    }

    if (!updatedFromServer) {
      try {
        const response = await fetch(`${CONFIG.appsScriptUrl}?action=top&limit=${CONFIG.topLimit}`, {
          method: 'GET',
          mode: 'cors'
        });
        const payload = await response.json().catch(() => null);
        if (payload && Array.isArray(payload.scores)) {
          setLeaderboard(payload.scores.map(sanitizeScoreEntry));
          updatedFromServer = true;
        }
      } catch {
        // ignore and fall back to local cache
      }
    }

    if (updatedFromServer) return { ok: true };
    const updated = sortScores([...leaderboard, sanitized]).slice(0, CONFIG.topLimit);
    setLeaderboard(updated);
    saveLocalScores(updated);
    return { ok: true };
  }

  function setScoreEntryError(message) {
    if (!scoreEntryError) return;
    scoreEntryError.textContent = message || '';
    scoreEntryError.classList.toggle('hidden', !message);
  }

  function updateScoreEntryFieldMode() {
    const isStaff = isStaffPeriod(scorePeriod ? scorePeriod.value : '');
    if (scoreIdLabel) {
      scoreIdLabel.textContent = isStaff ? 'Staff Name' : 'Student ID';
    }
    if (!scoreInitials) return;
    if (isStaff) {
      scoreInitials.maxLength = 10;
      scoreInitials.inputMode = 'text';
      scoreInitials.setAttribute('pattern', "[A-Za-z0-9 .'-]{1,10}");
      scoreInitials.placeholder = 'Name (max 10)';
      scoreInitials.value = normalizeStaffName(scoreInitials.value);
      return;
    }
    scoreInitials.maxLength = 6;
    scoreInitials.inputMode = 'numeric';
    scoreInitials.setAttribute('pattern', '\\d{6}');
    scoreInitials.placeholder = '6-digit ID';
    scoreInitials.value = normalizeStudentId(scoreInitials.value, false);
  }

  function openScoreEntry(score) {
    pendingScore = score;
    scoreEntryScore.textContent = `Score: ${score}`;
    scoreEntry.classList.remove('hidden');
    scoreInitials.value = '';
    scorePeriod.value = '';
    setScoreEntryError('');
    updateScoreEntryFieldMode();
    scoreInitials.focus();
  }

  function closeScoreEntry() {
    pendingScore = null;
    setScoreEntryError('');
    scoreEntry.classList.add('hidden');
  }

  function showWelcomeModal() {
    if (!welcomeModal || !welcomeMessage || !welcomeAction) return;
    if (welcomeDismissed) return;
    welcomeStep = 0;
    welcomeModal.classList.remove('hidden');
    welcomeMessage.textContent =
      'Welcome to the Bulldog Garage - Rally: Trophy Run competition. Whoever holds the #1 spot on the leaderboard on May 15th, 2026 at 8am will WIN an Amazon gift card (Valued at $20 or more....). There may be prizes for those who finish on the Top Score Board.';
    welcomeAction.textContent = 'Next';
  }

  function advanceWelcomeModal() {
    if (!welcomeModal || !welcomeMessage || !welcomeAction) return;
    if (welcomeStep === 0) {
      welcomeStep = 1;
      welcomeMessage.textContent =
        "Watch out for the new features:  * A clock slows down your speed temporarily * An oil spill temporarily reverses your controls * A large coin adds 250 points to your score * A police car blocks your path temorarily (don't hit it) * Tires will reduce your smoke cloud to 1/2 its current size.";
      welcomeAction.textContent = 'OK';
      return;
    }
    welcomeModal.classList.add('hidden');
    welcomeDismissed = true;
  }

  function isSplashActive() {
    return Boolean(splashState && splashState.active);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
  }

  function setSplashPhase(phase) {
    if (!splashState) return;
    splashState.phase = phase;
    if (splashModal) {
      splashModal.dataset.phase = phase;
    }
  }

  function setSplashScale(scale) {
    if (!splashLogo) return;
    splashLogo.style.transform = `scale(${scale.toFixed(4)})`;
  }

  function initSplash() {
    splashState = createInitialSplashState();
    if (!isSplashActive()) return;
    if (splashModal) {
      splashModal.classList.remove('hidden');
    }
    if (splashPrompt) {
      splashPrompt.textContent = 'Tap the screen or press any key to start';
    }
    setSplashPhase('splash_grow');
    setSplashScale(SPLASH_MIN_SCALE);
  }

  function dismissSplash() {
    if (!isSplashActive()) return;
    splashState.active = false;
    setSplashPhase('done');
    if (splashModal) {
      splashModal.classList.add('hidden');
    }
    playSound('splash_start');
    showWelcomeModal();
  }

  function updateSplash(deltaMs) {
    if (!isSplashActive()) return;
    splashState.elapsedMs += deltaMs;

    if (!splashState.riseCuePlayed) {
      splashState.riseCuePlayed = true;
      playSound('splash_rise');
    }

    if (splashState.elapsedMs < SPLASH_GROW_MS) {
      const t = easeOutCubic(clamp(splashState.elapsedMs / SPLASH_GROW_MS, 0, 1));
      setSplashPhase('splash_grow');
      setSplashScale(lerp(SPLASH_MIN_SCALE, SPLASH_PEAK_SCALE, t));
      return;
    }

    if (!splashState.impactCuePlayed) {
      splashState.impactCuePlayed = true;
      playSound('splash_impact');
    }

    if (splashState.elapsedMs < SPLASH_TOTAL_MS) {
      const t = easeInOutCubic(clamp((splashState.elapsedMs - SPLASH_GROW_MS) / SPLASH_SHRINK_MS, 0, 1));
      setSplashPhase('splash_shrink');
      if (!splashState.settleCuePlayed) {
        splashState.settleCuePlayed = true;
        playSound('splash_settle');
      }
      setSplashScale(lerp(SPLASH_PEAK_SCALE, 1, t));
      return;
    }

    setSplashScale(1);
    setSplashPhase('splash_wait_input');
    splashState.promptSoundMs = Math.max(0, splashState.promptSoundMs - deltaMs);
    if (splashState.promptSoundMs === 0) {
      splashState.promptSoundMs = SPLASH_PROMPT_SOUND_MS;
      playSound('splash_prompt');
    }
  }

  function isModalOpen() {
    return (
      isSplashActive() ||
      !welcomeModal.classList.contains('hidden') ||
      !scoreEntry.classList.contains('hidden') ||
      (settingsModal && !settingsModal.classList.contains('hidden')) ||
      (scoreboardModal && !scoreboardModal.classList.contains('hidden')) ||
      (dragModal && !dragModal.classList.contains('hidden')) ||
      (slotModal && !slotModal.classList.contains('hidden')) ||
      (resumeModal && !resumeModal.classList.contains('hidden'))
    );
  }

  function markScoreHandled() {
    scoreHandled = true;
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

  function randomRange(seed, min, max) {
    const roll = lcg(seed);
    const value = min + roll.value * (max - min);
    return { seed: roll.seed, value };
  }

  function addAreaToSet(set, item, size = 1) {
    if (!item) return;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        set.add(`${item.x + x},${item.y + y}`);
      }
    }
  }

  function buildOccupiedSet(state) {
    const occupied = new Set(state.dustTrail.map((segment) => `${segment.x},${segment.y}`));
    addAreaToSet(occupied, state.trophy, 1);
    addAreaToSet(occupied, state.clock, 1);
    addAreaToSet(occupied, state.tire, 1);
    addAreaToSet(occupied, state.oil, OIL_SIZE);
    addAreaToSet(occupied, state.police, 1);
    addAreaToSet(occupied, state.coin, COIN_SIZE);
    addAreaToSet(occupied, state.stopSign, 1);
    addAreaToSet(occupied, state.cherry, 1);
    return occupied;
  }

  function placeItem(state, size) {
    const occupied = buildOccupiedSet(state);
    const candidates = [];
    for (let y = 0; y <= GRID.rows - size; y += 1) {
      for (let x = 0; x <= GRID.cols - size; x += 1) {
        let free = true;
        for (let dy = 0; dy < size && free; dy += 1) {
          for (let dx = 0; dx < size; dx += 1) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              free = false;
              break;
            }
          }
        }
        if (free) candidates.push({ x, y });
      }
    }
    if (!candidates.length) return { item: null, seed: state.seed };
    const roll = lcg(state.seed);
    const index = Math.floor(roll.value * candidates.length);
    return { item: candidates[index], seed: roll.seed };
  }

  function placeTrophy(state) {
    const occupied = buildOccupiedSet(state);
    const open = [];
    for (let y = 0; y < GRID.rows; y += 1) {
      for (let x = 0; x < GRID.cols; x += 1) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) open.push({ x, y });
      }
    }
    if (open.length === 0) return { trophy: null, seed: state.seed };
    const roll = lcg(state.seed);
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
    const { trophy, seed: nextSeed } = placeTrophy({ dustTrail, seed, trophy: null });
    let next = nextSeed;
    const clockRespawn = randomRange(next, CLOCK_SPAWN_MIN_MS, CLOCK_SPAWN_MAX_MS);
    next = clockRespawn.seed;
    const tireRespawn = randomRange(next, TIRE_SPAWN_MIN_MS, TIRE_SPAWN_MAX_MS);
    next = tireRespawn.seed;
    const oilRespawn = randomRange(next, OIL_SPAWN_MIN_MS, OIL_SPAWN_MAX_MS);
    next = oilRespawn.seed;
    const policeRespawn = randomRange(next, POLICE_SPAWN_MIN_MS, POLICE_SPAWN_MAX_MS);
    next = policeRespawn.seed;
    const coinRespawn = randomRange(next, COIN_SPAWN_MIN_MS, COIN_SPAWN_MAX_MS);
    next = coinRespawn.seed;
    const stopSignRespawn = randomRange(next, STOP_SIGN_INITIAL_MIN_MS, STOP_SIGN_INITIAL_MAX_MS);
    next = stopSignRespawn.seed;
    const cherryRespawn = randomRange(next, CHERRY_SPAWN_MIN_MS, CHERRY_SPAWN_MAX_MS);
    next = cherryRespawn.seed;

    return {
      dustTrail,
      direction: null,
      moving: false,
      trophy,
      score: 0,
      seed: next,
      over: false,
      won: false,
      trophyAgeMs: 0,
      respawnMs: 0,
      trophiesCollected: 0,
      speedMultiplier: 1,
      clock: null,
      clockAgeMs: 0,
      clockRespawnMs: clockRespawn.value,
      tire: null,
      tireAgeMs: 0,
      tireRespawnMs: tireRespawn.value,
      oil: null,
      oilAgeMs: 0,
      oilRespawnMs: oilRespawn.value,
      police: null,
      policeAgeMs: 0,
      policeRespawnMs: policeRespawn.value,
      coin: null,
      coinAgeMs: 0,
      coinRespawnMs: coinRespawn.value,
      stopSign: null,
      stopSignAgeMs: 0,
      stopSignRespawnMs: stopSignRespawn.value,
      cherry: null,
      cherryAgeMs: 0,
      cherryRespawnMs: cherryRespawn.value,
      dragPending: false,
      lastDragMilestoneTriggered: 0,
      dragBuffMsRemaining: 0,
      dragBuffMultiplier: 1,
      slotPending: false,
      slowMsRemaining: 0,
      controlsReversedMs: 0
    };
  }

  function isOpposite(a, b) {
    return a.x + b.x === 0 && a.y + b.y === 0;
  }

  function isDragTriggerTrophy(trophiesCollected) {
    if (trophiesCollected === DRAG_FIRST_TRIGGER_TROPHY) return true;
    if (trophiesCollected < DRAG_FIRST_TRIGGER_TROPHY) return false;
    return (trophiesCollected - DRAG_FIRST_TRIGGER_TROPHY) % DRAG_TRIGGER_INTERVAL === 0;
  }

  function getDragMilestone(trophiesCollected) {
    if (trophiesCollected < DRAG_FIRST_TRIGGER_TROPHY) return 0;
    return 1 + Math.floor((trophiesCollected - DRAG_FIRST_TRIGGER_TROPHY) / DRAG_TRIGGER_INTERVAL);
  }

  function stepState(prev, inputDir) {
    if (prev.over) return prev;
    let direction = prev.direction;
    if (inputDir && !isOpposite(inputDir, prev.direction)) {
      direction = inputDir;
    }
    if (!direction) return prev;

    const head = {
      x: prev.dustTrail[0].x + direction.x,
      y: prev.dustTrail[0].y + direction.y
    };

    if (head.x < 0 || head.x >= GRID.cols || head.y < 0 || head.y >= GRID.rows) {
      playSound('wall');
      return { ...prev, direction, over: true };
    }

    const eating = prev.trophy && head.x === prev.trophy.x && head.y === prev.trophy.y;
    const body = eating ? prev.dustTrail : prev.dustTrail.slice(0, -1);
    if (body.some((segment) => segment.x === head.x && segment.y === head.y)) {
      playSound('crash');
      return { ...prev, direction, over: true };
    }

    const nextDust = [head, ...prev.dustTrail];
    if (!eating) nextDust.pop();

    let score = prev.score;
    let seed = prev.seed;
    let trophy = prev.trophy;
    let won = false;
    let trophiesCollected = prev.trophiesCollected;
    let speedMultiplier = prev.speedMultiplier;
    let clock = prev.clock;
    let clockAgeMs = prev.clockAgeMs;
    let clockRespawnMs = prev.clockRespawnMs;
    let tire = prev.tire;
    let tireAgeMs = prev.tireAgeMs;
    let tireRespawnMs = prev.tireRespawnMs;
    let oil = prev.oil;
    let oilAgeMs = prev.oilAgeMs;
    let oilRespawnMs = prev.oilRespawnMs;
    let police = prev.police;
    let policeAgeMs = prev.policeAgeMs;
    let policeRespawnMs = prev.policeRespawnMs;
    let coin = prev.coin;
    let coinAgeMs = prev.coinAgeMs;
    let coinRespawnMs = prev.coinRespawnMs;
    let stopSign = prev.stopSign;
    let stopSignAgeMs = prev.stopSignAgeMs;
    let stopSignRespawnMs = prev.stopSignRespawnMs;
    let cherry = prev.cherry;
    let cherryAgeMs = prev.cherryAgeMs;
    let cherryRespawnMs = prev.cherryRespawnMs;
    let dragPending = prev.dragPending;
    let lastDragMilestoneTriggered = prev.lastDragMilestoneTriggered;
    let dragBuffMsRemaining = prev.dragBuffMsRemaining;
    let dragBuffMultiplier = prev.dragBuffMultiplier;
    let slotPending = prev.slotPending;
    let slowMsRemaining = prev.slowMsRemaining;
    let controlsReversedMs = prev.controlsReversedMs;

    if (eating) {
      score += SCORE_PER_FOOD;
      trophiesCollected += 1;
      speedMultiplier *= SPEED_INCREMENT;
      playSound('trophy');
      const dragMilestone = getDragMilestone(trophiesCollected);
      if (dragMilestone > lastDragMilestoneTriggered && isDragTriggerTrophy(trophiesCollected)) {
        dragPending = true;
        lastDragMilestoneTriggered = dragMilestone;
      }
      const placement = placeTrophy({
        dustTrail: nextDust,
        seed,
        trophy: null,
        clock: prev.clock,
        tire: prev.tire,
        oil: prev.oil,
        police: prev.police,
        coin: prev.coin,
        stopSign: prev.stopSign,
        cherry: prev.cherry
      });
      trophy = placement.trophy;
      seed = placement.seed;
      if (!trophy) {
        won = true;
      }
    }

    if (police && isInArea(head, police, 1)) {
      playSound('police');
      return { ...prev, dustTrail: nextDust, direction, over: true, won: false };
    }

    if (clock && isInArea(head, clock, 1)) {
      score += CLOCK_SCORE;
      slowMsRemaining = CLOCK_SLOW_MS;
      playSound('clock');
      clock = null;
      clockAgeMs = 0;
      const roll = randomRange(seed, CLOCK_SPAWN_MIN_MS, CLOCK_SPAWN_MAX_MS);
      seed = roll.seed;
      clockRespawnMs = roll.value;
    }

    if (tire && isInArea(head, tire, 1)) {
      score += TIRE_SCORE;
      const newLength = Math.max(1, Math.ceil(nextDust.length / 2));
      nextDust.splice(newLength);
      playSound('tire');
      tire = null;
      tireAgeMs = 0;
      const roll = randomRange(seed, TIRE_SPAWN_MIN_MS, TIRE_SPAWN_MAX_MS);
      seed = roll.seed;
      tireRespawnMs = roll.value;
    }

    if (coin && isInArea(head, coin, COIN_SIZE)) {
      score += COIN_SCORE;
      playSound('coin');
      coin = null;
      coinAgeMs = 0;
      const roll = randomRange(seed, COIN_SPAWN_MIN_MS, COIN_SPAWN_MAX_MS);
      seed = roll.seed;
      coinRespawnMs = roll.value;
    }

    if (stopSign && isInArea(head, stopSign, 1)) {
      speedMultiplier = Math.max(0.25, speedMultiplier * 0.5);
      playSound('stop');
      stopSign = null;
      stopSignAgeMs = 0;
    }

    if (cherry && isInArea(head, cherry, 1)) {
      playSound('cherry');
      cherry = null;
      cherryAgeMs = 0;
      const roll = randomRange(seed, CHERRY_SPAWN_MIN_MS, CHERRY_SPAWN_MAX_MS);
      seed = roll.seed;
      cherryRespawnMs = roll.value;
      slotPending = true;
    }

    if (oil && isInArea(head, oil, OIL_SIZE)) {
      if (controlsReversedMs <= 0) {
        playSound('oil');
      }
      controlsReversedMs = OIL_REVERSE_MS;
    }

    return {
      ...prev,
      dustTrail: nextDust,
      direction,
      score,
      seed,
      trophy,
      over: won,
      won,
      trophyAgeMs: eating ? 0 : prev.trophyAgeMs,
      respawnMs: eating ? 0 : prev.respawnMs,
      trophiesCollected,
      speedMultiplier,
      clock,
      clockAgeMs,
      clockRespawnMs,
      tire,
      tireAgeMs,
      tireRespawnMs,
      oil,
      oilAgeMs,
      oilRespawnMs,
      police,
      policeAgeMs,
      policeRespawnMs,
      coin,
      coinAgeMs,
      coinRespawnMs,
      stopSign,
      stopSignAgeMs,
      stopSignRespawnMs,
      cherry,
      cherryAgeMs,
      cherryRespawnMs,
      dragPending,
      lastDragMilestoneTriggered,
      dragBuffMsRemaining,
      dragBuffMultiplier,
      slotPending,
      slowMsRemaining,
      controlsReversedMs
    };
  }

  function queueDirection(dir) {
    if (isSplashActive() || state.over || paused) return;
    if (dragState) return;
    if (slotState || resumeCountdownMs > 0 || resumeWaiting) return;
    const adjusted = state.controlsReversedMs > 0 ? { x: -dir.x, y: -dir.y } : dir;
    const basis = queuedDir || state.direction;
    if (!basis) {
      queuedDir = adjusted;
      playSound('turn');
      return;
    }
    if (adjusted.x === basis.x && adjusted.y === basis.y) return;
    if (isOpposite(basis, adjusted)) return;
    queuedDir = adjusted;
    playSound('turn');
  }

  function getEffectiveSpeed(current) {
    const slowFactor = current.slowMsRemaining > 0 ? 0.5 : 1;
    const dragBuff = current.dragBuffMultiplier || 1;
    return Math.max(0.25, current.speedMultiplier * dragBuff * slowFactor);
  }

  function applyDirectionFromVector(dx, dy, threshold) {
    if (Math.hypot(dx, dy) < threshold) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      queueDirection({ x: dx > 0 ? 1 : -1, y: 0 });
    } else {
      queueDirection({ x: 0, y: dy > 0 ? 1 : -1 });
    }
  }

  function isInArea(head, item, size = 1) {
    if (!item) return false;
    return head.x >= item.x && head.x < item.x + size && head.y >= item.y && head.y < item.y + size;
  }

  function updateScores() {
    scoreEl.textContent = String(state.score);
    writeBestScore(state.score);
  }

  function setSoundEffectsEnabled(enabled) {
    soundEffectsEnabled = Boolean(enabled);
    if (soundSetting) {
      soundSetting.value = soundEffectsEnabled ? 'on' : 'off';
    }
    if (!soundEffectsEnabled) {
      stopDragEngineAudio();
    } else if (dragState) {
      startDragEngineAudio();
    }
  }

  function pauseForUtilityModal() {
    if (!paused && !state.over && !dragState && !slotState && !resumeWaiting && resumeCountdownMs === 0) {
      paused = true;
      utilityModalPaused = true;
    }
    setOverlay(null);
  }

  function resumeFromUtilityModal() {
    if (utilityModalPaused && !state.over) {
      paused = false;
    }
    utilityModalPaused = false;
  }

  function openUtilityModal(modal) {
    if (!modal) return;
    pauseForUtilityModal();
    modal.classList.remove('hidden');
  }

  function closeUtilityModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    if (!isModalOpen()) {
      if (utilityModalPaused) {
        resumeFromUtilityModal();
      } else if (paused && !state.over) {
        setOverlay('paused');
      }
    }
  }

  function openResumePrompt(message) {
    resumeWaiting = true;
    resumeCountdownMs = 0;
    if (!resumeModal || !resumeMessage || !resumeAction) return;
    resumeMessage.textContent = message || 'Tap to resume';
    resumeAction.style.display = '';
    resumeModal.classList.remove('hidden');
  }

  function startResumeCountdown() {
    resumeWaiting = false;
    resumeCountdownMs = 5000;
    if (!resumeModal || !resumeAction) return;
    resumeAction.style.display = 'none';
  }

  function updateResumeCountdown(deltaMs) {
    if (!resumeModal || !resumeMessage) return;
    resumeCountdownMs = Math.max(0, resumeCountdownMs - deltaMs);
    const seconds = Math.ceil(resumeCountdownMs / 1000);
    resumeMessage.textContent = `Resuming in ${seconds}...`;
    if (resumeCountdownMs === 0) {
      resumeModal.classList.add('hidden');
      // After slot/cherry flow, require fresh player input before movement resumes.
      state.moving = false;
      state.direction = null;
      queuedDir = null;
      accumulator = 0;
    }
  }

  function detectDragQualityTier() {
    const dpr = window.devicePixelRatio || 1;
    const mobile = isMobileViewport();
    if (mobile && (frameSampleMs > 19 || dpr >= 3)) return 'low';
    if (mobile || frameSampleMs > 17.5) return 'medium';
    return 'high';
  }

  function applyDragQualityTier(tier) {
    const classes = ['drag-quality-high', 'drag-quality-medium', 'drag-quality-low'];
    document.body.classList.remove(...classes);
    document.body.classList.add(`drag-quality-${tier}`);
  }

  function getGearTopSpeedMps(gearIndex) {
    const ratio = DRAG_GEAR_RATIOS[gearIndex] || DRAG_GEAR_RATIOS[DRAG_GEAR_RATIOS.length - 1];
    const wheelRps = DRAG_REDLINE_RPM / (60 * ratio * DRAG_FINAL_DRIVE);
    return clamp(wheelRps * (Math.PI * 2 * DRAG_WHEEL_RADIUS_M), 15, DRAG_MAX_SPEED_MPS);
  }

  function getDragShiftTargetRpm(gear) {
    const idx = clamp((gear || 1) - 1, 0, DRAG_GEAR_RATIOS.length - 1);
    const gearTop = getGearTopSpeedMps(idx);
    const ratio = clamp(DRAG_SHIFT_TARGET_MPS / Math.max(1, gearTop), 0, 1);
    return DRAG_IDLE_RPM + (DRAG_REDLINE_RPM - DRAG_IDLE_RPM) * ratio;
  }

  function mpsToMph(value) {
    return value * 2.2369362921;
  }

  function getLaunchQuality(reactionMs, falseStart) {
    if (falseStart) {
      return {
        label: 'False Start',
        points: 0,
        launchSpeed: 5,
        boostMs: 0,
        wheelspinMs: 420,
        perfect: false
      };
    }
    if (reactionMs <= 170) {
      return {
        label: 'Perfect Launch',
        points: DRAG_LAUNCH_MAX_POINTS,
        launchSpeed: 10.5,
        boostMs: 1700,
        wheelspinMs: 120,
        perfect: true
      };
    }
    if (reactionMs <= 280) {
      return {
        label: 'Great Launch',
        points: 6000,
        launchSpeed: 9.2,
        boostMs: 1300,
        wheelspinMs: 140,
        perfect: false
      };
    }
    if (reactionMs <= 420) {
      return {
        label: 'Good Launch',
        points: 4200,
        launchSpeed: 8.1,
        boostMs: 900,
        wheelspinMs: 170,
        perfect: false
      };
    }
    return {
      label: 'Slow Launch',
      points: 2200,
      launchSpeed: 6.9,
      boostMs: 500,
      wheelspinMs: 200,
      perfect: false
    };
  }

  function getShiftQuality(speedMps, fromGear, toGear) {
    const mph = mpsToMph(speedMps);
    const scored = DRAG_SCORED_SHIFT_KEYS.has(`${fromGear}-${toGear}`);
    if (mph >= DRAG_SHIFT_PERFECT_MIN_MPH && mph <= DRAG_SHIFT_PERFECT_MAX_MPH) {
      return {
        label: 'Perfect Shift',
        points: scored ? DRAG_SHIFT_MAX_POINTS : 0,
        speedDelta: 10.8,
        boostMs: 1700,
        rpmDrop: 0.52,
        perfect: true,
        scored,
        mph: Math.round(mph)
      };
    }
    if (mph >= DRAG_SHIFT_GREAT_MIN_MPH && mph <= DRAG_SHIFT_GREAT_MAX_MPH) {
      return {
        label: 'Great Shift',
        points: scored ? 6000 : 0,
        speedDelta: 8.1,
        boostMs: 1250,
        rpmDrop: 0.54,
        perfect: false,
        scored,
        mph: Math.round(mph)
      };
    }
    if (mph >= DRAG_SHIFT_GOOD_MIN_MPH && mph <= DRAG_SHIFT_GOOD_MAX_MPH) {
      return {
        label: 'Good Shift',
        points: scored ? 4200 : 0,
        speedDelta: 5.4,
        boostMs: 900,
        rpmDrop: 0.57,
        perfect: false,
        scored,
        mph: Math.round(mph)
      };
    }
    if (mph >= DRAG_SHIFT_VALID_MIN_MPH && mph <= DRAG_SHIFT_VALID_MAX_MPH) {
      return {
        label: mph < DRAG_SHIFT_GOOD_MIN_MPH ? 'Early Shift' : 'Late Shift',
        points: scored ? 2200 : 0,
        speedDelta: 2.6,
        boostMs: 420,
        rpmDrop: 0.61,
        perfect: false,
        scored,
        mph: Math.round(mph)
      };
    }
    return {
      label: 'Missed Shift',
      points: scored ? 800 : 0,
      speedDelta: -2,
      boostMs: 0,
      rpmDrop: 0.64,
      perfect: false,
      scored,
      mph: Math.round(mph)
    };
  }

  function updateDragPhysics(car, dt, options = {}) {
    const gearIndex = clamp((car.gear || 1) - 1, 0, DRAG_GEAR_RATIOS.length - 1);
    const tractionScale = options.tractionScale ?? 1;
    const accelerationScale = options.accelerationScale ?? 1;
    const throttle = options.throttle ?? 1;
    const gearTop = getGearTopSpeedMps(gearIndex);
    const launchElapsedSec = (options.launchElapsedMs || 0) / 1000;
    const speedRatioInGear = clamp(car.speed / Math.max(gearTop, 0.001), 0, 1);
    const inHighGear = gearIndex >= 1;
    let baseAccel;
    if (inHighGear) {
      baseAccel = lerp(42, 7.6, clamp((car.speed - DRAG_SHIFT_TARGET_MPS) / (DRAG_MAX_SPEED_MPS - DRAG_SHIFT_TARGET_MPS), 0, 1));
      if (car.speed > 135) {
        baseAccel *= 0.82;
      }
    } else {
      baseAccel = lerp(12.8, 5.1, clamp(car.speed / DRAG_SHIFT_TARGET_MPS, 0, 1));
      if (launchElapsedSec < 1.05) {
        baseAccel *= 0.8;
      }
      if (car.speed >= DRAG_SHIFT_TARGET_MPS + 5) {
        baseAccel *= 0.42;
      }
    }
    const aeroLoss = (0.00092 * car.speed * car.speed) + (0.0012 * car.speed);
    const rollingLoss = 0.36 + speedRatioInGear * 0.28;
    const netAccel = Math.max(-6.5, baseAccel * accelerationScale * tractionScale * throttle - aeroLoss - rollingLoss);
    car.speed = clamp(car.speed + netAccel * dt, 0, Math.min(gearTop, DRAG_MAX_SPEED_MPS));
    if (!inHighGear && launchElapsedSec < DRAG_SHIFT_LOCKOUT_MS / 1000) {
      const lockRatio = clamp(launchElapsedSec / (DRAG_SHIFT_LOCKOUT_MS / 1000), 0, 1);
      const lockCap = lerp(36, DRAG_SHIFT_TARGET_MPS + 1.2, lockRatio);
      car.speed = Math.min(car.speed, lockCap);
    }
    car.distanceM += car.speed * dt;
    const targetRpm = DRAG_IDLE_RPM + (DRAG_REDLINE_RPM - DRAG_IDLE_RPM) * clamp(car.speed / Math.max(gearTop, 0.001), 0, 1);
    car.rpm = clamp(lerp(car.rpm || DRAG_IDLE_RPM, targetRpm + 180 * throttle, clamp(dt * 11, 0, 1)), DRAG_IDLE_RPM, DRAG_REDLINE_RPM);
    const slipRatio = inHighGear ? 0 : clamp((1 - tractionScale) * (0.5 + speedRatioInGear), 0, 1);
    return { slipRatio, gearTop };
  }

  function pushDragParticle(particle) {
    if (!dragState) return;
    dragState.particles.push(particle);
    const maxCount = DRAG_PARTICLE_MAX[dragState.qualityTier] || DRAG_PARTICLE_MAX.medium;
    if (dragState.particles.length > maxCount) {
      dragState.particles.splice(0, dragState.particles.length - maxCount);
    }
  }

  function emitDragExhaust(x, y, strength, color) {
    if (!dragState) return;
    const base = dragState.qualityTier === 'high' ? 4 : dragState.qualityTier === 'medium' ? 3 : 2;
    const count = Math.max(1, Math.round(base * clamp(strength, 0.45, 1.9)));
    for (let i = 0; i < count; i += 1) {
      const life = 320 + Math.random() * 260;
      pushDragParticle({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 26,
        vy: 42 + Math.random() * 84,
        lifeMs: life,
        maxLifeMs: life,
        size: 3 + Math.random() * 5,
        color: color || 'rgba(255, 158, 87, 0.66)'
      });
    }
  }

  function emitDragSparks(x, y) {
    if (!dragState) return;
    const count = dragState.qualityTier === 'high' ? 18 : dragState.qualityTier === 'medium' ? 12 : 8;
    for (let i = 0; i < count; i += 1) {
      const life = 200 + Math.random() * 240;
      pushDragParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 220,
        vy: -20 + Math.random() * 180,
        lifeMs: life,
        maxLifeMs: life,
        size: 1.4 + Math.random() * 2.8,
        color: 'rgba(255, 213, 122, 0.9)'
      });
    }
  }

  function createDragNpcs(seed) {
    const npcs = [];
    let nextSeed = seed;
    const laneOffsets = [DRAG_OPPONENT_LANE_OFFSET];
    for (let i = 0; i < DRAG_NPC_COUNT; i += 1) {
      const powerRoll = lcg(nextSeed);
      nextSeed = powerRoll.seed;
      const reactionRoll = lcg(nextSeed);
      nextSeed = reactionRoll.seed;
      const shiftRoll = lcg(nextSeed);
      nextSeed = shiftRoll.seed;
      const finishRoll = lcg(nextSeed);
      nextSeed = finishRoll.seed;
      npcs.push({
        id: i,
        laneOffset: laneOffsets[i],
        gear: 1,
        speed: 0,
        rpm: DRAG_IDLE_RPM,
        distanceM: 0,
        shiftCooldownMs: 0,
        launchElapsedMs: 0,
        reactionDelayMs: 110 + Math.floor(reactionRoll.value * 300),
        powerFactor: 0.93 + powerRoll.value * 0.17,
        shiftSkill: 0.78 + shiftRoll.value * 0.2,
        shiftTargetMph: DRAG_SHIFT_TARGET_MPH - 3 + shiftRoll.value * 10,
        terminalMph: 312 + powerRoll.value * 24,
        targetFinishMs: 17500 + Math.round(finishRoll.value * 5500),
        color: ['#ff8d4a', '#5eb0ff'][i] || '#ff8d4a',
        launched: false,
        hasShifted: false
      });
    }
    return { npcs, seed: nextSeed };
  }

  function resizeDragCanvas() {
    if (!dragCanvas || !dragCtx) return;
    const rect = dragCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (dragCanvas.width !== width || dragCanvas.height !== height) {
      dragCanvas.width = width;
      dragCanvas.height = height;
    }
    dragCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function setDragTreeState({ pre = false, amber = 0, green = false, red = false }) {
    if (!dragTree) return;
    const lights = dragTree.querySelectorAll('.tree-light');
    lights.forEach((light) => light.classList.remove('active'));
    if (pre) {
      if (lights[0]) lights[0].classList.add('active');
      if (lights[1]) lights[1].classList.add('active');
    }
    for (let i = 0; i < Math.min(3, amber); i += 1) {
      if (lights[2 + i]) lights[2 + i].classList.add('active');
    }
    if (green && lights[5]) lights[5].classList.add('active');
    if (red && lights[6]) lights[6].classList.add('active');
  }

  function getDragRankFromDistances(player, npcs) {
    const standings = [
      { id: 'player', distanceM: player.distanceM },
      ...npcs.map((npc, index) => ({ id: `npc-${index}`, distanceM: npc.distanceM }))
    ].sort((a, b) => b.distanceM - a.distanceM);
    const playerIndex = standings.findIndex((entry) => entry.id === 'player');
    return playerIndex >= 0 ? playerIndex + 1 : npcs.length + 1;
  }

  function openDragShiftRound() {
    if (!dragModal || !dragCanvas || !dragCtx) return;
    paused = false;
    setOverlay(null);
    loadDragVisualAssets();

    const qualityTier = detectDragQualityTier();
    applyDragQualityTier(qualityTier);
    if (dragQuality) dragQuality.textContent = qualityTier;
    if (dragMilestone) dragMilestone.textContent = String(state.trophiesCollected);

    const npcSetup = createDragNpcs(state.seed);
    state.seed = npcSetup.seed;

    dragState = {
      phase: 'splash',
      phaseMs: 0,
      totalMs: 0,
      qualityTier,
      milestoneTrophy: state.trophiesCollected,
      trackDistanceM: DRAG_TOTAL_DISTANCE_M,
      cameraShakeMs: 0,
      lastTreeBeat: -1,
      rewardApplied: false,
      player: {
        gear: 1,
        speed: 0,
        rpm: DRAG_IDLE_RPM,
        distanceM: 0,
        reactionMs: null,
        launchElapsedMs: 0,
        shiftLockRemainingMs: DRAG_SHIFT_LOCKOUT_MS,
        launched: false,
        queuedLaunch: false,
        falseStart: false,
        falseStartPenaltyMs: 0,
        shiftCooldownMs: 0,
        shiftBoostMs: 0,
        wheelspinMs: 0,
        overRevMs: 0,
        hasShifted: false,
        points: 0,
        launchPoints: 0,
        shiftPoints: 0,
        shiftAttempts: 0,
        scoredShiftCount: 0,
        perfectScoredShifts: 0,
        launchResult: null,
        shiftLog: [],
        feedbackText: '',
        feedbackMs: 0,
        audioState: 'idle'
      },
      npcs: npcSetup.npcs,
      particles: [],
      results: null
    };

    if (dragResults) dragResults.classList.add('hidden');
    setDragTreeState({ pre: false, amber: 0, green: false, red: false });
    if (dragPhaseLabel) dragPhaseLabel.textContent = 'Splash';
    if (dragSubtitle) dragSubtitle.textContent = 'Top Fuel showdown loading...';
    updateDragHud();
    resizeDragCanvas();
    drawDragScene(performance.now());
    dragModal.classList.remove('hidden');
    startDragEngineAudio();
    playSound('splash_rise');
  }

  function applyDragLaunch(reactionMs) {
    if (!dragState) return;
    const player = dragState.player;
    if (player.launched) return;
    const quality = getLaunchQuality(reactionMs, player.falseStart);
    player.launched = true;
    player.reactionMs = player.falseStart ? -1 : Math.max(0, Math.round(reactionMs));
    player.launchResult = quality;
    player.launchPoints = quality.points;
    player.points = clamp(player.points + quality.points, 0, DRAG_MAX_POINTS);
    player.speed = quality.launchSpeed;
    player.shiftBoostMs = quality.boostMs;
    player.wheelspinMs = quality.wheelspinMs;
    player.launchElapsedMs = 0;
    player.shiftLockRemainingMs = DRAG_SHIFT_LOCKOUT_MS;
    player.feedbackText = `${quality.label}${quality.points > 0 ? ` +${quality.points}` : ''}`;
    player.feedbackMs = 1600;
    player.audioState = quality.perfect ? 'launch_perfect' : 'launch';
    if (player.falseStart) {
      player.falseStartPenaltyMs = DRAG_FALSE_START_PENALTY_MS;
      player.feedbackText = 'False start penalty';
      player.feedbackMs = 1800;
      if (dragSubtitle) dragSubtitle.textContent = 'False start! Short throttle cut. Recover with clean shifts.';
      playSound('drag_shift_miss');
    } else {
      if (dragSubtitle) {
        dragSubtitle.textContent = quality.perfect
          ? 'Perfect launch. Shift unlocks at 5.0s, target 110 mph.'
          : `${quality.label}. Build speed, hold 5.0s, then shift near 110 mph.`;
      }
      playSound(quality.perfect ? 'drag_perfect_shift' : 'drag_launch');
    }
    playDragEngineTransient('engine_launch_burst', null, { volume: quality.perfect ? 0.9 : 0.72, playbackRate: quality.perfect ? 1.06 : 0.98 });
  }

  function handleDragLaunchInput() {
    if (!dragState) return;
    const player = dragState.player;
    if (dragState.phase === 'countdown') {
      const greenWindowStart = DRAG_COUNTDOWN_MS - 620;
      if (dragState.phaseMs < greenWindowStart) {
        player.falseStart = true;
        player.queuedLaunch = true;
        if (dragSubtitle) dragSubtitle.textContent = 'Jumped early. Penalty incoming.';
        setDragTreeState({ pre: true, amber: 3, green: false, red: true });
        playSound('drag_shift_miss');
      } else {
        player.queuedLaunch = true;
        if (dragSubtitle) dragSubtitle.textContent = 'Staged. Hold and fire at green.';
      }
      return;
    }
    if (dragState.phase === 'race' && !player.launched) {
      applyDragLaunch(dragState.phaseMs);
    }
  }

  function handleDragShiftInput() {
    if (!dragState || dragState.phase !== 'race') return;
    const player = dragState.player;
    if (!player.launched || player.shiftCooldownMs > 0) return;
    const lockRemaining = Math.max(0, DRAG_SHIFT_LOCKOUT_MS - player.launchElapsedMs);
    if (lockRemaining > 0) {
      player.feedbackText = `SHIFT LOCKED ${Math.max(0.1, lockRemaining / 1000).toFixed(1)}s`;
      player.feedbackMs = 420;
      player.shiftLockRemainingMs = lockRemaining;
      if (dragSubtitle) {
        dragSubtitle.textContent = `Shift unlocks in ${(lockRemaining / 1000).toFixed(1)}s. Hold full throttle.`;
      }
      playSound('drag_shift_miss');
      return;
    }
    if (player.gear >= DRAG_GEAR_RATIOS.length) {
      playSound('drag_shift_miss');
      return;
    }

    const fromGear = player.gear;
    const toGear = fromGear + 1;
    const shift = getShiftQuality(player.speed, fromGear, toGear);

    player.shiftCooldownMs = DRAG_SHIFT_COOLDOWN_MS;
    player.gear = toGear;
    player.hasShifted = true;
    player.shiftAttempts += 1;
    player.shiftBoostMs = Math.max(player.shiftBoostMs, shift.boostMs);
    player.speed = clamp(player.speed + shift.speedDelta, 0, DRAG_MAX_SPEED_MPS);
    player.rpm = Math.max(DRAG_IDLE_RPM + 450, player.rpm * shift.rpmDrop);
    player.shiftLockRemainingMs = 0;

    if (shift.scored) {
      player.scoredShiftCount += 1;
      player.shiftPoints += shift.points;
      player.points = clamp(player.points + shift.points, 0, DRAG_MAX_POINTS);
      if (shift.perfect) {
        player.perfectScoredShifts += 1;
      }
    }

    player.shiftLog.push({
      fromGear,
      toGear,
      points: shift.points,
      scored: shift.scored,
      perfect: shift.perfect,
      label: shift.label,
      mph: shift.mph
    });

    player.feedbackText = `${fromGear}→${toGear} ${shift.label} @ ${shift.mph} mph${shift.points > 0 ? ` +${shift.points}` : ''}`;
    player.feedbackMs = 1500;
    player.audioState = shift.perfect ? 'shift_perfect' : 'shift';

    if (dragSubtitle) {
      dragSubtitle.textContent = shift.scored
        ? `${shift.label} at ${shift.mph} mph. High gear engaged.`
        : `${shift.label}. Only 1→2 is scored in this run.`;
    }

    if (shift.perfect) {
      dragState.cameraShakeMs = Math.max(dragState.cameraShakeMs, 200);
      playSound('drag_perfect_shift');
    } else {
      playSound('drag_shift_miss');
    }
    playDragEngineTransient('shift_clutch_hit', null, { volume: shift.perfect ? 0.94 : 0.75, playbackRate: shift.perfect ? 1.04 : 0.96 });
  }

  function handleDragPrimaryAction() {
    if (!dragState) return;
    if (dragState.phase === 'countdown') {
      handleDragLaunchInput();
      return;
    }
    if (dragState.phase === 'race') {
      if (!dragState.player.launched) {
        handleDragLaunchInput();
      } else {
        handleDragShiftInput();
      }
    }
  }

  function advanceDragNpc(npc, deltaMs, raceElapsedMs) {
    if (!npc) return;
    const dt = deltaMs / 1000;
    npc.shiftCooldownMs = Math.max(0, npc.shiftCooldownMs - deltaMs);

    if (raceElapsedMs < npc.reactionDelayMs) {
      npc.speed = Math.max(0, npc.speed - 12 * dt);
      npc.rpm = DRAG_IDLE_RPM;
      return;
    }

    if (!npc.launched) {
      npc.launched = true;
      npc.speed = 8 + npc.powerFactor * 2.8;
      npc.rpm = 2800;
    }

    npc.launchElapsedMs += deltaMs;
    const npcMph = mpsToMph(npc.speed);
    const targetMph = npc.shiftTargetMph || (DRAG_SHIFT_TARGET_MPH + (1 - npc.shiftSkill) * 7 - 3);
    const lockDone = npc.launchElapsedMs >= DRAG_SHIFT_LOCKOUT_MS;
    if (!npc.hasShifted && lockDone && npc.gear < DRAG_GEAR_RATIOS.length && npc.shiftCooldownMs <= 0 && npcMph >= targetMph) {
      npc.gear += 1;
      npc.hasShifted = true;
      npc.shiftCooldownMs = DRAG_SHIFT_COOLDOWN_MS + 20;
      npc.speed += 6.2 + npc.shiftSkill * 2.1;
      npc.rpm *= 0.56;
    }

    const trackDistance = dragState ? dragState.trackDistanceM : DRAG_TOTAL_DISTANCE_M;
    const targetFinishMs = Math.max(16500, npc.targetFinishMs || 23000);
    const progress = clamp(npc.launchElapsedMs / targetFinishMs, 0, 1);
    const expectedDistance = trackDistance * (1 - Math.pow(1 - progress, 3));
    const progressError = (expectedDistance - npc.distanceM) / Math.max(120, trackDistance * 0.34);
    const raceAssist = clamp(progressError, -0.18, 0.26);

    updateDragPhysics(npc, dt, {
      tractionScale: npc.gear === 1 ? (0.82 + npc.powerFactor * 0.06) : (1 + npc.powerFactor * 0.07),
      accelerationScale: npc.powerFactor * (npc.hasShifted ? 1.12 : 1) * (1 + raceAssist),
      launchElapsedMs: npc.launchElapsedMs
    });
    const terminalMps = (npc.terminalMph || 322) / 2.2369362921;
    npc.speed = Math.min(npc.speed, terminalMps);
  }

  function updateDragParticles(deltaMs) {
    if (!dragState || !dragState.particles) return;
    const dt = deltaMs / 1000;
    for (let i = dragState.particles.length - 1; i >= 0; i -= 1) {
      const particle = dragState.particles[i];
      particle.lifeMs -= deltaMs;
      if (particle.lifeMs <= 0) {
        dragState.particles.splice(i, 1);
        continue;
      }
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 10 * dt;
      particle.vx *= 0.986;
      particle.size *= 0.994;
    }
  }

  function updateDragRace(deltaMs) {
    if (!dragState) return;
    const player = dragState.player;
    const dt = deltaMs / 1000;

    player.shiftCooldownMs = Math.max(0, player.shiftCooldownMs - deltaMs);
    player.shiftBoostMs = Math.max(0, player.shiftBoostMs - deltaMs);
    player.falseStartPenaltyMs = Math.max(0, player.falseStartPenaltyMs - deltaMs);
    player.wheelspinMs = Math.max(0, player.wheelspinMs - deltaMs);
    player.feedbackMs = Math.max(0, player.feedbackMs - deltaMs);

    if (player.launched) {
      player.launchElapsedMs += deltaMs;
      player.shiftLockRemainingMs = Math.max(0, DRAG_SHIFT_LOCKOUT_MS - player.launchElapsedMs);
      const tractionScale = player.wheelspinMs > 0 ? 0.74 : 1;
      const boostScale = player.shiftBoostMs > 0 ? 1.2 : 1;
      const penaltyScale = player.falseStartPenaltyMs > 0 ? 0.22 : 1;
      updateDragPhysics(player, dt, {
        tractionScale,
        accelerationScale: boostScale * penaltyScale * (player.hasShifted ? 1.18 : 1),
        launchElapsedMs: player.launchElapsedMs
      });

      if (player.rpm >= DRAG_REDLINE_RPM - 40 && !player.hasShifted && player.launchElapsedMs >= DRAG_SHIFT_LOCKOUT_MS) {
        player.overRevMs += deltaMs;
        player.speed *= 0.995;
        if (player.overRevMs > 260 && player.feedbackMs <= 0) {
          player.feedbackText = 'Shift now!';
          player.feedbackMs = 380;
        }
      } else {
        player.overRevMs = 0;
      }
    } else {
      player.speed = Math.max(0, player.speed - 16 * dt);
      player.rpm = Math.max(DRAG_IDLE_RPM, player.rpm - 2800 * dt);
      player.shiftLockRemainingMs = DRAG_SHIFT_LOCKOUT_MS;
    }

    dragState.npcs.forEach((npc, index) => {
      advanceDragNpc(npc, deltaMs, dragState.phaseMs);
      if (dragCanvas && npc.speed > 8 && dragState.qualityTier !== 'low') {
        const centerX = dragCanvas.clientWidth * (0.5 + npc.laneOffset * DRAG_LANE_RENDER_FACTOR);
        const centerY = dragCanvas.clientHeight * 0.76 - (npc.distanceM - player.distanceM) * 1.1;
        emitDragExhaust(centerX, centerY, 0.5, 'rgba(200, 210, 228, 0.44)');
      }
      if (npc.gear === DRAG_GEAR_RATIOS.length && npc.rpm > DRAG_REDLINE_RPM - 80) {
        npc.speed *= 0.995;
      }
      if (index === 0 && Math.random() < 0.0004 && dragCanvas && dragState.qualityTier === 'high') {
        const sx = dragCanvas.clientWidth * (0.5 + npc.laneOffset * DRAG_LANE_RENDER_FACTOR);
        const sy = dragCanvas.clientHeight * 0.72;
        emitDragSparks(sx, sy);
      }
    });

    if (dragCanvas && player.launched) {
      const exhaustX = dragCanvas.clientWidth * 0.5;
      const exhaustY = dragCanvas.clientHeight * 0.88;
      const strength = clamp((player.speed / 52) + (player.shiftBoostMs > 0 ? 0.35 : 0), 0.5, 1.8);
      emitDragExhaust(exhaustX, exhaustY, strength, player.shiftBoostMs > 0 ? 'rgba(255,226,150,0.8)' : 'rgba(255,164,96,0.62)');
      if (player.speed > 52 || player.shiftBoostMs > 0) {
        const flameCount = dragState.qualityTier === 'high' ? 4 : dragState.qualityTier === 'medium' ? 3 : 2;
        for (let i = 0; i < flameCount; i += 1) {
          pushDragParticle({
            x: exhaustX + (Math.random() - 0.5) * 18,
            y: exhaustY + 2 + Math.random() * 6,
            vx: (Math.random() - 0.5) * 26,
            vy: -72 - Math.random() * 120,
            lifeMs: 120 + Math.random() * 150,
            maxLifeMs: 120 + Math.random() * 150,
            size: 2.2 + Math.random() * 3.8,
            glow: 18,
            color: Math.random() < 0.45 ? 'rgba(255, 238, 174, 0.95)' : 'rgba(255, 116, 44, 0.92)'
          });
        }
      }
    }

    player.audioState = dragAudioMode;

    updateDragParticles(deltaMs);

    const anyFinished = player.distanceM >= dragState.trackDistanceM || dragState.npcs.some((npc) => npc.distanceM >= dragState.trackDistanceM);
    if (anyFinished || dragState.phaseMs >= DRAG_RACE_MS) {
      finalizeDragRace();
    }
  }

  function finalizeDragRace() {
    if (!dragState || dragState.phase === 'results') return;
    const rank = getDragRankFromDistances(dragState.player, dragState.npcs);
    const player = dragState.player;

    let reward = clamp(Math.round(player.points), 0, DRAG_MAX_POINTS);
    if (player.shiftAttempts === 0 && rank === dragState.npcs.length + 1) {
      reward = DRAG_NO_SHIFT_LOSS_POINTS;
    }

    const buff = rank === 1;
    dragState.results = {
      rank,
      reward,
      buff,
      launchPoints: player.launchPoints,
      shiftPoints: player.shiftPoints,
      perfectScoredShifts: player.perfectScoredShifts,
      shiftAttempts: player.shiftAttempts
    };

    dragState.phase = 'results';
    dragState.phaseMs = 0;
    if (dragPhaseLabel) dragPhaseLabel.textContent = 'Results';
    if (dragSubtitle) dragSubtitle.textContent = 'Run complete. Points awarded by launch + shift precision.';

    if (dragResultsRank) dragResultsRank.textContent = `Finish: #${rank}`;
    if (dragResultsReward) dragResultsReward.textContent = `Run Score: +${reward} points`;
    if (dragResultsBuff) {
      const launchLabel = player.launchResult ? player.launchResult.label : 'No Launch';
      const perf = `${player.perfectScoredShifts}/1 perfect shift`;
      const extra = buff ? 'Win bonus: +15% speed for 15s' : 'No speed buff this run';
      dragResultsBuff.textContent = `${launchLabel} · ${perf} · ${extra}`;
    }
    if (dragResults) dragResults.classList.remove('hidden');
    setDragTreeState({ pre: true, amber: 3, green: true, red: false });
    playSound(rank === 1 ? 'drag_finish_win' : 'drag_finish');
  }

  function closeDragShiftRound() {
    if (!dragState) return;
    if (dragState.results && !dragState.rewardApplied) {
      state.score = Math.max(0, state.score + dragState.results.reward);
      updateScores();
      if (dragState.results.buff) {
        state.dragBuffMultiplier = DRAG_BUFF_MULTIPLIER;
        state.dragBuffMsRemaining = DRAG_BUFF_DURATION_MS;
      }
      dragState.rewardApplied = true;
    }

    dragState = null;
    if (dragModal) dragModal.classList.add('hidden');
    if (dragResults) dragResults.classList.add('hidden');
    setDragTreeState({ pre: false, amber: 0, green: false, red: false });
    document.body.classList.remove('drag-quality-high', 'drag-quality-medium', 'drag-quality-low');
    stopDragEngineAudio();
    openResumePrompt('Tap to resume the race');
  }

  function updateDragHud() {
    if (!dragState) return;
    const player = dragState.player;
    const mph = mpsToMph(player.speed);
    const rankPreview = getDragRankFromDistances(player, dragState.npcs);
    if (dragRank) {
      dragRank.textContent = dragState.phase === 'results' && dragState.results ? `#${dragState.results.rank}` : `#${rankPreview}`;
    }
    if (dragGear) dragGear.textContent = String(player.gear);
    if (dragSpeed) dragSpeed.textContent = `${Math.round(mph)} mph`;
    if (dragRpmValue) {
      if (!player.launched) {
        dragRpmValue.textContent = 'STAGED · WAIT FOR GREEN';
      } else if (!player.hasShifted && player.shiftLockRemainingMs > 0) {
        dragRpmValue.textContent = `SHIFT LOCK ${Math.max(0.1, player.shiftLockRemainingMs / 1000).toFixed(1)}s`;
      } else if (!player.hasShifted) {
        dragRpmValue.textContent = `SHIFT TARGET ${DRAG_SHIFT_TARGET_MPH} MPH`;
      } else {
        dragRpmValue.textContent = `RPM ${Math.round(player.rpm)}`;
      }
    }
    if (dragRpmFill) {
      const speedPct = clamp((mph / mpsToMph(DRAG_MAX_SPEED_MPS)) * 100, 0, 100);
      const shiftPct = clamp((mph / DRAG_SHIFT_TARGET_MPH) * 100, 0, 100);
      const lockPct = clamp(((DRAG_SHIFT_LOCKOUT_MS - player.shiftLockRemainingMs) / DRAG_SHIFT_LOCKOUT_MS) * 100, 0, 100);
      dragRpmFill.style.width = `${player.hasShifted ? speedPct : (player.shiftLockRemainingMs > 0 ? lockPct : shiftPct)}%`;
      const inWindow = !player.hasShifted
        && player.shiftLockRemainingMs <= 0
        && mph >= DRAG_SHIFT_PERFECT_MIN_MPH
        && mph <= DRAG_SHIFT_PERFECT_MAX_MPH;
      dragRpmFill.style.boxShadow = inWindow
        ? '0 0 18px rgba(110, 255, 167, 0.9)'
        : mph > DRAG_SHIFT_GOOD_MAX_MPH && !player.hasShifted
          ? '0 0 18px rgba(255, 82, 82, 0.8)'
          : '0 0 12px rgba(255, 151, 67, 0.5)';
    }
    if (dragDistance) {
      if (!player.hasShifted) {
        dragDistance.textContent = `Distance: ${Math.round(player.distanceM)}m / ${dragState.trackDistanceM}m · Shift @ ${DRAG_SHIFT_TARGET_MPH} mph`;
      } else {
        dragDistance.textContent = `Distance: ${Math.round(player.distanceM)}m / ${dragState.trackDistanceM}m · Points: ${Math.round(player.points)}`;
      }
    }
    if (dragPoints) dragPoints.textContent = `${Math.round(player.points)}`;
    if (dragTime) {
      if (dragState.phase === 'splash') {
        const remaining = Math.max(0, (DRAG_SPLASH_MS - dragState.phaseMs) / 1000);
        dragTime.textContent = `${remaining.toFixed(1)}s`;
      } else if (dragState.phase === 'race') {
        const remainingMs = Math.max(0, DRAG_RACE_MS - dragState.phaseMs);
        dragTime.textContent = `${(remainingMs / 1000).toFixed(1)}s`;
      } else if (dragState.phase === 'countdown') {
        const remaining = Math.max(0, (DRAG_COUNTDOWN_MS - dragState.phaseMs) / 1000);
        dragTime.textContent = `${remaining.toFixed(1)}s`;
      } else {
        dragTime.textContent = '--';
      }
    }
  }

  function drawDragOpponentCar(x, y, scale, color, light = { x: x, y: y }) {
    if (!dragCtx) return;
    const length = 96 * scale;
    const width = 22 * scale;
    const shadowDx = clamp((light.x - x) * 0.14, -28 * scale, 28 * scale);
    const shadowDy = clamp((light.y - y) * 0.08, -6 * scale, 24 * scale) + 12 * scale;

    dragCtx.save();
    dragCtx.translate(x, y);

    const shadowGrad = dragCtx.createRadialGradient(shadowDx, shadowDy, 2, shadowDx, shadowDy, length * 0.62);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.48)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    dragCtx.fillStyle = shadowGrad;
    dragCtx.beginPath();
    dragCtx.ellipse(shadowDx, shadowDy, length * 0.62, width * 0.7, 0, 0, Math.PI * 2);
    dragCtx.fill();

    dragCtx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    dragCtx.beginPath();
    dragCtx.ellipse(0, width * 0.95, length * 0.48, width * 0.5, 0, 0, Math.PI * 2);
    dragCtx.fill();

    const body = dragCtx.createLinearGradient(-length * 0.52, 0, length * 0.42, 0);
    body.addColorStop(0, '#f9fbff');
    body.addColorStop(0.08, color);
    body.addColorStop(0.72, '#10141b');
    body.addColorStop(1, '#04060b');
    dragCtx.fillStyle = body;
    dragCtx.beginPath();
    dragCtx.moveTo(-length * 0.48, -width * 0.42);
    dragCtx.lineTo(length * 0.34, -width * 0.3);
    dragCtx.lineTo(length * 0.48, 0);
    dragCtx.lineTo(length * 0.34, width * 0.3);
    dragCtx.lineTo(-length * 0.48, width * 0.42);
    dragCtx.closePath();
    dragCtx.fill();

    dragCtx.fillStyle = 'rgba(16, 22, 33, 0.95)';
    dragCtx.fillRect(-length * 0.12, -width * 0.7, length * 0.22, width * 1.4);

    dragCtx.fillStyle = '#e8edf7';
    dragCtx.fillRect(length * 0.45, -width * 0.62, length * 0.06, width * 0.4);
    dragCtx.fillRect(length * 0.45, width * 0.22, length * 0.06, width * 0.4);

    dragCtx.fillStyle = '#ff5a5a';
    dragCtx.fillRect(-length * 0.53, -width * 0.32, length * 0.08, width * 0.22);
    dragCtx.fillRect(-length * 0.53, width * 0.1, length * 0.08, width * 0.22);

    dragCtx.strokeStyle = 'rgba(255, 231, 188, 0.6)';
    dragCtx.lineWidth = Math.max(1, scale * 1.8);
    dragCtx.beginPath();
    dragCtx.moveTo(-length * 0.05, 0);
    dragCtx.lineTo(length * 0.38, 0);
    dragCtx.stroke();

    dragCtx.restore();
  }

  function drawDragExhaustFlameShockwave(width, height, now, player, speedFactor) {
    if (!dragCtx || !dragState || dragState.phase !== 'race' || !player.launched) return;
    const boost = player.shiftBoostMs > 0 ? 0.36 : 0;
    const intensity = clamp(0.3 + speedFactor * 0.95 + boost, 0, 1.55);
    if (intensity < 0.42) return;

    const baseX = width * 0.5;
    const baseY = height * 0.885;
    const flicker = Math.sin(now * 0.042) * 0.12 + Math.sin(now * 0.017) * 0.08;
    const flameLength = (26 + intensity * 74) * (1 + flicker);
    const flameWidth = 9 + intensity * 14;
    const nozzleOffsets = [-flameWidth * 0.9, flameWidth * 0.9];

    dragCtx.save();
    dragCtx.globalCompositeOperation = 'lighter';
    nozzleOffsets.forEach((offset, index) => {
      const flameX = baseX + offset;
      const flameGrad = dragCtx.createLinearGradient(flameX, baseY, flameX, baseY - flameLength);
      flameGrad.addColorStop(0, 'rgba(255, 255, 255, 0.94)');
      flameGrad.addColorStop(0.2, 'rgba(255, 226, 140, 0.9)');
      flameGrad.addColorStop(0.55, index % 2 === 0 ? 'rgba(255, 129, 42, 0.86)' : 'rgba(255, 84, 32, 0.82)');
      flameGrad.addColorStop(1, 'rgba(255, 64, 24, 0)');
      dragCtx.fillStyle = flameGrad;
      dragCtx.beginPath();
      dragCtx.moveTo(flameX - flameWidth * 0.58, baseY);
      dragCtx.quadraticCurveTo(flameX - flameWidth * 0.28, baseY - flameLength * 0.36, flameX, baseY - flameLength);
      dragCtx.quadraticCurveTo(flameX + flameWidth * 0.28, baseY - flameLength * 0.36, flameX + flameWidth * 0.58, baseY);
      dragCtx.closePath();
      dragCtx.fill();
    });

    const ringCount = dragState.qualityTier === 'high' ? 3 : dragState.qualityTier === 'medium' ? 2 : 1;
    for (let i = 0; i < ringCount; i += 1) {
      const pulse = ((now * 0.0026) + i / ringCount) % 1;
      const radius = 10 + pulse * (34 + intensity * 28);
      const alpha = (1 - pulse) * (0.34 + intensity * 0.1);
      dragCtx.strokeStyle = `rgba(255, ${170 + Math.floor(intensity * 38)}, 84, ${alpha})`;
      dragCtx.lineWidth = 1.2 + (1 - pulse) * 2.8;
      dragCtx.beginPath();
      dragCtx.ellipse(baseX, baseY - 8, radius * 1.24, radius * 0.42, 0, 0, Math.PI * 2);
      dragCtx.stroke();
    }

    const haze = dragCtx.createRadialGradient(baseX, baseY - flameLength * 0.35, 0, baseX, baseY - flameLength * 0.35, flameLength * 1.1);
    haze.addColorStop(0, `rgba(255, 218, 170, ${0.2 + intensity * 0.14})`);
    haze.addColorStop(1, 'rgba(255, 218, 170, 0)');
    dragCtx.fillStyle = haze;
    dragCtx.fillRect(baseX - flameLength, baseY - flameLength * 1.2, flameLength * 2, flameLength * 1.8);
    dragCtx.restore();
  }

  function ensureDragBloomSurface(width, height) {
    if (!dragBloomCanvas || !dragBloomCtx) return false;
    const targetWidth = Math.max(1, Math.floor(width));
    const targetHeight = Math.max(1, Math.floor(height));
    if (dragBloomCanvas.width !== targetWidth || dragBloomCanvas.height !== targetHeight) {
      dragBloomCanvas.width = targetWidth;
      dragBloomCanvas.height = targetHeight;
    }
    return true;
  }

  function drawDragLensFlare(width, height, light, speedFactor) {
    if (!dragCtx) return;
    const sourceX = light && Number.isFinite(light.x) ? light.x : width * 0.5;
    const sourceY = light && Number.isFinite(light.y) ? light.y : height * 0.24;
    const centerX = width * 0.5;
    const centerY = height * 0.56;
    const axisX = centerX - sourceX;
    const axisY = centerY - sourceY;
    const flareStrength = clamp(0.22 + speedFactor * 0.22, 0.2, 0.55);
    const ringCount = dragState && dragState.qualityTier === 'high' ? 6 : 4;

    dragCtx.save();
    dragCtx.globalCompositeOperation = 'screen';
    for (let i = 0; i < ringCount; i += 1) {
      const t = i / (ringCount - 1 || 1);
      const px = sourceX + axisX * (0.12 + t * 0.88);
      const py = sourceY + axisY * (0.12 + t * 0.88);
      const radius = lerp(width * 0.01, width * 0.06, 1 - t);
      const grad = dragCtx.createRadialGradient(px, py, 0, px, py, radius);
      grad.addColorStop(0, `rgba(255, 236, 196, ${flareStrength * (1 - t * 0.5)})`);
      grad.addColorStop(1, 'rgba(255, 236, 196, 0)');
      dragCtx.fillStyle = grad;
      dragCtx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
    }

    const streak = dragCtx.createLinearGradient(sourceX - width * 0.2, sourceY, sourceX + width * 0.2, sourceY);
    streak.addColorStop(0, 'rgba(255, 226, 168, 0)');
    streak.addColorStop(0.5, `rgba(255, 226, 168, ${flareStrength * 0.7})`);
    streak.addColorStop(1, 'rgba(255, 226, 168, 0)');
    dragCtx.fillStyle = streak;
    dragCtx.fillRect(sourceX - width * 0.2, sourceY - 1.2, width * 0.4, 2.4);
    dragCtx.restore();
  }

  function drawDragAtmosphericFog(width, height, road, speedFactor) {
    if (!dragCtx || !road) return;
    const horizonFog = dragCtx.createLinearGradient(0, road.horizon - 28, 0, road.roadBottomY);
    horizonFog.addColorStop(0, `rgba(210, 230, 255, ${0.3 + speedFactor * 0.08})`);
    horizonFog.addColorStop(0.36, 'rgba(160, 187, 224, 0.07)');
    horizonFog.addColorStop(1, 'rgba(18, 28, 44, 0)');
    dragCtx.fillStyle = horizonFog;
    dragCtx.fillRect(0, road.horizon - 28, width, road.roadBottomY - road.horizon + 28);

    const lowerFog = dragCtx.createLinearGradient(0, road.roadBottomY - 80, 0, height);
    lowerFog.addColorStop(0, 'rgba(24, 36, 52, 0)');
    lowerFog.addColorStop(1, `rgba(5, 8, 13, ${0.34 + speedFactor * 0.1})`);
    dragCtx.fillStyle = lowerFog;
    dragCtx.fillRect(0, road.roadBottomY - 80, width, height - road.roadBottomY + 80);
  }

  function applyDragPostProcessing(width, height, speedFactor) {
    if (!dragCtx) return;
    if (ensureDragBloomSurface(width, height)) {
      dragBloomCtx.setTransform(1, 0, 0, 1, 0, 0);
      dragBloomCtx.clearRect(0, 0, width, height);
      dragBloomCtx.drawImage(dragCanvas, 0, 0, width, height);

      if ('filter' in dragCtx) {
        dragCtx.save();
        dragCtx.globalCompositeOperation = 'screen';
        dragCtx.filter = `blur(${2 + speedFactor * 6}px) brightness(${1.1 + speedFactor * 0.3}) saturate(1.18)`;
        dragCtx.globalAlpha = 0.16 + speedFactor * 0.14;
        dragCtx.drawImage(dragBloomCanvas, 0, 0, width, height);
        dragCtx.filter = 'none';
        dragCtx.restore();
      }
    }

    const grade = dragCtx.createLinearGradient(0, 0, 0, height);
    grade.addColorStop(0, 'rgba(108, 170, 255, 0.2)');
    grade.addColorStop(0.56, 'rgba(255, 188, 104, 0.09)');
    grade.addColorStop(1, 'rgba(6, 13, 20, 0.36)');
    dragCtx.save();
    dragCtx.globalCompositeOperation = 'soft-light';
    dragCtx.fillStyle = grade;
    dragCtx.fillRect(0, 0, width, height);

    const vignette = dragCtx.createRadialGradient(width * 0.5, height * 0.54, width * 0.18, width * 0.5, height * 0.54, width * 0.72);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(0, 0, 0, ${0.46 + speedFactor * 0.16})`);
    dragCtx.globalCompositeOperation = 'multiply';
    dragCtx.fillStyle = vignette;
    dragCtx.fillRect(0, 0, width, height);
    dragCtx.restore();
  }

  function drawDragGrandstand(side, width, height, horizon, flow) {
    if (!dragCtx) return;
    const farX = side < 0 ? width * 0.26 : width * 0.74;
    const nearX = side < 0 ? 0 : width;
    const innerNear = side < 0 ? width * 0.16 : width * 0.84;
    const yTop = horizon - 14;
    const yBottom = height * 0.61;

    dragCtx.save();

    const grad = dragCtx.createLinearGradient(0, yTop, 0, yBottom);
    grad.addColorStop(0, '#5f738f');
    grad.addColorStop(0.55, '#3d4f67');
    grad.addColorStop(1, '#1f2d3e');
    dragCtx.fillStyle = grad;
    dragCtx.beginPath();
    dragCtx.moveTo(nearX, yBottom + 34);
    dragCtx.lineTo(innerNear, yBottom);
    dragCtx.lineTo(farX, yTop);
    dragCtx.lineTo(side < 0 ? 0 : width, yTop - 10);
    dragCtx.closePath();
    dragCtx.fill();

    const rowCount = 20;
    for (let i = 0; i < rowCount; i += 1) {
      const t = i / rowCount;
      const y = lerp(yTop + 8, yBottom - 8, t);
      const x1 = lerp(farX, innerNear, t);
      const x2 = lerp(side < 0 ? 0 : width, nearX, t);
      dragCtx.strokeStyle = `rgba(18, 25, 36, ${0.45 - t * 0.16})`;
      dragCtx.lineWidth = 1;
      dragCtx.beginPath();
      dragCtx.moveTo(x1, y);
      dragCtx.lineTo(x2, y);
      dragCtx.stroke();
    }

    const crowdRows = dragState && dragState.qualityTier === 'high' ? 12 : 8;
    const peoplePerRow = dragState && dragState.qualityTier === 'high' ? 64 : 42;
    for (let r = 0; r < crowdRows; r += 1) {
      const t = r / (crowdRows - 1 || 1);
      const y = lerp(yTop + 14, yBottom - 14, t);
      const xStart = lerp(farX + 8, innerNear + 8, t);
      const xEnd = lerp(side < 0 ? 6 : width - 6, nearX - 6, t);
      for (let c = 0; c < peoplePerRow; c += 1) {
        const n = ((c * 47 + r * 131) % 997) / 997;
        const x = lerp(xStart, xEnd, c / (peoplePerRow - 1 || 1));
        const hue = 18 + ((c * 19 + r * 11) % 180);
        dragCtx.fillStyle = `hsla(${hue}, 36%, ${52 + n * 20}%, ${0.82 - t * 0.2})`;
        dragCtx.fillRect(x, y, 2, 2);
      }
    }

    for (let i = 0; i < 7; i += 1) {
      const t = i / 6;
      const x = lerp(farX + (side < 0 ? -12 : 12), side < 0 ? width * 0.04 : width * 0.96, t);
      const y = lerp(yTop - 4, yTop + 22, t * 0.4 + 0.1);
      const sway = Math.sin((flow * 0.012) + i * 0.6) * 3;
      dragCtx.strokeStyle = 'rgba(250, 254, 255, 0.85)';
      dragCtx.lineWidth = 1.2;
      dragCtx.beginPath();
      dragCtx.moveTo(x, y + 26);
      dragCtx.lineTo(x, y - 10);
      dragCtx.stroke();
      dragCtx.fillStyle = 'rgba(240, 247, 255, 0.9)';
      dragCtx.beginPath();
      dragCtx.moveTo(x, y - 10);
      dragCtx.lineTo(x + sway + (side < 0 ? 12 : -12), y - 6);
      dragCtx.lineTo(x, y - 2);
      dragCtx.closePath();
      dragCtx.fill();
    }

    dragCtx.restore();
  }

  function drawDragRoadBackdrop(width, height, flow, speedFactor, now, cameraBias = 0) {
    const horizon = height * 0.34;
    const skylineImage = getDragVisualAsset('track_skyline_hd');
    const standImage = getDragVisualAsset('grandstand_strip_hd');
    const sunPhase = (now || 0) * 0.00011;
    const sunX = width * (0.52 + Math.sin(sunPhase) * 0.24);
    const sunY = horizon - 58 + Math.cos(sunPhase * 0.84) * 14;

    if (skylineImage) {
      dragCtx.drawImage(skylineImage, 0, 0, width, height);
      const skyTint = dragCtx.createLinearGradient(0, 0, 0, height);
      skyTint.addColorStop(0, 'rgba(154, 194, 242, 0.16)');
      skyTint.addColorStop(0.5, 'rgba(220, 236, 255, 0.08)');
      skyTint.addColorStop(1, 'rgba(15, 24, 38, 0.32)');
      dragCtx.fillStyle = skyTint;
      dragCtx.fillRect(0, 0, width, height);
    } else {
      const sky = dragCtx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#8db7e6');
      sky.addColorStop(0.4, '#d5e6fa');
      sky.addColorStop(0.66, '#91b4da');
      sky.addColorStop(1, '#2b3d57');
      dragCtx.fillStyle = sky;
      dragCtx.fillRect(0, 0, width, height);
    }

    const sun = dragCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * 0.24);
    sun.addColorStop(0, 'rgba(255, 251, 223, 0.9)');
    sun.addColorStop(0.32, 'rgba(255, 235, 179, 0.42)');
    sun.addColorStop(1, 'rgba(255, 235, 179, 0)');
    dragCtx.fillStyle = sun;
    dragCtx.fillRect(0, 0, width, horizon + 40);

    const rayCount = dragState && dragState.qualityTier === 'high' ? 9 : 6;
    dragCtx.save();
    dragCtx.globalCompositeOperation = 'screen';
    for (let i = 0; i < rayCount; i += 1) {
      const rayT = i / rayCount;
      const swing = Math.sin((now || 0) * 0.0004 + i * 0.66) * width * 0.04;
      const rayX = sunX + (rayT - 0.5) * width * 0.52 + swing;
      const grad = dragCtx.createLinearGradient(rayX, sunY, rayX, horizon + height * 0.42);
      grad.addColorStop(0, 'rgba(255, 244, 214, 0.24)');
      grad.addColorStop(1, 'rgba(255, 244, 214, 0)');
      dragCtx.strokeStyle = grad;
      dragCtx.lineWidth = 18 + rayT * 20;
      dragCtx.beginPath();
      dragCtx.moveTo(rayX, sunY);
      dragCtx.lineTo(width * (0.18 + rayT * 0.64), horizon + height * 0.42);
      dragCtx.stroke();
    }
    dragCtx.restore();

    for (let i = 0; i < 5; i += 1) {
      const cx = width * (0.16 + i * 0.19);
      const cy = horizon * (0.33 + (i % 2) * 0.1);
      const cloud = dragCtx.createRadialGradient(cx, cy, 8, cx, cy, 60 + i * 8);
      cloud.addColorStop(0, 'rgba(252, 253, 255, 0.42)');
      cloud.addColorStop(1, 'rgba(252, 253, 255, 0)');
      dragCtx.fillStyle = cloud;
      dragCtx.fillRect(cx - 80, cy - 40, 160, 80);
    }

    drawDragGrandstand(-1, width, height, horizon, flow);
    drawDragGrandstand(1, width, height, horizon, flow);
    if (standImage) {
      const standHeight = height * 0.32;
      dragCtx.save();
      dragCtx.globalAlpha = 0.7;
      dragCtx.drawImage(standImage, 0, horizon - standHeight * 0.2, width * 0.48, standHeight);
      dragCtx.translate(width, 0);
      dragCtx.scale(-1, 1);
      dragCtx.drawImage(standImage, 0, horizon - standHeight * 0.2, width * 0.48, standHeight);
      dragCtx.restore();
    }

    const roadTopY = horizon + 14;
    const roadBottomY = height * 0.88;
    const roadTopWidth = width * 0.125;
    const roadBottomWidth = width * 1.04;
    const roadCenterX = width * 0.5 - cameraBias * width * 0.09;

    const topLeft = roadCenterX - roadTopWidth / 2;
    const topRight = roadCenterX + roadTopWidth / 2;
    const bottomLeft = roadCenterX - roadBottomWidth / 2;
    const bottomRight = roadCenterX + roadBottomWidth / 2;
    const lightVectorX = (width * 0.5 - sunX) / width;
    const lightVectorY = (roadBottomY - sunY) / Math.max(1, height);

    const poleCount = dragState && dragState.qualityTier === 'high' ? 12 : 8;
    for (let i = 0; i < poleCount; i += 1) {
      const t = i / (poleCount - 1 || 1);
      const y = lerp(roadTopY + 26, roadBottomY - 120, t);
      const laneT = clamp((y - roadTopY) / (roadBottomY - roadTopY), 0, 1);
      const leftX = lerp(topLeft - 58, bottomLeft - 120, laneT);
      const rightX = lerp(topRight + 58, bottomRight + 120, laneT);
      const poleHeight = lerp(24, 112, laneT);
      const glowRadius = 4 + laneT * 9;

      [leftX, rightX].forEach((poleX) => {
        const shadowLen = poleHeight * (0.9 + laneT * 0.8);
        dragCtx.strokeStyle = `rgba(0, 0, 0, ${0.16 + laneT * 0.12})`;
        dragCtx.lineWidth = 2 + laneT * 2.2;
        dragCtx.beginPath();
        dragCtx.moveTo(poleX, y);
        dragCtx.lineTo(
          poleX + lightVectorX * shadowLen * 2.6,
          y + lightVectorY * shadowLen * 2.2
        );
        dragCtx.stroke();

        dragCtx.strokeStyle = '#5f6774';
        dragCtx.lineWidth = 2 + laneT * 2.6;
        dragCtx.beginPath();
        dragCtx.moveTo(poleX, y);
        dragCtx.lineTo(poleX, y - poleHeight);
        dragCtx.stroke();

        const glow = dragCtx.createRadialGradient(poleX, y - poleHeight, 0, poleX, y - poleHeight, glowRadius * 3.2);
        glow.addColorStop(0, `rgba(255, 236, 184, ${0.58 - laneT * 0.24})`);
        glow.addColorStop(1, 'rgba(255, 236, 184, 0)');
        dragCtx.fillStyle = glow;
        dragCtx.fillRect(poleX - glowRadius * 3.2, y - poleHeight - glowRadius * 3.2, glowRadius * 6.4, glowRadius * 6.4);
      });
    }

    dragCtx.fillStyle = '#3e7cb9';
    dragCtx.beginPath();
    dragCtx.moveTo(topLeft - 20, roadTopY + 6);
    dragCtx.lineTo(topLeft, roadTopY + 6);
    dragCtx.lineTo(bottomLeft, roadBottomY);
    dragCtx.lineTo(bottomLeft - width * 0.1, roadBottomY);
    dragCtx.closePath();
    dragCtx.fill();

    dragCtx.beginPath();
    dragCtx.moveTo(topRight + 20, roadTopY + 6);
    dragCtx.lineTo(topRight, roadTopY + 6);
    dragCtx.lineTo(bottomRight, roadBottomY);
    dragCtx.lineTo(bottomRight + width * 0.1, roadBottomY);
    dragCtx.closePath();
    dragCtx.fill();

    const wallGrad = dragCtx.createLinearGradient(0, roadTopY, 0, roadBottomY);
    wallGrad.addColorStop(0, '#e8edf4');
    wallGrad.addColorStop(1, '#bac7d7');
    dragCtx.fillStyle = wallGrad;

    dragCtx.beginPath();
    dragCtx.moveTo(topLeft - 6, roadTopY + 3);
    dragCtx.lineTo(topLeft, roadTopY + 3);
    dragCtx.lineTo(bottomLeft + 24, roadBottomY - 2);
    dragCtx.lineTo(bottomLeft - 12, roadBottomY - 2);
    dragCtx.closePath();
    dragCtx.fill();

    dragCtx.beginPath();
    dragCtx.moveTo(topRight + 6, roadTopY + 3);
    dragCtx.lineTo(topRight, roadTopY + 3);
    dragCtx.lineTo(bottomRight - 24, roadBottomY - 2);
    dragCtx.lineTo(bottomRight + 12, roadBottomY - 2);
    dragCtx.closePath();
    dragCtx.fill();

    const sponsorPanels = ['LUCAS OIL', 'DENSO', 'BG', 'MOPAR', 'MSD', 'BULLDOG'];
    for (let i = 0; i < sponsorPanels.length; i += 1) {
      const t = i / sponsorPanels.length;
      const y = lerp(roadTopY + 26, roadBottomY - 64, t);
      const leftX = lerp(topLeft - 1, bottomLeft + 7, t);
      const rightX = lerp(topRight + 1, bottomRight - 7, t);
      const panelW = 46 + t * 38;
      const panelH = 14 + t * 10;

      dragCtx.fillStyle = i % 2 === 0 ? 'rgba(226, 76, 66, 0.82)' : 'rgba(37, 102, 173, 0.82)';
      dragCtx.fillRect(leftX - panelW - 4, y, panelW, panelH);
      dragCtx.fillStyle = 'rgba(250, 251, 255, 0.92)';
      dragCtx.font = `${Math.max(7, Math.floor(7 + t * 4))}px "Orbitron", sans-serif`;
      dragCtx.textAlign = 'center';
      dragCtx.fillText(sponsorPanels[i], leftX - panelW / 2 - 4, y + panelH * 0.7);

      dragCtx.fillStyle = i % 2 === 0 ? 'rgba(37, 102, 173, 0.82)' : 'rgba(226, 76, 66, 0.82)';
      dragCtx.fillRect(rightX + 4, y, panelW, panelH);
      dragCtx.fillStyle = 'rgba(250, 251, 255, 0.92)';
      dragCtx.fillText(sponsorPanels[(i + 2) % sponsorPanels.length], rightX + panelW / 2 + 4, y + panelH * 0.7);
    }

    dragCtx.fillStyle = '#5f6f86';
    dragCtx.fillRect(0, roadTopY - 2, width, 2);

    dragCtx.fillStyle = '#4d5a6b';
    dragCtx.beginPath();
    dragCtx.moveTo(topLeft, roadTopY);
    dragCtx.lineTo(topRight, roadTopY);
    dragCtx.lineTo(bottomRight, roadBottomY);
    dragCtx.lineTo(bottomLeft, roadBottomY);
    dragCtx.closePath();
    dragCtx.fill();

    const asphalt = dragCtx.createLinearGradient(0, roadTopY, 0, roadBottomY);
    asphalt.addColorStop(0, 'rgba(171, 185, 205, 0.44)');
    asphalt.addColorStop(0.4, 'rgba(87, 98, 117, 0.48)');
    asphalt.addColorStop(1, 'rgba(38, 44, 55, 0.56)');
    dragCtx.fillStyle = asphalt;
    dragCtx.fill();
    const asphaltPattern = getDragAsphaltPattern();
    if (asphaltPattern) {
      dragCtx.save();
      dragCtx.globalAlpha = 0.28;
      dragCtx.fillStyle = asphaltPattern;
      dragCtx.fill();
      dragCtx.restore();
    }

    const stripeOffset = (flow * (4 + speedFactor * 2.4)) % 78;
    for (let i = 0; i < 78; i += 1) {
      const y = roadBottomY - ((i * 58 + stripeOffset) % (roadBottomY - roadTopY));
      const t = clamp((y - roadTopY) / (roadBottomY - roadTopY), 0, 1);
      const left = lerp(topLeft, bottomLeft, t);
      const right = lerp(topRight, bottomRight, t);
      const center = (left + right) / 2;
      const stripeW = (right - left) * 0.022;
      dragCtx.fillStyle = `rgba(248, 250, 255, ${0.22 + t * 0.3})`;
      dragCtx.fillRect(center - stripeW / 2, y, stripeW, 5 + t * 9);
    }

    const grooveOffset = (flow * 5.8) % 32;
    for (let i = 0; i < 160; i += 1) {
      const y = roadBottomY - ((i * 20 + grooveOffset) % (roadBottomY - roadTopY));
      const t = clamp((y - roadTopY) / (roadBottomY - roadTopY), 0, 1);
      const left = lerp(topLeft, bottomLeft, t);
      const right = lerp(topRight, bottomRight, t);
      const laneW = right - left;
      const markW = Math.max(1, laneW * 0.007);
      dragCtx.fillStyle = `rgba(16, 18, 24, ${0.08 + t * 0.24})`;
      dragCtx.fillRect(left + laneW * 0.34, y, markW, 7 + t * 6);
      dragCtx.fillRect(left + laneW * 0.66, y, markW, 7 + t * 6);
    }

    if (dragState && dragState.qualityTier !== 'low') {
      const streaks = dragState.qualityTier === 'high' ? 80 : 48;
      const flowBoost = flow * 0.26 + speedFactor * 260;
      for (let i = 0; i < streaks; i += 1) {
        const y = roadBottomY - ((i * 22 + flowBoost) % (roadBottomY - roadTopY));
        const t = clamp((y - roadTopY) / (roadBottomY - roadTopY), 0, 1);
        const left = lerp(topLeft, bottomLeft, t);
        const right = lerp(topRight, bottomRight, t);
        const x = lerp(left + 12, right - 12, (i * 0.29) % 1);
        dragCtx.fillStyle = `rgba(214, 227, 247, ${0.03 + t * 0.11})`;
        dragCtx.fillRect(x, y, 1 + t * 1.8, 4 + t * 8);
      }
    }

    const specularLine = dragCtx.createLinearGradient(roadCenterX, roadTopY, roadCenterX, roadBottomY);
    specularLine.addColorStop(0, 'rgba(255, 252, 238, 0.28)');
    specularLine.addColorStop(0.45, `rgba(255, 244, 208, ${0.07 + speedFactor * 0.05})`);
    specularLine.addColorStop(1, 'rgba(255, 236, 194, 0)');
    dragCtx.strokeStyle = specularLine;
    dragCtx.lineWidth = 6 + speedFactor * 4;
    dragCtx.beginPath();
    dragCtx.moveTo(roadCenterX, roadTopY + 6);
    dragCtx.lineTo(roadCenterX, roadBottomY);
    dragCtx.stroke();

    const shadowSwing = Math.sin((now || 0) * 0.00035) * 0.04;
    dragCtx.fillStyle = `rgba(0, 0, 0, ${0.16 + speedFactor * 0.08})`;
    dragCtx.beginPath();
    dragCtx.moveTo(topLeft - 22, roadTopY);
    dragCtx.lineTo(topLeft + roadTopWidth * (0.25 + shadowSwing), roadTopY);
    dragCtx.lineTo(bottomLeft + roadBottomWidth * 0.38, roadBottomY);
    dragCtx.lineTo(bottomLeft - 28, roadBottomY);
    dragCtx.closePath();
    dragCtx.fill();

    dragCtx.beginPath();
    dragCtx.moveTo(topRight + 22, roadTopY);
    dragCtx.lineTo(topRight - roadTopWidth * (0.25 + shadowSwing), roadTopY);
    dragCtx.lineTo(bottomRight - roadBottomWidth * 0.38, roadBottomY);
    dragCtx.lineTo(bottomRight + 28, roadBottomY);
    dragCtx.closePath();
    dragCtx.fill();

    return {
      horizon,
      roadTopY,
      roadBottomY,
      roadTopWidth,
      roadBottomWidth,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      sunX,
      sunY
    };
  }

  function drawDragTreeTower(x, y, scale, countdownPhase) {
    if (!dragCtx) return;
    const poleW = 8 * scale;
    const poleH = 120 * scale;
    dragCtx.save();
    dragCtx.translate(x, y);

    dragCtx.fillStyle = '#394556';
    dragCtx.fillRect(-poleW / 2, 0, poleW, poleH);

    const lampColors = ['#a8b8d0', '#a8b8d0', '#ffc04c', '#ffc04c', '#ffc04c', '#4de080'];
    for (let i = 0; i < 6; i += 1) {
      const ly = 10 * scale + i * 18 * scale;
      const active = countdownPhase === 'countdown' && i >= 2 && i <= 4
        ? dragState.phaseMs >= (i - 1) * 700
        : countdownPhase === 'race' && i === 5;
      const c = lampColors[i];
      dragCtx.fillStyle = active ? c : 'rgba(38, 44, 54, 0.9)';
      dragCtx.beginPath();
      dragCtx.arc(-10 * scale, ly, 5.3 * scale, 0, Math.PI * 2);
      dragCtx.arc(10 * scale, ly, 5.3 * scale, 0, Math.PI * 2);
      dragCtx.fill();
      if (active) {
        dragCtx.fillStyle = c.replace(')', ', 0.28)').replace('rgb', 'rgba');
      }
    }

    dragCtx.restore();
  }

  function drawDragCockpitOverlay(width, height, now, player) {
    const panelTop = height * 0.67;
    const pulse = 0.5 + 0.5 * Math.sin(now / 190);

    dragCtx.save();

    const topFrame = dragCtx.createLinearGradient(0, 0, 0, height * 0.12);
    topFrame.addColorStop(0, '#161a22');
    topFrame.addColorStop(1, '#0b1018');
    dragCtx.fillStyle = topFrame;
    dragCtx.fillRect(0, 0, width, height * 0.105);

    dragCtx.strokeStyle = 'rgba(120, 132, 152, 0.58)';
    dragCtx.lineWidth = 2;
    dragCtx.beginPath();
    dragCtx.moveTo(0, height * 0.105);
    for (let i = 0; i <= 14; i += 1) {
      const x = (i / 14) * width;
      const sag = Math.sin(i * 0.9 + now * 0.0014) * 2.8;
      dragCtx.lineTo(x, height * 0.11 + sag);
    }
    dragCtx.stroke();

    for (let i = 0; i < 10; i += 1) {
      const x = width * (0.06 + i * 0.098);
      const y = height * 0.06 + Math.sin(i * 0.7) * 1.5;
      dragCtx.fillStyle = '#d7deec';
      dragCtx.beginPath();
      dragCtx.arc(x, y, 5, 0, Math.PI * 2);
      dragCtx.fill();
      dragCtx.fillStyle = '#7f8ba2';
      dragCtx.beginPath();
      dragCtx.arc(x, y, 2.2, 0, Math.PI * 2);
      dragCtx.fill();
    }

    dragCtx.fillStyle = 'rgba(9, 14, 24, 0.9)';
    dragCtx.beginPath();
    dragCtx.moveTo(0, panelTop + 16);
    dragCtx.quadraticCurveTo(width * 0.22, panelTop - 18, width * 0.5, panelTop + 2);
    dragCtx.quadraticCurveTo(width * 0.78, panelTop - 18, width, panelTop + 16);
    dragCtx.lineTo(width, height);
    dragCtx.lineTo(0, height);
    dragCtx.closePath();
    dragCtx.fill();

    const rail = dragCtx.createLinearGradient(0, panelTop - 56, 0, height);
    rail.addColorStop(0, '#525f73');
    rail.addColorStop(1, '#1b2331');
    dragCtx.strokeStyle = rail;
    dragCtx.lineWidth = 14;
    dragCtx.beginPath();
    dragCtx.moveTo(width * 0.26, height * 0.98);
    dragCtx.lineTo(width * 0.39, panelTop - 40);
    dragCtx.moveTo(width * 0.74, height * 0.98);
    dragCtx.lineTo(width * 0.61, panelTop - 40);
    dragCtx.stroke();

    const hood = dragCtx.createLinearGradient(width * 0.5, panelTop - 42, width * 0.5, height * 0.88);
    hood.addColorStop(0, '#d7e06c');
    hood.addColorStop(0.5, '#909a3b');
    hood.addColorStop(1, '#2d351a');
    dragCtx.fillStyle = hood;
    dragCtx.beginPath();
    dragCtx.moveTo(width * 0.47, panelTop - 52);
    dragCtx.lineTo(width * 0.53, panelTop - 52);
    dragCtx.lineTo(width * 0.58, panelTop + 12);
    dragCtx.lineTo(width * 0.42, panelTop + 12);
    dragCtx.closePath();
    dragCtx.fill();

    dragCtx.fillStyle = '#202a39';
    dragCtx.fillRect(width * 0.34, panelTop - 10, width * 0.32, height * 0.15);
    dragCtx.strokeStyle = 'rgba(195, 206, 224, 0.42)';
    dragCtx.strokeRect(width * 0.34, panelTop - 10, width * 0.32, height * 0.15);

    dragCtx.fillStyle = '#e7ebf4';
    dragCtx.font = `700 ${Math.max(15, Math.floor(width * 0.022))}px "Orbitron", sans-serif`;
    dragCtx.textAlign = 'center';
    dragCtx.fillText(`${Math.round(player.speed * 2.237)} MPH`, width * 0.5, panelTop + 25);
    dragCtx.fillStyle = '#aeb9cc';
    dragCtx.font = `700 ${Math.max(14, Math.floor(width * 0.02))}px "Orbitron", sans-serif`;
    dragCtx.fillText(`RPM ${Math.round(player.rpm)}`, width * 0.5, panelTop + 50);
    dragCtx.fillStyle = '#ffb25c';
    dragCtx.font = `900 ${Math.max(28, Math.floor(width * 0.05))}px "Orbitron", sans-serif`;
    dragCtx.fillText(`G${player.gear}`, width * 0.5, panelTop + 88);

    const handColor = '#b5db63';
    const handShade = '#7e9d33';
    dragCtx.fillStyle = handColor;
    dragCtx.beginPath();
    dragCtx.moveTo(width * 0.27, height * 0.93);
    dragCtx.lineTo(width * 0.33, height * 0.89);
    dragCtx.lineTo(width * 0.35, height * 0.95);
    dragCtx.lineTo(width * 0.31, height * 0.99);
    dragCtx.closePath();
    dragCtx.fill();
    dragCtx.fillStyle = handShade;
    dragCtx.fillRect(width * 0.31, height * 0.93, width * 0.03, height * 0.02);

    dragCtx.fillStyle = handColor;
    dragCtx.beginPath();
    dragCtx.moveTo(width * 0.73, height * 0.93);
    dragCtx.lineTo(width * 0.67, height * 0.89);
    dragCtx.lineTo(width * 0.65, height * 0.95);
    dragCtx.lineTo(width * 0.69, height * 0.99);
    dragCtx.closePath();
    dragCtx.fill();
    dragCtx.fillStyle = handShade;
    dragCtx.fillRect(width * 0.66, height * 0.93, width * 0.03, height * 0.02);

    const glow = dragCtx.createRadialGradient(width * 0.5, panelTop + 70, 30, width * 0.5, panelTop + 70, width * 0.3);
    glow.addColorStop(0, `rgba(255, 127, 64, ${0.16 + pulse * 0.13})`);
    glow.addColorStop(1, 'rgba(255, 127, 64, 0)');
    dragCtx.fillStyle = glow;
    dragCtx.fillRect(width * 0.18, panelTop - 30, width * 0.64, height - panelTop + 40);

    const shadowDrift = Math.sin(now * 0.0009) * 0.5 + 0.5;
    const cockpitShadow = dragCtx.createLinearGradient(width * shadowDrift, panelTop - 80, width * (1 - shadowDrift), height);
    cockpitShadow.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
    cockpitShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    cockpitShadow.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    dragCtx.fillStyle = cockpitShadow;
    dragCtx.fillRect(0, panelTop - 90, width, height - panelTop + 110);

    const dashImage = getDragVisualAsset('dashboard_cluster_hd');
    if (dashImage) {
      dragCtx.globalAlpha = 0.92;
      dragCtx.drawImage(dashImage, width * 0.29, panelTop - 34, width * 0.42, height * 0.2);
      dragCtx.globalAlpha = 1;
    }

    const cockpitImage = getDragVisualAsset('cockpit_frame_hd');
    if (cockpitImage) {
      dragCtx.globalAlpha = 0.94;
      dragCtx.drawImage(cockpitImage, 0, 0, width, height);
      dragCtx.globalAlpha = 1;
    }

    dragCtx.restore();
  }

  function drawDragTachometer(width, height) {
    if (!dragState) return;
    const player = dragState.player;
    const centerX = width * 0.86;
    const centerY = height * 0.82;
    const radius = Math.min(width * 0.12, height * 0.17);
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.24;

    dragCtx.save();

    dragCtx.fillStyle = 'rgba(8, 10, 16, 0.95)';
    dragCtx.beginPath();
    dragCtx.arc(centerX, centerY, radius + 18, 0, Math.PI * 2);
    dragCtx.fill();

    dragCtx.lineWidth = 11;
    dragCtx.strokeStyle = 'rgba(190, 201, 221, 0.78)';
    dragCtx.beginPath();
    dragCtx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    dragCtx.stroke();

    const mph = mpsToMph(player.speed);
    const mphRatio = clamp(mph / mpsToMph(DRAG_MAX_SPEED_MPS), 0, 1);
    const needleAngle = startAngle + (endAngle - startAngle) * mphRatio;

    for (let i = 0; i <= 11; i += 1) {
      const t = i / 11;
      const angle = startAngle + (endAngle - startAngle) * t;
      const inner = radius - 9;
      const outer = radius + (i % 2 === 0 ? 8 : 4);
      dragCtx.strokeStyle = i >= 9 ? '#ff5f5f' : '#dce5f2';
      dragCtx.lineWidth = i % 2 === 0 ? 2 : 1;
      dragCtx.beginPath();
      dragCtx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      dragCtx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      dragCtx.stroke();
    }

    const zoneStart = clamp(DRAG_SHIFT_PERFECT_MIN_MPH / mpsToMph(DRAG_MAX_SPEED_MPS), 0, 1);
    const zoneEnd = clamp(DRAG_SHIFT_PERFECT_MAX_MPH / mpsToMph(DRAG_MAX_SPEED_MPS), 0, 1);
    const zoneA = startAngle + (endAngle - startAngle) * zoneStart;
    const zoneB = startAngle + (endAngle - startAngle) * zoneEnd;

    dragCtx.lineWidth = 7;
    dragCtx.strokeStyle = '#84ffb8';
    dragCtx.beginPath();
    dragCtx.arc(centerX, centerY, radius + 11, zoneA, zoneB, false);
    dragCtx.stroke();

    const inWindow = !player.hasShifted
      && player.shiftLockRemainingMs <= 0
      && mph >= DRAG_SHIFT_PERFECT_MIN_MPH
      && mph <= DRAG_SHIFT_PERFECT_MAX_MPH;
    dragCtx.strokeStyle = inWindow ? '#7affb0' : player.shiftLockRemainingMs > 0 ? '#ffd46f' : '#ff6f45';
    dragCtx.lineWidth = 4;
    dragCtx.beginPath();
    dragCtx.moveTo(centerX, centerY);
    dragCtx.lineTo(centerX + Math.cos(needleAngle) * (radius - 12), centerY + Math.sin(needleAngle) * (radius - 12));
    dragCtx.stroke();

    dragCtx.fillStyle = inWindow ? '#7affb0' : '#ff8c5e';
    dragCtx.beginPath();
    dragCtx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    dragCtx.fill();

    dragCtx.fillStyle = '#f6f8ff';
    dragCtx.font = `900 ${Math.max(17, Math.floor(width * 0.03))}px "Orbitron", sans-serif`;
    dragCtx.textAlign = 'center';
    dragCtx.fillText(`${Math.round(mph)}`, centerX, centerY + 9);
    dragCtx.fillStyle = '#bcc8de';
    dragCtx.font = `700 ${Math.max(10, Math.floor(width * 0.015))}px "Orbitron", sans-serif`;
    dragCtx.fillText('MPH', centerX, centerY + 26);

    dragCtx.restore();
  }

  function drawDragScene(now) {
    if (!dragState || !dragCtx || !dragCanvas) return;
    resizeDragCanvas();
    const width = dragCanvas.clientWidth;
    const height = dragCanvas.clientHeight;
    const shake = dragState.cameraShakeMs > 0 ? Math.sin(now / 24) * (dragState.cameraShakeMs / 82) : 0;
    const player = dragState.player;
    const speedFactor = clamp(player.speed / 130, 0, 1.25);
    const flow = player.distanceM * 9.8;

    dragCtx.clearRect(0, 0, width, height);
    dragCtx.save();
    dragCtx.translate(shake, 0);

    const road = drawDragRoadBackdrop(width, height, flow, speedFactor, now, DRAG_PLAYER_LANE_OFFSET);
    const light = {
      x: road.sunX || width * 0.5,
      y: road.sunY || road.horizon - 60
    };
    drawDragLensFlare(width, height, light, speedFactor);

    const countdownPhase = dragState.phase === 'countdown' ? 'countdown' : dragState.phase === 'race' ? 'race' : 'idle';
    drawDragTreeTower(width * 0.12, road.horizon - 12, clamp(width / 1200, 0.72, 1.2), countdownPhase);

    dragState.npcs.forEach((npc) => {
      const diff = npc.distanceM - player.distanceM;
      if (diff < -20 || diff > 260) return;
      const closeness = clamp(1 - diff / 260, 0, 1);
      const y = lerp(road.roadTopY + 10, height * 0.72, closeness);
      const t = clamp((y - road.roadTopY) / (road.roadBottomY - road.roadTopY), 0, 1);
      const roadWidth = lerp(road.roadTopWidth, road.roadBottomWidth, t);
      const x = width / 2 + npc.laneOffset * roadWidth * DRAG_LANE_RENDER_FACTOR;
      const scale = lerp(0.18, 1.0, closeness);
      drawDragOpponentCar(x, y, scale, npc.color, light);
    });

    const finishDiff = dragState.trackDistanceM - player.distanceM;
    if (finishDiff > 0 && finishDiff < 220) {
      const closeness = clamp(1 - finishDiff / 220, 0, 1);
      const y = lerp(road.roadTopY + 8, height * 0.59, closeness);
      const t = clamp((y - road.roadTopY) / (road.roadBottomY - road.roadTopY), 0, 1);
      const left = lerp(road.topLeft, road.bottomLeft, t);
      const right = lerp(road.topRight, road.bottomRight, t);
      const stripeH = 8 + closeness * 18;
      const cells = 18;
      const cellW = (right - left) / cells;
      for (let i = 0; i < cells; i += 1) {
        dragCtx.fillStyle = i % 2 === 0 ? '#f5f7fc' : '#171d27';
        dragCtx.fillRect(left + i * cellW, y, cellW + 1, stripeH);
      }
    }

    drawDragExhaustFlameShockwave(width, height, now, player, speedFactor);
    drawDragAtmosphericFog(width, height, road, speedFactor);

    if (dragState.particles && dragState.particles.length > 0) {
      dragState.particles.forEach((particle) => {
        const life = clamp(particle.lifeMs / particle.maxLifeMs, 0, 1);
        dragCtx.globalAlpha = life;
        dragCtx.fillStyle = particle.color;
        if (particle.glow) {
          dragCtx.shadowBlur = particle.glow * life;
          dragCtx.shadowColor = particle.color;
        }
        dragCtx.beginPath();
        dragCtx.arc(particle.x, particle.y, Math.max(0.5, particle.size * life), 0, Math.PI * 2);
        dragCtx.fill();
        dragCtx.shadowBlur = 0;
      });
      dragCtx.globalAlpha = 1;
    }

    if (speedFactor > 0.35) {
      const blurStrength = clamp((speedFactor - 0.3) * 0.45, 0, 0.32);
      const streaks = dragState.qualityTier === 'high' ? 40 : dragState.qualityTier === 'medium' ? 24 : 12;
      dragCtx.save();
      dragCtx.globalAlpha = blurStrength;
      for (let i = 0; i < streaks; i += 1) {
        const y = (i / streaks) * height;
        const sweep = ((flow * 0.18) + i * 44) % width;
        dragCtx.strokeStyle = i % 2 === 0 ? 'rgba(255, 244, 226, 0.18)' : 'rgba(145, 197, 255, 0.14)';
        dragCtx.lineWidth = 1 + (i % 3 === 0 ? 0.7 : 0);
        dragCtx.beginPath();
        dragCtx.moveTo(-24 + sweep, y);
        dragCtx.lineTo(80 + sweep + speedFactor * 18, y);
        dragCtx.stroke();
      }
      dragCtx.restore();
    }

    drawDragCockpitOverlay(width, height, now, player);
    drawDragTachometer(width, height);

    const rank = getDragRankFromDistances(player, dragState.npcs);
    const secs = dragState.phase === 'race' ? Math.max(0, (DRAG_RACE_MS - dragState.phaseMs) / 1000) : 0;

    dragCtx.fillStyle = 'rgba(14, 16, 23, 0.62)';
    dragCtx.fillRect(12, 14, 250, 58);
    dragCtx.fillRect(width - 250 - 12, 14, 250, 58);

    dragCtx.fillStyle = '#f0f5ff';
    dragCtx.font = `700 ${Math.max(14, Math.floor(width * 0.018))}px "Orbitron", sans-serif`;
    dragCtx.textAlign = 'left';
    dragCtx.fillText(`POSITION ${rank}/${dragState.npcs.length + 1}`, 24, 38);
    dragCtx.fillText(`DIST ${Math.round(player.distanceM)}m`, 24, 62);
    dragCtx.fillStyle = 'rgba(245, 232, 198, 0.88)';
    dragCtx.font = `700 ${Math.max(10, Math.floor(width * 0.013))}px "Orbitron", sans-serif`;
    dragCtx.fillText('PLAYER LANE: RIGHT', 24, 82);

    dragCtx.textAlign = 'right';
    dragCtx.fillStyle = '#f0f5ff';
    dragCtx.font = `700 ${Math.max(14, Math.floor(width * 0.018))}px "Orbitron", sans-serif`;
    dragCtx.fillText(`${secs.toFixed(2)} SECONDS LEFT`, width - 24, 38);
    dragCtx.fillText(`POINTS ${Math.round(player.points)}/${DRAG_MAX_POINTS}`, width - 24, 62);
    dragCtx.fillStyle = 'rgba(245, 232, 198, 0.88)';
    dragCtx.font = `700 ${Math.max(10, Math.floor(width * 0.013))}px "Orbitron", sans-serif`;
    dragCtx.fillText('OPPONENT LANE: LEFT', width - 24, 82);

    const promptActive = dragState.phase === 'race' && player.launched && !player.hasShifted && player.gear < DRAG_GEAR_RATIOS.length;
    if (promptActive) {
      const mph = mpsToMph(player.speed);
      let shiftText = 'BUILD SPEED';
      let shiftHot = false;
      if (player.shiftLockRemainingMs > 0) {
        shiftText = `SHIFT LOCKED ${Math.max(0.1, player.shiftLockRemainingMs / 1000).toFixed(1)}s`;
      } else if (mph >= DRAG_SHIFT_PERFECT_MIN_MPH && mph <= DRAG_SHIFT_PERFECT_MAX_MPH) {
        shiftText = 'SHIFT NOW';
        shiftHot = true;
      } else if (mph > DRAG_SHIFT_GOOD_MAX_MPH) {
        shiftText = 'LATE SHIFT';
      } else {
        shiftText = `TARGET ${DRAG_SHIFT_TARGET_MPH} MPH`;
      }
      dragCtx.fillStyle = shiftHot ? (Math.floor(now / 120) % 2 === 0 ? '#94ffbe' : '#ffffff') : 'rgba(248, 238, 214, 0.95)';
      dragCtx.font = `900 ${Math.max(20, Math.floor(width * 0.03))}px "Orbitron", sans-serif`;
      dragCtx.textAlign = 'center';
      dragCtx.fillText(shiftText, width * 0.5, height * 0.22);
    }

    if (player.feedbackMs > 0 && player.feedbackText) {
      dragCtx.textAlign = 'center';
      dragCtx.fillStyle = player.feedbackText.includes('Perfect') ? '#93ffbe' : '#ffe2b7';
      dragCtx.font = `900 ${Math.max(18, Math.floor(width * 0.026))}px "Orbitron", sans-serif`;
      dragCtx.fillText(player.feedbackText, width * 0.5, height * 0.27);
    }

    if (dragState.phase === 'splash') {
      const t = clamp(dragState.phaseMs / DRAG_SPLASH_MS, 0, 1);
      const pulse = 0.5 + 0.5 * Math.sin(now / 90);
      const stripeCount = 18;
      dragCtx.fillStyle = 'rgba(5, 7, 11, 0.58)';
      dragCtx.fillRect(0, 0, width, height);
      dragCtx.save();
      dragCtx.globalCompositeOperation = 'screen';
      for (let i = 0; i < stripeCount; i += 1) {
        const sx = ((i / stripeCount) * width + now * 0.45) % (width + 220) - 110;
        const grad = dragCtx.createLinearGradient(sx, 0, sx + 160, 0);
        grad.addColorStop(0, 'rgba(255, 130, 43, 0)');
        grad.addColorStop(0.5, `rgba(255, 170, 94, ${0.24 + pulse * 0.24})`);
        grad.addColorStop(1, 'rgba(255, 130, 43, 0)');
        dragCtx.fillStyle = grad;
        dragCtx.fillRect(sx, 0, 180, height);
      }
      dragCtx.restore();

      dragCtx.textAlign = 'center';
      dragCtx.fillStyle = '#ffe4c2';
      dragCtx.font = `900 ${Math.max(34, Math.floor(width * 0.058))}px "Orbitron", sans-serif`;
      dragCtx.fillText('BULLDOG GARAGE', width * 0.5, height * 0.4);
      dragCtx.fillStyle = '#ff9a4f';
      dragCtx.font = `900 ${Math.max(28, Math.floor(width * 0.047))}px "Orbitron", sans-serif`;
      dragCtx.fillText('TOP FUEL SHOWDOWN', width * 0.5, height * 0.49);
      dragCtx.fillStyle = `rgba(255, 247, 229, ${0.45 + pulse * 0.45})`;
      dragCtx.font = `700 ${Math.max(16, Math.floor(width * 0.024))}px "Orbitron", sans-serif`;
      dragCtx.fillText('LIGHTS UP IN 3...2...1...', width * 0.5, height * 0.57);

      const progressW = width * 0.42;
      const progressH = Math.max(7, Math.floor(height * 0.01));
      const progressX = width * 0.5 - progressW / 2;
      const progressY = height * 0.64;
      dragCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      dragCtx.fillRect(progressX, progressY, progressW, progressH);
      const fillGrad = dragCtx.createLinearGradient(progressX, progressY, progressX + progressW, progressY);
      fillGrad.addColorStop(0, '#ff7f32');
      fillGrad.addColorStop(1, '#ffe086');
      dragCtx.fillStyle = fillGrad;
      dragCtx.fillRect(progressX, progressY, progressW * t, progressH);
    } else if (dragState.phase === 'cinematic') {
      const pulse = 0.6 + 0.4 * Math.sin(now / 220);
      dragCtx.fillStyle = `rgba(8, 10, 14, ${0.34 - pulse * 0.12})`;
      dragCtx.fillRect(0, 0, width, height);
      dragCtx.fillStyle = '#fff0d0';
      dragCtx.font = `900 ${Math.max(28, Math.floor(width * 0.046))}px "Orbitron", sans-serif`;
      dragCtx.textAlign = 'center';
      dragCtx.fillText('NHRA STYLE DRAG STRIP SHIFT', width / 2, height * 0.43);
      dragCtx.font = `700 ${Math.max(16, Math.floor(width * 0.024))}px "Orbitron", sans-serif`;
      dragCtx.fillStyle = '#ffbc7e';
      dragCtx.fillText('Launch clean. Shift unlocks at 5.0s. Target 110 mph for max score.', width / 2, height * 0.5);
    } else if (dragState.phase === 'results' && dragState.results) {
      const pulse = 0.5 + 0.5 * Math.sin(now / 180);
      dragCtx.fillStyle = `rgba(255, 214, 143, ${0.08 + pulse * 0.14})`;
      dragCtx.fillRect(0, 0, width, height);
    }

    dragCtx.restore();
    applyDragPostProcessing(width, height, speedFactor);
  }

  function updateDragShift(deltaMs, now) {
    if (!dragState) return;
    dragState.totalMs += deltaMs;
    dragState.phaseMs += deltaMs;
    dragState.cameraShakeMs = Math.max(0, dragState.cameraShakeMs - deltaMs);

    if (dragState.phase === 'splash') {
      if (dragPhaseLabel) dragPhaseLabel.textContent = 'Splash';
      if (dragState.phaseMs >= DRAG_SPLASH_MS) {
        dragState.phase = 'cinematic';
        dragState.phaseMs = 0;
        if (dragSubtitle) dragSubtitle.textContent = 'Top Fuel style: launch hard, hold 5.0s, then hit one 110 mph upshift.';
        if (dragPhaseLabel) dragPhaseLabel.textContent = 'Cinematic';
        playSound('splash_impact');
        playSound('drag_intro');
      }
    } else if (dragState.phase === 'cinematic') {
      if (dragPhaseLabel) dragPhaseLabel.textContent = 'Cinematic';
      if (dragState.phaseMs >= DRAG_CINEMATIC_MS) {
        dragState.phase = 'countdown';
        dragState.phaseMs = 0;
        if (dragSubtitle) dragSubtitle.textContent = 'Stage and watch the tree.';
        if (dragPhaseLabel) dragPhaseLabel.textContent = 'Countdown';
        setDragTreeState({ pre: true, amber: 0, green: false, red: false });
        playSound('drag_impact');
      }
    } else if (dragState.phase === 'countdown') {
      const amber = dragState.phaseMs >= 2100 ? 3 : dragState.phaseMs >= 1400 ? 2 : dragState.phaseMs >= 700 ? 1 : 0;
      const beat = Math.floor(dragState.phaseMs / 700);
      if (beat !== dragState.lastTreeBeat) {
        dragState.lastTreeBeat = beat;
        if (beat >= 0 && beat <= 4) playSound('drag_tree');
      }
      setDragTreeState({
        pre: true,
        amber,
        green: dragState.phaseMs >= DRAG_COUNTDOWN_MS - 620,
        red: dragState.player.falseStart
      });
      if (dragState.phaseMs >= DRAG_COUNTDOWN_MS) {
        dragState.phase = 'race';
        dragState.phaseMs = 0;
        if (dragPhaseLabel) dragPhaseLabel.textContent = 'Race';
        setDragTreeState({ pre: true, amber: 3, green: true, red: false });
        playSound('drag_green');
        if (dragState.player.queuedLaunch) {
          applyDragLaunch(0);
        } else if (dragSubtitle) {
          dragSubtitle.textContent = 'Green. Launch now, then hold 5.0s before shift.';
        }
      }
    } else if (dragState.phase === 'race') {
      updateDragRace(deltaMs);
    } else if (dragState.phase === 'results') {
      if (dragPhaseLabel) dragPhaseLabel.textContent = 'Results';
      if (dragState.phaseMs >= DRAG_RESULTS_MS) {
        closeDragShiftRound();
        return;
      }
    }

    updateDragEngineAudio();
    updateDragHud();
    drawDragScene(now);
  }

  function openSlotMachine() {
    if (!slotModal || !slotAction || !slotMessage) return;
    paused = false;
    setOverlay(null);
    slotState = {
      pullsRemaining: 3,
      reels: [randomSlotSymbol(), randomSlotSymbol(), randomSlotSymbol()],
      totalAward: 0,
      finished: false,
      isSpinning: false
    };
    slotAction.disabled = false;
    if (slotJackpotBanner) {
      slotJackpotBanner.classList.remove('active');
      slotJackpotBanner.classList.add('hidden');
    }
    updateSlotUI('Pull to spin. Match symbols on the center payline.');
    slotModal.classList.remove('hidden');
  }

  const SLOT_SYMBOLS = [
    { key: 'bolt', label: 'BOLT', icon: '⚡', points: 300, weight: 30 },
    { key: 'coin', label: 'COIN', icon: '🪙', points: 500, weight: 24 },
    { key: 'trophy', label: 'TROPHY', icon: '🏆', points: 750, weight: 20 },
    { key: 'cherry', label: 'CHERRY', icon: '🍒', points: 1000, weight: 16 },
    { key: 'star', label: 'STAR', icon: '⭐', points: 1500, weight: 10 }
  ];
  const SLOT_SYMBOL_BY_LABEL = new Map(SLOT_SYMBOLS.map((symbol) => [symbol.label, symbol]));
  const SLOT_TOTAL_WEIGHT = SLOT_SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
  const SLOT_MAX_PAYOUT = Math.max(...SLOT_SYMBOLS.map((symbol) => symbol.points));

  function getSlotCellHeight() {
    const firstReel = slotReelViews[0] ? slotReelViews[0].root : null;
    if (!firstReel) return 72;
    const cssValue = Number.parseFloat(getComputedStyle(firstReel).getPropertyValue('--slot-cell-height'));
    if (Number.isFinite(cssValue) && cssValue > 1) return cssValue;
    const fallback = firstReel.clientHeight / SLOT_REEL_ROWS;
    return fallback > 1 ? fallback : 72;
  }

  function randomSlotSymbol(excludeKey = null) {
    let symbol = SLOT_SYMBOLS[0];
    do {
      let next = Math.random() * SLOT_TOTAL_WEIGHT;
      for (let i = 0; i < SLOT_SYMBOLS.length; i += 1) {
        const candidate = SLOT_SYMBOLS[i];
        next -= candidate.weight;
        if (next <= 0) {
          symbol = candidate;
          break;
        }
      }
      if (next > 0) {
        symbol = SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1];
      }
    } while (excludeKey && symbol.key === excludeKey && SLOT_SYMBOLS.length > 1);
    return symbol;
  }

  function createSlotSymbolNode(symbol) {
    const node = document.createElement('div');
    node.className = `slot-symbol slot-symbol--${symbol.key}`;
    const icon = document.createElement('span');
    icon.className = 'slot-symbol-icon';
    icon.textContent = symbol.icon;
    const label = document.createElement('span');
    label.className = 'slot-symbol-text';
    label.textContent = symbol.label;
    node.appendChild(icon);
    node.appendChild(label);
    return node;
  }

  function renderSlotStrip(view, symbols) {
    if (!view || !view.strip) return;
    const fragment = document.createDocumentFragment();
    symbols.forEach((symbol) => {
      fragment.appendChild(createSlotSymbolNode(symbol));
    });
    view.strip.textContent = '';
    view.strip.appendChild(fragment);
  }

  function setSlotReelTranslate(view, y) {
    if (!view || !view.strip) return;
    view.translateY = y;
    view.strip.style.transform = `translate3d(0, ${y}px, 0)`;
  }

  function buildReelSequence(finalSymbol, reelIndex) {
    const config = SLOT_REEL_CONFIG[reelIndex] || SLOT_REEL_CONFIG[SLOT_REEL_CONFIG.length - 1];
    const totalCells = Math.max(64, config.rotations * SLOT_SYMBOLS.length + 22);
    const symbols = Array.from({ length: totalCells }, () => randomSlotSymbol());
    const targetIndex = totalCells - (6 + reelIndex);
    symbols[targetIndex] = finalSymbol;
    symbols[targetIndex - 1] = randomSlotSymbol(finalSymbol.key);
    symbols[targetIndex + 1] = randomSlotSymbol(finalSymbol.key);
    const startIndex = 2 + Math.floor(Math.random() * 5);
    return { symbols, startIndex, targetIndex };
  }

  function setStaticSlotReels(symbols) {
    slotReelViews.forEach((view, index) => {
      if (!view || !view.root) return;
      const center = symbols[index] || randomSlotSymbol();
      const top = randomSlotSymbol(center.key);
      const bottom = randomSlotSymbol(center.key);
      renderSlotStrip(view, [top, center, bottom]);
      view.root.classList.remove('spinning');
      setSlotReelTranslate(view, 0);
      view.tickIndex = SLOT_CENTER_ROW;
      view.root.setAttribute('aria-label', `Reel ${index + 1}: ${center.label}`);
      if (!view.strip) return;
      view.strip.style.transition = 'none';
      view.strip.style.willChange = 'transform';
      view.strip.style.transform = `translate3d(0, 0px, 0)`;
      view.translateY = 0;
    });
  }

  function easeOutQuint(value) {
    return 1 - Math.pow(1 - value, 5);
  }

  function buildSlotResultReels() {
    const jackpotSymbols = SLOT_SYMBOLS.filter((symbol) => symbol.points === SLOT_MAX_PAYOUT);
    const jackpotSymbol = jackpotSymbols[Math.floor(Math.random() * jackpotSymbols.length)] || SLOT_SYMBOLS[0];
    const jackpotHit = Math.floor(Math.random() * SLOT_JACKPOT_ODDS) === 0;
    if (jackpotHit) {
      return [jackpotSymbol, jackpotSymbol, jackpotSymbol];
    }
    let reels = [randomSlotSymbol(), randomSlotSymbol(), randomSlotSymbol()];
    while (reels.every((symbol) => symbol.key === jackpotSymbol.key)) {
      reels = [randomSlotSymbol(), randomSlotSymbol(), randomSlotSymbol()];
    }
    return reels;
  }

  function triggerJackpotFlash() {
    if (!slotJackpotBanner) return;
    if (slotJackpotTimer) {
      clearTimeout(slotJackpotTimer);
      slotJackpotTimer = null;
    }
    slotJackpotBanner.classList.remove('hidden');
    slotJackpotBanner.classList.add('active');
    slotJackpotTimer = setTimeout(() => {
      slotJackpotBanner.classList.remove('active');
      slotJackpotBanner.classList.add('hidden');
      slotJackpotTimer = null;
    }, 1800);
  }

  function runSlotSpinAnimation(finalReels) {
    return new Promise((resolve) => {
      const start = performance.now();
      const cellHeight = getSlotCellHeight();
      let lastTickTime = 0;

      const plans = slotReelViews.map((view, index) => {
        if (!view || !view.root) return null;
        const config = SLOT_REEL_CONFIG[index] || SLOT_REEL_CONFIG[SLOT_REEL_CONFIG.length - 1];
        const sequence = buildReelSequence(finalReels[index], index);
        renderSlotStrip(view, sequence.symbols);
        view.root.classList.add('spinning');

        const startY = -(sequence.startIndex - SLOT_CENTER_ROW) * cellHeight;
        const targetY = -(sequence.targetIndex - SLOT_CENTER_ROW) * cellHeight;
        setSlotReelTranslate(view, startY);
        view.tickIndex = Math.round(-startY / cellHeight);
        return {
          index,
          view,
          finalSymbol: finalReels[index],
          startY,
          targetY,
          startDelay: config.startDelay,
          duration: config.duration,
          stopped: false
        };
      });

      function frame(now) {
        const elapsedTotal = now - start;
        let finished = true;
        plans.forEach((plan) => {
          if (!plan) return;
          if (elapsedTotal < plan.startDelay) {
            finished = false;
            return;
          }

          const elapsed = Math.max(0, elapsedTotal - plan.startDelay);
          const progress = Math.min(1, elapsed / plan.duration);
          const eased = easeOutQuint(progress);
          const wobble = progress < 1 ? Math.sin(progress * Math.PI * 13) * (1 - progress) * 6 : 0;
          const y = plan.startY + (plan.targetY - plan.startY) * eased + wobble;
          setSlotReelTranslate(plan.view, y);

          const tickIndex = Math.round(-y / cellHeight);
          if (tickIndex !== plan.view.tickIndex) {
            plan.view.tickIndex = tickIndex;
            if (now - lastTickTime > SLOT_SPIN_TICK_MS) {
              lastTickTime = now;
              playSound('slot_spin');
            }
          }

          if (progress < 1) {
            finished = false;
          } else if (!plan.stopped) {
            plan.stopped = true;
            plan.view.root.classList.remove('spinning');
            setSlotReelTranslate(plan.view, plan.targetY);
            if (plan.view.root) {
              plan.view.root.setAttribute('aria-label', `Reel ${plan.index + 1}: ${plan.finalSymbol.label}`);
            }
            if (now - lastTickTime > 60) {
              lastTickTime = now;
              playSound('slot_stop');
            }
          }
        });

        if (finished) {
          resolve();
          return;
        }
        requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    });
  }

  function calculateSlotAward(reels) {
    const labels = reels.map((r) => r.label);
    const counts = labels.reduce((acc, label) => {
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    const best = Object.values(counts).sort((a, b) => b - a)[0] || 0;
    if (best === 3) {
      return reels[0].points;
    }
    if (best === 2) {
      const symbolLabel = Object.keys(counts).find((key) => counts[key] === 2);
      const symbol = SLOT_SYMBOL_BY_LABEL.get(symbolLabel);
      return symbol ? Math.round(symbol.points * 0.4) : 0;
    }
    return 0;
  }

  async function spinSlot() {
    if (!slotState || slotState.finished || slotState.isSpinning) return;
    slotState.isSpinning = true;
    if (slotAction) slotAction.disabled = true;
    if (slotMessage) slotMessage.textContent = 'Spinning reels...';
    playSound('slot_lever');

    const finalReels = buildSlotResultReels();
    await runSlotSpinAnimation(finalReels);
    if (!slotState) return;

    slotState.reels = finalReels;
    const award = calculateSlotAward(slotState.reels);
    slotState.totalAward += award;
    state.score = Math.max(0, state.score + award);
    updateScores();
    slotState.pullsRemaining -= 1;

    if (award >= SLOT_MAX_PAYOUT) {
      playSound('slot_win');
      playSound('jackpot');
      triggerJackpotFlash();
    } else if (award > 0) {
      playSound('slot_win');
    } else {
      playSound('slot');
    }

    if (slotState.pullsRemaining <= 0) {
      slotState.finished = true;
      updateSlotUI(`Total bonus: ${slotState.totalAward} points.`);
    } else {
      updateSlotUI(award > 0 ? `Award: ${award} points.` : 'No payout. Try another pull.');
    }

    slotState.isSpinning = false;
    if (slotAction) slotAction.disabled = false;
  }

  function updateSlotUI(message) {
    if (!slotState) return;
    if (!slotState.isSpinning) {
      setStaticSlotReels(slotState.reels.map((value) => (typeof value === 'string' ? randomSlotSymbol() : value)));
    }
    if (slotMessage) slotMessage.textContent = message;
    if (slotPullsLeft) slotPullsLeft.textContent = String(Math.max(0, slotState.pullsRemaining));
    if (slotAction) slotAction.textContent = slotState.finished ? 'Continue' : `Spin (${slotState.pullsRemaining})`;
  }

  function closeSlotMachine() {
    if (!slotModal) return;
    slotModal.classList.add('hidden');
    if (slotJackpotTimer) {
      clearTimeout(slotJackpotTimer);
      slotJackpotTimer = null;
    }
    if (slotJackpotBanner) {
      slotJackpotBanner.classList.remove('active');
      slotJackpotBanner.classList.add('hidden');
    }
    slotReelViews.forEach((view) => {
      if (!view || !view.root) return;
      view.root.classList.remove('spinning');
      if (view.strip) view.strip.style.transform = 'translate3d(0, 0px, 0)';
      view.translateY = 0;
      view.tickIndex = 0;
    });
    slotState = null;
  }

  function restart() {
    state = createInitialState(Date.now() % 2147483647);
    queuedDir = null;
    accumulator = 0;
    paused = false;
    scoreHandled = false;
    dragState = null;
    stopDragEngineAudio();
    slotState = null;
    resumeWaiting = false;
    resumeCountdownMs = 0;
    document.body.classList.remove('drag-quality-high', 'drag-quality-medium', 'drag-quality-low');
    if (dragModal) dragModal.classList.add('hidden');
    if (slotModal) slotModal.classList.add('hidden');
    if (resumeModal) resumeModal.classList.add('hidden');
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
    if (isSplashActive()) return;
    if (state.over || dragState || slotState || resumeWaiting || resumeCountdownMs > 0) return;
    paused = !paused;
    if (paused) setOverlay('paused');
    else setOverlay(null);
  }

  function scheduleRespawn(minMs, maxMs) {
    const roll = randomRange(state.seed, minMs, maxMs);
    state.seed = roll.seed;
    return roll.value;
  }

  function updateDragBuffTimer(deltaMs) {
    if (state.dragBuffMsRemaining <= 0) return;
    state.dragBuffMsRemaining = Math.max(0, state.dragBuffMsRemaining - deltaMs);
    if (state.dragBuffMsRemaining === 0) {
      state.dragBuffMultiplier = 1;
    }
  }

  function updateTimers(deltaMs) {
    if (state.slowMsRemaining > 0) {
      state.slowMsRemaining = Math.max(0, state.slowMsRemaining - deltaMs);
    }
    if (state.controlsReversedMs > 0) {
      state.controlsReversedMs = Math.max(0, state.controlsReversedMs - deltaMs);
    }

    if (state.trophy) {
      state.trophyAgeMs += deltaMs;
      if (state.trophyAgeMs >= TROPHY_EXPIRE_MS) {
        state.trophy = null;
        state.trophyAgeMs = 0;
        state.respawnMs = TROPHY_RESPAWN_MS;
        state.score = Math.max(0, state.score - TROPHY_PENALTY);
        updateScores();
        playSound('penalty');
      }
    }

    if (!state.trophy && state.respawnMs > 0) {
      state.respawnMs = Math.max(0, state.respawnMs - deltaMs);
      if (state.respawnMs === 0) {
        const placement = placeTrophy(state);
        state.trophy = placement.trophy;
        state.seed = placement.seed;
        if (!state.trophy) {
          state.over = true;
          state.won = true;
        }
      }
    }

    if (state.clock) {
      state.clockAgeMs += deltaMs;
      if (state.clockAgeMs >= CLOCK_LIFETIME_MS) {
        state.clock = null;
        state.clockAgeMs = 0;
        state.clockRespawnMs = scheduleRespawn(CLOCK_SPAWN_MIN_MS, CLOCK_SPAWN_MAX_MS);
      }
    } else {
      state.clockRespawnMs = Math.max(0, state.clockRespawnMs - deltaMs);
      if (state.clockRespawnMs === 0) {
        const placement = placeItem(state, 1);
        state.clock = placement.item;
        state.seed = placement.seed;
        state.clockAgeMs = 0;
        if (!state.clock) {
          state.clockRespawnMs = 5000;
        }
      }
    }

    if (state.tire) {
      state.tireAgeMs += deltaMs;
      if (state.tireAgeMs >= TIRE_LIFETIME_MS) {
        state.tire = null;
        state.tireAgeMs = 0;
        state.tireRespawnMs = scheduleRespawn(TIRE_SPAWN_MIN_MS, TIRE_SPAWN_MAX_MS);
      }
    } else {
      state.tireRespawnMs = Math.max(0, state.tireRespawnMs - deltaMs);
      if (state.tireRespawnMs === 0) {
        const placement = placeItem(state, 1);
        state.tire = placement.item;
        state.seed = placement.seed;
        state.tireAgeMs = 0;
        if (!state.tire) {
          state.tireRespawnMs = 10000;
        }
      }
    }

    if (state.oil) {
      state.oilAgeMs += deltaMs;
      if (state.oilAgeMs >= OIL_LIFETIME_MS) {
        state.oil = null;
        state.oilAgeMs = 0;
        state.oilRespawnMs = scheduleRespawn(OIL_SPAWN_MIN_MS, OIL_SPAWN_MAX_MS);
      }
    } else {
      state.oilRespawnMs = Math.max(0, state.oilRespawnMs - deltaMs);
      if (state.oilRespawnMs === 0) {
        const placement = placeItem(state, OIL_SIZE);
        state.oil = placement.item;
        state.seed = placement.seed;
        state.oilAgeMs = 0;
        if (!state.oil) {
          state.oilRespawnMs = 10000;
        }
      }
    }

    if (state.police) {
      state.policeAgeMs += deltaMs;
      if (state.policeAgeMs >= POLICE_LIFETIME_MS) {
        state.police = null;
        state.policeAgeMs = 0;
        state.policeRespawnMs = scheduleRespawn(POLICE_SPAWN_MIN_MS, POLICE_SPAWN_MAX_MS);
      }
    } else {
      state.policeRespawnMs = Math.max(0, state.policeRespawnMs - deltaMs);
      if (state.policeRespawnMs === 0) {
        const placement = placeItem(state, 1);
        state.police = placement.item;
        state.seed = placement.seed;
        state.policeAgeMs = 0;
        if (!state.police) {
          state.policeRespawnMs = 10000;
        }
      }
    }

    if (state.coin) {
      state.coinAgeMs += deltaMs;
      if (state.coinAgeMs >= COIN_LIFETIME_MS) {
        state.coin = null;
        state.coinAgeMs = 0;
        state.coinRespawnMs = scheduleRespawn(COIN_SPAWN_MIN_MS, COIN_SPAWN_MAX_MS);
      }
    } else {
      state.coinRespawnMs = Math.max(0, state.coinRespawnMs - deltaMs);
      if (state.coinRespawnMs === 0) {
        const placement = placeItem(state, COIN_SIZE);
        state.coin = placement.item;
        state.seed = placement.seed;
        state.coinAgeMs = 0;
        if (!state.coin) {
          state.coinRespawnMs = 10000;
        }
      }
    }

    if (state.stopSign) {
      state.stopSignAgeMs += deltaMs;
      if (state.stopSignAgeMs >= STOP_SIGN_LIFETIME_MS) {
        state.stopSign = null;
        state.stopSignAgeMs = 0;
      }
    }
    state.stopSignRespawnMs = Math.max(0, state.stopSignRespawnMs - deltaMs);
    if (!state.stopSign && state.stopSignRespawnMs === 0) {
      const placement = placeItem(state, 1);
      state.stopSign = placement.item;
      state.seed = placement.seed;
      state.stopSignAgeMs = 0;
      if (state.stopSign) {
        state.stopSignRespawnMs = scheduleRespawn(STOP_SIGN_RESPAWN_MIN_MS, STOP_SIGN_RESPAWN_MAX_MS);
      } else {
        state.stopSignRespawnMs = 8000;
      }
    }

    if (state.cherry) {
      state.cherryAgeMs += deltaMs;
      if (state.cherryAgeMs >= CHERRY_LIFETIME_MS) {
        state.cherry = null;
        state.cherryAgeMs = 0;
        state.cherryRespawnMs = scheduleRespawn(CHERRY_SPAWN_MIN_MS, CHERRY_SPAWN_MAX_MS);
      }
    } else {
      state.cherryRespawnMs = Math.max(0, state.cherryRespawnMs - deltaMs);
      if (state.cherryRespawnMs === 0) {
        const placement = placeItem(state, 1);
        state.cherry = placement.item;
        state.seed = placement.seed;
        state.cherryAgeMs = 0;
        if (!state.cherry) {
          state.cherryRespawnMs = 8000;
        }
      }
    }
  }

  function handleGameOver() {
    updateScores();
    setOverlay(state.won ? 'win' : 'over');
    if (shouldPromptForScore(state.score)) {
      openScoreEntry(state.score);
    }
  }

  function handleStep(deltaMs, nowMs = performance.now()) {
    if (isSplashActive()) return;
    if (state.over) return;
    if (dragState) {
      updateDragShift(deltaMs, nowMs);
      return;
    }
    if (slotState) return;
    if (resumeWaiting) return;
    if (resumeCountdownMs > 0) {
      updateResumeCountdown(deltaMs);
      if (resumeCountdownMs === 0) {
        paused = false;
      }
      return;
    }
    if (state.dragPending && !isModalOpen()) {
      state.dragPending = false;
      openDragShiftRound();
      return;
    }
    if (paused) return;
    updateDragBuffTimer(deltaMs);
    if (!state.moving) {
      if (queuedDir) {
        state.direction = queuedDir;
        state.moving = true;
        queuedDir = null;
      } else {
        return;
      }
    }
    updateTimers(deltaMs);
    accumulator += deltaMs;
    let safety = 0;
    let tickMs = BASE_TICK_MS / getEffectiveSpeed(state);
    while (accumulator >= tickMs && safety < 120) {
      const next = stepState(state, queuedDir);
      queuedDir = null;
      const scoreBefore = state.score;
      state = next;
      tickMs = BASE_TICK_MS / getEffectiveSpeed(state);
      accumulator -= tickMs;
      if (state.score !== scoreBefore) {
        updateScores();
      }
      if (state.over) {
        handleGameOver();
        break;
      }
      if (state.dragPending) {
        state.dragPending = false;
        openDragShiftRound();
        break;
      }
      if (state.slotPending) {
        state.slotPending = false;
        openSlotMachine();
        break;
      }
      safety += 1;
    }
    if (safety >= 120) {
      accumulator = 0;
    }
  }

  function drawBackground(time) {
    const { offsetX, offsetY, width, height } = layout;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.boardFill || '#e5e5e5';
    ctx.fillRect(offsetX, offsetY, width, height);

    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.drawImage(noiseCanvas, offsetX, offsetY, width, height);
    ctx.restore();

    ctx.strokeStyle = theme.grid || '#b0b0b0';
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

    // Removed scanline sweep for a cleaner board background.
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
    if (state.slowMsRemaining > 0 && state.slowMsRemaining <= 3000) {
      ctx.globalAlpha = Math.floor(time / 150) % 2 === 0 ? 0.35 : 1;
    }
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
    if (!state.direction) return 0;
    if (state.direction.x === 1) return 0;
    if (state.direction.x === -1) return Math.PI;
    if (state.direction.y === 1) return Math.PI / 2;
    return -Math.PI / 2;
  }

  function drawTrophy(time) {
    if (!state.trophy) return;
    if (state.trophyAgeMs >= TROPHY_BLINK_MS) {
      const blinkStep = Math.floor(state.trophyAgeMs / 200) % 2;
      if (blinkStep === 1) return;
    }
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

  function drawClock(time) {
    if (!state.clock) return;
    if (state.clockAgeMs >= CLOCK_BLINK_START_MS) {
      const interval = state.clockAgeMs >= CLOCK_BLINK_FAST_MS ? 140 : 260;
      if (Math.floor(state.clockAgeMs / interval) % 2 === 1) return;
    }
    const centerX = layout.offsetX + state.clock.x * layout.cell + layout.cell / 2;
    const centerY = layout.offsetY + state.clock.y * layout.cell + layout.cell / 2;
    const radius = layout.cell * 0.28;
    ctx.save();
    ctx.fillStyle = '#f8f1c1';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = layout.cell * 0.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1b1b1b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = '#1b1b1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - radius * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * 0.4, centerY);
    ctx.stroke();
    ctx.restore();
  }

  function drawTire() {
    if (!state.tire) return;
    const centerX = layout.offsetX + state.tire.x * layout.cell + layout.cell / 2;
    const centerY = layout.offsetY + state.tire.y * layout.cell + layout.cell / 2;
    const radius = layout.cell * 0.28;
    ctx.save();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function drawOil() {
    if (!state.oil) return;
    const size = layout.cell * OIL_SIZE;
    const x = layout.offsetX + state.oil.x * layout.cell;
    const y = layout.offsetY + state.oil.y * layout.cell;
    ctx.save();
    ctx.fillStyle = 'rgba(20, 24, 35, 0.9)';
    roundRect(x, y, size, size, layout.cell * 0.4);
    ctx.fill();
    ctx.restore();
  }

  function drawPolice(time) {
    if (!state.police) return;
    const x = layout.offsetX + state.police.x * layout.cell;
    const y = layout.offsetY + state.police.y * layout.cell;
    const size = layout.cell * 0.9;
    ctx.save();
    ctx.fillStyle = '#222';
    ctx.fillRect(x + layout.cell * 0.05, y + layout.cell * 0.1, size, size * 0.8);
    const flash = Math.floor(time / 200) % 2 === 0;
    ctx.fillStyle = flash ? '#ff3b30' : '#3b82f6';
    ctx.fillRect(x + layout.cell * 0.15, y + layout.cell * 0.05, size * 0.7, layout.cell * 0.15);
    ctx.restore();
  }

  function drawCoin() {
    if (!state.coin) return;
    if (state.coinAgeMs >= COIN_BLINK_START_MS) {
      if (Math.floor(state.coinAgeMs / 200) % 2 === 1) return;
    }
    const x = layout.offsetX + state.coin.x * layout.cell;
    const y = layout.offsetY + state.coin.y * layout.cell;
    const size = layout.cell * COIN_SIZE;
    ctx.save();
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = layout.cell * 0.5;
    ctx.beginPath();
    ctx.ellipse(x + size / 2, y + size / 2, size * 0.42, size * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c08400';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function drawCherry(time) {
    if (!state.cherry) return;
    if (state.cherryAgeMs >= CHERRY_BLINK_START_MS) {
      if (Math.floor(state.cherryAgeMs / 160) % 2 === 1) return;
    }
    const centerX = layout.offsetX + state.cherry.x * layout.cell + layout.cell / 2;
    const centerY = layout.offsetY + state.cherry.y * layout.cell + layout.cell / 2;
    const radius = layout.cell * 0.2;
    ctx.save();
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = layout.cell * 0.4;
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.6, centerY, radius, 0, Math.PI * 2);
    ctx.arc(centerX + radius * 0.6, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY - radius * 2.1);
    ctx.stroke();
    ctx.restore();
  }

  function drawStopSign(time) {
    if (!state.stopSign) return;
    const centerX = layout.offsetX + state.stopSign.x * layout.cell + layout.cell / 2;
    const centerY = layout.offsetY + state.stopSign.y * layout.cell + layout.cell / 2;
    const radius = layout.cell * 0.32;
    const pulse = 1 + 0.04 * Math.sin(time / 180);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = '#d62828';
    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = Math.max(2, layout.cell * 0.08);
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const angle = Math.PI / 8 + i * (Math.PI / 4);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.floor(layout.cell * 0.22)}px "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STOP', 0, 0);
    ctx.restore();
  }

  function drawSpeedCountdown() {
    if (state.slowMsRemaining <= 0 || state.slowMsRemaining > 3000) return;
    const countdown = Math.ceil(state.slowMsRemaining / 1000);
    const text = `Speed Normal ${countdown}`;
    ctx.save();
    ctx.fillStyle = '#ffd166';
    ctx.font = `bold ${Math.floor(layout.cell * 0.6)}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, layout.offsetX + layout.width / 2, layout.offsetY + layout.cell * 1.2);
    ctx.restore();
  }

  function drawDragBuffIndicator() {
    if (state.dragBuffMsRemaining <= 0) return;
    const seconds = Math.ceil(state.dragBuffMsRemaining / 1000);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 201, 122, 0.96)';
    ctx.font = `bold ${Math.floor(layout.cell * 0.44)}px "Orbitron", sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`Drag Boost x${DRAG_BUFF_MULTIPLIER.toFixed(2)} (${seconds}s)`, layout.offsetX + layout.width - 10, layout.offsetY + layout.cell * 1.2);
    ctx.restore();
  }

  function render(time) {
    resizeCanvas();
    drawBackground(time);
    drawOil();
    drawCoin();
    drawCherry(time);
    drawStopSign(time);
    drawClock(time);
    drawTire();
    drawPolice(time);
    drawTrophy(time);
    drawCarAndDust(time);
    drawSpeedCountdown();
    drawDragBuffIndicator();

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
    frameSampleMs = frameSampleMs * 0.88 + delta * 0.12;
    updateSplash(delta);
    handleStep(delta, now);
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

  function handleKeydown(event) {
    const { code } = event;
    if (isSplashActive()) {
      event.preventDefault();
      enableAudio();
      dismissSplash();
      return;
    }
    if (dragState) {
      if (code === 'Space') {
        event.preventDefault();
      }
      if (code === 'Space') handleDragPrimaryAction();
      return;
    }
    if (isModalOpen()) {
      if (code === 'Escape') {
        closeScoreEntry();
        closeUtilityModal(settingsModal);
        closeUtilityModal(scoreboardModal);
      }
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
  }

  function handleMobileAction(event) {
    event.preventDefault();
    if (isSplashActive()) return;
    const action = event.currentTarget.dataset.action;
    if (action === 'pause') togglePause();
    if (action === 'restart') restart();
  }

  function handleDpadPress(event) {
    event.preventDefault();
    if (isSplashActive()) return;
    const dir = event.currentTarget.dataset.dir;
    if (dir === 'up') queueDirection({ x: 0, y: -1 });
    if (dir === 'down') queueDirection({ x: 0, y: 1 });
    if (dir === 'left') queueDirection({ x: -1, y: 0 });
    if (dir === 'right') queueDirection({ x: 1, y: 0 });
  }


  function startJoystick(event) {
    if (!joystick || !joystickHandle) return;
    joystickActive = true;
    joystickPointerId = event.pointerId;
    joystick.setPointerCapture(event.pointerId);
    const rect = joystick.getBoundingClientRect();
    joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    joystickRadius = rect.width * 0.4;
    moveJoystick(event);
  }

  function moveJoystick(event) {
    if (!joystickActive || event.pointerId !== joystickPointerId) return;
    const dx = event.clientX - joystickCenter.x;
    const dy = event.clientY - joystickCenter.y;
    const distance = Math.hypot(dx, dy);
    const max = joystickRadius;
    const scale = distance > max ? max / distance : 1;
    const offsetX = dx * scale;
    const offsetY = dy * scale;
    joystickHandle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    applyDirectionFromVector(dx, dy, max * 0.25);
  }

  function endJoystick(event) {
    if (!joystickActive || event.pointerId !== joystickPointerId) return;
    joystickActive = false;
    joystickPointerId = null;
    joystickHandle.style.transform = 'translate(0px, 0px)';
  }

  function handleTouchStart(event) {
    if (isSplashActive()) {
      event.preventDefault();
      return;
    }
    if (dragState && dragCanvas && (event.target === dragCanvas || dragCanvas.contains(event.target))) {
      event.preventDefault();
      if (dragState.phase === 'race' && dragState.player && dragState.player.launched) {
        handleDragShiftInput();
      }
      return;
    }
    if (!boardCanvas || !event.target || (event.target !== boardCanvas && !boardCanvas.contains(event.target))) return;
    if (isModalOpen()) return;
    event.preventDefault();
    const touch = event.touches[0];
    if (!touch) return;
    swipeStart = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!swipeStart) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - swipeStart.x;
    const dy = touch.clientY - swipeStart.y;
    swipeStart = null;
    applyDirectionFromVector(dx, dy, 28);
  }

  function handleDragTouchMove(event) {
    if (!dragState || !dragCanvas) return;
    if (event.target === dragCanvas || dragCanvas.contains(event.target)) {
      event.preventDefault();
    }
  }

  function handleSplashGesture(event) {
    if (!isSplashActive()) return;
    event.preventDefault();
    event.stopPropagation();
    enableAudio();
    dismissSplash();
  }

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', () => {
    applyMobileGestureLock();
    applyVirtualControlsPreference();
    resizeDragCanvas();
    if (dragState) drawDragScene(performance.now());
    render(performance.now());
  });

  skinButtons.forEach((btn) => {
    btn.addEventListener('click', () => setSkin(btn.dataset.skin));
  });

  if (joystick) {
    joystick.addEventListener('pointerdown', startJoystick);
    joystick.addEventListener('pointermove', moveJoystick);
    joystick.addEventListener('pointerup', endJoystick);
    joystick.addEventListener('pointercancel', endJoystick);
  }

  if (boardCanvas) {
    boardCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    boardCanvas.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  if (dragCanvas) {
    dragCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    dragCanvas.addEventListener('touchmove', handleDragTouchMove, { passive: false });
    dragCanvas.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  if (splashModal) {
    splashModal.addEventListener('pointerdown', handleSplashGesture, { passive: false });
    splashModal.addEventListener('touchstart', handleSplashGesture, { passive: false });
  }

  ['pointerdown', 'keydown', 'touchstart'].forEach((eventName) => {
    window.addEventListener(eventName, enableAudio, { once: true, passive: true });
  });

  mobileActionButtons.forEach((btn) => {
    btn.addEventListener('pointerdown', handleMobileAction);
  });

  dpadButtons.forEach((btn) => {
    btn.addEventListener('pointerdown', handleDpadPress);
    btn.addEventListener('touchstart', handleDpadPress, { passive: false });
  });

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      openUtilityModal(settingsModal);
    });
  }

  if (scoreboardBtn) {
    scoreboardBtn.addEventListener('click', () => {
      renderLeaderboard();
      openUtilityModal(scoreboardModal);
    });
  }

  if (settingsClose) {
    settingsClose.addEventListener('click', () => {
      closeUtilityModal(settingsModal);
    });
  }

  if (scoreboardClose) {
    scoreboardClose.addEventListener('click', () => {
      closeUtilityModal(scoreboardModal);
    });
  }

  if (settingsModal) {
    settingsModal.addEventListener('pointerdown', (event) => {
      if (event.target === settingsModal) {
        closeUtilityModal(settingsModal);
      }
    });
  }

  if (scoreboardModal) {
    scoreboardModal.addEventListener('pointerdown', (event) => {
      if (event.target === scoreboardModal) {
        closeUtilityModal(scoreboardModal);
      }
    });
  }

  if (soundSetting) {
    soundSetting.addEventListener('change', () => {
      setSoundEffectsEnabled(soundSetting.value === 'on');
    });
  }

  if (virtualControlsSetting) {
    virtualControlsSetting.addEventListener('change', () => {
      virtualControlsEnabled = virtualControlsSetting.value !== 'off';
      localStorage.setItem(VIRTUAL_CONTROLS_KEY, virtualControlsEnabled ? 'on' : 'off');
      applyVirtualControlsPreference();
      render(performance.now());
    });
  }

  pauseBtn.addEventListener('click', togglePause);
  restartBtnSide.addEventListener('click', restart);
  restartBtn.addEventListener('click', restart);
  resumeBtn.addEventListener('click', () => {
    paused = false;
    setOverlay(null);
  });
  scoreInitials.addEventListener('input', () => {
    if (isStaffPeriod(scorePeriod.value)) {
      scoreInitials.value = normalizeStaffName(scoreInitials.value);
    } else {
      scoreInitials.value = normalizeStudentId(scoreInitials.value, false);
    }
    setScoreEntryError('');
  });
  scorePeriod.addEventListener('change', () => {
    updateScoreEntryFieldMode();
    setScoreEntryError('');
  });
  scoreCancel.addEventListener('click', () => {
    markScoreHandled();
    closeScoreEntry();
  });
  scoreForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pendingScore === null) {
      closeScoreEntry();
      return;
    }
    const period = normalizePeriod(scorePeriod.value);
    if (!period) {
      setScoreEntryError('Please select a period.');
      return;
    }

    const staff = isStaffPeriod(period);
    let studentId = '';
    let staffName = '';
    if (staff) {
      staffName = normalizeStaffName(scoreInitials.value);
      if (!staffName) {
        setScoreEntryError('Enter a staff name (max 10 characters).');
        return;
      }
      scoreInitials.value = staffName;
    } else {
      studentId = normalizeStudentId(scoreInitials.value, false);
      if (!/^\d{6}$/.test(studentId)) {
        setScoreEntryError('Enter a valid 6-digit student ID.');
        scoreInitials.value = studentId;
        return;
      }
      scoreInitials.value = studentId;
    }

    const scoreValue = pendingScore;
    const saveResult = await submitScore({
      studentId,
      staffName,
      displayName: staff ? staffName : studentId,
      initials: staff ? staffName : studentId,
      period,
      score: scoreValue
    });
    if (!saveResult || !saveResult.ok) {
      setScoreEntryError((saveResult && saveResult.message) || 'Could not save score. Try again.');
      return;
    }
    markScoreHandled();
    closeScoreEntry();
  });
  if (welcomeAction) {
    welcomeAction.addEventListener('click', advanceWelcomeModal);
  }
  if (dragLaunchBtn) {
    dragLaunchBtn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      handleDragLaunchInput();
    });
    dragLaunchBtn.addEventListener('touchstart', (event) => {
      event.preventDefault();
      handleDragLaunchInput();
    }, { passive: false });
  }
  if (dragShiftBtn) {
    dragShiftBtn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      handleDragShiftInput();
    });
    dragShiftBtn.addEventListener('touchstart', (event) => {
      event.preventDefault();
      handleDragShiftInput();
    }, { passive: false });
  }
  if (dragShiftOverlayBtn) {
    dragShiftOverlayBtn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      handleDragShiftInput();
    });
    dragShiftOverlayBtn.addEventListener('touchstart', (event) => {
      event.preventDefault();
      handleDragShiftInput();
    }, { passive: false });
  }
  if (dragContinueBtn) {
    dragContinueBtn.addEventListener('click', () => {
      if (!dragState || dragState.phase !== 'results') return;
      closeDragShiftRound();
    });
  }
  if (slotAction) {
    slotAction.addEventListener('click', async () => {
      if (!slotState) return;
      if (slotState.finished) {
        closeSlotMachine();
        openResumePrompt('Tap to resume the race');
        return;
      }
      await spinSlot();
    });
  }
  if (resumeAction) {
    resumeAction.addEventListener('click', () => {
      startResumeCountdown();
    });
  }

  setSoundEffectsEnabled(true);
  applyMobileGestureLock();
  applyVirtualControlsPreference();
  loadDragVisualAssets();
  updateScores();
  loadLeaderboard();
  initSplash();
  if (!isSplashActive()) {
    showWelcomeModal();
  }
  resizeCanvas();
  render(performance.now());
  requestAnimationFrame(loop);

  window.render_game_to_text = () => {
    const car = state.dustTrail[0];
    const mode = isSplashActive()
      ? 'splash'
      : state.over
        ? state.won
          ? 'win'
          : 'gameover'
        : dragState
          ? 'drag_shift'
          : slotState
            ? 'slot'
            : resumeWaiting
              ? 'resume_wait'
              : resumeCountdownMs > 0
                ? 'resume_countdown'
                : paused
                  ? 'paused'
                  : 'play';
    const payload = {
      mode,
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
      moving: state.moving,
      trophy: state.trophy,
      clock: state.clock,
      tire: state.tire,
      oil: state.oil,
      police: state.police,
      coin: state.coin,
      stopSign: state.stopSign,
      cherry: state.cherry,
      score: state.score,
      best: bestScore,
      topScores: leaderboard,
      tickMs: Math.round(BASE_TICK_MS / getEffectiveSpeed(state)),
      speedMultiplier: Number(state.speedMultiplier.toFixed(3)),
      dragBuffMultiplier: Number((state.dragBuffMultiplier || 1).toFixed(3)),
      dragBuffMsRemaining: Math.round(state.dragBuffMsRemaining || 0),
      slowMsRemaining: Math.round(state.slowMsRemaining),
      controlsReversedMs: Math.round(state.controlsReversedMs),
      trophyAgeMs: Math.round(state.trophyAgeMs),
      respawnMs: Math.round(state.respawnMs),
      dragShift: dragState
        ? {
            phase: dragState.phase,
            milestone: dragState.milestoneTrophy,
            player: {
              lane: 2,
              gear: dragState.player.gear,
              rpm: Math.round(dragState.player.rpm),
              mph: Math.round(mpsToMph(dragState.player.speed)),
              distanceM: Math.round(dragState.player.distanceM),
              reactionMs: dragState.player.reactionMs,
              launchElapsedMs: Math.round(dragState.player.launchElapsedMs || 0),
              shiftLockRemainingMs: Math.round(dragState.player.shiftLockRemainingMs || 0),
              shiftTargetMph: DRAG_SHIFT_TARGET_MPH,
              hasShifted: Boolean(dragState.player.hasShifted),
              points: Math.round(dragState.player.points),
              launchPoints: Math.round(dragState.player.launchPoints),
              shiftPoints: Math.round(dragState.player.shiftPoints),
              shiftAttempts: dragState.player.shiftAttempts,
              perfectScoredShifts: dragState.player.perfectScoredShifts
            },
            npcs: dragState.npcs.map((npc, index) => ({
              lane: index + 1,
              laneOffset: Number(npc.laneOffset.toFixed(2)),
              distanceM: Math.round(npc.distanceM)
            })),
            rankPreview: getDragRankFromDistances(dragState.player, dragState.npcs),
            timeRemainingMs:
              dragState.phase === 'splash'
                ? Math.max(0, Math.round(DRAG_SPLASH_MS - dragState.phaseMs))
                : dragState.phase === 'cinematic'
                ? Math.max(0, Math.round(DRAG_CINEMATIC_MS - dragState.phaseMs))
                :
              dragState.phase === 'race'
                ? Math.max(0, Math.round(DRAG_RACE_MS - dragState.phaseMs))
                : dragState.phase === 'countdown'
                  ? Math.max(0, Math.round(DRAG_COUNTDOWN_MS - dragState.phaseMs))
                  : Math.max(0, Math.round(DRAG_RESULTS_MS - dragState.phaseMs)),
            qualityTier: dragState.qualityTier,
            audioState: dragAudioMode
          }
        : null,
      splash: isSplashActive()
        ? {
            phase: splashState.phase,
            elapsedMs: Math.round(splashState.elapsedMs)
          }
        : null,
      slot: slotState
        ? {
            pullsRemaining: slotState.pullsRemaining,
            totalAward: slotState.totalAward,
            reels: slotState.reels.map((item) => (typeof item === 'string' ? item : item.label))
          }
        : null,
      resumeCountdownMs: Math.round(resumeCountdownMs)
    };
    return JSON.stringify(payload);
  };

  window.advanceTime = (ms) => {
    updateSplash(ms);
    handleStep(ms, performance.now());
    render(performance.now());
  };
})();
