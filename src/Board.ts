import { CellState } from "./types";

export default class Board {
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
