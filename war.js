//use these rules https://www.pagat.com/war/war.html
var war             = new Deck(), //deck to be used
    hands           = [], //the hands for each player
    numOfPlayers    = 2, //the number of players in the game
    handSize        = 26, //the hand size
    moves           = [], //the current move that is in play
    turn            = true, //whose turn it is
    isWar           = false, //if there is war
    winnerPile      = [], //pile cards for the people that won the war
    inProgress      = false, //the state of the game
    winner          = ""  //for who won the war
    debugging       = true;



  //get the start button and make an event listener for it
  var startButton = document.querySelector('button');
  startButton.addEventListener('click', function() {
    start();
  });
  /*
This function starts the game
*/
function start(){
  //listener
  var page = document.querySelector("html");
  page.addEventListener("click", function(){
      makeMove();
  });
  //create the deck of 52 cards
  war.createDeck();
  //shuffle deck
  war.shuffle();
  //deal to the number of players
  hands = war.dealToNPlayers(numOfPlayers, handSize)
  //render deck
  renderDecks();
  //hide button
  startButton.classList.add("hidden");
  //render "table"
  var table = document.querySelector(".war-decks");
  table.style.display = "flex";
  //set the progress to be true
  inProgress = true;
}
/*
  This funciton makes the move
*/
function makeMove(){

  //only make the move if the game is in progress
  if(inProgress){
    if (hands[0].length !== 0 && hands[1].length !== 0)
    {
    //player 1 turn
    if(turn){
      var card = hands[0].shift();
      moves[0] = card;
      renderMove(card);
      turn = !turn;
    }
    //player 2 turn
    else if(!turn){
      var card = hands[1].shift();
      moves[1] = card;
      renderMove(card);
      checkMoves();
      turn = !turn;
    }
   }

   else {
     inProgress = false;
     endGame();
   }
   //for debugging purposes
   if(debugging){
     if(inProgress){makeMove();}
     else {endGame();}
   }
 }
}

/*
 This function checks the moves
*/
function checkMoves(card) {
  var value = moves[0].value;
  var valueTwo = moves[1].value;
  console.log("V1:", value);
  console.log("V2:", valueTwo);
  //change the value of the ace value
  if(value === 1) {value = 14;}
  if(valueTwo === 1) {valueTwo = 14;}
  //if player one drew a higher value
  if(value > valueTwo){
    hands[0].splice(hands[0].length, 0, moves[0]);
    hands[0].splice(hands[0].length, 0, moves[1]);
    removeWar();
  }//if the computer drew a higher value
  else if(value < valueTwo){
    hands[1].splice(hands[1].length, 0, moves[0]);
    hands[1].splice(hands[1].length, 0, moves[1]);
    removeWar();
  } //if there is war
  else if(value === valueTwo){
    isWar = true;
    console.log("Moves", moves);
    var cardsLeft = declareWar();
    console.log("Winner's Pile RIGHT after declare war", winnerPile);
    console.log("Moves after declare war", moves);
    renderWar();
    winner = checkWinner(cardsLeft);
    // console.log("WINNER for this war is ", winner);
    giveToWinner();
    // console.log("Total hand size after war: ", hands.length);
    // console.log(hands);
    isWar = false;
  }
}

/*
 This function checks to see who the winner is for the war
*/
function checkWinner(cardsLeft){
  // console.log("Winners ARRRAYY", winnerPile);
  // console.log("Moves to check after declare winner", moves);
  // console.log(winnerPile[winnerPile.length-2].value);
  // console.log(winnerPile[winnerPile.length-1].value);
  var value;
  var value2;

  if(cardsLeft >= 2){
    value = winnerPile[winnerPile.length-2].value;
    value2 = winnerPile[winnerPile.length-1].value;
  }
  //player 1 had 1 card left
  else if (cardsLeft === 1){
    value = winnerPile[2];
    value2 = winnerPile[winnerPile.length-1];
  }
  else if(cardsLeft === 2){
    value2 = winnerPile[2];
    value = winnerPile[winnerPile.length-1];
  }

  //change the value of the ace value
  if(value === 1) {value = 14;}
  else if(value2 === 1) {value2 = 14;}
  console.log("V1:", value);
  console.log("V2:", value2);
  if(value > value2){
    return "player1";
  }
  else if(value < value2){
    return "player2";
  }
  else {
    return "tie";
  }
}

/*
 This function does war when there is war
*/
function declareWar() {

  console.log("WARRRR!");
  //check if they have enough cards to do war
  if (hands[0].length >= 2 && hands[1].length >= 2){
      console.log(moves);
      //push the "war" cars onto the pile
      winnerPile.push(moves.pop());
      winnerPile.push(moves.pop());
      //flip a card ove that nobody sees for the "war process" grabbing it
      //from the "top" of the deck
      winnerPile.push(hands[0].shift());
      winnerPile.push(hands[1].shift());
      //flip another card over to see who wins, if anybody
      winnerPile.push(hands[0].shift());
      winnerPile.push(hands[1].shift());

      //render the outcome of the war action
      renderMove(winnerPile[winnerPile.length-2]);
      renderMove(winnerPile[winnerPile.length-1]);

      return 3; //greater then 2 cards each
  }
  //if the player 1 only has one card left, just use that for war
  else if(hands[0].length === 1){
    oneCardLeft(1);
    return 1; //only one card
  }
  //if the player 2 only has one card left
  else if(hands[1].length === 1){
    oneCardLeft(2);
    return 2; //only one card
  }

  //if they have no many cards left to do war, they just loose
  else if(hands[0].length === 0) {
    console.log("Player 1 loses!");
    inProgress = false;
  }
  else if(hand[1].length == 0){
    console.log("Player 2 loses");
    inProgres = false;
  }
}


/*
 This is a helper function for a certain case in war
*/
function oneCardLeft(player){

  //push the "war" cars onto the pile
  winnerPile.push(moves.pop());
  winnerPile.push(moves.pop());
  //if player one only has on card left after the war
  if(player === 1){
    //use their last card as ward
    winnerPile.push(hands[0].pop());
    //player 2 still does teh war action
    winnerPile.push(hands[1].shift());
    winnerPile.push(hands[1].shift());

  }

  if(player === 2){
    //use theirlast card as ward
    winnerPile.push(hands[1].pop());
    //player 1 still does teh war action
    winnerPile.push(hands[0].shift());
    winnerPile.push(hands[0].shift());

  }
}

/*
 This function gives the card to win appropriate winner
*/
function giveToWinner() {
  console.log("winnerPile to give to winner", winnerPile);
  console.log("winner is", winner);
  console.log("winnersPile size:", winnerPile.length);
  if(winner === 'player1' && winnerPile.length){
    //give the winner pile to player one from the war
    for(var i = 0; i < winnerPile.length; i++){
      hands[0].push(winnerPile[i]);
    }

  } else if (winner === 'player2' && winnerPile.length) {
    //give the winner pile to player two from war
    for(var i = 0; i < winnerPile.length; i++){
      hands[1].push(winnerPile[i]);
    }

  }
  console.log("MOVESSSS", moves);
  console.log("hand sizes after given the cards to the winner", hands[0].length, hands[1].length);
  //empty winnerPile
  winnerPile = [];
  console.log(winnerPile.length, i);

}

/*
 This funciton removes the war element
*/
function removeWar(){
  var w = document.querySelector(".war");
  if(w != null && w.length != 0){
    w.innerHTML = "";
  }
}

/*
 This function renders the cards
*/
function renderDecks(){
  //render each decks
  if(hands[0].length != 0){
    var playerOneDeck = document.getElementById("deck-one");
    playerOneDeck.innerHTML = "";
    var image = document.createElement("img");
    var dir = "cards/" + "Back.png";
    image.setAttribute("src", dir);
    image.classList.add("card");
    playerOneDeck.appendChild(image);
  }
  //render the computer
  if(hands[1].length != 0){
    var playerTwoDeck = document.getElementById("deck-two");
    playerTwoDeck.innerHTML = "";
    var image = document.createElement("img");
    var dir = "cards/" + "Back.png";
    image.setAttribute("src", dir);
    image.classList.add("card");
    playerTwoDeck.appendChild(image);
  }
}
/*
 This function renders the move
*/
function renderMove(card){
  // console.log(card);
  // console.log("H1:(RenderMove)",hands[0].length);
  // console.log("H2:(RenderMove)",hands[1].length);
  // console.log("H", hands[0].length+hands[1].length + moves.length);

  //render the image for the players hand
  if(hands[0].length != 0){
    if(turn){
      var c = document.createElement("img");
      var value = document.getElementById("deck-one-value");
      value.innerHTML = "";
      var dir = "cards/" + card.suit + " " + card.value + ".png";
      c.setAttribute("src", dir);
      c.classList.add("card");
      value.appendChild(c);
    }

  }
    //if its the computer render their deck
    if(hands[1].length != 0){
      if(!turn){
        var c = document.createElement("img");
        var value = document.getElementById("deck-two-value");
        value.innerHTML = "";
        var dir = "cards/" + card.suit + " " + card.value + ".png";
        c.setAttribute("src", dir);
        c.classList.add("card");
        value.appendChild(c);
        console.log("H", hands[0].length+hands[1].length + moves.length);
    }
  }
}

/*
 This function renders the war
*/
function renderWar(){

  var isW = document.querySelector(".war");
  var nav = document.querySelector(".nav-bar");

  var warCard = winnerPile[0];
  var warCard2 = winnerPile[1];
  var warContent = "";
  var value = warCard.value;

  if(warCard.value === warCard2.value) {
    if(warCard.value == 1) {value = "Ace";}
    if(warCard.value == 11) {value = "Jack";}
    if(warCard.value == 12) {value = "Queen";}
    if(warCard.value == 13) {value = "King"}

  warContent = " There were two " + value +'\'s' }

  //if there is war, render some text onto the screen
  if(isW == null || isW.length == 0){
    var w = document.createElement("div");
    w.classList.add("war");
    var content = document.createTextNode("WAR!" + warContent);
    w.appendChild(content);
    //JQuerty to insert after scores
    $(w).insertAfter(nav);
  }
  else {
    isW.innerText = "WAR!";
  }
}


/*
 THis function ends the game
*/
function endGame(){
  var r = document.querySelector(".winner")
  //display the winner
  var winner = "";
  if(hands[0].length == 0) { winner = "Player 2 is the winner!";}
  else if(hands[1].length == 0) { winner = "Player 1 is the winner!";}

  if(r === null){
    var b = document.querySelector("body");
    var result = document.createElement("div");
    result.classList.add("winner");
    var w = document.createTextNode(winner);
    result.appendChild(w);
    b.appendChild(result);
 }

}
