"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createjs = require("createjs-module");
function init() {
    var assetsPath = "assets/";
    var stage = new createjs.Stage("miniGameCanvas");
    //background variables
    var background_bitmap = new createjs.Bitmap("assets/background.png");
    var background_speed = 1;
    stage.addChild(background_bitmap);
    var ground_level = 350;
    background_bitmap.y -= 300;
    //balcony variables
    var balcony_shape = new createjs.Shape();
    balcony_shape.graphics.beginFill("gray").drawRect(0, 0, 1920, 200);
    balcony_shape.y = ground_level + 400;
    stage.addChild(balcony_shape);
    //fence
    var fence_bitmap = new createjs.Bitmap("assets/fence.png");
    fence_bitmap.y = ground_level + 250;
    stage.addChild(fence_bitmap);
    var fence_speed = 2.5;
    fence_bitmap.x = -75;
    //images
    var character_standing_image = new Image();
    var character_walking_left_image = new Image();
    var character_walking_right_image = new Image();
    var character_jumping_image = new Image();
    loadCharacterImages();
    //character variables
    var character_bitmap = new createjs.Bitmap("assets/character_standing.png");
    character_bitmap.y = ground_level;
    var speed = 5;
    var jumpheight = 100;
    var jumpduration = 500;
    var isLeftPressed = false;
    var isRightPressed = false;
    stage.addChild(character_bitmap);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", handleTick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    function loadCharacterImages() {
        character_standing_image.src = assetsPath + "character_standing.png";
        character_walking_right_image.src = assetsPath + "character_walking_right.png";
        character_walking_left_image.src = assetsPath + "character_walking_left.png";
        character_jumping_image.src = assetsPath + "character_jumping.png";
        character_standing_image.onload = function () { };
        character_walking_left_image.onload = function () { };
        character_walking_right_image.onload = function () { };
        character_jumping_image.onload = function () { };
    }
    function handleTick(event) {
        if (character_bitmap.y != ground_level) {
            character_bitmap.image = character_jumping_image;
        }
        else {
            character_bitmap.image = character_standing_image;
        }
        if (isLeftPressed && canBitmapMoveLeft(character_bitmap)) {
            background_bitmap.x += background_speed;
            character_bitmap.x -= speed;
            fence_bitmap.x += fence_speed;
            if (character_bitmap.y == ground_level) {
                character_bitmap.image = character_walking_left_image;
            }
        }
        if (isRightPressed && canBitmapMoveRight(character_bitmap)) {
            background_bitmap.x -= background_speed;
            fence_bitmap.x -= fence_speed;
            character_bitmap.x += speed;
            if (character_bitmap.y == ground_level) {
                character_bitmap.image = character_walking_right_image;
            }
        }
        console.log(character_bitmap.x, character_bitmap.y);
        stage.update(event);
    }
    function handleKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                isLeftPressed = true;
                break;
            case 38:
                if (character_bitmap.y === ground_level) {
                    character_jump();
                    character_bitmap.image = character_jumping_image;
                }
                break;
            case 39:
                isRightPressed = true;
                break;
        }
    }
    function handleKeyUp(event) {
        switch (event.keyCode) {
            case 37:
                isLeftPressed = false;
                character_bitmap.image = character_standing_image;
                break;
                break;
            case 39:
                isRightPressed = false;
                character_bitmap.image = character_standing_image;
                break;
        }
    }
    function character_jump() {
        createjs.Tween.get(character_bitmap)
            .to({ y: character_bitmap.y - jumpheight }, jumpduration / 2, createjs.Ease.quadOut)
            .to({ y: character_bitmap.y }, jumpduration / 2, createjs.Ease.quadIn);
    }
    function canBitmapMoveLeft(bitmap) {
        if (bitmap.x >= 0) {
            return true;
        }
    }
    function canBitmapMoveRight(bitmap) {
        if (bitmap.x <= 1920) {
            return true;
        }
    }
}
