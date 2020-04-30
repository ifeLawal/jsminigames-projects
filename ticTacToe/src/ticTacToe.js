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

const winningMessageElement = document.getElementById('winning-message');
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
document.getElementById('restartButton').addEventListener('click', restartGame);

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