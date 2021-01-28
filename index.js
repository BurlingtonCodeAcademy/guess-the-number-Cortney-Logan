const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

async function start() {
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
  };

  //keep track of min & max for range of guesses
  let min = 1;
  let max = 100;

  //the computer guesses - create a function that guesses a number within the current range

  //compare the number to the actual number
  // if the computer guessed the correct number ==> user responds 'y' and game gives victory message
  // else the computer guessed incorrectly ==> user responds 'n' and computer asks if higher or lower

  //users responds h or l and changes min or max respectively

  //computer guesses again, but within the new range
  //until it breaks - keep guessing

  process.exit();
}

start();