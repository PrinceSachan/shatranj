"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        console.log(move);
        // validate the type of move using zod
        console.log("move made");
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("early sent 1");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("early sent 2");
            return;
        }
        console.log("did not early return");
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        console.log("move succeeded");
        // check if the game is over
        if (this.board.isGameOver()) {
            // send the game over message to both players
            this.player1.emit(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        // if game is not over
        console.log(this.board.moves.length);
        if (this.moveCount % 2 === 0) {
            console.log("sent1");
            this.player2.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
        }
        else {
            console.log("sent2");
            this.player1.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
        // send the updated board to both player
    }
}
exports.Game = Game;
