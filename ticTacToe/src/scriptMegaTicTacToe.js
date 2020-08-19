// TicTacToe T3 or TTT
// 9 Tic Tac Toe Boards in one


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


// constant variables for the game
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const MAKE_CLUSTER_ACTIVE = 'active';
const LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD = 9;
const LENGTH_OF_TIC_TAC_TOE_BOARD = 3;
const winningMessageTextElement = document.querySelector('#winning-text-message');


// elements from the UI that will be updated during the game
const winningMessageElement = document.getElementById('winning-message');       // line 133 in html. Used as a winning message pop-up
const cellElements = document.querySelectorAll('[data-cell]');                  // lines 20 - 116 in html. Used to place X and Os on screen
const clusterElements = document.querySelectorAll('[data-cluster]');            // lines 19, 30, 41, 52, 63, 74, 85, 96, and 107 in html. Used to reference the 9 board UIs on screen
const board = document.getElementById('board');                                 // line 18 in html. Represents the entire board aka holder of all 9 sub boards
document.getElementById('restartButton').addEventListener('click', restartGame);// line 134 in html. Used as a restart pop-up
const xMatchesMessage = document.getElementById('xMatches')                     // line 128 in html. Used as a continuous display of x's total score
const circleMatchesMessage = document.getElementById('circleMatches')           // line 129 in html. Used as a continuous display of o's total score
const npcToggleButton = document.getElementById('npcToggle');                   // line 131 in html. Used to toggle on rudimentary npc (it just places randomly) or to have 2 v 2 functionality

// changing variables in the game
let twoDBoard;                              
let board_order = [0,1,2,3,4,5,6,7,8];      // order for tic tac toe sub boards
let board_order_index = 0;                  // index for sub boards
let x_matches = 0;          
let circle_matches = 0;
let circleTurn;
let npcOn = true;

// tracker for 3 by three matches made so far
xMatchesMessage.innerText += ` ${x_matches}`;
circleMatchesMessage.innerText += ` ${circle_matches}`;

// randm shuffle array code from stackoverflow
// used to shuffle board order
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

// Game Logic
// start game in a cluster
// play game in that cluster
// once board is full, go to next cluster
// start game in new cluster
// once board is full, go to next cluster
// ... repeat until ...
// once all the clusters are visited
// check for amount of winners for each side
// print out the winner


startMegaTicTacToe();

// set up the state needed for beginning a new game
function startMegaTicTacToe() {
    twoDBoard = createTwoDBoard();
    circleTurn = false;

    shuffle(board_order);
    startBoard(board_order_index);
}

// create an empty mega tic tac toe, 9 x 9, board for the game
function createTwoDBoard() {
    var outerArr = [];
    for(let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; i++) {
        outerArr.push(new Array(LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD));
        outerArr[i].fill('');
    }
    return outerArr;
}


// start a game in the sub board
// send the sub board and board elements to a game state
function startBoard(index) {
    let boardElements = clusterElements[board_order[index]].querySelectorAll('[data-cell]');
    let cluster = clusterElements[board_order[index]];

    startGame(boardElements, cluster);
}

// start board sends the current board and cell that is being played over
// start game adds UI interaction functionality to play the game
function startGame(elements, node) {
    
    node.classList.add(MAKE_CLUSTER_ACTIVE);

    elements.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true})
    });
    setBoardHover(node);
}


// reset the board and remove the pop-up message and go to the starting
// game state
function restartGame() {
    winningMessageElement.classList.remove('show');
    cellElements.forEach(cell => {
        cell.classList.remove('circle', 'x');
    })

    board_order_index = 0;

    clearBoardHover();
    startMegaTicTacToe();
}

// UI and game functionality
// check where the person clicked and place the appropriate sign (x or o)
// check if someone won from that awesome play, if not swap turns
function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

    placeMark(cell, currentClass); // placeMark
    
    let indices = getClusterAndCellIndexFromElement(cell);
    let boardPosition = returnTwoDBoardLocationFromClusterAndCellPosition(indices[0], indices[1]);
    twoDBoard[boardPosition[0]][boardPosition[1]] = currentClass == CIRCLE_CLASS ? 'o' : 'x';
    
    checkForMatches();

    // If you've gone through all the subboards, see who won
    if(board_order_index>=board_order.length-1) {
        checkWinner();

    } else if (isSubBoardComplete(cell.parentNode)) { // check for a finished subboard and move forward
        board_order_index++;
        cell.parentNode.style = "background-color: azure";
        
        swapTurns();
        startBoard(board_order_index);

        if(npcOn && circleTurn) {
            MakeNPCMove(clusterElements[board_order[board_order_index]]);
        }

    } else {
        swapTurns(); 
        setBoardHover(cell.parentNode);

        if(npcOn && circleTurn) {
            MakeNPCMove(cell.parentNode);
        }
    }
    
    
}


// see if the board is full of x's and o's, aka no more open slots
function isDraw () {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

// pop up the appropriate message for how the game ended
function endGame(isDraw){
    if(isDraw) {
        winningMessageTextElement.innerHTML = 'Draw!';
    } else {
        winningMessageTextElement.innerHTML = `${circleTurn ? "O's" : "X's"} Win!`
    }
    winningMessageElement.classList.add('show');
    // restartElement.classList.add('show');
}

// place an x or o into the cell UI
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}


// swap turns
function swapTurns() {
    circleTurn = !circleTurn;
}

// swap the x and o hover UI functionality
function setBoardHover(subBoard) {
    subBoard.classList.remove(X_CLASS, CIRCLE_CLASS);
    subBoard.classList.add(circleTurn ? CIRCLE_CLASS : X_CLASS);
}

function clearBoardHover() {
    [...clusterElements].forEach(subBoard => {
        return subBoard.classList.remove(X_CLASS, CIRCLE_CLASS,MAKE_CLUSTER_ACTIVE);
    })
}

// 
// checkWinner();

// 
function checkWinner() {
    let draw = false;
    if(x_matches > circle_matches) {
        endGame(draw);
    } else if(circle_matches > x_matches) {
        endGame(draw);
    } else {
        draw = true;
        endGame(draw);
    }
}

// find what cluster and cell the element that was clicked is in
function getClusterAndCellIndexFromElement(element) {
    var index = [...element.parentNode.querySelectorAll('[data-cell]')].indexOf(element);
    var indexcluster = [...element.parentNode.parentNode.querySelectorAll('[data-cluster]')].indexOf(element.parentNode);
        
    return [indexcluster, index];
}

// transform index of cluster and cell to pin point what the indeces correspond
// to in the 2 dimensional array. The transformation is explained visually in the
// readme
function returnTwoDBoardLocationFromClusterAndCellPosition(clusterIndex, cellIndex) {
    let clusterPosition = convertIndextoBoardLocation(clusterIndex);
    let cellPosition = convertIndextoBoardLocation(cellIndex);

    clusterPosition = clusterPosition.map(x => x * LENGTH_OF_TIC_TAC_TOE_BOARD);

    let twoDBoardLocation = clusterPosition.map( (num, index) => {
        return num + cellPosition[index];
    });
    
    return twoDBoardLocation;
}

// a function to convert a single index value from the 0-9 data cell array
// and convert that value into a 3x3 2d board position
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

// transform the 2D javascript array representation of the board
// into the single array index UI system
function convertBoardToClusterandIndex(xPos, yPos) {
    let clusterIndex = 0;
    let cellIndex = 0;
    
    clusterIndex = Math.floor(xPos / LENGTH_OF_TIC_TAC_TOE_BOARD) * LENGTH_OF_TIC_TAC_TOE_BOARD + Math.floor(yPos / LENGTH_OF_TIC_TAC_TOE_BOARD);
    cellIndex = (xPos % LENGTH_OF_TIC_TAC_TOE_BOARD) * 3 + (yPos % LENGTH_OF_TIC_TAC_TOE_BOARD);
    
    return [clusterIndex, cellIndex];
}

// use cluster and cell info to select the UI node element
function selectNodeElement(clusterIndex, cellIndex) {
    return clusterElements[clusterIndex].querySelectorAll("[data-cell")[cellIndex];
}

// give a similar background color to a 3 in a row match
function colorMatches(xAndYPos, symbol) {
    // cap the for loop to multiples of 3
    // numsThreeInRowMatch
    let numsThreeInRowMatch = Math.floor(xAndYPos.length/LENGTH_OF_TIC_TAC_TOE_BOARD);
    let cap = Math.floor(xAndYPos.length/LENGTH_OF_TIC_TAC_TOE_BOARD)*LENGTH_OF_TIC_TAC_TOE_BOARD;
    
    let validXAndYPos = xAndYPos;
    
    // if we have a match of three and we can find a match of 3 colored we are good

    // manage only changing colors for accurate groups of three and not just the
    // first group of three matches in a row
    for(let i=0; i <= xAndYPos.length-LENGTH_OF_TIC_TAC_TOE_BOARD; i++) {
        
        if(xAndYPos.slice(
            i,LENGTH_OF_TIC_TAC_TOE_BOARD+i)
            .every(loc => {
                console.log("we made it");
                let clusterAndCell = convertBoardToClusterandIndex(loc.xPos, loc.yPos);
                let nodeBgColor = selectNodeElement(clusterAndCell[0], clusterAndCell[1]).style.backgroundColor;
                return nodeBgColor == "red" || nodeBgColor == "green";
        })) {
            validXAndYPos.splice(i,LENGTH_OF_TIC_TAC_TOE_BOARD+i);
        }
    }
    
    // color a valid three in a row match that not colored
    if(validXAndYPos.length >= LENGTH_OF_TIC_TAC_TOE_BOARD) {
        validXAndYPos.map((loc) => {
            let clusterAndCell = convertBoardToClusterandIndex(loc.xPos, loc.yPos);
            selectNodeElement(clusterAndCell[0], clusterAndCell[1]).style.backgroundColor = symbol == "x" ? "red" : "green";
        });
    }
    
}

// make a random move for the npc. Use sleep to make it look like the npc was thinking
async function MakeNPCMove(subBoard) {
    if(circleTurn) {
        let availableCells = checkForFreeCells(subBoard);
        await sleep(1000);
        shuffle(availableCells);
        availableCells[0].click();
    }
}

// a sleep function to simulate npc "thinking" as it plays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// handle the UI changes and validation of turning on and off the NPC
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


// see if the board is completely empty
function gameInSession() {
    return [...cellElements].some(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

// provide an array of elements with free cells
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

// see if the subboard is completely full
function isSubBoardComplete(subBoard) {
    let cellElements = subBoard.querySelectorAll('[data-cell]');
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

// check for all possible 3 in a row matches. there are 4 kinds
// diagonal left to right, diagonal right to left, vertical, horizontal
function checkForMatches() {
    let diagonalPositiveSlopeXandCircleMatches = diagonalPositiveSlopeMatching();
    let diagonalNegativeSlopeXandCircleMatches = diagonalNegativeSlopeMatching();
    let verticalXandCircleMatches = verticalMatching();
    let horizontalXandCircleMatches = horizontalMatching();

    // console.log(`diagonal matches: ${diagonalPositiveSlopeXandCircleMatches}`);
    // console.log(`diagonal matches: ${diagonalNegativeSlopeXandCircleMatches}`);

    x_matches = verticalXandCircleMatches[0] + horizontalXandCircleMatches[0] + diagonalNegativeSlopeXandCircleMatches[0] + diagonalPositiveSlopeXandCircleMatches[0];
    
    circle_matches = verticalXandCircleMatches[1] + horizontalXandCircleMatches[1] + diagonalNegativeSlopeXandCircleMatches[1] + diagonalPositiveSlopeXandCircleMatches[1];
    
    xMatchesMessage.innerText = `x matches: ${x_matches}`;
    circleMatchesMessage.innerText = `circle matches: ${circle_matches}`;
}

// 
function diagonalPositiveSlopeMatching() {

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

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;

    for(let x = LENGTH_OF_TIC_TAC_TOE_BOARD-1; x < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; x++) {
        for(let y=0; y < x; y++) {
            // if this is the first check, set the starting match as itself
            if(matchesInARow == 1) {
                matchesXAndYPos = [
                    {xPos:x-y,yPos:y}
                ];
            }
            if(twoDBoard[x-y][y] == twoDBoard[x-y-1][y+1] && twoDBoard[x-y][y] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x-y-1,yPos:y+1});
            } else if(matchesInARow >= 3) {
                // if you reach the end and have 3 or more matches
                // or you found 3 or more matches in the middle
                // give credit for those matches to a player 
                if(twoDBoard[x-y][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }


                // dividing the matchesInARow by 3 and adding the floored/int
                // value gives us 1 point for everything in the 3-5 range and 2
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
                if(twoDBoard[x-y][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                }
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3)
                    colorMatches(matchesXAndYPos, 'o');
                }
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1; // reset matches for he new cycle
        matchesXAndYPos = [];
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
            if(matchesInARow == 1) {
                matchesXAndYPos = [
                    {xPos:x,yPos:y+i}
                ];
            }
            if(twoDBoard[x][y+i] == twoDBoard[x-1][y+i+1] && twoDBoard[x][y+i] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x-1,yPos:y+i+1});
            } else if (matchesInARow >= 3) {
                if(twoDBoard[x][y+i] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                // dividing the matchesInARow by 3 and adding the floored/int
                // value gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }
            
            
            if(x-1 <= y && matchesInARow >= 3) {
                if(twoDBoard[x][y+i] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else { 
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1; // reset matches for the new cycle
        matchesXAndYPos = [];
    }

    return [xMatchesInARow, oMatchesInARow];
}

// 
function diagonalNegativeSlopeMatching() {

    var xMatchesInARow = 0;
    var oMatchesInARow = 0;
    
    // 2 dimensional indices this covers
    // 0,6; 1,7; 2,8
    // 0,5; 1,6; 2,7; 3,8;
    // logic behind these 2 for loops to evaluate matches in those indices:
    // outer loop starts at y of 6 decresaes towards 0
    // inner loop always starts x at 0 and ends at the edge and keeps pushing
    // down 1 as it's limit, y, reduces by 1

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;
    for(let y = LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-LENGTH_OF_TIC_TAC_TOE_BOARD; y >= 0; y--) {
        // 
        for(let x = 0; x + 1 < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - y; x++) {
            if(matchesInARow==1) {
                matchesXAndYPos = [
                    {xPos:x,yPos:y+x}
                ];
            }
            if (twoDBoard[x][y+x] == twoDBoard[x+1][y+x+1] && twoDBoard[x][y+x] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x+1,yPos:y+x+1});
            } else if(matchesInARow >= 3) {
                if(twoDBoard[x][y+x] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(x+2  >= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD-y && matchesInARow>=3) {
                if(twoDBoard[x][y+x] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
            
        }
        matchesInARow = 1;
        matchesXAndYPos = [];
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
            if(matchesInARow==1) {
                matchesXAndYPos = [
                    {xPos:x+y,yPos:y}
                ];
            }
            if (twoDBoard[x+y][y] == twoDBoard[x+y+1][y+1] && twoDBoard[x+y][y] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x+y+1,yPos:y+1});
            } else if(matchesInARow >= 3) {
                if(twoDBoard[x+y][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(y+2 >= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - x && matchesInARow>=3) {
                if(twoDBoard[x+y][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1;
        matchesXAndYPos = [];
    }

    return [xMatchesInARow, oMatchesInARow];
}

// 
function verticalMatching() {
    var xMatchesInARow = 0;
    var oMatchesInARow = 0;

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;

    // vertical win
    for (let y = 0; y < twoDBoard[0].length; y++) {
        for (let x = 0; x < twoDBoard.length-1; x++) {
            if(matchesInARow == 1) {
                matchesXAndYPos = [
                    {xPos:x,yPos:y}
                ];
            }
            if (twoDBoard[x][y] == twoDBoard[x+1][y] && twoDBoard[x][y] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x+1,yPos:y});
            } else if(matchesInARow >= 3) {
                // if you reach the end and have 3 or more matches
                // or you found 3 or more matches in the middle
                // give credit for those matches to a player
                if(twoDBoard[x][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(x+1 == twoDBoard.length-1 && matchesInARow >= 3) {
                if(twoDBoard[x][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                }
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1;
        matchesXAndYPos = [];
    }
    return [xMatchesInARow, oMatchesInARow];
}

// 
function horizontalMatching() {
    let matchesInARow = 1;
    var xMatchesInARow = 0;
    var oMatchesInARow = 0;
    // horizontal win
    for(let x = 0; x < twoDBoard.length; x++) {
        for (let y = 0; y < twoDBoard[x].length-1; y++) {
            if(matchesInARow==1) {
                matchesXAndYPos = [
                    {xPos:x,yPos:y}
                ];
            }
            if (twoDBoard[x][y] == twoDBoard[x][y+1] && twoDBoard[x][y] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x,yPos:y+1});
            } 
            else if(matchesInARow >= 3) {
                if(twoDBoard[x][y] == 'x') {
                    xMatchesInARow+= Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                }
                else {
                    oMatchesInARow+= Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                } 
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(y+1 == twoDBoard[x].length-1 && matchesInARow >=3) {
                if(twoDBoard[x][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'x');
                }
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    colorMatches(matchesXAndYPos, 'o');
                } 
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1;
        matchesXAndYPos = [];
    }
    return [xMatchesInARow, oMatchesInARow];
}
