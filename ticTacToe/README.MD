# [Play MegaTicTacToe](https://ifelawal.github.io/jsminigames-projects/ticTacToe/megaTicTacToe.html)

# Files that matter

### For MegaTicTacToe
- src/scriptMegaTicTacToe.js
- src/megaTicTacToe.css
- megaTicTacToe.html

### For TicTacToe
- src/ticTacToe.js
- src/ticTacToe.css
- ticTacToe.html

Visuals for main MegaTicTacToe logic. To be edited with more details

## Rules for MegaTicTacToe

* You have a total of 9 regular tic tac toe boards that you will play against npc or a person next to you on
* Once a board is finished, you move to a new board randomly
* You gain 1 match for any pairings of your 3 markers (O or X) ie 3 in a row = 1 match any extra pairs (4 or 5) do not grant an additonal match, 6 in a row = 2 matches any extra pairs (7 or 8) do not grant an additional match
* Whoever gets the most matches wins

- Whenever **"points"** are mentioned below in the visuals, thy are **synonymous to "match"** mentioned in the rules above.

## megaTicTicTacToe.js
conversion functions transforming from JS 2D array to the 1D array representation of the UI cells and clusters

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing how the boards are clustered](https://drive.google.com/uc?id=14k3O1iBkWyBVgRvxWldL8s0leKUHcAZn)

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of each cell index](https://drive.google.com/uc?id=1hZDlNCO-34Tgez7dIPzXrCopSFVpZ5EK) 

**diagonalPositiveSlopeMatching()**
checking for one direction of diagonal matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of diagonal negtive slope matching](https://drive.google.com/uc?id=1ZvoZHWI8Kq2qfFh2MRDqhzRmgdiehXWg) 

**diagonalNegativeSlopeMatching()**
checking for the other direction of diagonal matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of diagonal negtive slope matching](https://drive.google.com/uc?id=1JWvtDPvkoJxemBJmDCqPu2ZbE7JodNXL)

**verticalMatching()**
checking for vertical matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of vertical matching.](https://drive.google.com/uc?id=1iAID27eTHHvtqqmRrNu5BcFvxCCjS8Z3) 

**horizontalMatching()**
checking for horizontal matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of horizontal matching.](https://drive.google.com/uc?id=1HWgjS8JIZquvhD5ReDaIp_Up8bhXNRGY)


### To do
- Move files to a better directory structure (easy)
- Fix color matching so it doesn't color 4 matches when you put a match in the middle for a match of 4 (intermediate)
- Style page better (intermediate)
- Consider deployment for 2 player remote playing (intermediate)
- Possibly make npc smarter (hard)