import { environment } from "../env/env";
export class Character {
    bitmap: createjs.Bitmap;
    speed: number;
    jumpheight: number;
    jumpduration: number;
    isLeftPressed = false;
    isRightPressed = false;

    character_standing_image = new Image();
    character_walking_left_image = new Image();
    character_walking_right_image = new Image();
    character_jumping_image = new Image();
    character_running_left_image = new Image();
    character_running_right_image = new Image();

    constructor(bitmap: createjs.Bitmap, speed: number, jumpheight: number, jumpduration: number) {
        this.bitmap = bitmap;
        this.speed = speed;
        this.jumpheight = jumpheight;
        this.jumpduration = jumpduration;

        this.loadImages();
    }

    loadImages() {

        this.character_standing_image.src = environment.assetsPath + "character_standing.png";
        this.character_walking_right_image.src = environment.assetsPath + "character_walking_right.png";
        this.character_walking_left_image.src = environment.assetsPath + "character_walking_left.png";
        this.character_jumping_image.src = environment.assetsPath + "character_jumping.png";
        this.character_running_left_image.src = environment.assetsPath + "character_running_left.png";
        this.character_running_right_image.src = environment.assetsPath + "character_running_right.png";

        this.character_standing_image.onload = function() {};
        this.character_walking_left_image.onload = function() {};
        this.character_walking_right_image.onload = function() {};
        this.character_jumping_image.onload = function() {};
        this.character_running_left_image.onload = function() {};
        this.character_running_right_image.onload = function() {};
    }

    changeAnimationToStanding() {
        this.bitmap.image = this.character_standing_image;
    }

    changeAnimationToWalking(direction: string) {
        if (direction === "left") {
            this.bitmap.image = this.character_walking_left_image;
        }else if (direction === "right") {
            this.bitmap.image = this.character_walking_right_image;
        }
    }

    changeAnimationToRunning(direction: string) {
        if (direction === "left") {
            this.bitmap.image = this.character_running_left_image;
        }else if (direction === "right") {
            this.bitmap.image = this.character_running_right_image;
        }
    }

    changeAnimationToJumping() {
        this.bitmap.image = this.character_jumping_image;
    }

    isOnGround(bitmap: createjs.Bitmap) {
        if (bitmap.y === environment.ground_level) {
            return true;
        }
        return false;
    }

    jump() {
        createjs.Tween.get(this.bitmap)
            .to({ y: this.bitmap.y - this.jumpheight }, this.jumpduration / 2, createjs.Ease.quadOut)
            .to({ y: environment.ground_level }, this.jumpduration / 2, createjs.Ease.quadIn);
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

    move(direction: string, isDoubleClick: boolean) {
        if (direction === "left") {

            if (isDoubleClick) {
                console.log("run left");
                this.bitmap.x -= this.speed * 2;
                this.changeAnimationToRunning("left");
            }
            else {
                this.bitmap.x -= this.speed;
                this.changeAnimationToWalking("left");
            }
        } else if (direction === "right") {

            if (isDoubleClick) {
                console.log("run right");
                this.bitmap.x += this.speed * 2;
                this.changeAnimationToRunning("right");
            }
            else {
                this.bitmap.x += this.speed;
                this.changeAnimationToWalking("right");
            }
        }
    }

    update() {
        if (!this.isOnGround(this.bitmap)) {
            this.changeAnimationToJumping();
        } else {
            this.changeAnimationToStanding();
        }
        if (this.isLeftPressed && this.canMoveLeft()) {
            this.move("left",this.isDoubleClick());
        }
        if (this.isRightPressed && this.canMoveRight()) {
            this.move("right",this.isDoubleClick());
        }
    }

    isDoubleClick(): boolean {
        let currentTime = new Date().getTime();
        if ((currentTime - environment.lastClickTime < environment.doubleClickThreshold || environment.isDoubleClickActive) && (currentTime - environment.lastClickTime > 20 || environment.isDoubleClickActive)) {
            console.log('double');
            environment.isDoubleClickActive = true;
            environment.lastClickTime = 0;
            return true;
        }
        else if (!environment.isDoubleClickActive){
            console.log('single');
            environment.lastClickTime = currentTime;
            return false;
        }
            return false;        
    }

}