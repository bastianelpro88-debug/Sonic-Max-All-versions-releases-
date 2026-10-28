
"use strict";

// ==========================================
// SONIC MAX — INTRO Y MENÚ PRINCIPAL
// HTML + CSS + JAVASCRIPT
// ==========================================

const CONFIG = {
  introDuration: 8500,
  characterStagger: 650,
  characterAnimationDuration: 1500
};

const CHARACTERS = [
  {
    id: "sonic",
    name: "Sonic",
    color: "#0874ff",
    ability: "Spin Dash",
    special: "Velocidad extrema"
  },
  {
    id: "tails",
    name: "Tails",
    color: "#ff9d22",
    ability: "Vuelo",
    special: "Volar con sus colas"
  },
  {
    id: "knuckles",
    name: "Knuckles",
    color: "#e92c36",
    ability: "Golpe poderoso",
    special: "Escalada"
  },
  {
    id: "shadow",
    name: "Shadow",
    color: "#252535",
    ability: "Chaos Control",
    special: "Chaos Spear"
  },
  {
    id: "rouge",
    name: "Rouge",
    color: "#f17be7",
    ability: "Planeo",
    special: "Bomba de murciélago"
  },
  {
    id: "amy",
    name: "Amy",
    color: "#ff55b8",
    ability: "Martillo Piko Piko",
    special: "Salto doble"
  },
  {
    id: "sach",
    name: "Sach",
    color: "#922bff",
    ability: "Rayo de energía",
    special: "Velocidad aumentada"
  }
];

// ==========================================
// ELEMENTOS PRINCIPALES
// ==========================================

const intro = document.getElementById("intro");
const titleScreen = document.getElementById("titleScreen");
const continueButton = document.getElementById("continueButton");

let selectedCharacter = "sonic";
let gameStarted = false;
let introTimers = [];

// ==========================================
// UTILIDADES
// ==========================================

function clearIntroTimers() {
  introTimers.forEach(timer => clearTimeout(timer));
  introTimers = [];
}

function scheduleIntro(callback, delay) {
  const timer = setTimeout(callback, delay);
  introTimers.push(timer);
}

function getCharacter(id) {
  return CHARACTERS.find(character => character.id === id);
}

// ==========================================
// INTRO ANIMADA
// ==========================================

function startIntro() {
  if (!intro || !titleScreen) return;

  clearIntroTimers();
  gameStarted = false;

  titleScreen.style.display = "none";

  CHARACTERS.forEach((character, index) => {
    const sprite = document.getElementById(character.id);

    if (!sprite) {
      console.warn(
        `SONIC MAX: falta el elemento #${character.id} en index.html`
      );
      return;
    }

    // Reiniciar la posición y la animación.
    sprite.style.animation = "none";
    sprite.style.left = "-100px";
    sprite.style.display = "block";

    // Obligar al navegador a reiniciar la animación CSS.
    void sprite.offsetWidth;

    // Cada personaje utiliza su propia animación CSS.
    sprite.style.animation =
      `${character.id}Enter ${CONFIG.characterAnimationDuration / 1000}s ` +
      `${index * CONFIG.characterStagger}ms steps(12, end) forwards`;
  });

  // Mostrar el logo después de las entradas.
  const finalDelay =
    (CHARACTERS.length - 1) * CONFIG.characterStagger +
    CONFIG.characterAnimationDuration;

  scheduleIntro(() => {
    titleScreen.style.display = "flex";
    titleScreen.style.opacity = "0";
    titleScreen.style.animation = "none";

    void titleScreen.offsetWidth;

    titleScreen.style.animation = "titleReveal 1s forwards";
  }, Math.max(CONFIG.introDuration, finalDelay));
}

// ==========================================
// MENÚ PRINCIPAL
// ==========================================

function showMainMenu() {
  if (!titleScreen) return;

  clearIntroTimers();
  titleScreen.style.display = "flex";
  titleScreen.style.opacity = "1";
  titleScreen.style.animation = "none";

  titleScreen.innerHTML = `
    <div class="logo-emblem">✦</div>
    <p class="edition">BIENVENIDO A</p>

    <h1>SONIC <span>MAX</span></h1>

    <p class="subtitle">ELIGE TU PERSONAJE</p>

    <div id="characterMenu"
         style="
           display:flex;
           flex-wrap:wrap;
           justify-content:center;
           gap:8px;
           max-width:650px;
         ">
      ${CHARACTERS.map(character => `
        <button
          type="button"
          data-character="${character.id}"
          style="background:${character.color};margin:4px;padding:10px">
          ${character.name}
        </button>
      `).join("")}
    </div>

    <p id="characterInfo">
      Sonic — Velocidad extrema
    </p>

    <button id="startGameButton" type="button">
      ▶ COMENZAR AVENTURA
    </button>

    <button id="replayButton" type="button">
      ↻ VER INTRO OTRA VEZ
    </button>
  `;

  // Selección de personaje.
  titleScreen.querySelectorAll("[data-character]").forEach(button => {
    button.addEventListener("click", () => {
      selectedCharacter = button.dataset.character;

      const character = getCharacter(selectedCharacter);
      const info = document.getElementById("characterInfo");

      if (!character || !info) return;

      info.textContent =
        `${character.name} — ${character.ability} · ${character.special}`;

      // Destacar el personaje seleccionado.
      titleScreen.querySelectorAll("[data-character]").forEach(item => {
        item.style.outline =
          item.dataset.character === selectedCharacter
            ? "3px solid white"
            : "none";
      });
    });
  });

  document
    .getElementById("startGameButton")
    .addEventListener("click", startGame);

  document
    .getElementById("replayButton")
    .addEventListener("click", startIntro);
}

// ==========================================
// PANTALLA DE INICIO DE PARTIDA
// ==========================================

function startGame() {
  if (gameStarted || !intro) return;

  const character = getCharacter(selectedCharacter);

  if (!character) return;

  gameStarted = true;
  clearIntroTimers();

  intro.innerHTML = `
    <section style="
      position:absolute;
      inset:0;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      text-align:center;
      padding:20px;
      background:#09051f;
      color:white;
      font-family:monospace;
    ">
      <p style="color:#4ceaff;letter-spacing:3px">
        SONIC MAX
      </p>

      <h1>
        <span style="color:${character.color}">
          ${character.name}
        </span>
      </h1>

      <p>HABILIDAD: ${character.ability}</p>
      <p>ESPECIAL: ${character.special}</p>

      <p style="max-width:420px">
        ¡${character.name.toUpperCase()} está preparado para la aventura!
      </p>

      <p style="color:#ffe34c">
        PRÓXIMAMENTE: NIVEL 1
      </p>

      <button id="backToMenuButton" type="button">
        VOLVER AL MENÚ
      </button>
    </section>
  `;

  document
    .getElementById("backToMenuButton")
    .addEventListener("click", () => {
      // Recargar para restaurar todos los elementos del HTML.
      location.reload();
    });
}

// ==========================================
// BOTÓN INICIAL
// ==========================================

if (continueButton) {
  continueButton.addEventListener("click", showMainMenu);
}

// ==========================================
// ARRANCAR SONIC MAX
// ==========================================

startIntro();
