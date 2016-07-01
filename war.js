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
    winner          = "";  //for who won the war

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
   else {
     inProgress = false;
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
    renderWar();
    giveToWinner();
    console.log("Total hand size after war: ", hands[0].length + hands[1].length);
    isWar = false;
  }
}

/*
 This function does war when there is war
*/
var declareWar = function() {
  console.log("WARRRR!");
  //check if they have enough cards to do war
  if (hands[0].length > 2 && hands[1].length > 2){

    //Put current moves into winnerPile (the cards that caused war)
    winnerPile.push(moves[0]);
    winnerPile.push(moves[1]);

    //Put down one more card from each player (the cards flipped over)
    winnerPile.push(hands[0].shift());
    winnerPile.push(hands[1].shift());
    //make the moves to flip over

    //put those in the winner pile (the face up cards)
    winnerPile.push(hands[0].shift());
    winnerPile.push(hands[1].shift());

    console.log("Winner Pile:", winnerPile);
    //render it
    var cardOne = winnerPile.pop();
    var cardTwo = winnerPile.pop();
    console.log("C1:",cardOne);
    console.log("C2:", cardTwo);

    renderMove(cardOne);
    renderMove(cardTwo);

  }
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
    //give the flipped over cards from war as well to player 1
    for(var i = 0; i < moves.length; i++){
      hands[1].push(moves.pop());
    }
  } else if (winner === 'player2' && winnerPile.length) {
    //give the winner pile to player two from war
    for(var i = 0; i < winnerPile.length; i++){
      hands[1].push(winnerPile.pop());
    }
    //give the winner pile to player two from war
    for(var i = 0; i < moves.length; i++){
      hands[1].push(moves.pop());
    }
  }
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
  console.log(card);
  // console.log("H1:",hands[0].length);
  // console.log("H2:",hands[1].length);
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
    }
  }
}

/*
 This function renders the war
*/
function renderWar(){

  var isW = document.querySelector(".war");
  var table = document.querySelector(".war-decks");

  //if there is war, render some text onto the screen
  if(isW == null || isW.length == 0){
    var w = document.createElement("div");
    w.classList.add("war");
    var content = document.createTextNode("WAR!");
    w.appendChild(content);
    //JQuerty to insert after scores
    $(w).insertAfter(table);
  }
  else {
    isW.innerText = "WAR!";
  }
}


/*
 THis function ends the game
*/
function endGame(){
}
