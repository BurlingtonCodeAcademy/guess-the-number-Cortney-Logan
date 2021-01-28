const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//returns a random guess between the given min and max range
function makeRandomGuess(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function start() {
  //starter code
  console.log(
    "Let's play a game where you (human) make up a number and I (computer) try to guess it."
  );
  let readyToPlay = await ask(
    "Have you picked a random number between 1 and 100? (y/n): "
  );
  if (readyToPlay === "y" || readyToPlay === "yes") {
    console.log("Great, let's get started!");
  } else {
    console.log("Ok, I'll wait, please pick a number between 1 and 100.");
  }

  //keep track of min & max for range of guesses
  let min = 1;
  let max = 100;

  //the computer makes a guess
  let guess = makeRandomGuess(min, max);
  let response = await ask(`Is the number ${guess}? (y/n): `);

  // if the computer guessed the correct number ==> user responds 'y' and game gives victory message
  if (response === "y" || response === "yes") {
    console.log(`Aha! Your number was ${guess}! I win!`);
  }
  //if the computer guessed wrong it asks if the number is higher or lower
  else {
    console.log(`Bummer.  Is the number higher (h) or lower (l)? `);
  }

  process.exit();
}

start();

//OUTLINE//
//users responds h or l and changes min or max respectively

//computer guesses again, but within the new range
//until it breaks - keep guessing
