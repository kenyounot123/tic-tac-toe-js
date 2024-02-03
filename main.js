//Gameboard factory wrapped inside IIFE (module)
const Board = (function gameBoard() {
  //Create board 3 by 3 array
  const entries = [];
  const makeBoard = () => {
    const allCells = document.querySelectorAll('.cell')
    let counter = 0;
    for (let row = 0; row <= 2; row ++){
      let new_row_entry = [];
      for (let column = 0; column <= 2; column ++) {
        const cell = allCells[counter];
        cell.setAttribute('data-index', [row, column])
        counter ++;
        new_row_entry.push(' ');
      };
      entries.push(new_row_entry);
    };
  }

  //Check if row has three in a row
  const rowWin = (row) => {
    if (!(row.includes('X') || row.includes('O'))) {
      return false;
    }
    if (row[0] === row[1] && row[1] === row[2]) {
      return true;
    } else {
      return false;
    }
  };
   //Check if column has three in a row
  const columnWin = (column) => {
    if (!(column.includes('X') || column.includes('O'))) {
      return false;
    }
    if (column[0] === column[1] && column[1] === column[2]) {
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
    console.log('all diagonals', diagonals)
    if (!((diagonals[0].includes('X') || 
          diagonals[0].includes('O')) &&
          (diagonals[1].includes('X') ||
          diagonals[1].includes('O')))) {
      return false;
    } else if ((diagonals[0][0] === diagonals[0][1] &&
                diagonals[0][1] === diagonals[0][2]) ||
                (diagonals[1][0] === diagonals[1][1] &&
                diagonals[1][1] === diagonals[1][2])){
      
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
        allColumns[column].push(entries[row][column]);
      };
    };
    return allColumns;
  };


  //Loop through all entries to see if win condition is satisfied
  const winConditionSatisfied = () => {
    //Loop through rows and check if win condition is satisfied
    const allRowWinArray = entries.map(row => rowWin(row));
    let entriesColumns = getAllColumns();
    console.log('all columns:', entriesColumns)
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
    //Loop through all cells and display their value to DOM
    const allCells = document.querySelectorAll('.cell')
    let counter = 0;
    for (let row = 0; row <= 2; row ++){
      for (let column = 0; column <= 2; column ++) {
        const cell = allCells[counter];
        cell.textContent = entries[row][column]
        counter ++;
      };
    };
  };

  //Reset board
  const clearBoard = () => {
    entries.splice(0, entries.length)
    makeBoard();
  }
  
  return { entries, winConditionSatisfied, makeBoard, clearBoard, displayBoard };
})();

//Player factory
const createPlayer = function (name, symbol) {

  const playerName = `${name}`;
  const playerSymbol = `${symbol}`
  //Player move selection will read mouse click target, determine which square it was on the board.entries array and then change the entry to player symbol
  const selectEntry = (e) => {
    console.log(e.target)
    const entryArray = e.target.getAttribute('data-index').split(',')
    if (Board.entries[entryArray[0]][entryArray[1]] === 'X' ||
        Board.entries[entryArray[0]][entryArray[1]] === 'O') {
      return false;
    } else {
      Board.entries[entryArray[0]][entryArray[1]] = playerSymbol;
      return true;
    }
  };
  return {playerName, symbol, selectEntry}
};
const Modal = (() => {
  const infoDialog = document.querySelector('.modal');

  function show(text) {
    infoDialog.textContent = text;
    infoDialog.showModal();
  }

  function closeModal() {
    infoDialog.close();
  }

  window.addEventListener('click', function(event) {
    if (event.target === infoDialog) {
      closeModal();
    }
  });

  return {
    show,
    closeModal
  };
})();
const Game = (() => {
  Board.makeBoard()
  const allCells = document.querySelectorAll('.cell')
  let playerOne = createPlayer('Player 1', 'X');
  let playerTwo = createPlayer('Player 2', 'O');
  let gameBoardEntries = Board.entries
  console.log(gameBoardEntries)
  const totalRounds = 9;
  let rounds = 1;

  function play(e) {
    console.log(Board.entries)
    if (rounds === totalRounds) {
      Modal.show(`Its a Tie!`)
      Board.clearBoard()
      rounds = 1;
    }
    let current_player = rounds % 2 === 1 ? playerOne : playerTwo
    switch (current_player) {
      case playerOne:
        if (playerOne.selectEntry(e)) {
          Board.displayBoard();
          if (Board.winConditionSatisfied()) {
            Modal.show(`${current_player.playerName} is the winner`)
            Board.clearBoard();
            rounds = 1;
          }
          rounds ++;
        }
        break;
      case playerTwo:
        if (playerTwo.selectEntry(e)) {
          Board.displayBoard();
          if (Board.winConditionSatisfied()) {
            Modal.show(`${current_player.playerName} is the winner`)
            Board.clearBoard();
            rounds = 1;
          }
          rounds ++;
        }
        break;
    };
  };
  allCells.forEach(cell => {
    cell.addEventListener('click', play) 
  });
})();