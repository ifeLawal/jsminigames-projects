# A repo for my javascript mini games and projects

## Homepage 

The homepage has links to all the different projects. Currently there is only 2. A test of the CSS grid layouts and tictactoe.
Here is a link to the homepage [github homepage link](https://ifelawal.github.io/jsminigames-projects/) 

## [Tic Tac Toe](https://ifelawal.github.io/jsminigames-projects/ticTacToe/ticTacToe.html) 

This is a picture of how the tic tac toe game looks.
![Image of tic tac toe page](/images/TicTacToeScreen.png)

Things to do
- Smarter npc gameplay. NPC currently plays randomly
  - Possible solution, checking tic tac toe npc videos for optimal answer vs checking for winner and placing npc to block it for opponent and use it for itself
- Clean up code placement in document and add comments

## [Mega Tic Tac Toe](https://ifelawal.github.io/jsminigames-projects/ticTacToe/megaTicTacToe.html)

This is a picture of how the mega tic tac toe game looks.
![Image of mega tic tac toe page](/images/MegaTicTacToeScreen.png)

Rules
- You have a total of 9 regular tic tac toe boards that you will play against npc or a person next to you on
- Once a board is finished, you move to a new board randomly
- You gain 1 match for any pairings of your 3 marks 3 ie 3 in a row = 1 match, 4-5 in a row = 1 match, 6 in a row = 2 matches
- Whoever gets the most matches wins 

![Image of mega tic tac toe page](/images/MegaTicTacToeAtWorkWins.png)

Things to add
- Have a popup of who won and a restart button
- Have a line cut through the matches to help players see there matches clearly on the board
- Smarter npc gameplay. NPC currently plays randomly
- Clean up code placement in document and add comments
- QA the matching conditions, especially diagonals
  - Possible solution: write code to have a log of matches on screen. Play the game with npc and check states
- Add remote play functionality? (might not be possible on github)
