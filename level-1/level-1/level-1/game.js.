
"use strict";

/* =========================================================
   SONIC MAX
   ESCAPE FROM THE CITY — ACT 1
   Motor de juego 2D para navegador y Android
========================================================= */

const CONFIG = {
  levelLength: 3500,
  baseSpeed: 360,
  boostSpeed: 650,
  gravity: 1900,
  jumpForce: 700,
  playerX: 0.20,
  collisionWidth: 42,
  collisionHeight: 52,
  ringValue: 10,
  initialRings: 0
};

const $ = (id) => document.getElementById(id);

const game = $("game");
const player = $("player");
const ringsLayer = $("rings");
const overlay = $("overlay");
const toast = $("toast");
const flash = $("flash");
const progressBar = $("progress");

if (!game || !player || !ringsLayer || !overlay) {
  throw new Error(
    "Faltan elementos del HTML. Revisa level-1/index.html."
  );
}

const state = {
  running: false,
  ended: false,
  distance: 0,
  speed: CONFIG.baseSpeed,
  rings: CONFIG.initialRings,
  score: 0,
  y: 0,
  velocityY: 0,
  jumping: false,
  boosting: false,
  invincible: 0,
  lastTime: 0,
  spawnTimer: 0,
  ringTimer: 0,
  objects: [],
  keys: new Set(),
  jumpQueued: false,
  boostEnergy: 100,
  animationFrame: 0
};

const floor = () => window.innerHeight * 0.22;
const playerScreenX = () => window.innerWidth * CONFIG.playerX;

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = String(value);
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
}

function flashScreen() {
  if (!flash) return;

  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
}

function updateHUD() {
  setText("ring-count", state.rings);
  setText("score", state.score.toLocaleString("es-CL"));
  setText("speed", Math.round(state.speed / 4));
  setText("boost-value", Math.round(state.boostEnergy) + "%");

  if (progressBar) {
    progressBar.style.width =
      Math.min(100, state.distance / CONFIG.levelLength * 100) + "%";
  }
}

function createObject(type, x, y, symbol) {
  const element = document.createElement("div");
  element.className = type === "ring" ? "ring" : "obstacle";
  element.textContent = type === "ring" ? "" : symbol;
  element.dataset.type = type;

  if (type === "ring") {
    element.setAttribute("aria-label", "Anillo");
  }

  game.appendChild(element);

  const object = {
    type,
    x,
    y,
    element,
    collected: false,
    width: type === "ring" ? 30 : 50,
    height: type === "ring" ? 30 : 50
  };

  state.objects.push(object);
  return object;
}

function removeObject(object) {
  object.element.remove();
  state.objects = state.objects.filter(item => item !== object);
}

function spawnRingPattern() {
  const startX = window.innerWidth + 70;
  const pattern = Math.random();

  for (let i = 0; i < 5; i++) {
    const height = pattern > 0.65
      ? floor() + 110
      : floor() + 35;

    createObject(
      "ring",
      startX + i * 46,
      height,
      ""
    );
  }
}

function spawnObstacle() {
  const symbols = ["🚧", "🪨", "📦"];
  const symbol = symbols[
    Math.floor(Math.random() * symbols.length)
  ];

  createObject(
    "obstacle",
    window.innerWidth + 70,
    floor(),
    symbol
  );
}

function setObjectPosition(object) {
  object.element.style.left = object.x + "px";

  if (object.type === "ring") {
    object.element.style.top = object.y + "px";
  } else {
    object.element.style.bottom =
      (window.innerHeight - floor() - object.height / 2) + "px";
  }
}

function overlaps(a, b) {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

function getPlayerRect() {
  const x = playerScreenX();
  const bottom = floor() + state.y;

  return {
    left: x,
    right: x + CONFIG.collisionWidth,
    top: window.innerHeight - bottom - CONFIG.collisionHeight,
    bottom: window.innerHeight - bottom
  };
}

function getObjectRect(object) {
  if (object.type === "ring") {
    return {
      left: object.x,
      right: object.x + object.width,
      top: object.y,
      bottom: object.y + object.height
    };
  }

  return {
    left: object.x,
    right: object.x + object.width,
    top: window.innerHeight - floor() - object.height,
    bottom: window.innerHeight - floor()
  };
}

function collectRing(object) {
  state.rings++;
  state.score += CONFIG.ringValue;
  object.collected = true;

  showToast("+10 ANILLO");
  removeObject(object);
}

function hitObstacle(object) {
  if (state.invincible > 0 || state.boosting) {
    state.score += 50;
    showToast("¡DESTROZADO! +50");
    removeObject(object);
    return;
  }

  state.invincible = 1.1;
  state.speed = Math.max(190, state.speed * 0.65);
  state.rings = Math.max(0, state.rings - 5);

  player.classList.add("hit");
  flashScreen();
  showToast("¡CUIDADO!");

  removeObject(object);

  window.setTimeout(() => {
    player.classList.remove("hit");
  }, 300);
}

function updatePlayer(dt) {
  const wantsJump = state.jumpQueued ||
    state.keys.has(" ") ||
    state.keys.has("ArrowUp") ||
    state.keys.has("w");

  if (wantsJump && !state.jumping) {
    state.velocityY = CONFIG.jumpForce;
    state.jumping = true;
    player.classList.add("jumping");
    state.jumpQueued = false;
  }

  state.velocityY -= CONFIG.gravity * dt;
  state.y += state.velocityY * dt;

  if (state.y <= 0) {
    state.y = 0;
    state.velocityY = 0;
    state.jumping = false;
    player.classList.remove("jumping");
  }

  const wantsBoost = state.keys.has("Shift") ||
    state.keys.has("x") ||
    state.boosting;

  if (wantsBoost && state.boostEnergy > 0) {
    state.boostEnergy = Math.max(
      0,
      state.boostEnergy - 30 * dt
    );
    state.speed = CONFIG.boostSpeed;
    player.style.filter =
      "drop-shadow(0 0 12px #4af6ff) drop-shadow(0 5px 5px #0008)";
  } else {
    state.speed = Math.min(
      CONFIG.baseSpeed + state.distance * 0.015,
      470
    );
    state.boostEnergy = Math.min(
      100,
      state.boostEnergy + 12 * dt
    );
    player.style.filter =
      "drop-shadow(0 5px 5px rgba(0,0,0,.5))";
  }

  if (state.invincible > 0) {
    state.invincible -= dt;
  }

  player.style.bottom =
    `calc(22% + ${state.y}px)`;

  player.style.transform = state.boosting
    ? "scale(1.15) skewX(-12deg)"
    : "none";
}

function updateObjects(dt) {
  const playerRect = getPlayerRect();

  for (const object of [...state.objects]) {
    object.x -= state.speed * dt;
    setObjectPosition(object);

    if (overlaps(playerRect, getObjectRect(object))) {
      if (object.type === "ring") {
        collectRing(object);
      } else {
        hitObstacle(object);
      }
      continue;
    }

    if (object.x < -100) {
      removeObject(object);
    }
  }
}

function endLevel() {
  state.running = false;
  state.ended = true;

  const title = $("modal-title");
  const message = $("modal-message");
  const startButton = $("start-button");
  const secondaryButton = $("secondary-button");

  if (title) title.textContent = "¡ACTO COMPLETADO!";
  if (message) {
    message.textContent =
      `Puntuación: ${state.score} · Anillos: ${state.rings}. ` +
      "¡Has escapado de la ciudad!";
  }

  if (startButton) {
    startButton.textContent = "VOLVER A JUGAR";
    startButton.onclick = resetLevel;
  }

  if (secondaryButton) {
    secondaryButton.textContent = "VOLVER AL MENÚ";
    secondaryButton.onclick = () => {
      window.location.href = "../index.html";
    };
  }

  overlay.classList.remove("hidden");
}

function tick(now) {
  if (!state.running) return;

  const dt = Math.min((now - state.lastTime) / 1000 || 0, 0.035);
  state.lastTime = now;

  state.distance += state.speed * dt;
  state.spawnTimer -= dt;
  state.ringTimer -= dt;

  updatePlayer(dt);
  updateObjects(dt);

  if (state.spawnTimer <= 0) {
    spawnObstacle();
    state.spawnTimer = 1.25 + Math.random() * 1.3;
  }

  if (state.ringTimer <= 0) {
    spawnRingPattern();
    state.ringTimer = 1.8 + Math.random() * 1.2;
  }

  updateHUD();

  if (state.distance >= CONFIG.levelLength) {
    endLevel();
    return;
  }

  state.animationFrame = requestAnimationFrame(tick);
}

function startLevel() {
  overlay.classList.add("hidden");
  state.running = true;
  state.ended = false;
  state.lastTime = performance.now();

  player.classList.add("running");
  showToast("¡CORRE!");
  state.animationFrame = requestAnimationFrame(tick);
}

function resetLevel() {
  cancelAnimationFrame(state.animationFrame);

  for (const object of [...state.objects]) {
    removeObject(object);
  }

  state.running = false;
  state.ended = false;
  state.distance = 0;
  state.speed = CONFIG.baseSpeed;
  state.rings = 0;
  state.score = 0;
  state.y = 0;
  state.velocityY = 0;
  state.jumping = false;
  state.boosting = false;
  state.invincible = 0;
  state.spawnTimer = 0.7;
  state.ringTimer = 0.4;
  state.boostEnergy = 100;
  state.jumpQueued = false;

  player.style.bottom = "22%";
  player.style.transform = "none";
  player.classList.remove("jumping", "hit");
  player.classList.add("running");

  const title = $("modal-title");
  const message = $("modal-message");
  const startButton = $("start-button");
  const secondaryButton = $("secondary-button");

  if (title) title.textContent = "ESCAPE FROM THE CITY";
  if (message) {
    message.textContent =
      "¡Corre por la ciudad, recoge anillos y esquiva los obstáculos!";
  }

  if (startButton) {
    startButton.textContent = "¡COMENZAR!";
    startButton.onclick = startLevel;
  }

  if (secondaryButton) {
    secondaryButton.textContent = "VOLVER AL MENÚ";
    secondaryButton.onclick = () => {
      window.location.href = "../index.html";
    };
  }

  updateHUD();
  startLevel();
}

function bindHold(id, callback, releaseCallback) {
  const button = $(id);
  if (!button) return;

  button.addEventListener("pointerdown", event => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    callback();
  });

  const release = event => {
    event.preventDefault();
    if (releaseCallback) releaseCallback();
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}

bindHold("jump", () => {
  state.jumpQueued = true;
});

bindHold(
  "boost",
  () => { state.boosting = true; },
  () => { state.boosting = false; }
);

window.addEventListener("keydown", event => {
  const key = event.key.length === 1
    ? event.key.toLowerCase()
    : event.key;

  if ([" ", "ArrowUp", "ArrowDown", "Shift"].includes(key)) {
    event.preventDefault();
  }

  state.keys.add(key);

  if (key === "Escape" && state.running) {
    state.running = false;
    overlay.classList.remove("hidden");
  }
});

window.addEventListener("keyup", event => {
  const key = event.key.length === 1
    ? event.key.toLowerCase()
    : event.key;

  state.keys.delete(key);
});

window.addEventListener("blur", () => {
  state.keys.clear();
  state.boosting = false;
});

const startButton = $("start-button");
if (startButton) {
  startButton.addEventListener("click", startLevel);
}

const secondaryButton = $("secondary-button");
if (secondaryButton) {
  secondaryButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

updateHUD();
