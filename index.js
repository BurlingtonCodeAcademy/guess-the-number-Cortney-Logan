const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

async function start() {
  //returns a random guess between the given min and max range
  function makeRandomGuess(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  //returns a guess that is half way between the min and max range
  function makeSmartGuess(min, max) {
    return min + Math.floor((max - min) / 2);
  }

  //cheat detector function that will return if there is an issue with the response based on known range
  function cheatDetector(min, max, guess, modifyRange) {
    if (modifyRange === "h") {
      if (guess + 1 > max) {
        console.log(
          `You said the number was lower than ${
            max + 1
          }, so it can't also be higher than ${guess}!`
        );
        return true;
      }
    }
    if (modifyRange === "l") {
      if (guess - 1 < min) {
        console.log(
          `You said the number was higher than ${
            min - 1
          }, so it can't also be lower than ${guess}!`
        );
        return true;
      }
    }
    return false;
  }

  //keep track of min & max for range of guesses
  let min = 1;
  let max = 100;

  //starts the game
  console.log(
    "Let's play a game where you (human) pick a number between 1 and a maximum, and I (computer) try to guess it."
  );
  //allow the user to set the high range
  max = await ask("What would you like the maximum number to be? ");

  //confirms the user is ready to play
  let readyToPlay = await ask(
    `Have you decided on a random number between 1 and ${max}? (y/n): `
  );

  //waits until the player is ready to play by entering 'y' or 'yes'
  while (readyToPlay !== "y" && readyToPlay !== "yes") {
    readyToPlay = await ask(
      "Ok, I'll wait, please pick a number between 1 and 100. Are you ready now? (y/n) "
    );
  }
  console.log("Great, let's get started!");

  // declares the variable that will store the users response if the computer's guess is correct or not
  let response = "n";
  //declares the numOfGuess variable to keep track of the number of guesses
  let numOfGuess = 0;

  //while the user has not responded 'y' to indicate that the computer has correctly guessed, the computer will continue making guesses
  while ((response === "n") | (response === "no")) {
    //sets the computer up to make a random guess within the current range
    //let guess = makeRandomGuess(min, max);
    //sets the computer up to make a smart guess within the current range
    let guess = makeSmartGuess(min, max);

    //stores the users response if the computer's guess is correct or not
    // console.log(
    //   `BUG: in the body of the while loop the current range is ${min} to ${max}`
    // );
    response = await ask(`Is the number ${guess}? (y/n): `);

    //the computer has made another guess - index number of guesses made by 1
    numOfGuess += 1;

    // if the computer guessed the correct number ==> user responds 'y' and game gives victory message
    if (response === "y" || response === "yes") {
      console.log(
        `Aha! Your number was ${guess}! I win!\nIt only took me ${numOfGuess} tries to correctly guess your number.`
      );
    }
    //if the computer guessed wrong it asks if the number is higher or lower
    else {
      //stores the h/l response from the user as a variable
      let modifyRange = await ask(
        `Bummer.  Is the number higher (h) or lower (l)? `
      );
      // if the number is higher, the guess+1 is the new min of the range
      if (modifyRange === "h") {
        if (cheatDetector(min, max, guess, modifyRange)) {
          console.log("you are cheating!");
        } else {
          min = guess + 1;
        }
        //console.log(`the range is now ${min} to ${max}`);
      }
      //if the number is lower, the guess-1 is the new max of the range
      else if (modifyRange === "l") {
        if (cheatDetector(min, max, guess, modifyRange)) {
          console.log("you are cheating!");
        } else {
          max = guess - 1;
        }
        //console.log(`the range is now ${min} to ${max}`);
      }
    }
  }

  process.exit();
}

//adding a comment
start();
