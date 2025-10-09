import { IGameState } from "./IGameState";
import { Game } from "../game";
import { PlayingState } from "./PlayingState";
export class PausedState implements IGameState {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    enter() {
        console.log("Game Paused");
        this.game.stage.update();
    }

    exit() {
        console.log("Resuming Game");
    }

    update(event: any) {
        // No updates in paused state
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 80) { // 'P' key to resume
            this.game.changeState(new PlayingState(this.game));
        }
    }
    handleKeyUp(event: KeyboardEvent) {
        // No action on key up in paused state
    }

}