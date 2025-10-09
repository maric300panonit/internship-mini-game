import { IGameState } from "./IGameState";
import { Game } from "../game";
import { PausedState } from "./PausedState";

export class PlayingState implements IGameState {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    enter() {
        console.log("Game Started");
    }
    exit() {
        console.log("Exiting Playing State");
    }
    update(event: any) {

        if (!this.game.isBitmapOnGround(this.game.character_bitmap)) {
            this.game.changeCharacterAnimationToJumping();
        }
        else {
            this.game.changeCharacterAnimationToStanding();
        }
        if (this.game.isLeftPressed && this.game.canBitmapMoveLeft(this.game.character_bitmap)) {
            this.game.handleMoveLeft();
        }
        if (this.game.isRightPressed && this.game.canBitmapMoveRight(this.game.character_bitmap)) {
            this.game.handleMoveRight();
        }
        this.game.stage.update(event);
            
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                this.game.isLeftPressed = true;
                break;
            case 38:
                if  (this.game.isBitmapOnGround(this.game.character_bitmap)) {
                    this.game.characterJump();
                    this.game.changeCharacterAnimationToJumping();
                }
                break;
            case 39:
                this.game.isRightPressed = true;                    
                break;
            case 80: // 'P' key to pause
                this.game.changeState(new PausedState(this.game));
                break;
        }
    }
    handleKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                this.game.isLeftPressed = false;
                this.game.changeCharacterAnimationToStanding();
                break;
            case 39:
                this.game.isRightPressed = false;                    
                this.game.changeCharacterAnimationToStanding();
                break;
        }
    }

}