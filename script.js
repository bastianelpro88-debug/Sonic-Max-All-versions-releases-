
"use strict";

// =====================================
// SONIC MAX — INTRO Y CONTROL DEL JUEGO
// =====================================

const CONFIG = {
  introDuration: 7200,
  characterStagger: 650
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
    special: "Vuelo con sus colas"
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

const intro = document.getElementById("intro");
const titleScreen = document.getElementById("titleScreen");
const continueButton = document.getElementById("continueButton");

let gameStarted = false;
let selectedCharacter = "sonic";
let introTimers = [];

// =====================================
// UTILIDADES
// =====================================

function clearIntroTimers() {
  introTimers.forEach(clearTimeout);
  introTimers = [];
}

function scheduleIntro(callback, delay) {
  const timer = setTimeout(callback, delay);
  introTimers.push(timer);
}

function getCharacter(id) {
  return CHARACTERS.find(character => character.id === id);
}

// =====================================
// ANIMACIÓN DE INTRO
// =====================================

function startIntro() {
  if (!intro || !titleScreen) return;

  gameStarted = false;
  clearIntroTimers();

  titleScreen.style.display = "none";

  CHARACTERS.forEach((character, index) => {
    const sprite = document.getElementById(character.id);

    if (!sprite) return;

    sprite.style.display = "block";
    sprite.style.animation = "none";
    sprite.style.left = "-90px";

    // Reinicia la animación para poder repetir la intro.
    void sprite.offsetWidth;

    sprite.style.animation =
      `sonicEnter 1.5s ${index * CONFIG.characterStagger}ms steps(12, end) forwards`;
  });

  scheduleIntro(() => {
    titleScreen.style.display = "flex";
    titleScreen.style.opacity = "0";
    titleScreen.style.animation = "titleReveal 1s forwards";
  }, CONFIG.introDuration);
}

// =====================================
// PANTALLA DE TÍTULO Y MENÚ
// =====================================

function showMainMenu() {
  if (!titleScreen) return;

  titleScreen.innerHTML = `
    <p class="edition">BIENVENIDO A</p>
    <h1>SONIC <span>MAX</span></h1>
    <p class="subtitle">ELIGE TU PERSONAJE</p>
    <div id="characterMenu"
         style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:650px">
      ${CHARACTERS.map(character => `
        <button
          type="button"
          data-character="${character.id}"
          style="background:${character.color};margin:4px;padding:10px">
          ${character.name}
        </button>
      `).join("")}
    </div>
    <p id="characterInfo">Sonic — Velocidad extrema</p>
    <button id="startGameButton" type="button">
      COMENZAR AVENTURA
    </button>
    <button id="replayButton" type="button">
      VER INTRO OTRA VEZ
    </button>
  `;

  titleScreen.querySelectorAll("[data-character]").forEach(button => {
    button.addEventListener("click", () => {
      selectedCharacter = button.dataset.character;

      const character = getCharacter(selectedCharacter);
      const info = document.getElementById("characterInfo");

      if (info && character) {
        info.textContent =
          `${character.name} — ${character.ability} / ${character.special}`;
      }
    });
  });

  document.getElementById("startGameButton")
    .addEventListener("click", startGame);

  document.getElementById("replayButton")
    .addEventListener("click", startIntro);
}

// =====================================
// INICIO DE LA PARTIDA
// =====================================

function startGame() {
  if (gameStarted) return;

  gameStarted = true;

  const character = getCharacter(selectedCharacter);

  if (!character || !intro) return;

  clearIntroTimers();

  intro.innerHTML = `
    <section style="
      position:absolute;inset:0;
      display:flex;flex-direction:column;
      justify-content:center;align-items:center;
      text-align:center;background:#087bd1;color:white;
      font-family:monospace;padding:20px">
      <h1>SONIC <span style="color:#ffe34c">MAX</span></h1>
      <h2 style="color:${character.color}">
        ${character.name}
      </h2>
      <p>Habilidad: ${character.ability}</p>
      <p>Especial: ${character.special}</p>
      <p>¡Personaje seleccionado correctamente!</p>
      <p>Próximo paso: conectar el nivel 1 y sus controles.</p>
      <button id="backToMenuButton" type="button">
        VOLVER AL MENÚ
      </button>
    </section>
  `;

  document.getElementById("backToMenuButton")
    .addEventListener("click", () => {
      location.reload();
    });
}

// =====================================
// INICIAR
// =====================================

if (continueButton) {
  continueButton.addEventListener("click", showMainMenu);
}

startIntro();
