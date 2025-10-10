import { IGameState } from "./IGameState.ts";
import type { IGame } from "../IGame.ts";
import { Character } from "../models/character.model.ts";
import { environment } from "../env/env.ts";
import { Keys } from "../constants.ts";
import { InputManager } from "../InputManager.ts";

export class PlayingState implements IGameState {
    private game: IGame;
    private character: Character;
    private inputManager: InputManager;
    private characterMovement: number = 0;

    constructor(game: IGame, character: Character, inputManager: InputManager) {
        this.game = game;
        this.character = character;
        this.inputManager = inputManager;
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
        if (this.inputManager.moveLeft) {
            this.character.move("left", this.inputManager.isSprinting);
            this.characterMovement = this.inputManager.isSprinting ? this.character.speed * -2 : this.character.speed * -1;
        } else if (this.inputManager.moveRight) {
            this.character.move("right", this.inputManager.isSprinting);
            this.characterMovement = this.inputManager.isSprinting ? this.character.speed * 2 : this.character.speed;
        } else {
            this.character.changeAnimationToStanding();
            this.characterMovement = 0;
        }
        this.game.updateBackgroundLayers(this.characterMovement);
        this.game.stage.update();
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case Keys.UP_ARROW:
                if (this.character.isOnGround(this.character.bitmap)) {
                    this.character.jump();
                    this.character.changeAnimationToJumping();
                }
                break;
            case Keys.P:
                this.game.transitionTo("paused");
                break;
        }
    }
    handleKeyUp(event: KeyboardEvent) {

    }
}