import { ASSETS_PATH, GROUND_LEVEL } from "../constants";
import { AssetManager } from "../assetManager/AssetManager";

export class Character {
    bitmap: createjs.Bitmap;
    speed: number;
    jumpheight: number;
    jumpduration: number;
    isLeftPressed = false;
    isRightPressed = false;
    assetManager: AssetManager;

    constructor(bitmap: createjs.Bitmap, speed: number, jumpheight: number, jumpduration: number, assetManager: AssetManager) {
        this.bitmap = bitmap;
        this.speed = speed;
        this.jumpheight = jumpheight;
        this.jumpduration = jumpduration;
        this.assetManager = assetManager;

    }

    changeAnimationToStanding() {
        this.bitmap.image = this.assetManager.getResult("character_standing");
    }

    changeAnimationToWalking(direction: string) {
        if (direction === "left") {
            this.bitmap.image = this.assetManager.getResult("character_walking_left");
        }else if (direction === "right") {
            this.bitmap.image = this.assetManager.getResult("character_walking_right");
        }
    }

    changeAnimationToRunning(direction: string) {
        if (direction === "left") {
            this.bitmap.image = this.assetManager.getResult("character_running_left");
        }else if (direction === "right") {
            this.bitmap.image = this.assetManager.getResult("character_running_right");
        }
    }

    changeAnimationToJumping() {
        this.bitmap.image = this.assetManager.getResult("character_jumping");
    }

    isOnGround(bitmap: createjs.Bitmap) {
        if (bitmap.y === GROUND_LEVEL) {
            return true;
        }
        return false;
    }

    jump() {
        createjs.Tween.get(this.bitmap)
            .to({ y: this.bitmap.y - this.jumpheight }, this.jumpduration / 2, createjs.Ease.quadOut)
            .to({ y: GROUND_LEVEL }, this.jumpduration / 2, createjs.Ease.quadIn);
    }

    canMoveLeft() {
        if (this.bitmap.x >= 0) {
            return true;
        }
        return false;
    }
    
    canMoveRight() {
        if (this.bitmap.x <= 1920) {
            return true;
        }
        return false;
    }

    move(direction: string, isSprinting: boolean) {

        if (direction === "left" && this.canMoveLeft()) {

            isSprinting ? this.bitmap.x -= this.speed * 2 : this.bitmap.x -= this.speed;
            isSprinting ? this.changeAnimationToRunning("left") : this.changeAnimationToWalking("left");

        } else if (direction === "right" && this.canMoveRight()) {

            isSprinting ? this.bitmap.x += this.speed * 2 : this.bitmap.x += this.speed;
            isSprinting ? this.changeAnimationToRunning("right") : this.changeAnimationToWalking("right");
        }
    }

    update() {
        
    }

    

}