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

  //cheat detector function that will return true if there is an issue with the response based on known range (true ==> lying, false ==> not lying)
  function cheatDetector(min, max, guess, modifyRange) {
    //if the min=max=guess then the computer has narrowed down the number to the correct guess
    if (min === max && min === guess) {
      console.log(
        `Your name must be Simba, 'cause you're a-lying. The number MUST be ${guess}.`
      );
      return true;
      //runs through scenarios when 'h' or 'l' are given incorrectly
    } else {
      if (modifyRange === "h") {
        //if the user indicates the number is higher but the guess is already the max included value ==> returns true
        if (guess + 1 > max) {
          console.log(
            `Liar, liar pants on fire! You said the number was lower than ${
              max + 1
            }, so it can't also be higher than ${guess}...`
          );
          return true;
        }
      }
      if (modifyRange === "l") {
        //if the user indicates the number is lower but the guess is already the min included value ==> returns true
        if (guess - 1 < min) {
          console.log(
            `Cheater, cheater pumpkin eater! You said the number was higher than ${
              min - 1
            }, so it can't also be lower than ${guess}!`
          );
          return true;
        }
      }
      return false;
    }
  }

  //keep track of min & max for range of guesses
  let min = 1;
  let max = 100;

  //declares wantToPlay variable to allow users to play multiple times
  let wantToPlay = "y";

  //starts the game
  console.log(
    "Let's play a game where you (human) pick a number between 1 and a maximum, and I (computer) try to guess it."
  );

  //while loop here to play the game again....
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
      //if the min, max and guess are all equal then the computer has correctly narrowed down the number and the user is cheating
      if (cheatDetector(min, max, guess, "")) {
        console.log("Please be honest this time....");
        //since numOfGuess will iterate once more when the computer prompts the users again we need to walk it down by 1 to correctly indicate the number of guesses taken
        numOfGuess -= 1;
      } else {
        console.log("Bummer.");

        //declare the variable modifyRange that will hold h/l
        let modifyRange = "";

        while (!modifyRange) {
          //stores the h/l response from the user in modifyRange
          modifyRange = await ask(
            `Is the number higher (h) or lower (l) than ${guess}? `
          );
          // if the number is higher, the guess+1 is the new min of the range
          if (modifyRange === "h") {
            if (cheatDetector(min, max, guess, modifyRange)) {
              console.log("Please tell me the truth this time...");
              modifyRange = "";
            } else {
              min = guess + 1;
            }
          }
          //if the number is lower, the guess-1 is the new max of the range
          else if (modifyRange === "l") {
            if (cheatDetector(min, max, guess, modifyRange)) {
              console.log("Please tell me the truth this time...");
              modifyRange = "";
            } else {
              max = guess - 1;
            }
          }
        }
      }
    }
  }
  process.exit();
}

start();
