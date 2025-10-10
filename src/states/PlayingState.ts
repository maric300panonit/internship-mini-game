import { IGameState } from "./IGameState.ts";
import type { IGame } from "../IGame.ts";
import { Character } from "../models/character.model.ts";
import { environment } from "../env/env.ts";
import { Keys } from "../constants.ts";

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
            case Keys.LEFT_ARROW:
                this.character.isLeftPressed = true;
                break;
            case Keys.UP_ARROW:
                if (this.character.isOnGround(this.character.bitmap)) {
                    this.character.jump();
                    this.character.changeAnimationToJumping();
                }
                break;
            case Keys.RIGHT_ARROW:
                this.character.isRightPressed = true;
                break;
            case Keys.P: // 'P' key to pause
                this.game.transitionTo("paused");
                break;
        }
    }
    handleKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case Keys.LEFT_ARROW:
                environment.isDoubleClickActive = false;
                this.character.isLeftPressed = false;
                this.character.changeAnimationToStanding();
                break;
            case Keys.RIGHT_ARROW:
                environment.isDoubleClickActive = false;
                this.character.isRightPressed = false;
                this.character.changeAnimationToStanding();
                break;
        }
    }
}