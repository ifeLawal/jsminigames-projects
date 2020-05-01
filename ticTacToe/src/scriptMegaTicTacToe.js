// TicTacToe T3 or TTT

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
const MAKE_CLUSTER_ACTIVE = 'active';
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn;

const winningMessageElement = document.getElementById('winning-message');
const cellElements = document.querySelectorAll('[data-cell]');
const clusterElements = document.querySelectorAll('[data-cluster]');
const board = document.getElementById('board');
document.getElementById('restartButton').addEventListener('click', restartGame);


let board_order = [0,1,2,3,4,5,6,7,8];
let board_order_index = 0;
/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
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

// start game in a cluster
// play game in that cluster
// once board is full, go to next cluster
// start game in new cluster
// once board is full, go to next cluster
// ...
// once all the clusters are visited
// check for amount of winners for each side
// 

shuffle(board_order);
startBoard(board_order_index);

function startBoard(index) {
    let cellElements = clusterElements[board_order[index]].querySelectorAll('[data-cell]');
    let cluster = clusterElements[board_order[index]];
    startGame(cellElements, cluster);
    // console.log(cellElements);
    // startGame.apply(this, cellElements);
    
}

// function setBoardHover(singleTTTBoard) {
//     console.log(singleTTTBoard);
//     singleTTTBoard.classList.remove(CIRCLE_CLASS, X_CLASS);
//     singleTTTBoard.classList.add(CIRCLE_CLASS, MAKE_CLUSTER_ACTIVE);
// }

// startGame() tic tac toe
// function startGame() {
//     circleTurn = false;
//     cellElements.forEach(cell => {
//         cell.addEventListener('click', handleClick, { once: true })
//     })
//     setBoardHover();
// }

// startGame Mega Tic Tac Toe
function startGame(elements, node) {
    // console.log(elements);
    // console.log(node);
    node.classList.add(MAKE_CLUSTER_ACTIVE, CIRCLE_CLASS);

    circleTurn = false;
    elements.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true})
    });
    setBoardHover(node);
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
    console.log(cell)
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass); // placeMark
    // Check For Win
    if(checkWinner(currentClass)) {
        endGame(false)
    } else if (subBoardComplete(cell.parentNode)) { // Check for Draw
        board_order_index++;
        startBoard(board_order_index);
    } else {
        swapTurns(); // Switch Turns
        setBoardHover(cell.parentNode); 
    }
    
}

function subBoardComplete(subBoard) {
    let cellElements = subBoard.querySelectorAll('[data-cell]');
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
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

function setBoardHover(subBoard) {
    // console.log(cluster);
    subBoard.classList.remove(X_CLASS, CIRCLE_CLASS);
    subBoard.classList.add(circleTurn ? CIRCLE_CLASS : X_CLASS);
}

function checkWinner(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}