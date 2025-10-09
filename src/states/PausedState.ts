import { IGameState } from "./IGameState.ts";
import type { IGame } from "../IGame.ts";
import { Character } from "../models/character.model.ts";

export class PausedState implements IGameState {
    private game: IGame;
    private character: Character;

    constructor(game: IGame, character: Character) {
        this.game = game;
        this.character = character;
    }

    enter() {
        console.log("Game Paused");
        createjs.Ticker.paused = true;
        this.game.pause_menu_container.visible = true;

        this.game.stage.update();
    }

    update(event: any): void {
        // No updates needed in paused state
    }

    exit() {
        console.log("Resuming Game");
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