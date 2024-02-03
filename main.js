//Gameboard factory wrapped inside IIFE (module)
const board = (function gameBoard() {
  //Create board 3 by 3 array
  const entries = [];
  for (let row = 0; row <= 2; row ++){
    let new_row_entry = [];
    for (let column = 0; column <= 2; column ++) {
      new_row_entry.push(' ');
    };
    entries.push(new_row_entry);
  };

  //Check if row has three in a row
  const rowWin = (row) => {
    if (row[0] === row[1] && row[1] === row[2]) {
      return true;
    } else {
      return false;
    }
  };
   //Check if column has three in a row
  const columnWin = (column) => {
    if (column[0] === column[1] && column[1] === column[2]) {
      return true;
    } else {
      return false;
    }
  };
  //Check if diagonal has three in a row
  const diagonalWin = () => {
    if (
      (entries[0][0] === entries[1][1] && 
      entries[1][1] === entries[2][2]) ||
      (entries[0][2] === entries[1][1] &&
      entries[1][1] === entries[2][0])
      ) {
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
    console.log(entriesColumns)
    //Loop through columns and check if win condition is satisfied
    const allColumnWinArray = entriesColumns.map(column => columnWin(column));
    const diagonalWinSatisfied = diagonalWin();
    const rowSatisfied = allRowWinArray.every(win => win === true);
    const columnSatisfied = allColumnWinArray.every(win => win === true);
    console.log('Row wins:', allRowWinArray);
    console.log('Column wins:', allColumnWinArray);
    console.log('Diagonal win:', diagonalWinSatisfied);
    if (rowSatisfied === true || columnSatisfied === true || diagonalWinSatisfied === true) {
      return true;
    } else {
      return false;
    }
  }
  
  return { entries, winConditionSatisfied };
})();

board.winConditionSatisfied();
console.log(board.winConditionSatisfied())
