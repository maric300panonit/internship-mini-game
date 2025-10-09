"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var PlayingState_ts_1 = require("./states/PlayingState.ts");
var PausedState_ts_1 = require("./states/PausedState.ts");
var Game = /** @class */ (function () {
    function Game(canvasId) {
        this.assetsPath = "assets/";
        this.lastClickTime = 0;
        this.doubleClickThreshold = 300; // milliseconds
        this.isDoubleClickActive = false;
        //backgroud variables
        this.background_bitmap = new createjs.Bitmap(this.assetsPath + "background.png");
        this.background_speed = 1;
        this.ground_level = 350;
        //balcony variables
        this.balcony_shape = new createjs.Shape();
        this.balcony_y = this.ground_level + 400;
        this.balcony_shape_height = 200;
        this.balcony_shape_width = 1920;
        //fence variables
        this.fence_bitmap = new createjs.Bitmap(this.assetsPath + "fence.png");
        this.fence_speed = 2.5;
        this.fence_bitmap_x = -75;
        //character variables
        this.character_bitmap = new createjs.Bitmap(this.assetsPath + "character_standing.png");
        this.speed = 5;
        this.jumpheight = 100;
        this.jumpduration = 500;
        this.isLeftPressed = false;
        this.isRightPressed = false;
        //pausemenu variables
        this.pause_menu_container = new createjs.Container();
        this.pause_menu_shape = new createjs.Shape();
        this.pause_menu_text = new createjs.Text("Game Paused", "24px Arial", "#FFFFFF");
        this.pause_menu_width = 400;
        this.pause_menu_height = 200;
        this.character_standing_image = new Image();
        this.character_walking_left_image = new Image();
        this.character_walking_right_image = new Image();
        this.character_jumping_image = new Image();
        this.character_running_left_image = new Image();
        this.character_running_right_image = new Image();
        this.stage = new createjs.Stage(canvasId);
        this.initialize();
    }
    Game.prototype.initialize = function () {
        this.setupBackground();
        this.setupBalcony();
        this.setupFence();
        this.setupCharacter();
        this.setupPauseMenu();
        this.setupTicker();
        this.setupEventListeners();
        // Set initial state to PlayingState
        this.currentState = new PlayingState_ts_1.PlayingState(this);
        this.currentState.enter();
    };
    Game.prototype.update = function (event) {
        if (!this.isBitmapOnGround(this.character_bitmap)) {
            this.changeCharacterAnimationToJumping();
        }
        else {
            this.changeCharacterAnimationToStanding();
        }
        if (this.isLeftPressed && this.canBitmapMoveLeft(this.character_bitmap)) {
            this.handleMoveLeft();
        }
        if (this.isRightPressed && this.canBitmapMoveRight(this.character_bitmap)) {
            this.handleMoveRight();
        }
        this.stage.update(event);
    };
    Game.prototype.setupPauseMenu = function () {
        this.pause_menu_shape.graphics.beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, this.pause_menu_width, this.pause_menu_height);
        this.pause_menu_shape.x = (this.stage.canvas.width - this.pause_menu_width) / 2;
        this.pause_menu_shape.y = (this.stage.canvas.height - this.pause_menu_height) / 2;
        this.pause_menu_container.addChild(this.pause_menu_shape);
        this.pause_menu_container.addChild(this.pause_menu_text);
        this.pause_menu_text.x = this.pause_menu_shape.x + (this.pause_menu_width - this.pause_menu_text.getMeasuredWidth()) / 2;
        this.pause_menu_text.y = this.pause_menu_shape.y + (this.pause_menu_height - this.pause_menu_text.getMeasuredHeight()) / 2;
        this.stage.addChild(this.pause_menu_container);
        this.pause_menu_container.visible = false;
    };
    Game.prototype.changeState = function (newState) {
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    };
    Game.prototype.handleKeyDown = function (event) {
        this.currentState.handleKeyDown(event);
    };
    Game.prototype.handleKeyUp = function (event) {
        this.currentState.handleKeyUp(event);
    };
    Game.prototype.setupBackground = function () {
        this.stage.addChild(this.background_bitmap);
        this.background_bitmap.y -= 300;
    };
    Game.prototype.setupBalcony = function () {
        this.balcony_shape = new createjs.Shape();
        this.balcony_shape.graphics.beginFill("gray").drawRect(0, 0, this.balcony_shape_width, this.balcony_shape_height);
        this.balcony_shape.y = this.ground_level + 400;
        this.stage.addChild(this.balcony_shape);
    };
    Game.prototype.setupFence = function () {
        this.stage.addChild(this.fence_bitmap);
        this.fence_bitmap.y = this.ground_level + 250;
    };
    Game.prototype.setupCharacter = function () {
        this.loadCharacterImages();
        this.character_bitmap.y = this.ground_level;
        this.stage.addChild(this.character_bitmap);
    };
    Game.prototype.loadCharacterImages = function () {
        this.character_standing_image.src = this.assetsPath + "character_standing.png";
        this.character_walking_right_image.src = this.assetsPath + "character_walking_right.png";
        this.character_walking_left_image.src = this.assetsPath + "character_walking_left.png";
        this.character_jumping_image.src = this.assetsPath + "character_jumping.png";
        this.character_running_left_image.src = this.assetsPath + "character_running_left.png";
        this.character_running_right_image.src = this.assetsPath + "character_running_right.png";
        this.character_standing_image.onload = function () { };
        this.character_walking_left_image.onload = function () { };
        this.character_walking_right_image.onload = function () { };
        this.character_jumping_image.onload = function () { };
        this.character_running_left_image.onload = function () { };
        this.character_running_right_image.onload = function () { };
    };
    Game.prototype.setupTicker = function () {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    };
    Game.prototype.setupEventListeners = function () {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    };
    Game.prototype.handleTick = function () {
    };
    Game.prototype.canBitmapMoveLeft = function (bitmap) {
        if (bitmap.x >= 0) {
            return true;
        }
        return false;
    };
    Game.prototype.canBitmapMoveRight = function (bitmap) {
        if (bitmap.x <= 1920) {
            return true;
        }
        return false;
    };
    Game.prototype.changeCharacterAnimationToStanding = function () {
        this.character_bitmap.image = this.character_standing_image;
    };
    Game.prototype.changeCharacterAnimationToWalking = function (direction) {
        if (direction === "left") {
            this.character_bitmap.image = this.character_walking_left_image;
        }
        else if (direction === "right") {
            this.character_bitmap.image = this.character_walking_right_image;
        }
    };
    Game.prototype.changeCharacterAnimationToRunning = function (direction) {
        if (direction === "left") {
            this.character_bitmap.image = this.character_running_left_image;
        }
        else if (direction === "right") {
            this.character_bitmap.image = this.character_running_right_image;
        }
    };
    Game.prototype.changeCharacterAnimationToJumping = function () {
        this.character_bitmap.image = this.character_jumping_image;
    };
    Game.prototype.isBitmapOnGround = function (bitmap) {
        if (bitmap.y === this.ground_level) {
            return true;
        }
        return false;
    };
    Game.prototype.characterJump = function () {
        createjs.Tween.get(this.character_bitmap)
            .to({ y: this.character_bitmap.y - this.jumpheight }, this.jumpduration / 2, createjs.Ease.quadOut)
            .to({ y: this.ground_level }, this.jumpduration / 2, createjs.Ease.quadIn);
    };
    Game.prototype.handleMoveLeft = function () {
        if (this.isDoubleClick()) {
            console.log("run left");
            this.character_bitmap.x -= this.speed * 2;
            this.changeCharacterAnimationToRunning("left");
        }
        else {
            this.character_bitmap.x -= this.speed;
            this.changeCharacterAnimationToWalking("left");
        }
        this.background_bitmap.x += this.background_speed;
        this.fence_bitmap.x += this.fence_speed;
    };
    Game.prototype.handleMoveRight = function () {
        if (this.isDoubleClick()) {
            console.log("run right");
            this.character_bitmap.x += this.speed * 2;
            this.changeCharacterAnimationToRunning("right");
        }
        else {
            this.character_bitmap.x += this.speed;
            this.changeCharacterAnimationToWalking("right");
        }
        this.background_bitmap.x -= this.background_speed;
        this.fence_bitmap.x -= this.fence_speed;
    };
    Game.prototype.transitionTo = function (stateName) {
        if (stateName === "playing") {
            this.changeState(new PlayingState_ts_1.PlayingState(this));
        }
        else if (stateName === "paused") {
            this.changeState(new PausedState_ts_1.PausedState(this));
        }
    };
    Game.prototype.isDoubleClick = function () {
        var currentTime = new Date().getTime();
        if ((currentTime - this.lastClickTime < this.doubleClickThreshold || this.isDoubleClickActive) && (currentTime - this.lastClickTime > 20 || this.isDoubleClickActive)) {
            console.log('double');
            this.isDoubleClickActive = true;
            this.lastClickTime = 0;
            return true;
        }
        else if (!this.isDoubleClickActive) {
            console.log('single');
            this.lastClickTime = currentTime;
            return false;
        }
        return false;
    };
    return Game;
}());
exports.Game = Game;
