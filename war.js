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
      winner = checkMoves();
      turn = !turn;
    }
   }
      // else {debugging = false; }
   //}
   else {
     inProgress = false;
     endGame();
   }
 }
}

/*
 This function checks the moves
*/
function checkMoves(card) {
  var value = moves[0].value;
  var valueTwo = moves[1].value;

  //change the value of the ace value
  if(value === 1) {value = 14;}
  else if(valueTwo === 1) {valueTwo = 14;}
  //if player one drew a higher value
  if(value > valueTwo){
    hands[0].splice(hands[0].length, 0, moves[0]);
    hands[0].splice(hands[0].length, 0, moves[1]);
    removeWar();
    return 'player1'
  }//if the computer drew a higher value
  else if(value < valueTwo){
    hands[1].splice(hands[1].length, 0, moves[0]);
    hands[1].splice(hands[1].length, 0, moves[1]);
    removeWar();
    return 'player2'
  } //if there is war
  else if(value === valueTwo){
    isWar = true;
    declareWar();
    console.log("Winner's Pile RIGHT after declare war", winnerPile);
    console.log("Moves after declare war", moves);
     renderWar();
    // giveToWinner();
    // console.log("Total hand size after war: ", hands.length);
    // console.log(hands);
    isWar = false;
  }
}

/*
 This function does war when there is war
*/
function declareWar() {
  console.log("WARRRR!");
  //check if they have enough cards to do war
  if (hands[0].length > 2 && hands[1].length > 2){

    //Put current moves into winnerPile (the cards that caused war)
    winnerPile.push(moves[0]);
    winnerPile.push(moves[1]);

    console.log("Winner Pile AFTER WAR Cards:", winnerPile);

    // //Put down one more card from each player (the cards flipped over)
    // winnerPile.push(hands[0].pop());
    // winnerPile.push(hands[1].pop());
    // console.log("Winner Pile AFTER FACED Down:", winnerPile);
    //
    // //put those in the winner pile (the face up cards)
    // winnerPile.push(hands[0].pop());
    // winnerPile.push(hands[1].pop());
    //
    // console.log("Winner Pile AFTER facing up:", winnerPile);

    // //render it
    // var cardOne = winnerPile.pop();
    // var cardTwo = winnerPile.pop();
    // console.log("C1:",cardOne);
    // console.log("C2:", cardTwo);
    //
    // //render each of the flipped cards
    // renderMove(cardOne);
    // renderMove(cardTwo);
    //
    // //push it back so you can give it to the winner
    // winnerPile.push(cardOne);
    // winnerPile.push(cardTwo);
    //
    // console.log("After War", winnerPile);

   }
  //
  //   // if one of them has one card left just use that card
  // else if (hands[0].length == 1){
  //   var card = hands[0].pop();
  //   renderMove(card);
  // }
  // else if (hands[1].length == 1){
  //   var card2 = hands[1].pop();
  //   renderMove(card);
  // }
  //   //there is war but the person has no more cards
  // else if(hands[0].length == 0){
  //   console.log("Player 2 Wins!");
  //   inProgress = false;
  // }
  //
  // else if(hands[1].length == 0){
  //   console.log("Player 1 Wins!");
  //   inProgress = false;
  // }

}

/*
 This function gives the card to win appropriate winner
*/
function giveToWinner() {
  console.log("winnerPile to give to winner", winnerPile);
  if(winner === 'player1' && winnerPile.length){
    //give the winner pile to player one from the war
    for(var i = 0; i < winnerPile.length; i++){
      hands[0].push(winnerPile.pop());
    }
  } else if (winner === 'player2' && winnerPile.length) {
    //give the winner pile to player two from war
    for(var i = 0; i < winnerPile.length; i++){
      hands[1].push(winnerPile.pop());
    }
  }
  console.log("Total hands size after given the cards to the winner", hands.length);
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

  //if there is war, render some text onto the screen
  if(isW == null || isW.length == 0){
    var w = document.createElement("div");
    w.classList.add("war");
    var content = document.createTextNode("WAR!");
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
  if(r === null){
    var b = document.querySelector("body");
    var result = document.createElement("div");
    result.classList.add("winner");
    var w = document.createTextNode(winner);
    result.appendChild(w);
    b.appendChild(result);
 }

}
