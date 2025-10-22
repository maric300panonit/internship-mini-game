import { ASSETS_PATH, GROUND_LEVEL } from "../constants";
import { AssetManager } from "../assetManager/AssetManager";
import { ISerializable } from "../saveManager/ISerializable";
import { ICharacterSaveData } from "../saveManager/ISaveData";
export class Character implements ISerializable<ICharacterSaveData> {
    bitmap: createjs.Bitmap;
    speed: number;
    jumpheight: number;
    jumpduration: number;
    isLeftPressed = false;
    isRightPressed = false;
    isJumping = false;
    assetManager: AssetManager;
    jumpCount: number;
    distanceTraveled: number;

    constructor(bitmap: createjs.Bitmap, speed: number, jumpheight: number, jumpduration: number, assetManager: AssetManager) {
        this.bitmap = bitmap;
        this.speed = speed;
        this.jumpheight = jumpheight;
        this.jumpduration = jumpduration;
        this.assetManager = assetManager;
        this.jumpCount = 0;
        this.distanceTraveled = 0;

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
        if (bitmap.y >= GROUND_LEVEL) {
            return true;
        }
        return false;
    }

    jump() {
        this.jumpCount += 1;
        this.isJumping = true;
        createjs.Tween.get(this.bitmap)
            .to({ y: this.bitmap.y - this.jumpheight }, this.jumpduration / 2, createjs.Ease.quadOut)
            .to({ y: GROUND_LEVEL }, this.jumpduration / 2, createjs.Ease.quadIn)
            .call(() => {this.isJumping = false; });
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
        
        isSprinting ? this.distanceTraveled += this.speed * 2 : this.distanceTraveled += this.speed;

        if (direction === "left") {

            isSprinting ? this.bitmap.x -= this.speed * 2 : this.bitmap.x -= this.speed;
            isSprinting ? this.changeAnimationToRunning("left") : this.changeAnimationToWalking("left");

        } else if (direction === "right") {

            isSprinting ? this.bitmap.x += this.speed * 2 : this.bitmap.x += this.speed;
            isSprinting ? this.changeAnimationToRunning("right") : this.changeAnimationToWalking("right");
        }
    }

    update() {
        
    }

    public serialize(): ICharacterSaveData {
        return {
            x: this.bitmap.x,
            y: this.bitmap.y,
            distanceTraveled: this.distanceTraveled,
            jumpCount: this.jumpCount
        }
    }

    public deserialize(data: ICharacterSaveData): void {
        this.bitmap.x = data.x;
        this.bitmap.y = data.y;
        this.distanceTraveled = data.distanceTraveled;
        this.jumpCount = data.jumpCount;
    }
    

}