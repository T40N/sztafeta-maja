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
const language_ENG = "ENG";
const language_PL = "PL";
let cards = [...document.getElementsByClassName("card")];
const startOverBtn = document.getElementById("start-over");
const randomizeBtn = document.getElementById("Randomize");
let gameArray = [];
let first = true;
let firstGuess = null;
let lock = false;
let isAudioActive = true;
let shuffledIndexes = [];
let clearedCards = [];
let eventfirst = true;

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
  shuffledIndexes = shuffle();
  generateCard();

  for (const element of gameArray) {
    element.card.addEventListener("click", () => eventHandler(element));
  }
};

const randomize = () => {
  refresh();
  idioms = idioms.filter((idiom) => !idiom.guessed);
  game();
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
      idioms[element.idiomIndex].guessed = true;
      clear(firstGuess, element);
      firstGuess = null;
    }
  }

  first = !first;
};

const startGame = () => {
  refresh();
  first = true;
  firstGuess = null;
  lock = false;
  gameArray = [];
  eventfirst = true;
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
  startGame();
});

randomizeBtn.addEventListener("click", (event) => {
  randomize();
});

const clear = (firstGuess, secondGuess) => {
  setTimeout(() => {
    clearedCards.push(firstGuess);
    clearedCards.push(secondGuess);
    firstGuess.card.style.visibility = "hidden";
    secondGuess.card.style.visibility = "hidden";
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

const refresh = () => {
  const container = document.getElementById("cards");
  cards = cards.map((card) => {
    card.remove();
    card = document.createElement("div");
    card.classList.add("card");
    container.appendChild(card);
    return card;
    // card.removeEventListener("click", eventHandler);
  });
};

startGame();
