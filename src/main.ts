import * as readline from "readline";

enum GameState {
  START = 0,
  RUN = 1,
  END= 2,
};

enum CellState {
  EMPTY = 0,
  X = 1,
  O = 2,
};

class Board {
  cells: CellState[] = Array(9).fill(CellState.EMPTY);

  updateCell(cellIndex: number, cellValue: CellState): boolean {
    if (cellIndex < this.cells.length
      && cellIndex >= 0
      && this.cells[cellIndex] === CellState.EMPTY  
    ) {
      this.cells[cellIndex] = cellValue;

      return true;
    }

    return false;
  }

  getRowValues(cellIndex: number): CellState[] {
    const row = Math.floor(cellIndex / 3);      
    const rowOffset: number = row * 3;

    return this.cells.slice(rowOffset, rowOffset + 3);
  }

  getColumnValues(cellIndex: number): CellState[] {
    const column = cellIndex % 3;

    return [0, 1, 2].map((offset) => {
      return this.cells[column + offset * 3];
    });
  }

  getDiagonalValues(cellIndex: number, diagonalIndices: number[]): CellState[] {
    if (diagonalIndices.includes(cellIndex)) {
      return diagonalIndices.map((index) => this.cells[index]);
    }

    return [];
  }

  getLeftDiagonalValues(cellIndex: number): CellState[] {
    return this.getDiagonalValues(cellIndex, [0, 4, 8]);
  }

  getRightDiagonalValues(cellIndex: number): CellState[] {
    return this.getDiagonalValues(cellIndex, [2, 4, 6]);
  }
}

class Game {
  state: GameState;
  turn: number;
  turnLimit = 9;
  board: Board;

  constructor() {
    this.set();
  }

  set() {
    this.state = GameState.START;
    this.turn = 1;
    this.board = new Board();
  }

  run() {
    this.state = GameState.RUN;
  }

  stop() {
    this.state = GameState.END
  }

  reset() {
    this.set();
  }

  isRunning(): boolean {
    return this.state === GameState.RUN;
  }

  incrementTurn() {
    this.turn++;

    if (this.turn > this.turnLimit) {
      this.stop();
    }
  }

  getCurrentPlayer(): CellState {
    return this.turn % 2 === 1 ? CellState.X : CellState.O;
  }

  playTurn(cellIndex: number, currentPlayer: CellState): boolean {
    if (!isNaN(cellIndex)
      && this.board.updateCell(cellIndex, currentPlayer)
    ) {

      this.printBoard();
      this.incrementTurn();

      return true;
    }  

    return false;
  }
  
  hasWon(cellIndex: number, currentPlayer: CellState): boolean {
    if (this.turn >= 5) {
      if (this.isLineValid(this.board.getRowValues(cellIndex), currentPlayer)
        || this.isLineValid(this.board.getColumnValues(cellIndex), currentPlayer)
        || this.isLineValid(this.board.getLeftDiagonalValues(cellIndex), currentPlayer)
        || this.isLineValid(this.board.getRightDiagonalValues(cellIndex), currentPlayer)
      ) {
        this.stop();

        return true;
      }
    }

    return false;
  }

  isLineValid(line: CellState[], currentPlayer: CellState): boolean {
    if (line.length === 3
      && line.every((cellValue) => cellValue === currentPlayer)
    ) {
      return true;
    }

    return false;
  }

  printBoard() {
    console.log(
      this.board.cells.slice(0, 3).join("|") + "\n"
      + this.board.cells.slice(3, 6).join("|") + "\n"
      + this.board.cells.slice(6, 9).join("|")
    );
  }
}

class GUI {
  interface: readline.Interface;
  game: Game;

  constructor(game: Game) {
    this.setInterface();

    this.game = game;
  }

  setInterface() {
    this.interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.interface.on("close", () => {
      console.log("\nLeaving...");
      process.exit(0);
    });
  }

  start() {
    console.log("Starting...");

    this.interface.question("Press ENTER to start:\n", () => {
      console.log("Started.");

      this.run();   
    });
  }

  stop() {
    this.game.stop();
    this.interface.close();
  }

  reset() {
    this.interface.question("Do you want to restart? [y/any]:\n", (answer: string) => {
      if (answer === "y") {
        console.log("Re-started.");

        this.game.reset();
        this.run();  
      } else {
        this.stop();
      }
    });
  }

  * questions(query: string) {
    try {
      for (;;) {
        yield new Promise((resolve) => this.interface.question(query, resolve));
      }
    } finally {
      this.reset();
    }
  }

  async run() {
    this.game.run();

    for await (const cellIndex of this.questions("Cell index: ")) {
      const cell: number = Number(cellIndex);
      const currentPlayer: CellState = this.game.getCurrentPlayer();

      console.log(`Turn: ${this.game.turn} | Player: ${currentPlayer} | Cell: ${cell}`);

      if (!this.game.playTurn(cell, currentPlayer)) {
        console.log("Illegal or invalid turn.");
      }

      console.log("\n");

      if (this.game.hasWon(cell, currentPlayer)) {
        console.log(`Player ${currentPlayer} has won.\n`);

        break;
      }

      if (!this.game.isRunning()) {
        console.log("Game has finished.\n");

        break;
      }
    }
  }
}

const gui: GUI = new GUI(new Game());

gui.start();
