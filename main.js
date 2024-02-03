//Gameboard factory wrapped inside IIFE (module)
const board = (function gameBoard() {
  //Create board 3 by 3 array
  const entries = [];
  const makeBoard = () => {
    for (let row = 0; row <= 2; row ++){
      let new_row_entry = [];
      for (let column = 0; column <= 2; column ++) {
        new_row_entry.push(' ');
      };
      entries.push(new_row_entry);
    };
  }

  //Check if row has three in a row
  const rowWin = (row) => {
    if (!(row.includes('X') || row.includes('O'))) {
      return false;
    } else if (row[0] === row[1] && row[1] === row[2]) {
      return true;
    } else {
      return false;
    }
  };
   //Check if column has three in a row
  const columnWin = (column) => {
    if (!(column.includes('X') || column.includes('O'))) {
      return false;
    } else if (column[0] === column[1] && column[1] === column[2]) {
      return true;
    } else {
      return false;
    }
  };
  //Check if diagonal has three in a row
  const diagonalWin = () => {
    const diagonals = [
      [entries[0][0], entries[1][1], entries[2][2]],
      [entries[0][2], entries[1][1], entries[2][0]]
    ]
    if (!(diagonals[0].includes('X') || 
          diagonals[0].includes('O') ||
          diagonals[1].includes('X') ||
          diagonals[1].includes('O'))) {
      return false;
    } else if ((diagonals[0][0] === diagonals[0][1] &&
                diagonals[0][1] === diagonals[0][2]) ||
                diagonals[1][0] === diagonals[1][1] &&
                diagonals[1][1] === diagonals[1][2]){
      
      return true;
    } else {
      return false;
    }
  };

  //Return an array of each column entries
  const getAllColumns = () => {
    let allColumns = []
    for (let column = 0; column <= 2; column ++){
      allColumns.push([])
      for (let row = 0; row <= 2; row ++) {
        allColumns[column].push([entries[row][column]]);
      };
    };
    return allColumns;
  };


  //Loop through all entries to see if win condition is satisfied
  const winConditionSatisfied = () => {
    //Loop through rows and check if win condition is satisfied
    const allRowWinArray = entries.map(row => rowWin(row));
    let entriesColumns = getAllColumns();
    //Loop through columns and check if win condition is satisfied
    const allColumnWinArray = entriesColumns.map(column => columnWin(column));
    //Check diagonals
    const diagonalWinSatisfied = diagonalWin();
    //If any is satisfied then return true
    const rowSatisfied = allRowWinArray.some(win => win === true);
    const columnSatisfied = allColumnWinArray.some(win => win === true);
    console.log('Row wins:', allRowWinArray);
    console.log('Column wins:', allColumnWinArray);
    console.log('Diagonal win:', diagonalWinSatisfied);
    if (rowSatisfied === true || columnSatisfied === true || diagonalWinSatisfied === true) {
      return true;
    } else {
      return false;
    }
  }

  //Display board to DOM
  const displayBoard = () => {

  };
  const clearBoard = () => {
    entries.splice(0, entries.length)
    makeBoard();
  }
  
  return { entries, winConditionSatisfied, makeBoard, clearBoard };
})();

//Player factory
const createPlayer = function (name, symbol) {
  const playerName = `${name}`;
  const playerSymbol = `${symbol}`
  //Player move selection will read mouse click target, determine which square it was on the board.entries array and then change the entry to player symbol
  const selectEntry = (entry) => {
    board.entries[entry[0]][entry[1]] = playerSymbol
  };
  return {name, symbol, selectEntry}
};
board.makeBoard();
console.log('Board Entries:', board.entries);
const playerOne = createPlayer('Player1', 'X')
playerOne.selectEntry([0,0])
playerOne.selectEntry([0,1])
playerOne.selectEntry([0,2])
console.log('Board Entries:', board.entries);
console.log(board.winConditionSatisfied());
board.clearBoard();
console.log(board)