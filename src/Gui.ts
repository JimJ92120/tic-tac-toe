import * as readline from "readline";

import { GameInterface } from "./Game/types";

export default class GUI {
  interface: readline.Interface;
  game: GameInterface;

  constructor(game: GameInterface) {
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

      console.log(`Turn: ${this.game.turn} | Player: ${this.game.currentPlayer} | Cell: ${cell}`);

      if (!this.game.playTurn(cell)) {
        console.log("Illegal or invalid turn.");
      }

      console.log("\n");

      if (this.game.hasWon(cell)) {
        console.log(`Player ${this.game.currentPlayer} has won.\n`);

        break;
      }

      if (!this.game.isRunning()) {
        console.log("Game has finished.\n");

        break;
      }
    }
  }
}

