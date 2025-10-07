"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createjs = require("createjs-module");
function init() {
    //loadBackground();
    var stage = new createjs.Stage("miniGameCanvas");
    var character_standing_image = new Image();
    var character_walking_left_image = new Image();
    var character_walking_right_image = new Image();
    loadCharacterImages();
    var character_bitmap = new createjs.Bitmap("character_standing.png");
    var speed = 5;
    var isLeftPressed = false;
    var isRightPressed = false;
    stage.addChild(character_bitmap);
    //stage.update();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", handleTick);
    function loadCharacterImages() {
        character_standing_image.src = "character_standing.png";
        character_walking_right_image.src = "character_walking_right.png";
        character_walking_left_image.src = "character_walking_left.png";
        character_standing_image.onload = function () {
        };
        character_walking_left_image.onload = function () {
        };
        character_walking_right_image.onload = function () {
        };
    }
    function handleTick(event) {
        if (isLeftPressed) {
            character_bitmap.x -= speed;
            character_bitmap.image = character_walking_left_image;
        }
        if (isRightPressed) {
            character_bitmap.x += speed;
            character_bitmap.image = character_walking_right_image;
        }
        stage.update(event);
    }
    function handleKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                isLeftPressed = true;
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
            case 39:
                isRightPressed = false;
                character_bitmap.image = character_standing_image;
                break;
        }
    }
}
