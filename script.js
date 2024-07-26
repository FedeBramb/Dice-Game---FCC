const listOfAllDice = document.querySelectorAll(".die"); // Divs contenenti i risultati dei lanci dadi
const scoreInputs = document.querySelectorAll("#score-options input"); // Tutti gli input nel div con id score-option
const scoreSpans = document.querySelectorAll("#score-options span"); // Tutti gli span nel div con id score-option
const currentRoundText = document.getElementById("current-round"); // Testo del round corrente
const currentRoundRollsText = document.getElementById("current-round-rolls"); // Testo con numero rolls correnti
const totalScoreText = document.getElementById("total-score"); // Testo punteggio totale
const scoreHistory = document.getElementById("score-history"); // Lista dove vengono visualizzati i punteggi precedenti
const rollDiceBtn = document.getElementById("roll-dice-btn"); // Bottone per lanciare i dadi
const keepScoreBtn = document.getElementById("keep-score-btn"); //
const rulesContainer = document.querySelector(".rules-container"); // Contenitore con le regole
const rulesBtn = document.getElementById("rules-btn"); // Bottone per mostrare le regole


// Genera casualmente i valori dei dadi e li visualizza nei divs corrispondenti.
let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let totalScore = 0;
let round = 1; 
let rolls = 0; 

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  };

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

//Aggiorna il testo che mostra il numero di rolls correnti e il numero del round corrente.
const updateStats = () => {
  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;
};

//Aggiorna le opzioni radio nel div con id score-options abilitando l'opzione selezionata, 
//impostando il suo valore e aggiungendo un testo indicante lo score ottenuto.
const updateRadioOption = (optionNode, score) => {
  scoreInputs[optionNode].disabled = false;
  scoreInputs[optionNode].value = score;
  scoreSpans[optionNode].textContent = `, score = ${score}`;
};

//Aggiorna il punteggio totale e visualizza lo score ottenuto nella lista di storico punteggi.
const updateScore = (selectedValue, achieved) => {
  totalScore += parseInt(selectedValue);
  totalScoreText.textContent = totalScore;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

//Verificano la presenza di combinazioni specifiche di dadi (Three of a Kind, Full House, Straights)
// e aggiornano le opzioni radio di conseguenza.
const getHighestDuplicates = (arr) => {
  const counts = {};

  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  let highestCount = 0;

  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  const sumOfAllDice = diceValuesArr.reduce((a, b) => a + b, 0);

  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  updateRadioOption(5, 0);
};

const detectFullHouse = (arr) => {
  const counts = {};

  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25);
  }

  updateRadioOption(5, 0);
};

const checkForStraights = (arr) => {
  const sortedNumbersArr = arr.sort((a, b) => a - b);
  const uniqueNumbersArr = [...new Set(sortedNumbersArr)];
  const uniqueNumbersStr = uniqueNumbersArr.join("");

  const smallStraightsArr = ["1234", "2345", "3456"];
  const largeStraightsArr = ["12345", "23456"];

  if (smallStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(3, 30);
  }

  if (largeStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(4, 40);
  }

  updateRadioOption(5, 0);
};

const resetRadioOption = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  totalScore = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreText.textContent = totalScore;
  scoreHistory.innerHTML = "";

  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;

  resetRadioOption();
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOption();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);
}
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide Rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show Rules";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOption();
    updateScore(selectedValue, achieved);
    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${totalScore}`);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice");
  }
});