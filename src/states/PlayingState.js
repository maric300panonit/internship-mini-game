"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayingState = void 0;
var PlayingState = /** @class */ (function () {
    function PlayingState(game) {
        this.game = game;
    }
    PlayingState.prototype.enter = function () {
        createjs.Ticker.paused = false;
        this.game.pause_menu_container.visible = false;
        console.log("Game Started");
    };
    PlayingState.prototype.exit = function () {
        console.log("Exiting Playing State");
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
                this.game.isDoubleClickActive = false;
                this.game.isLeftPressed = false;
                this.game.changeCharacterAnimationToStanding();
                break;
            case 39:
                this.game.isDoubleClickActive = false;
                this.game.isRightPressed = false;
                this.game.changeCharacterAnimationToStanding();
                break;
        }
    };
    return PlayingState;
}());
exports.PlayingState = PlayingState;
