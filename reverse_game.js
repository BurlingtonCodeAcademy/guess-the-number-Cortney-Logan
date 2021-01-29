const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

async function start() {
  //returns a random guess between the given min and max range
  function chooseRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  console.log(
    "Let's play a game where I (computer) make up a number and you (human) try to guess it."
  );

  //the computer picks a random number between 1 and 100
  let randomNumber = chooseRandomNumber(1, 100);
  //declare the variable to hold the user's guess
  let guess = 0;

  console.log("I have picked a random number between 1 and 100.");

  //allows the user to guess as long as guess is not equal to the chosen randomNumber
  while (randomNumber !== +guess) {
    //prompts the use for a guess
    guess = await ask("Please make a guess: ");
    //if the guess is less than the randomNumber indicates that the guess is too low
    if (randomNumber > +guess) {
      console.log("You guessed too low.");
    }
    //if the guess is greater than the random number indicates that the guess is too high
    else if (randomNumber < +guess) {
      console.log("You guessed too high.");
    }
    //only triggered if the guess is equal to the randomNumber
    else {
      console.log(
        `Congratulations! You correctly guessed that the number is ${randomNumber}.`
      );
      break;
    }
  }
  process.exit();
}

start();
