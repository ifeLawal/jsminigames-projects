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
const LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD = 9;
const LENGTH_OF_TIC_TAC_TOE_BOARD = 3;
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn;
let npcOn = true;


const winningMessageElement = document.getElementById('winning-message');
const cellElements = document.querySelectorAll('[data-cell]');
const clusterElements = document.querySelectorAll('[data-cluster]');
const board = document.getElementById('board');
document.getElementById('restartButton').addEventListener('click', restartGame);
const xMatchesMessage = document.getElementById('xMatches')
const circleMatchesMessage = document.getElementById('circleMatches')

let twoDBoard;
let board_order = [0,1,2,3,4,5,6,7,8];
let board_order_index = 0;
let x_matches = 0;
let circle_matches = 0;

xMatchesMessage.innerText += ` ${x_matches}`;
circleMatchesMessage.innerText += ` ${circle_matches}`;
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

startMegaTicTacToe();

function startMegaTicTacToe() {
    twoDBoard = createTwoDBoard();
    circleTurn = false;
    shuffle(board_order);
    startBoard(board_order_index);
}

function startBoard(index) {
    // circleTurn = false;
    let boardElements = clusterElements[board_order[index]].querySelectorAll('[data-cell]');
    let cluster = clusterElements[board_order[index]];
    startGame(boardElements, cluster);
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
    node.classList.add(MAKE_CLUSTER_ACTIVE);

    // circleTurn = false;
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
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass); // placeMark
    let indices = getClusterAndCellIndexFromElement(cell);
    let boardPosition = returnTwoDBoardLocationFromClusterAndCellPosition(indices[0], indices[1]);
    twoDBoard[boardPosition[0]][boardPosition[1]] = currentClass == CIRCLE_CLASS ? 'o' : 'x';
    console.log(twoDBoard);
    checkForMatches();
    // Check For Win
    if(board_order_index>board_order.length) {
        checkWinner();
    } else if (isSubBoardComplete(cell.parentNode)) { // Check for Draw
        board_order_index++;
        cell.parentNode.style = "background-color: blue";
        swapTurns(); // Switch Turns
        startBoard(board_order_index);
        if(npcOn && circleTurn) {
            MakeNPCMove(clusterElements[board_order[board_order_index]]);
        }
    } else {
        swapTurns(); // Switch Turns
        setBoardHover(cell.parentNode);
        if(npcOn && circleTurn) {
            MakeNPCMove(cell.parentNode);
        }
    }
    
    
}

function checkForMatches() {
    let diagonalPositiveSlopeXandCircleMatches = diagonalPositiveSlopeMatching();
    let diagonalNegativeSlopeXandCircleMatches = diagonalNegativeSlopeMatching();
    let verticalXandCircleMatches = verticalMatching();
    let horizontalXandCircleMatches = horizontalMatching();
    console.log(`diagonal matches: ${diagonalPositiveSlopeXandCircleMatches}`);
    console.log(`diagonal matches: ${diagonalNegativeSlopeXandCircleMatches}`);

    x_matches = verticalXandCircleMatches[0] + horizontalXandCircleMatches[0] + diagonalNegativeSlopeXandCircleMatches[0] + diagonalPositiveSlopeXandCircleMatches[0];
    
    circle_matches = verticalXandCircleMatches[1] + horizontalXandCircleMatches[1] + diagonalNegativeSlopeXandCircleMatches[1] + diagonalPositiveSlopeXandCircleMatches[1];
    xMatchesMessage.innerText = `x matches: ${x_matches}`;
    circleMatchesMessage.innerText = `circle matches: ${circle_matches}`;
}

function diagonalPositiveSlopeMatching() {
    let matchesInARow = 1; // since the item matches with itself, we start with 1
    var xMatchesInARow = 0;
    var oMatchesInARow = 0;

    // sample 2 dimensional indices this covers
    // 2,0; 1,1; 0,2
    // 3,0; 2,1; 1,2; 0,3
    // to automate this you subtract along the x-axis in the outer loop and start y
    // at 0, incrementing it until it reaches the x value while subtracting it's
    // value from x to get the appropriate x value
    // however since you are evaluating against the next value, +1 position, in the inner loop
    // you stop once y equals the initial x aka if x starts at 2 when y
    // becomes 2
    for(let x = LENGTH_OF_TIC_TAC_TOE_BOARD-1; x < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; x++) {
        for(let y=0; y < x; y++) {
            if(twoDBoard[x-y][y] == twoDBoard[x-y-1][y+1] && twoDBoard[x-y][y] != '') {
                matchesInARow++;
            } else if(matchesInARow >= 3) {
                // if you reach the end and have 3 or more matches
                // or you found 3 or more matches in the middle
                // give credit for those matches to a player 
                if(twoDBoard[x-y][y] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3)}
                else {oMatchesInARow += Math.floor(matchesInARow/3)}
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }
            // if we have reached the end of the diagonal
            // and have a match of 3 or more
            // give credit to whoever has the matches and reset the count
            if(y+1 >= x && matchesInARow >= 3) {
                if(twoDBoard[x-y][y] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3)}
                else {oMatchesInARow += Math.floor(matchesInARow/3)}
                matchesInARow = 1;
            }
        }
        matchesInARow = 1;
    }

    // sample 2 dimensional indices this covers
    // 8,1; 7,2; 6,3 ... 2,7; 1,8
    // 8,2; 7,3 ... 3,7; 2,8
    // to automate this you subtract along the x-axis in the outer loop and start y
    // at 1, incrementing it until it reaches the x value while subtracting it's
    // value from x to get the appropriate x value
    // however since you are evaluating against the next value, +1 position, in the inner loop
    // you stop once y equals the initial x aka if x starts at 8 when y
    // becomes 8
    // since x is always 8, I decided to move down the y to tell if all the
    // diagonals are checked
    // in the inner loop, the end of how low the x should go along the diagonal
    // coincides with shrinking in the range using the increasing y value
    for(let y = 1;y < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-LENGTH_OF_TIC_TAC_TOE_BOARD; y++) {
        for(let x=LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-1, i = 0; x > y; x--, i++) {
            if(twoDBoard[x][y+i] == twoDBoard[x-1][y+i+1] && twoDBoard[x][y+i] != '') {
                matchesInARow++;
            } else if (matchesInARow >= 3) {
                if(twoDBoard[x][y+i] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }
            
            // if we've reached the end of the diagonal
            // and there are 3 or more matches
            // give credit
            if(x-1 <= y && matchesInARow >= 3) {
                if(twoDBoard[x][y+i] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                matchesInARow = 1;
            }
        }
        matchesInARow = 1;
    }
    return [xMatchesInARow, oMatchesInARow];
}

function diagonalNegativeSlopeMatching() {
    let matchesInARow = 1; // since the item matches with itself, we start with 1
    var xMatchesInARow = 0;
    var oMatchesInARow = 0;
    
    // 2 dimensional indices this covers
    // 0,6; 1,7; 2,8
    // 0,5; 1,6; 2,7; 3,8;
    // logic behind these 2 for loops to evaluate matches in those indices:
    // outer loop starts at y of 6 decresaes towards 0
    // inner loop always starts x at 0 and ends at the edge and keeps pushing
    // down 1 as it's limit, y, reduces by 1
    for(let y = LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-LENGTH_OF_TIC_TAC_TOE_BOARD; y >= 0; y--) {
        // 
        for(let x = 0; x + 1 < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - y; x++) {
            if (twoDBoard[x][y+x] == twoDBoard[x+1][y+x+1] && twoDBoard[x][y+x] != '') {
                matchesInARow++;
                console.log(`diagonalMatches: ${matchesInARow}`);
            } else if(matchesInARow >= 3) {
                if(twoDBoard[x][y+x] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(x+2  >= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-y && matchesInARow>=3) {
                if(twoDBoard[x][y+x] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                matchesInARow = 1;
            }
            
        }
        matchesInARow = 1;
    }

    // sample 2 dimensional indices this covers
    // 1,0; 2,1; 3,2 ... 6,5; 7,6; 8,7
    // 2,0; 3,1; ... 7,5; 8,6
    // what's the logic behind these 2 for loops to evaluate matches in those indices?:
    // the outer loop starts at x of 1 and increases towards 6
    // the inner loop always starts at 0 and ends at the edge and keeps pushing
    // 1 more in as the x increases, as we go down, by a factor of 1
    // since we evaluate against the next cell
    // we want the limit to go to the value before the next cell therefore y + 1
    for(let x = 1;x <= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-LENGTH_OF_TIC_TAC_TOE_BOARD; x++) {
        for(let y=0; y + 1 < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - x; y++) {
            if (twoDBoard[x+y][y] == twoDBoard[x+y+1][y+1] && twoDBoard[x+y][y] != '') {
                matchesInARow++;
                console.log(`diagonalMatches: ${matchesInARow}`);
            } else if(matchesInARow >= 3) {
                if(twoDBoard[x+y][y] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(y+2 >= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - x && matchesInARow>=3) {
                if(twoDBoard[x][y+x] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                matchesInARow = 1;
            }
        }
        matchesInARow = 1;
    }

    return [xMatchesInARow, oMatchesInARow];
}

function verticalMatching() {
    let matchesInARow = 1; // since the item matches with itself, we start with 1
    var xMatchesInARow = 0;
    var oMatchesInARow = 0;
    //vertical win
    for (let j = 0; j < twoDBoard[0].length; j++) {
        for (let i = 0; i < twoDBoard.length-1; i++) {
            if (twoDBoard[i][j] == twoDBoard[i+1][j] && twoDBoard[i][j] != '') {
                matchesInARow++;
            } else if(matchesInARow >= 3) {
                // if you reach the end and have 3 or more matches
                // or you found 3 or more matches in the middle
                // give credit for those matches to a player
                if(twoDBoard[i][j] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(i+1 == twoDBoard.length-1 && matchesInARow >= 3) {
                if(twoDBoard[i][j] == 'x') {xMatchesInARow += Math.floor(matchesInARow/3);} 
                else { oMatchesInARow += Math.floor(matchesInARow/3);}
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            }
        }
        matchesInARow = 1; 
    }
    return [xMatchesInARow, oMatchesInARow];
}

function horizontalMatching() {
    let matchesInARow = 1;
    var xMatchesInARow = 0;
    var oMatchesInARow = 0;
    // horizontal win
    for(let i = 0; i < twoDBoard.length; i++) {
        for (let j = 0; j < twoDBoard[i].length-1; j++) {
            if (twoDBoard[i][j] == twoDBoard[i][j+1] && twoDBoard[i][j] != '') {
                matchesInARow++;
            } 
            else if(matchesInARow >= 3) {
                if(twoDBoard[i][j] == 'x') {xMatchesInARow+= Math.floor(matchesInARow/3);}
                else { oMatchesInARow+= Math.floor(matchesInARow/3);} 
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(j+1 == twoDBoard[i].length-1 && matchesInARow >=3) {
                if(twoDBoard[i][j] == 'x') {xMatchesInARow+= Math.floor(matchesInARow/3);}
                else { oMatchesInARow+= Math.floor(matchesInARow/3);} 
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            }
        }
        matchesInARow = 1;
    }
    return [xMatchesInARow, oMatchesInARow];
}

function isSubBoardComplete(subBoard) {
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

// function checkWinner(currentClass) {
//     return WINNING_COMBINATIONS.some(combination => {
//         return combination.every(index => {
//             return cellElements[index].classList.contains(currentClass)
//         })
//     })
// }


// take clusters and cells and create a 2 dimensional board representation with
// the X and Circle values
// unwrap cluster to figure out where things go
// check the amount of matches vertical, horizontal, and diagonal for each class
// return the winner with the most matches or draw if equal
checkWinner();

function checkWinner() {
    // twoDBoard[8][8] = 'X';
    for(let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; i++) {
        let j = 0;
        for(j; j % LENGTH_OF_TIC_TAC_TOE_BOARD != 0; j++) {

        }
    }
    // loop through cluster query
    // loop through cells
    // create twoDBoard
    // checkwinners of 2d board
    // 
    console.log(twoDBoard)
    console.log(clusterElements[0].querySelectorAll('[data-cell'));
}


function getClusterAndCellIndexFromElement(element) {
    var index = [...element.parentNode.querySelectorAll('[data-cell')].indexOf(element);
    var indexcluster = [...element.parentNode.parentNode.querySelectorAll('[data-cluster]')].indexOf(element.parentNode);
        
    return [indexcluster, index];
}

function returnTwoDBoardLocationFromClusterAndCellPosition(clusterIndex, cellIndex) {
    // cluster index
    // convert cluster index into [boardx, boardy]
    // multiply boardx & boardy by length of tic tac toe board to transpose it accordingly to the 2D board
    // add the converted index of the cell data
    // append value in the cell to the 2dboard
    let clusterPosition = convertIndextoBoardLocation(clusterIndex);
    let cellPosition = convertIndextoBoardLocation(cellIndex);
    clusterPosition = clusterPosition.map(x => x * LENGTH_OF_TIC_TAC_TOE_BOARD);
    let twoDBoardLocation = clusterPosition.map( (num, index) => {
        return num + cellPosition[index];
    });
    console.log(twoDBoardLocation);
    return twoDBoardLocation;
}

// rather than creating a 2d board, could I match the values using 
// where they should be. ie cluster 0: 0-2, cluster 1: 0-2, cluster 2: 0-2
// cluster 0: 3-5, cluster 1: 3-5, cluster 2: 3-5
// 

function convertIndextoBoardLocation(val) {
    let boardx = 0;
    let boardy = 0;
    if (val % (LENGTH_OF_TIC_TAC_TOE_BOARD - 1) == 0) {
        boardx = Math.floor(val/LENGTH_OF_TIC_TAC_TOE_BOARD);
        boardy = val % LENGTH_OF_TIC_TAC_TOE_BOARD;
    } else {
        boardx = Math.floor(val/LENGTH_OF_TIC_TAC_TOE_BOARD);
        boardy = val % LENGTH_OF_TIC_TAC_TOE_BOARD;
    }

    return [boardx, boardy];
}

function createTwoDBoard() {
    var outerArr = [];
    for(let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; i++) {
        outerArr.push(new Array(LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD));
        outerArr[i].fill('');
    }
    return outerArr;
}

async function MakeNPCMove(subBoard) {
    if(circleTurn) {
        let availableCells = checkForFreeCells(subBoard);
        await sleep(1000);
        shuffle(availableCells);
        availableCells[0].click();
    }
}


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


function checkForFreeCells(subBoard) {
    let freeCells = [];
    let boardElements = subBoard.querySelectorAll('[data-cell]');
    boardElements.forEach(cell => {
        if(!(cell.classList.contains(CIRCLE_CLASS) || cell.classList.contains(X_CLASS))){
            freeCells.push(cell);
        }
    })
    return freeCells;
}