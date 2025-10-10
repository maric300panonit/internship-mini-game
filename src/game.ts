import { IGameState } from "./states/IGameState.ts";
import { PlayingState } from "./states/PlayingState.ts";
import { PausedState } from "./states/PausedState.ts";
import { environment } from "./env/env.ts";
import { Character } from "./models/character.model.ts";
import { InputManager } from "./InputManager.ts";
import { States } from "./constants.ts";
export class Game{
    stage: createjs.Stage;

    private currentState!: IGameState;
    private inputManager!: InputManager;

    //backgroud variables
    background_bitmap: createjs.Bitmap = new createjs.Bitmap(environment.assetsPath + "background.png");
    background_speed = 1;

    //balcony variables
    balcony_shape: createjs.Shape = new createjs.Shape();
    balcony_y = environment.ground_level + 400;
    balcony_shape_height = 200;
    balcony_shape_width = 1920;

    //fence variables
    fence_bitmap: createjs.Bitmap = new createjs.Bitmap(environment.assetsPath + "fence.png");
    fence_speed = 2.5;
    fence_bitmap_x = -75;

    //character variables
    character = new Character(new createjs.Bitmap(environment.assetsPath + "character_standing.png"), 5, 100, 500);

    //pausemenu variables
    pause_menu_container: createjs.Container = new createjs.Container();    
    pause_menu_shape: createjs.Shape = new createjs.Shape();
    pause_menu_text = new createjs.Text("Game Paused", "24px Arial", "#FFFFFF");
    pause_menu_width = 400;
    pause_menu_height = 200;

    constructor(canvasId: string) {
        this.stage = new createjs.Stage(canvasId);
        this.initialize();
    }

    initialize() {
        this.setupBackground();
        this.setupBalcony();
        this.setupFence();
        this.setupCharacter();
        this.setupPauseMenu();
        this.setupTicker();
        this.setupEventListeners();

        this.inputManager = new InputManager();

        this.currentState = new PlayingState(this, this.character, this.inputManager);
        this.currentState.enter();
    }

    private update(event: any) {
            this.currentState.update(event);
    }

    setupPauseMenu() {
        this.pause_menu_shape.graphics.beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, this.pause_menu_width, this.pause_menu_height);
        this.pause_menu_shape.x = (this.stage.canvas.width - this.pause_menu_width) / 2;
        this.pause_menu_shape.y = (this.stage.canvas.height - this.pause_menu_height) / 2;
        this.pause_menu_container.addChild(this.pause_menu_shape);
        this.pause_menu_container.addChild(this.pause_menu_text);
        this.pause_menu_text.x = this.pause_menu_shape.x + (this.pause_menu_width - this.pause_menu_text.getMeasuredWidth()) / 2;
        this.pause_menu_text.y = this.pause_menu_shape.y + (this.pause_menu_height - this.pause_menu_text.getMeasuredHeight()) / 2;
        this.stage.addChild(this.pause_menu_container);
        this.pause_menu_container.visible = false;
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
        this.balcony_shape.graphics.beginFill("gray").drawRect(0, 0, this.balcony_shape_width, this.balcony_shape_height);
        this.balcony_shape.y = environment.ground_level + 400;
        this.stage.addChild(this.balcony_shape);
    }

    setupFence() {
        this.stage.addChild(this.fence_bitmap);
        this.fence_bitmap.y = environment.ground_level + 250;
    }

    setupCharacter() {
        this.character.bitmap.y = environment.ground_level;
        this.stage.addChild(this.character.bitmap);
    }

    setupTicker() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    }
    setupEventListeners() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    transitionTo(stateName: string) {
        if (stateName === States.PLAYING) {
            this.changeState(new PlayingState(this, this.character, this.inputManager));
        } else if (stateName === States.PAUSED) {
            this.changeState(new PausedState(this, this.character));
        }
    }

}