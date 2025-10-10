import { Keys } from "./constants.ts";
export class InputManager {
    public moveLeft = false;
    public moveRight = false;
    public isSprinting = false;
    
    private lastKeyTime = 0;
    private doubleClickThreshold = 300; // milliseconds

    constructor() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.repeat) return; // Ignore auto-repeated keydown events
        if (event.keyCode === Keys.LEFT_ARROW || event.keyCode === Keys.RIGHT_ARROW) {
            const currentTime = Date.now();
            if (currentTime - this.lastKeyTime < this.doubleClickThreshold && (currentTime - this.lastKeyTime > 20 || this.isSprinting)) {
                this.isSprinting = true;
            }
            this.lastKeyTime = currentTime;
            if (event.keyCode === Keys.LEFT_ARROW) {
                this.moveLeft = true;
            }
            if (event.keyCode === Keys.RIGHT_ARROW) {
                this.moveRight = true;
            }

        }
    }
    handleKeyUp(event: KeyboardEvent) {
        if (event.keyCode === Keys.LEFT_ARROW) {
            this.moveLeft = false;
        }
        if (event.keyCode === Keys.RIGHT_ARROW) {
            this.moveRight = false;
        }
        if (!this.moveLeft && !this.moveRight) {
            this.isSprinting = false;
        }
    }
}