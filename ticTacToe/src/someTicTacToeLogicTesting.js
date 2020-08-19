// 4 parts
// part 1 creating the board
// part 2 is checking the state of the board
// part 3 is taking player input and checking for a winner condition
// part 4 is outputting winner or tie


var board = [['', '', ''],
             ['', '', ''],
             ['', '', '']
            ];
var players = ['O','X'];

// var availableX = [0,1,2,3,4,5,6,7,8,9];
var availableX = [];
var winner = false;
var turns = 0;
var gameOver = false;

// [0 - 9] - [0][0]
// 3/3 = 1
// 4/3 = 1 1

// if you wanted to create the board with user input,
// this function would create a single array transformation of the
// 2 dimensional slots
function createBoardUnwrap() {
    // for if it wasn't a square. If it is a square, Math.pow(board.length, 2) is more efficient
    for(let i = 0; i < board.length*board[0].length; i++) {
        availableX.push(i)
    }
}

// takes a single value that represents a position in the trasnformed single array
// takes the value and returns the corresponding x and y position on the 2 dimensional board
function convertSingleArraytoBoard(val) {
    var boardx;
    var boardy;
    if (val % (board[0].length-1) == 0) {
        boardx = Math.floor(val/board[0].length);
        boardy = val % board[0].length;
    } else {
        boardx = Math.floor(val/board[0].length);
        boardy = val % board[0].length;
    }

    return [boardx, boardy];
}

// takes x and y position of the board and transposes it to 
// what that position would be on an unwrapped board
function convertBoardPositiontoSingleArray(x,y) {
    return board[0].length*x+y;
}

// check state of the board and who the current player is
function checkWinner() {
    if(availableX.length == 0) {
        gameOver = true;
    }
    var matchesInARow = 0;
    // horizontal win
    for(let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length-1; j++) {
            if (board[i][j] == board[i][j+1] && board[i][j] != '') {
                matchesInARow++;
            } 
            if(matchesInARow >= 2) {
                winner = true;
                break;
            }
        }
        matchesInARow = 0;
    }
    
    //vertical win
    for (let j = 0; j < board[0].length; j++) {
        for (let i = 0; i < board.length-1; i++) {
            if (board[i][j] == board[i+1][j] && board[i][j] != '') {
                matchesInARow++;
            }
            if(matchesInARow >= 2) {
                winner = true;
                break;
            }
        }
        matchesInARow = 0; 
    }

    // diagonal win 1
    // only works if the tic tac toe board is a square
    var diagonalValues = [];
    for (let i = 0; i < board.length; i++){
        diagonalValues.push(board[i][board[0].length-i])
    }
    for (let i = 0; i < diagonalValues.length-1; i++){
        if(diagonalValues[i] == diagonalValues[i+1] && diagonalValues[i] != '') {
            matchesInARow++;
        } if(matchesInARow >= 2) {
            winner = true;
            break;
        }
        if(i+1 == diagonalValues.length-1) {
            matchesInARow = 0;
        }
    }
    
    // use javascript every test to see if all the values in diagonal values are all the same
    // if (diagonalValues == diagonalValues[0] && diagonalValues[0] != '') {
    //     winner = true;
    //     console.log(diagonalValues);

    // } 

    // diagonal win 2
    // only works if the tic tac toe board is a square
    var diagonalValuesTopLeft = [];
    for (let i = 0; i < board.length; i++){
        diagonalValuesTopLeft.push(board[i][i])
    }
    for (let i = 0; i < diagonalValuesTopLeft.length-1; i++){
        if(diagonalValuesTopLeft[i] == diagonalValuesTopLeft[i+1] && diagonalValuesTopLeft[i] != '') {
            matchesInARow++;
        } if(matchesInARow >= 2) {
            winner = true;
            break;
        } if(i+1 == diagonalValues.length-1) {
            matchesInARow = 0;
        }
    }
    // use javascript every test to see if all the values in diagonal values are all the same
    // if (diagonalValuesTopLeft == diagonalValuesTopLeft[0] && diagonalValuesTopLeft[0] != '') {
    //     winner = true;
    //     console.log(diagonalValuesTopLeft);
    // } 
    
}


// a sleep function to see two npcs playing against each other
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// on first round assign random player start
// check player turn
// set player move
// check winner
// if winner, stop game display winner
// if no winner next player turn
// 
async function playGame() {
    createBoardUnwrap();
    // while no winner or the game is not over, play the game

    while(winner == false && gameOver == false) {
        if (turns == 0) {
            currentPlayer = Math.floor(Math.random()*players.length);
        }
        turns++;
        // set player move

        // remove element from the available single array using splice
        // select that element from the returned splice array that holds that single element
        var randNumber = Math.floor(Math.random()*availableX.length);
        var playAt = availableX.splice(randNumber, 1)[0];
        var position = convertSingleArraytoBoard(playAt);
        board[position[0]][position[1]] = players[currentPlayer];

        
        console.log(playAt);
        console.log(position);
        console.log(availableX);
        console.log(board);
        // await sleep(4000);

        
        // check winner
        checkWinner();
        // if there is a winner
        // print which player it is
        // and what they were using
        if(winner==true) {
            console.log("Player "+currentPlayer+" has won using "+players[currentPlayer]);
        } else if (gameOver == true && winner == false) {
            console.log("It was a tie");
        }
        // change player
        currentPlayer = currentPlayer == 0 ? 1 : 0;
        // break;
    }
    
}

playGame();