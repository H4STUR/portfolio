import { createCell } from './CellTypes';

/**
 * Function to create a grid (board) of cells
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @returns {Array} A 2D array representing the board with cells
 */
const createBoard = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createCell())
  );
};

/**
 * Function to randomly place mines on the board
 * @param {Array} board - The board (2D array) where mines will be placed
 * @param {number} mineCount - The number of mines to place on the board
 * @returns {Array} The updated board with mines placed
 */
const placeMines = (board, mineCount) => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    // Place a mine if there isn't already one at this location
    if (!board[randomRow][randomCol].isMine) {
      board[randomRow][randomCol].isMine = true;
      minesPlaced++;

      // Update the neighbor counts for surrounding cells
      updateNeighbors(board, randomRow, randomCol);
    }
  }

  return board;
};

/**
 * Function to update the neighbors count of cells surrounding a mine
 * @param {Array} board - The board with cells
 * @param {number} row - Row index of the placed mine
 * @param {number} col - Column index of the placed mine
 */
const updateNeighbors = (board, row, col) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    // Check if the neighboring cell is within bounds and is not a mine
    if (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length &&
      !board[newRow][newCol].isMine
    ) {
      board[newRow][newCol].neighbors += 1;
    }
  });
};

export { createBoard, placeMines };
