import dotenv from "dotenv";
dotenv.config();

import net from "net";

import Board, { BoardStatus, ShootStatus } from "./board";

const TITLE = `__________        __    __  .__           _________.__    .__        
\\______   \\____ _/  |__/  |_|  |   ____  /   _____/|  |__ |__|_____  
 |    |  _|__  \\\\   __\\   __\\  | _/ __ \\ \\_____  \\ |  |  \\|  \\____ \\ 
 |    |   \\/ __ \\|  |  |  | |  |_\\  ___/ /        \\|   Y  \\  |  |_> >
 |______  (____  /__|  |__| |____/\\___  >_______  /|___|  /__|   __/ 
        \\/     \\/                     \\/        \\/      \\/   |__| (${process.env.VERSION})\n\n`;

const CHANCE_FOR_WAVE = Number(process.env.CHANCE_FOR_WAVE || 0.15);
const TIMEOUT = Number(process.env.TIMEOUT || 60000);
const PORT = Number(process.env.PORT || 5000);

(async () => {
  const server = new net.Server();
  server.listen(PORT);
  console.log("listening on port", PORT);

  server
    .on("connection", (socket) => {
      try {
        const name = `[${socket.remoteAddress}]:${socket.remotePort}`;
        const board = new Board(8, 8, [2, 3, 4, 5], 24);

        console.log(name, "welcome");
        socket.write(TITLE);
        socket.write(
          `There is a ${CHANCE_FOR_WAVE * 100}% chance for waves today ~~\n\n`
        );
        socket.write(
          "The board is 8x8, you have 24 shots and there are 4 ships of length 2, 3, 4 and 5\n"
        );

        socket.write(
          `Your session lasts only ${
            TIMEOUT / 1000
          } seconds. The timer starts when you send your first command.\n\n`
        );

        socket.write("> ");

        let wins = 0;
        let timeout: NodeJS.Timeout = null;

        socket.once("close", () => {
          if (timeout) clearTimeout(timeout);
          console.log(name, "byebye");
        });

        let working = false;
        socket
          .on("data", (data) => {
            try {
              if (working || socket.destroyed) return;
              working = true;

              if (!timeout) {
                timeout = setTimeout(() => {
                  console.log(name, "out of time");
                  socket.write(
                    "\n\nTimeout! You're out of time, better 'luck' next time ;)\n\n"
                  );
                  socket.destroy();
                }, TIMEOUT);
              }

              const str = data.toString().trim();
              console.log(name, "data", str);
              if (str === "help") {
                socket.write(
                  "print\t\tDisplays the current board\nstatus\t\tDisplays the state of the game\nshoot x y\tShoots at the specified position\nexit\t\tExits the game\n"
                );
              } else if (str === "print" || str === "board") {
                socket.write(board.printBoard());
              } else if (str === "status") {
                switch (board.getStatus()) {
                  case BoardStatus.WON_THE_GAME:
                    socket.write("Congratulation, you won the game!\n");
                    break;
                  case BoardStatus.LOST_THE_GAME:
                    socket.write(
                      "You don't have any shots left, you lost the game..\n"
                    );
                    break;
                  case BoardStatus.GAME_IN_PROGRESS:
                    socket.write(
                      `The game is in progress. You have ${board.getShotsLeft()} shots left and ${board.getShotsToHit()} ship tiles to hit.\n`
                    );
                    break;
                }
              } else if (/^shoot/.test(str)) {
                const [x, y] = str.split(" ").slice(1).map(Number);
                if (isNaN(x) || isNaN(y)) socket.write("shoot x y\n");
                else {
                  switch (board.shoot(x, y)) {
                    case ShootStatus.GAME_ENDED:
                      socket.write(
                        "You cannot shoot anymore, the game ended..\n"
                      );
                      break;
                    case ShootStatus.OUT_OF_BOUNDS:
                      socket.write(
                        "You shoot and completly miss out of bounds..\n"
                      );
                      break;
                    case ShootStatus.ALREADY_SHOT_THERE:
                      socket.write("You already shot there..\n");
                      break;
                    case ShootStatus.SHOT_HIT:
                      socket.write(
                        `You shoot at {${x},${y}} and hit a ship!\n`
                      );
                      break;
                    case ShootStatus.SHOT_HIT_AND_SUNK:
                      socket.write(
                        `You shoot at {${x},${y}} and sink a ship!\n`
                      );
                      break;
                    case ShootStatus.SHOT_MISS:
                      socket.write(`You shoot at {${x},${y}} and miss..\n`);
                      break;
                  }

                  const status = board.getStatus();
                  if (status !== BoardStatus.GAME_IN_PROGRESS) {
                    if (status === BoardStatus.WON_THE_GAME) {
                      wins++;

                      if (wins === 1) {
                        console.log(name, "got the first flag :)");
                        socket.write(
                          "Nice work! Here's your flag: " +
                            process.env.FLAG_1 +
                            "\nCan you now beat this game 5 times in a row?\n"
                        );
                        board.init();
                      } else if (wins === 5) {
                        console.log(name, "got the second flag :)");
                        socket.write(
                          "Great job! Here's your final flag: " +
                            process.env.FLAG_5 +
                            "\n\n"
                        );
                        socket.destroy();
                        return;
                      } else {
                        console.log(name, "won", wins);
                        socket.write(
                          `You won this board, only ${5 - wins} to go!\n`
                        );
                        board.init();
                      }
                    } else if (status === BoardStatus.LOST_THE_GAME) {
                      console.log(name, "lost");
                      socket.write(
                        "You lost this board, better 'luck' next time ;)\n\n"
                      );
                      socket.destroy();
                      return;
                    }
                  }
                }
              } else if (str === "exit" || str.startsWith("healthcheck")) {
                socket.destroy();
                return;
              } else {
                socket.write("see 'help' for more information\n");
              }

              socket.write("> ");
              working = false;
            } catch (e) {
              working = false;
              console.error(e);
            }
          })
          .on("error", (e) => console.log(e));
      } catch (e) {
        console.error(e);
      }
    })
    .on("error", (e) => console.error(e));
})();
