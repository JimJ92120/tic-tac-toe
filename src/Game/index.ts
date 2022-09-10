import { CellState, GameState, GameInterface } from "../types";

import Board from "./Board";

export default class Game implements GameInterface {
  state: GameState;
  turn: number;
  turnLimit = 9;
  board: Board;
  currentPlayer: CellState;

  constructor() {
    this.set();
  }

  set() {
    this.state = GameState.START;
    this.turn = 1;
    this.board = new Board();
    this.currentPlayer = CellState.X;
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

  updateCurrentPlayer() {
    this.currentPlayer = this.turn % 2 === 1 ? CellState.X : CellState.O
  }

  playTurn(cellIndex: number): boolean {
    this.updateCurrentPlayer();
  
    if (!isNaN(cellIndex)
      && this.board.updateCell(cellIndex, this.currentPlayer)
    ) {

      this.printBoard();
      this.incrementTurn();

      return true;
    }  

    return false;
  }
  
  hasWon(cellIndex: number): boolean {
    if (this.turn >= 5) {
      if (this.isLineValid(this.board.getRowValues(cellIndex), this.currentPlayer)
        || this.isLineValid(this.board.getColumnValues(cellIndex), this.currentPlayer)
        || this.isLineValid(this.board.getLeftDiagonalValues(cellIndex), this.currentPlayer)
        || this.isLineValid(this.board.getRightDiagonalValues(cellIndex), this.currentPlayer)
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
