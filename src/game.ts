import { IGameState } from "./states/IGameState";
import { PlayingState } from "./states/PlayingState";
import { PausedState } from "./states/PausedState";
export class Game {
    stage: createjs.Stage;

    assetsPath = "assets/";
    private currentState!: IGameState;

    //backgroud variables
    background_bitmap: createjs.Bitmap = new createjs.Bitmap(this.assetsPath + "background.png");
    background_speed = 1;
    ground_level = 350;

    //balcony variables
    balcony_shape: createjs.Shape = new createjs.Shape();
    balcony_y = this.ground_level + 400;
    balcony_shape_height = 200;
    balcony_shape_width = 1920;

    //fence variables
    fence_bitmap: createjs.Bitmap = new createjs.Bitmap(this.assetsPath + "fence.png");
    fence_speed = 2.5;
    fence_bitmap_x = -75;

    //character variables
    character_bitmap: createjs.Bitmap = new createjs.Bitmap(this.assetsPath + "character_standing.png");
    speed = 5;
    jumpheight = 100;
    jumpduration = 500;
    isLeftPressed = false;
    isRightPressed = false;

    character_standing_image = new Image();
    character_walking_left_image = new Image();
    character_walking_right_image = new Image();
    character_jumping_image = new Image();

    constructor() {
        this.stage = new createjs.Stage("miniGameCanvas");
        this.initialize();
    }

    initialize() {
        this.setupBackground();
        this.setupBalcony();
        this.setupFence();
        this.setupCharacter();
        this.setupTicker();
        this.setupEventListeners();

        this.currentState = new PlayingState(this);
        this.currentState.enter();

    }

    private update(event: any) {
            this.currentState.update(event);
    }

    changeState(newState: IGameState) {
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    handleKeyDown(event: KeyboardEvent) {
        this.currentState.handleKeyDown(event);
    }
    handleKeyUp(event: KeyboardEvent) {
        this.currentState.handleKeyUp(event);
    }


    setupBackground() {
        this.stage.addChild(this.background_bitmap);
        this.background_bitmap.y -= 300;
    }

    setupBalcony() {
        this.balcony_shape = new createjs.Shape();
        this.balcony_shape.graphics.beginFill("gray").drawRect(0, 0, this.balcony_shape_height, this.balcony_shape_width);
        this.balcony_shape.y = this.ground_level + 400;
        this.stage.addChild(this.balcony_shape);
    }

    setupFence() {
        this.stage.addChild(this.fence_bitmap);
        this.fence_bitmap.y = this.ground_level + 250;
    }

    setupCharacter() {
        this.character_standing_image = new Image();
        this.character_walking_left_image = new Image();
        this.character_walking_right_image = new Image();
        this.character_jumping_image = new Image();
        this.loadCharacterImages();

        this.character_bitmap.y = this.ground_level;
        this.stage.addChild(this.character_bitmap);
    }

    loadCharacterImages() {

        this.character_standing_image.src = this.assetsPath + "character_standing.png";
        this.character_walking_right_image.src = this.assetsPath + "character_walking_right.png";
        this.character_walking_left_image.src = this.assetsPath + "character_walking_left.png";
        this.character_jumping_image.src = this.assetsPath + "character_jumping.png";

        this.character_standing_image.onload = function() {};
        this.character_walking_left_image.onload = function() {};
        this.character_walking_right_image.onload = function() {};
        this.character_jumping_image.onload = function() {};
    }
    setupTicker() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.handleTick.bind(this));
    }
    setupEventListeners() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    handleTick() {
        this.stage.update();
    }
    canBitmapMoveLeft(bitmap: createjs.Bitmap) {
            if (bitmap.x >= 0) {
                return true;
            }
        }
    
    canBitmapMoveRight(bitmap: createjs.Bitmap) {
        if (bitmap.x <= 1920) {
            return true;
        }
    }

    changeCharacterAnimationToStanding() {
        this.character_bitmap.image = this.character_standing_image;
    }

    changeCharacterAnimationToWalking(direction: string) {
        if (direction === "left") {
            this.character_bitmap.image = this.character_walking_left_image;
        }else if (direction === "right") {
            this.character_bitmap.image = this.character_walking_right_image;
        }
    }
    changeCharacterAnimationToJumping() {
        this.character_bitmap.image = this.character_jumping_image;
    }

    isBitmapOnGround(bitmap: createjs.Bitmap) {
        if (bitmap.y === this.ground_level) {
            return true;
        }
    }

    characterJump() {
        createjs.Tween.get(this.character_bitmap)
            .to({ y: this.character_bitmap.y - this.jumpheight }, this.jumpduration / 2, createjs.Ease.quadOut)
            .to({ y: this.ground_level }, this.jumpduration / 2, createjs.Ease.quadIn);
    }

    handleMoveLeft() {
        //TODO: checkif character is on ground before changing animation
        this.character_bitmap.x -= this.speed;
        this.changeCharacterAnimationToWalking("left");

        this.background_bitmap.x += this.background_speed;
        this.fence_bitmap.x += this.fence_speed;

    }

    handleMoveRight() {
        this.character_bitmap.x += this.speed;
        this.changeCharacterAnimationToWalking("right");

        this.background_bitmap.x -= this.background_speed;
        this.fence_bitmap.x -= this.fence_speed;
    }

}
