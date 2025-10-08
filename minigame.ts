import * as createjs from "createjs-module"

function init() {
    
    var stage = new createjs.Stage("miniGameCanvas");
    //background variables
    var background_bitmap = new createjs.Bitmap("background.png");
    const background_speed = 1;
    stage.addChild(background_bitmap);
    const ground_level = 350;
    background_bitmap.y -= 300;

    //road variables
    var road_shape = new createjs.Shape();
    road_shape.graphics.beginFill("gray").drawRect(0, 0, 1920, 200);
    road_shape.y = ground_level + 400;
    stage.addChild(road_shape);    
    //images
    var character_standing_image = new Image();
    var character_walking_left_image = new Image();
    var character_walking_right_image = new Image();
    var character_jumping_image = new Image();
    loadCharacterImages();

    //character variables
    var character_bitmap = new createjs.Bitmap("character_standing.png");
    character_bitmap.y = ground_level;
    const speed = 5;
    const jumpheight = 100;
    const jumpduration = 500;
    var isLeftPressed = false;
    var isRightPressed = false;

    stage.addChild(character_bitmap);

    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", handleTick);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function loadCharacterImages() {

        character_standing_image.src = "character_standing.png"
        character_walking_right_image.src = "character_walking_right.png"
        character_walking_left_image.src = "character_walking_left.png"
        character_jumping_image.src = "character_jumping.png"
    
        character_standing_image.onload = function() {

        };
        character_walking_left_image.onload = function() {

        };
        character_walking_right_image.onload = function() {

        };
        character_jumping_image.onload = function() {

        };
    }

    function handleTick(event: any) {
        if (character_bitmap.y != ground_level) {
            character_bitmap.image = character_jumping_image;
        }
        else {
            character_bitmap.image = character_standing_image;
        }
        
        if (isLeftPressed && canBitmapMoveLeft(character_bitmap)) {
            background_bitmap.x += background_speed;
            character_bitmap.x -= speed;
            if(character_bitmap.y == ground_level) {
                character_bitmap.image = character_walking_left_image;
            }
        }
        if (isRightPressed && canBitmapMoveRight(character_bitmap)) {
            background_bitmap.x -= background_speed;
            character_bitmap.x += speed;
            if(character_bitmap.y == ground_level) {
                character_bitmap.image = character_walking_right_image;
            }
        }
                console.log(character_bitmap.x, character_bitmap.y);

        
    stage.update(event);
    }
    
    function handleKeyDown(event: any) {
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

    function handleKeyUp(event: any) {
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
    function character_jump(){
        createjs.Tween.get(character_bitmap)
            .to({y: character_bitmap.y - jumpheight}, jumpduration / 2, createjs.Ease.quadOut)
            .to({y: character_bitmap.y}, jumpduration / 2, createjs.Ease.quadIn);
    }
    
    function canBitmapMoveLeft(bitmap: createjs.Bitmap) {
        if (bitmap.x >= 0) {
            return true;
        }
    }

    function canBitmapMoveRight(bitmap: createjs.Bitmap) {
        if (bitmap.x <= 1920) {
            return true;
        }
    }
}