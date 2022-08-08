// const cards = [...document.getElementsByClassName('card')];

// const turn = e => {
//     const card = e.currentTarget;
//     const classes = [...card.classList];
//     console.log(classes);
//     card.classList.toggle("turn");
//     if(classes.includes('turn')){
//         card.classList.toggle('return')
//     }
//     console.log(classes);
// }

// const addListener = (child) => {
//     child.addEventListener('click', turn);
// }

// cards.forEach(addListener);

// console.log(cards)

import data from "./data/idioms.js";

let idioms = data.map((idiom) => ({
  ...idiom,
  guessed: false,
}));

const audio = new Audio("./data/Rome.mp3");
const endGameAudio = new Audio("./data/endgame-music.mp3");
const language_ENG = "ENG";
const language_PL = "PL";
let cards = [...document.getElementsByClassName("card")];
const points = document.getElementById("points");
const startOverBtn = document.getElementById("start-over");
const randomizeBtn = document.getElementById("Randomize");
const muteBtn = document.getElementById("muteBtn");
const endButton = document.getElementById("endButton");
const gameEndModal = document.getElementById("gameEndModal");
const newGameButton = document.getElementById("newGameButton");
const snowflakeFigure = document.getElementById("snowflakeFigure");
let gameArray = [];
let first = true;
let firstGuess = null;
let lock = false;
let isAudioActive = true;
let shuffledIndexes = [];
let clearedCards = [];
let isRandomized = false;
let end = false;

const shuffle = () => {
  const shuffledIndexes = Array.from(Array(cards.length).keys());
  shuffledIndexes.sort(() => Math.random() - 0.5); // shuffles array
  return shuffledIndexes;
};

const generateCard = () => {
  for (const [index, idiom] of idioms.entries()) {
    gameArray.push({
      card: cards[shuffledIndexes[2 * index]],
      idiomIndex: index,
      language: language_ENG,
      idiom: idiom.eng,
    });

    gameArray.push({
      card: cards[shuffledIndexes[2 * index + 1]],
      idiomIndex: index,
      language: language_PL,
      idiom: idiom.pl,
    });

    console.log(gameArray[index]);
  }
};

const game = () => {
  console.log(idioms);
  shuffledIndexes = shuffle();
  if (!isRandomized) generateCard();

  for (const element of gameArray) {
    element.card.addEventListener("click", () => eventHandler(element));
  }
};

const randomize = () => {
  restart();
  generateCard();
  gameArray = gameArray.map((card) => {
    if (clearedCards.includes(card.idiom)) {
      card.card.style.visibility = "hidden";
    }
    return card;
  });
  isRandomized = true;
  game();
};

const gameEnd = () => {
  endButton.style.visibility = "visible";
};

const chackIfGameOver = () => {
  let count = 0;
  idioms.forEach((idiom) => {
    if (idiom.guessed === true) {
      count++;
    }
  });

  if (idioms.length === count) gameEnd();
};

const eventHandler = (element) => {
  if (element.guessed || lock) return;
  if (!first) {
    if (
      firstGuess.idiomIndex === element.idiomIndex &&
      firstGuess.language === element.language
    )
      return;
  }

  if (first) {
    firstGuess = { ...element };
    showIdiom(element);
  } else {
    lock = true;

    showIdiom(element);
    hideIdioms(firstGuess, element);
    if (
      firstGuess.idiomIndex === element.idiomIndex &&
      firstGuess.language !== element.language
    ) {
      snowflakeFigure.classList.add("animate__shakeY");
      idioms[element.idiomIndex].guessed = true;
      clear(firstGuess, element);
      firstGuess = null;
    }
  }

  chackIfGameOver();

  first = !first;
};

const startGame = () => {
  first = true;
  firstGuess = null;
  lock = false;
  gameArray = [];
  //   idioms = data.map((idiom) => ({
  //     ...idiom,
  //     guessed: false,
  //   }));
  if (isAudioActive) {
    audio.play();
  }
  show();
  game();
};

startOverBtn.addEventListener("click", (event) => {
  restart();
  clearedCards = [];
  startGame();
});

randomizeBtn.addEventListener("click", (event) => {
  randomize();
});

muteBtn.addEventListener("click", (event) => {
  if (isAudioActive) {
    audio.pause();
  } else {
    audio.play();
  }
  isAudioActive = !isAudioActive;
});

endButton.addEventListener("click", (event) => {
  endButton.style.visibility = "hidden";
  gameEndModal.style.visibility = "visible";
  endPointsCounter.innerHTML = points.innerHTML;
  if (isAudioActive) endGameAudio.play();
});

newGameButton.addEventListener("click", (event) => {
  gameEndModal.style.visibility = "hidden";
  endGameAudio.pause();
  restart();
  clearedCards = [];
  startGame();
});

const clear = (firstGuess, secondGuess) => {
  setTimeout(() => {
    points.innerHTML = +points.innerHTML + 10;
    clearedCards.push(firstGuess.idiom);
    clearedCards.push(secondGuess.idiom);
    firstGuess.card.style.visibility = "hidden";
    secondGuess.card.style.visibility = "hidden";
    snowflakeFigure.classList.remove("animate__shakeY");
  }, 1500);
};

const show = () => {
  clearedCards.forEach((elem) => {
    elem.card.style.visibility = "visible";
  });
};

const hideIdioms = (firstGuess, secondGuess) => {
  setTimeout(() => {
    firstGuess.card.classList.remove("turn");
    secondGuess.card.classList.remove("turn");
    firstGuess.card.innerHTML = "";
    secondGuess.card.innerHTML = "";
  }, 1500);

  setTimeout(() => {
    lock = false;
  }, 2000);
};

const showIdiom = (element) => {
  element.card.classList.add("turn");
  element.card.insertAdjacentHTML("afterbegin", `<p>${element.idiom}</p>`);
};

const restart = () => {
  const container = document.getElementById("cards");
  cards = cards.map((card) => {
    card.remove();
    card = document.createElement("div");
    card.classList.add("card");
    container.appendChild(card);
    return card;
  });
};

startGame();
