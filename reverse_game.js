////Boilerplate code set up correctly - used to accept input from user
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

  //intros the game
  console.log(
    "Let's play a game where I (computer) pick a number between 1 and 100, and you (human) try to guess it."
  );

  //declares wantToPlay variable to allow users to play multiple times
  let wantToPlay = "y";

  //while wantToPlay is yes the game will continue to run.  If the user selects no the game ends
  while (wantToPlay === "y" || wantToPlay === "yes") {
    //the computer picks a random number between 1 and 100
    let randomNumber = chooseRandomNumber(1, 100);
    //declare the variable to hold the user's guess
    let guess = 0;

    console.log("\nI have picked a random number between 1 and 100.");

    //allows the user to guess as long as guess is not equal to the chosen randomNumber
    while (randomNumber !== +guess) {
      //prompts the use for a guess
      guess = await ask("\nPlease make a guess: ");
      //if the guess is less than the randomNumber indicates that the guess is too low
      if (randomNumber > +guess) {
        console.log("\nYou guessed too low.");
      }
      //if the guess is greater than the random number indicates that the guess is too high
      else if (randomNumber < +guess) {
        console.log("\nYou guessed too high.");
      }
      //only triggered if the guess is equal to the randomNumber
      else {
        console.log(
          `\nCongratulations! You correctly guessed that the number is ${randomNumber}.`
        );

        //prompts the user if they'd like to play again
        wantToPlay = await ask("\nWould you like to play again? (y/n): ");

        //if the user does not want to play again the game exits
        if (wantToPlay === "n" || wantToPlay === "no") {
          console.log("\nGoodbye, thanks for playing!");
          process.exit();
        }
      }
    }
  }
}

start();
