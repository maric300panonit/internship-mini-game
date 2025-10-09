import { IGameState } from "./IGameState";
import type { IGame } from "../IGame";

export class PausedState implements IGameState {
    private game: IGame;

    constructor(game: IGame) {
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
            this.game.transitionTo("playing");
        }
    }
    handleKeyUp(event: KeyboardEvent) {
        // No action on key up in paused state
    }
}