const X_CLASS = 'x';
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const CIRCLE_CLASS = 'circle';
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn;
let npcOn = true;

const winningMessageElement = document.getElementById('winning-message');
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
document.getElementById('restartButton').addEventListener('click', restartGame);
const npcToggleButton = document.getElementById('npcToggle');

// a sleep function to see two npcs playing against each other
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function turnOnNPC() {
    if(!(gameInSession())) {
        if(npcToggleButton.innerText == "Turn off NPC") {
            npcOn = !npcOn;
            npcToggleButton.innerText = "Turn on NPC";
            npcToggleButton.style = "background-color: grey; color: white";
        } else {
            npcOn = !npcOn;
            npcToggleButton.innerText = "Turn off NPC";
            npcToggleButton.style = "background-color: darkblue; color: white";
        }
    } else {
        if(npcOn) {
            alert("Game is in session, so you can not turn off npc");
        } else {
            alert("Game is in session, so you can't turn on NPC")
        }
    }
}

function gameInSession() {
    return [...cellElements].some(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

startGame()

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHover();
}

function restartGame() {
    winningMessageElement.classList.remove('show');
    cellElements.forEach(cell => {
        cell.classList.remove('circle', 'x');
    })
    startGame();
}

async function MakeNPCMove() {
    if(circleTurn) {
        let availableCells = checkForFreeCells();
        await sleep(1000);
        shuffle(availableCells);
        availableCells[0].click();
    }
}

function checkForFreeCells() {
    let freeCells = [];
    cellElements.forEach(cell => {
        if(!(cell.classList.contains(CIRCLE_CLASS) || cell.classList.contains(X_CLASS))){
            freeCells.push(cell);
        }
    })
    return freeCells;
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass); // placeMark
    // Check For Win
    if(checkWinner(currentClass)) {
        endGame(false)
    } else if (isDraw()) { // Check for Draw
        endGame(true)
    } else {
        swapTurns(); // Switch Turns
        if(npcOn) {
            MakeNPCMove();
        }
        setBoardHover(); 
    }
    
}

function isDraw () {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function endGame(draw){
    if(draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Win!`
    }
    winningMessageElement.classList.add('show')
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHover() {
    board.classList.remove(X_CLASS, CIRCLE_CLASS);
    board.classList.add(circleTurn ? CIRCLE_CLASS : X_CLASS);
}

function checkWinner(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

// helper methods


var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};