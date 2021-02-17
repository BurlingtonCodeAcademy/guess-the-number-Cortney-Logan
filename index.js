//Boilerplate code set up correctly - used to accept input from user
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//Guess The Number game - the users picks a number and the computer guesses
async function computerGuesses() {
  //returns a guess that is half way between the min and max range
  function makeSmartGuess(min, max) {
    return min + Math.floor((max - min) / 2);
  }

  //cheat detector function that will return true if there is an issue with the response based on known range (true ==> lying, false ==> not lying)
  function cheatDetector(min, max, guess, secretNumber, modifyRange) {
    //if the computer's guess is the secret number but the user has said no, the computer calls them out for cheating
    if (guess === secretNumber) {
      console.log(
        `\nHmmm, is your name Mufasa, 'cause I think you're a-lying...\n`
      );
      return true;
    } else {
      if (modifyRange === "h" || modifyRange === "higher") {
        //if the user indicates the number is higher but the guess is already the max included value ==> returns true
        if (guess + 1 > max) {
          console.log(
            `\nLiar, liar pants on fire! You said the number was lower than ${
              max + 1
            }, so it can't also be higher than ${guess}...\n`
          );
          return true;
        }
      }
      if (modifyRange === "l" || modifyRange === "lower") {
        //if the user indicates the number is lower but the guess is already the min included value ==> returns true
        if (guess - 1 < min) {
          console.log(
            `\nCheater, cheater pumpkin eater! You said the number was higher than ${
              min - 1
            }, so it can't also be lower than ${guess}!\n`
          );
          return true;
        }
      }
      return false;
    }
  }

  //intros the game
  console.log(
    "Let's play a game where you (human) pick a number between 1 and a maximum, and I (computer) try to guess it."
  );

  //declares wantToPlay variable to allow users to play multiple times
  let wantToPlay = "y";

  //while wantToPlay is yes the game will continue to run.  If the user selects no the game ends
  while (wantToPlay === "y" || wantToPlay === "yes") {
    //keep track of min & max for range of guesses. Default values are 1 and 100
    let min = 1;
    let max = 100;

    //allow the user to set the high range
    max = await ask("\nWhat would you like the maximum number to be? ");

    //makes sure number submitted is a valid number
    while (isNaN(max)) {
      max = await ask(
        "\nLet's try this again. Please enter a number you'd like to use as the maximum. "
      );
    }

    //confirms the user is ready to play
    let readyToPlay = await ask(
      `\nHave you decided on a random number between 1 and ${max}? (y/n): `
    );
    //sanitizes readyToPlay
    readyToPlay = readyToPlay.trim().toLowerCase();

    //waits until the player is ready to play by entering 'y' or 'yes'
    while (readyToPlay !== "y" && readyToPlay !== "yes") {
      readyToPlay = await ask(
        `\nOk, I'll wait, please pick a number between 1 and ${max}. Are you ready now? (y/n): `
      );
      //sanitizes readyToPlay
      readyToPlay = readyToPlay.trim().toLowerCase();
    }

    //declares a variable to store the user's number to be used to detect cheating
    let secretNumber = await ask(
      "\nWhat is your secret number? I won't peak, I promise..."
    );

    //sanitizes input into a number if a string has been entered
    secretNumber = +secretNumber;

    //guard clause to check that the secret number entered is a number and within the range
    while (isNaN(secretNumber) || secretNumber > max || secretNumber < 1) {
      //if the input entered is not a number prompts user to re-enter secret number
      if (isNaN(secretNumber)) {
        secretNumber = await ask(
          `\nYou must enter a number. Please enter your secret number - remember it should be between 1 and ${max}. `
        );
      }
      //if the input is outside of the range 1 to max, prompts the user to re-enter the secret number
      else {
        secretNumber = await ask(
          `\nRemember, the number must be between 1 and ${max}. Please choose a different secret number that is within the correct range. `
        );
      }
      //sanitizes input into a number if a string has been entered
      secretNumber = +secretNumber;
    }

    //returns the secret number the user input
    console.log(
      `\nYou entered ${secretNumber}. \n\nBeep. Boop. Beep. Erasing from my memory.`
    );

    //starts the game
    console.log("\nNow I will try to guess your secret number!");

    // declares the variable that will store the users response if the computer's guess is correct or not
    let response = "n";
    //declares the numOfGuess variable to keep track of the number of guesses
    let numOfGuess = 0;

    //while the user has not responded 'y' to indicate that the computer has correctly guessed, the computer will continue making guesses
    while ((response === "n") | (response === "no")) {
      //sets the computer up to make a smart guess within the current range
      let guess = makeSmartGuess(min, max);

      //stores the users response if the computer's guess is correct or not
      response = await ask(`\nIs the number ${guess}? (y/n): `);

      //sanitizes response
      response = response.trim().toLowerCase();

      //the computer has made another guess - index number of guesses made by 1
      numOfGuess += 1;

      // if the computer guessed the correct number ==> user responds 'y' and game gives victory message
      if (response === "y" || response === "yes") {
        console.log(
          `\nAha! Your number was ${guess}! I win!\nIt only took me ${numOfGuess} tries to correctly guess your number.`
        );

        //prompts the user if they'd like to play again
        wantToPlay = await ask("\nWould you like to play again? (y/n): ");

        //sanitizes wantToPlay
        wantToPlay = wantToPlay.trim().toLowerCase();

        //if the user does not want to play again the game exits
        if (wantToPlay === "n" || wantToPlay === "no") {
          console.log("\nGoodbye, thanks for playing!");
          process.exit();
        }
      }

      //if the computer guessed wrong the user answers 'n' and computer asks if the number is higher or lower
      else {
        //if the min, max and guess are all equal then the computer has correctly narrowed down the number and the user is cheating
        if (cheatDetector(min, max, guess, secretNumber, "")) {
          console.log("Please be honest this time....");
          //since numOfGuess will iterate once more when the computer prompts the users again we need to walk it down by 1 to correctly indicate the number of guesses taken
          numOfGuess -= 1;
        } else {
          console.log("\nBummer.");
          //declare the variable modifyRange that will hold h/l
          let modifyRange = "";

          while (!modifyRange) {
            //stores the h/l response from the user in modifyRange
            modifyRange = await ask(
              `Is the number higher (h) or lower (l) than ${guess}? `
            );

            //sanitizes modifyRange
            modifyRange = modifyRange.trim().toLowerCase();

            // if the number is higher, the guess+1 is the new min of the range
            if (modifyRange === "h" || modifyRange === "higher") {
              if (cheatDetector(min, max, guess, secretNumber, modifyRange)) {
                console.log("Please tell me the truth this time...");
                modifyRange = "";
              } else {
                min = guess + 1;
              }
            }
            //if the number is lower, the guess-1 is the new max of the range
            else if (modifyRange === "l" || modifyRange === "lower") {
              if (cheatDetector(min, max, guess, secretNumber, modifyRange)) {
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
  }
}

//Guess The Number game - the computer picks a number and the user guesses
async function userGuesses() {
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

    //declares the numOfGuess variable to keep track of the number of guesses
    let numOfGuess = 0;

    //allows the user to guess as long as guess is not equal to the chosen randomNumber
    while (randomNumber !== +guess) {
      //prompts the use for a guess
      guess = await ask("\nPlease make a guess: ");

      //makes sure guess submitted is a valid number
      while (isNaN(guess)) {
        guess = await ask(
          "Let's try this again. Please enter a number as your guess. "
        );
      }
      numOfGuess += 1;
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

        //reports the number of guesses it took the user to correctly guess
        if (numOfGuess >= 7) {
          console.log(
            `It took you ${numOfGuess} tries to correctly guess my number.  You better keep practicing....`
          );
        } else {
          console.log(`It only took you ${numOfGuess} tries.  You're AMAZING!`);
        }

        //prompts the user if they'd like to play again
        wantToPlay = await ask("\nWould you like to play again? (y/n): ");

        //sanitizes wantToPlay
        wantToPlay = wantToPlay.trim().toLowerCase();

        //if the user does not want to play again the game exits
        if (wantToPlay === "n" || wantToPlay === "no") {
          console.log("\nGoodbye, thanks for playing!");
          process.exit();
        }
      }
    }
  }
}

//lets the user choose which version of teh guess the number game they'd like to play
async function playGame() {
  console.log("Hello and Welcome to the Guess The Number Game!");

  //asks the user which version of the game they'd like to play
  let gameChoice = await ask(
    "\nWhich game would you like to play?\n\t[1] You (human) pick a number, and I (computer) try to guess it.\n\t[2] I (computer) pick a number, and you (human) try to guess it.\nPlease select which game you'd like to play by entering either 1 or 2: "
  );

  //declares an array to hold the valid users input choices
  let choices = ["1", "2"];

  //sanitizes gameChoice
  gameChoice = gameChoice.trim();

  //checks that the choice is actually a number
  while (isNaN(gameChoice) || !choices.includes(gameChoice)) {
    gameChoice = await ask(
      "Let's try this again. Please enter either 1 or 2 to choose the game you'd like to play. "
    );
  }

  //sanitizes gameChoice
  gameChoice = gameChoice.trim();

  //triggers correct game to run once valid game choice has been made
  if (gameChoice === "1") {
    console.log("\nYou picked game 1, have fun!\n");
    computerGuesses();
  } else {
    console.log("\nYou picked game 2, good luck!\n");
    userGuesses();
  }
}

playGame();
