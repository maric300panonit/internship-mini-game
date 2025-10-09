"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayingState = void 0;
var PlayingState = /** @class */ (function () {
    function PlayingState(game) {
        this.game = game;
    }
    PlayingState.prototype.enter = function () {
        console.log("Game Started");
    };
    PlayingState.prototype.exit = function () {
        console.log("Exiting Playing State");
    };
    PlayingState.prototype.update = function (event) {
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
    };
    PlayingState.prototype.handleKeyDown = function (event) {
        switch (event.keyCode) {
            case 37:
                this.game.isLeftPressed = true;
                break;
            case 38:
                if (this.game.isBitmapOnGround(this.game.character_bitmap)) {
                    this.game.characterJump();
                    this.game.changeCharacterAnimationToJumping();
                }
                break;
            case 39:
                this.game.isRightPressed = true;
                break;
            case 80: // 'P' key to pause
                this.game.transitionTo("paused");
                break;
        }
    };
    PlayingState.prototype.handleKeyUp = function (event) {
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
    };
    return PlayingState;
}());
exports.PlayingState = PlayingState;
