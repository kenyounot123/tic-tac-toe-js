// Board class
class Board {
  //Create board 3 by 3 array when instantiated
  static entries = []
  constructor() {
    this.makeBoard();
  }
  static makeBoard() {
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
      this.entries.push(new_row_entry);
    };
  }

  //Check if row has three in a row
  static #rowWin(row) {
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
  static #columnWin(column) {
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
  static #diagonalWin() {
    const diagonals = [
      [this.entries[0][0], this.entries[1][1], this.entries[2][2]],
      [this.entries[0][2], this.entries[1][1], this.entries[2][0]]
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
  static #getAllColumns() {
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
  static winConditionSatisfied(){
    //Loop through rows and check if win condition is satisfied
    const allRowWinArray = this.entries.map(row => this.#rowWin(row));
    let entriesColumns = this.#getAllColumns();
    //Loop through columns and check if win condition is satisfied
    const allColumnWinArray = entriesColumns.map(column => this.#columnWin(column));
    //Check diagonals
    const diagonalWinSatisfied = this.#diagonalWin();
    //If any is satisfied then return true
    const rowSatisfied = allRowWinArray.some(win => win === true);
    const columnSatisfied = allColumnWinArray.some(win => win === true);
    if (rowSatisfied === true || columnSatisfied === true || diagonalWinSatisfied === true) {
      return true;
    } else {
      return false;
    }
  }

  //Display board to DOM
  static displayBoard() {
    //Loop through all cells and display their value to DOM
    const allCells = document.querySelectorAll('.cell')
    let counter = 0;
    for (let row = 0; row <= 2; row ++){
      for (let column = 0; column <= 2; column ++) {
        const cell = allCells[counter];
        cell.textContent = this.entries[row][column]
        counter ++;
      };
    };
  };

  //Reset board
  static clearBoard() {
    this.entries.splice(0, this.entries.length)
    this.makeBoard();
  }
  
  
};

//Player factory
class Player {

  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol
  }

  //Player move selection will read mouse click target, determine which square it was on the board.entries array and then change the entry to player symbol
  selectEntry(e) {
    const entryArray = e.target.getAttribute('data-index').split(',')
    if (Board.entries[entryArray[0]][entryArray[1]] === 'X' ||
        Board.entries[entryArray[0]][entryArray[1]] === 'O') {
      return false;
    } else {
      Board.entries[entryArray[0]][entryArray[1]] = this.symbol;
      return true;
    }
  };
  
};
class Modal {

  static infoDialog = document.querySelector('.modal');
  static modalContent = document.createElement('p');
  
  static show(text) {
    Modal.modalContent.textContent = text;
    Modal.infoDialog.showModal();
  }

  static closeModal() {
    Modal.infoDialog.close();
  }
  static initEventListeners() {
    this.infoDialog.appendChild(this.modalContent);
    window.addEventListener('click', function(event) {
      if (event.target === this.infoDialog) {
        Modal.closeModal();
      }
    }); 
  }
};
class Game {
  constructor() {
    Board.makeBoard()
    Modal.initEventListeners();
    this.playerOne = new Player('Player 1', 'X');
    this.playerTwo = new Player('Player 2', 'O');
    this.gameBoardEntries = Board.entries
    this.totalRounds = 9
    this.rounds = 1;
    this.initMainEventListener()
    this.initResetEventListener()
  }

  play(e) {
    if (this.rounds === this.totalRounds) {
      Modal.show(`Its a Tie!`)
      this.rounds = 1;
    }
    let current_player = this.rounds % 2 === 1 ? this.playerOne : this.playerTwo
    switch (current_player) {
      case this.playerOne:
        if (this.playerOne.selectEntry(e)) {
          this.rounds ++;
          Board.displayBoard();
          if (Board.winConditionSatisfied()) {
            Modal.show(`${current_player.name} is the winner`);
            Board.clearBoard();
            this.rounds = 1;
          }
        }
        break;
      case this.playerTwo:
        if (this.playerTwo.selectEntry(e)) {
          this.rounds ++;
          Board.displayBoard();
          if (Board.winConditionSatisfied()) {
            Modal.show(`${current_player.name} is the winner`);
            Board.clearBoard();
            this.rounds = 1;
          }
        }
        break;
    };
  };
  initMainEventListener() {
    const allCells = document.querySelectorAll('.cell')
    allCells.forEach(cell => {
      cell.addEventListener('click', this.play) 
    });
  }
  initResetEventListener() {
    const resetButton = document.querySelector('.reset')
    resetButton.addEventListener('click', function() {
    Board.clearBoard()
    this.rounds = 1
    Board.displayBoard();
  })

  }
};

new Game();

