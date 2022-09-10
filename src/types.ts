export enum CellState {
  EMPTY = 0,
  X = 1,
  O = 2,
};

export enum GameState {
  START = 0,
  RUN = 1,
  END= 2,
};

export interface GameInterface {
  turn: number;
  currentPlayer: CellState;

  run(): void;
  stop(): void;
  reset(): void;
  playTurn(cellIndex: number): boolean;
  hasWon(cellIndex: number): boolean;
  isRunning(): boolean;
}
