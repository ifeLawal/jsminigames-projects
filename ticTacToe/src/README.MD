ConvertboardIndex

convertIndextoBoardLocation(val)

// the two d board is a 9x9 2d array
// cellIndex always equates to [0-2][0-2]; [0,1,2][3,4,5][6,7,8]
// by adding the clusterIndex value you transpose the cellIndex to the right board
// ie cellIndex: 5 -> [1][2]
// clusterIndex 0: transpose by [0][0], so [1][2]
// clusterIndex 1: transpose by [0][3] so [1][5]
// clusterIndex 4: transpose by [3][3] so [4][5]
// convert cluster index into [boardx, boardy]
// multiply boardx & boardy by length of tic tac toe board to transpose it accordingly to the 2D board
// add the converted index of the cell data
// append value in the cell to the 2dboard