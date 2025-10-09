"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PausedState = void 0;
var PausedState = /** @class */ (function () {
    function PausedState(game) {
        this.game = game;
    }
    PausedState.prototype.enter = function () {
        console.log("Game Paused");
        this.game.stage.update();
    };
    PausedState.prototype.exit = function () {
        console.log("Resuming Game");
    };
    PausedState.prototype.update = function (event) {
        // No updates in paused state
    };
    PausedState.prototype.handleKeyDown = function (event) {
        if (event.keyCode === 80) { // 'P' key to resume
            this.game.transitionTo("paused");
        }
    };
    PausedState.prototype.handleKeyUp = function (event) {
        // No action on key up in paused state
    };
    return PausedState;
}());
exports.PausedState = PausedState;
