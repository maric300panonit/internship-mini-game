import { IGameState } from "./IGameState.ts";
import type { IGame } from "../IGame.ts";
import { Character } from "../models/character.model.ts";
import { environment } from "../env/env.ts";

export class PlayingState implements IGameState {
    private game: IGame;
    private character: Character;

    constructor(game: IGame, character: Character) {
        this.game = game;
        this.character = character;
    }

    enter() {
        createjs.Ticker.paused = false;
        this.game.pause_menu_container.visible = false;
        console.log("Game Started");
    }
    exit() {
        console.log("Exiting Playing State");
    }

    update() {
        this.character.update();
        this.game.stage.update();
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                this.character.isLeftPressed = true;
                break;
            case 38:
                if (this.character.isOnGround(this.character.bitmap)) {
                    this.character.Jump();
                    this.character.changeAnimationToJumping();
                }
                break;
            case 39:
                this.character.isRightPressed = true;
                break;
            case 80: // 'P' key to pause
                this.game.transitionTo("paused");
                break;
        }
    }
    handleKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                environment.isDoubleClickActive = false;
                this.character.isLeftPressed = false;
                this.character.changeAnimationToStanding();
                break;
            case 39:
                environment.isDoubleClickActive = false;
                this.character.isRightPressed = false;
                this.character.changeAnimationToStanding();
                break;
        }
    }
}