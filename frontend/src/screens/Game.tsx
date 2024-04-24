import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBaord } from "../components/ChessBaord"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

// TODO: Move together, there's code repetition here
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over"

export const Game = () => {
    const socket = useSocket()
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())
    const [started, setStarted] = useState(false)

    useEffect(() => {
      if(!socket){
        return
      }
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message);
        switch (message.type) {
            case INIT_GAME: 
                // setChess(new Chess())
                setBoard(chess.board())
                setStarted(true)
                console.log("Game initialized");
                break;
            case MOVE:
                const move = message.payload;
                chess.move(move);
                setBoard(chess.board())
                console.log("Move made");
                break;
            case GAME_OVER:
                console.log("Game over");
                break;
        }
      }
    }, [socket])

    if(!socket) return <div>Connecting...</div>

    

    const clickHandler = () => {
        socket.send(JSON.stringify({
            type: INIT_GAME
        }))
    }

    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBaord socket={socket} board={board} setBoard={setBoard} chess={chess} />
                    </div>
                    <div className="pt-8 col-span-2 bg-slate-900 w-full flex justify-center">
                        {!started && <Button onClick={clickHandler}>
                            Play
                        </Button>}
                    </div>
                </div>
            </div>
        </div>
    )
}