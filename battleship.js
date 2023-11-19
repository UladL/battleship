/*
Hello Reader! This is me writing this in 2023 and at this moment I am 13. In this code I made a batteship game where you have the ships and sink 'em!
In this part of a code i will try to explain what every part of the code does.
 ---------------------------------------------------------------------------------------------------
VIEW:
displayMessage - this function will show if will tell us if there is a mistake in our guess
displayHit - this function will show us if we hitted one of the ships
diplayMiss - this function will show us if me mised
----------------------------------------------------------------------------------------------------
MODEL:
boardSize - size of the board
numShips - amount of ships on a board
LenShips - how big the ships are. Right now each ship is 3 spaces
shipsSunk - how many ships we sunk at this point in the game. When the value turns 3 the game is over
ships - this is an object thas has each ship location and the amount of hits we've done to them. It will change when we play the game
fire - this is a function that has our guess in it and will check if our guess is === to any of the ships position and then will display hit or miss using view
isSunk - this is a function that checks if any of the ships are now sunk or close to being sunk
generateship - makes 3 random cordinates anf puts them in an array where than collision checks them
collision - is a fnuction that checks if the random position for a ship that was created doesnt touch any other ships
parseGuess - this a function that turns for example A0 to 00 and checks if the value we gave it is correct or not.
----------------------------------------------------------------------------------------------------
CONTROLLER:
guesses - how many guesses was already used
procces guess - its a function that checks if we sunk or hit the battleship and shows it to the user
init and hadlefirebutton - they work together that the little area where we put text actually works
onload - just makes sure the website will load AND makes it so we can press enter to shoot
 */
let view = {
    displayMessage: function (msg){
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHIT: function (location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMISS: function (location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};
let model = {
    boardSize: 7,
    numShips: 3,
    LenShips: 3,
    shipsSunk: 0,
    ships: [
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]}
    ],
    fire: function (guess){
        for (let i = 0; i < this.numShips; i++ ){
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = "hit";
                view.displayHIT(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)){
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMISS(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk : function (ship){
        for(let i = 0; i < this.LenShips; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function(){
        let locations;
        for(let i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            }while (this.colision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function(){
        let direction = Math.floor(Math.random() * 2);
        let row,col;
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.LenShips));
        }else{
            row = Math.floor(Math.random() * (this.boardSize - this.LenShips));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newshiplocations = [];
        for (let i = 0; i < this.LenShips; i++){
            if(direction === 1){
                newshiplocations.push(row + "" + (col + i));
            }else{
                newshiplocations.push((row + i) + "" + col);
            }
        }
        return newshiplocations;
    },
    colision: function(locations){
        for(let i = 0; i < this.numShips; i++){
            let ship = model.ships[i];
            for(let j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};
function parseGuess(guess){
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    }else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        }else {
            return row + column;
        }
    }
    return null;
}
let controller = {
    guesses: 0,
    processGuess: function(guess) {
        let location= parseGuess(guess)
        if(location){
            this.guesses++;
            let hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage("You sank all my battle ships, in " + this.guesses + " guesses!");
            }
        }
    }
}
function init(){
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    let guessInput = document. getElementById ("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}
function handleFireButton(){
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}
window.onload = init;
function handleKeyPress (e) {
    let fireButton = document. getElementById ("fireButton") ;
    if (e.keyCode === 13){
        fireButton.click ();
        return false;
    }
}