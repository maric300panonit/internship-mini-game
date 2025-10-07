"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createjs = require("createjs-module");
function init() {
    var stage = new createjs.Stage("miniGameCanvas");
    //stage variables
    var ground_level = 500;
    //images
    var character_standing_image = new Image();
    var character_walking_left_image = new Image();
    var character_walking_right_image = new Image();
    var character_jumping_image = new Image();
    loadCharacterImages();
    //character variables
    var character_bitmap = new createjs.Bitmap("character_standing.png");
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
        character_standing_image.src = "character_standing.png";
        character_walking_right_image.src = "character_walking_right.png";
        character_walking_left_image.src = "character_walking_left.png";
        character_jumping_image.src = "character_jumping.png";
        character_standing_image.onload = function () {
        };
        character_walking_left_image.onload = function () {
        };
        character_walking_right_image.onload = function () {
        };
        character_jumping_image.onload = function () {
        };
    }
    function handleTick(event) {
        if (character_bitmap.y != ground_level) {
            character_bitmap.image = character_jumping_image;
        }
        else {
            character_bitmap.image = character_standing_image;
        }
        if (isLeftPressed) {
            character_bitmap.x -= speed;
            if (character_bitmap.y == ground_level) {
                character_bitmap.image = character_walking_left_image;
            }
        }
        if (isRightPressed) {
            character_bitmap.x += speed;
            if (character_bitmap.y == ground_level) {
                character_bitmap.image = character_walking_right_image;
            }
        }
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
}
