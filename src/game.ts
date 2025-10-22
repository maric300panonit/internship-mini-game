import { IGameState } from "./states/IGameState.ts";
import { PlayingState } from "./states/PlayingState.ts";
import { PausedState } from "./states/PausedState.ts";
import { Character } from "./models/character.model.ts";
import { InputManager } from "./InputManager.ts";
import { States } from "./constants.ts";
import { IBackgroundLayer } from "./IBackgroundLayer.ts";
import { GROUND_LEVEL } from "./constants.ts";
import { AssetManager } from "./assetManager/AssetManager.ts";
import { Button } from "./buttons/Button.ts";
import { IBackgroundLayerSaveData, ISaveFile } from "./saveManager/ISaveData.ts";
import { SaveManager } from "./saveManager/saveManager.ts";
import { ISerializable } from "./saveManager/ISerializable.ts";
export class Game implements ISerializable<ISaveFile> {
    stage: createjs.Stage;

    private currentState!: IGameState;
    private inputManager!: InputManager;
    private assetManager = new AssetManager();
    private saveManager!: SaveManager;
    private backgroundLayers: IBackgroundLayer[] = [];

    //character variables
    character!: Character;
    
    //pausemenu variables
    pause_menu_container: createjs.Container = new createjs.Container();    
    pause_menu_shape: createjs.Shape = new createjs.Shape();
    pause_menu_text = new createjs.Text("Game Paused", "24px Arial", "#FFFFFF");
    pause_menu_width = 400;
    pause_menu_height = 200;

    saveButton!: Button;
    loadButton!: Button;

    //labels variables
    labelContainer: createjs.Container = new createjs.Container();
    distanceTraveledLabel!: createjs.Text;
    jumpCountLabel!: createjs.Text;

    constructor(canvasId: string) {
        this.stage = new createjs.Stage(canvasId);
    
        this.assetManager = new AssetManager();
        this.assetManager.loadAssets(() => {
            this.initialize();
        });
    }

    initialize() {
        this.saveManager = new SaveManager();
        this.setupBackgroundLayers();
        this.setupCharacter();
        this.setupLabels();
        this.setupPauseMenu();
        this.setupTicker();
        this.setupEventListeners();

        this.inputManager = new InputManager();
        this.currentState = new PlayingState(this, this.character, this.inputManager);
        this.currentState.enter();
    }

    setupBackgroundLayers() {
        const background_bitmap: createjs.Bitmap = new createjs.Bitmap(this.assetManager.getResult("background"));
        background_bitmap.y = -300;
        this.backgroundLayers.push({ bitmap: background_bitmap, speed: 0.2 });

        const balcony_bitmap: createjs.Bitmap = new createjs.Bitmap(this.assetManager.getResult("gray_wall"));
        balcony_bitmap.y = GROUND_LEVEL + 400;
        this.backgroundLayers.push({bitmap: balcony_bitmap, speed: 0.5});

        const fence_bitmap: createjs.Bitmap = new createjs.Bitmap(this.assetManager.getResult("fence"));
        fence_bitmap.y = GROUND_LEVEL + 250;
        fence_bitmap.x = -75;
        this.backgroundLayers.push({ bitmap: fence_bitmap, speed: 0.5 });

        this.stage.addChild(background_bitmap);
        this.stage.addChild(balcony_bitmap);
        this.stage.addChild(fence_bitmap);
    }

    updateBackgroundLayers(characterMovement: number) {
        this.backgroundLayers.forEach(layer => {
            layer.bitmap.x -= characterMovement * layer.speed;
        });
    }

    setupCharacter() {
        this.character = new Character(new createjs.Bitmap(this.assetManager.getResult("character_standing")), 5, 100, 500, this.assetManager);

        this.character.bitmap.y = GROUND_LEVEL;
        this.stage.addChild(this.character.bitmap);
    }

    setupLabels() {
        this.distanceTraveledLabel = new createjs.Text("distance traveled: " + this.character.distanceTraveled.toString(), "48px Arial");
        this.distanceTraveledLabel.y = 10;
        this.labelContainer.addChild(this.distanceTraveledLabel)

        this.jumpCountLabel = new createjs.Text("jump count: " + this.character.jumpCount.toString(), "48px Arial");
        this.jumpCountLabel.y = 65;
        this.labelContainer.addChild(this.jumpCountLabel);

        this.stage.addChild(this.labelContainer);
    }

    updateLabels() {
        this.distanceTraveledLabel.text = "distance traveled: " + this.character.distanceTraveled;
        this.jumpCountLabel.text = "jump count: " + this.character.jumpCount;
    }

    setupPauseMenu() {
        this.pause_menu_shape.graphics.beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, this.pause_menu_width, this.pause_menu_height);
        this.pause_menu_shape.x = (this.stage.canvas.width - this.pause_menu_width) / 2;
        this.pause_menu_shape.y = (this.stage.canvas.height - this.pause_menu_height) / 2;
        this.pause_menu_container.addChild(this.pause_menu_shape);
        this.pause_menu_container.addChild(this.pause_menu_text);
        this.pause_menu_text.x = this.pause_menu_shape.x + (this.pause_menu_width - this.pause_menu_text.getMeasuredWidth()) / 2;
        this.pause_menu_text.y = this.pause_menu_shape.y + 10;
        this.pause_menu_container.visible = false;

        const buttonX = this.pause_menu_shape.x + (this.pause_menu_width - 150) / 2;
        const saveButtonY = this.pause_menu_shape.y + 70;
        const loadButtonY = this.pause_menu_shape.y + 120;

        this.saveButton = new Button("Save", buttonX, saveButtonY, this.onSaveGame.bind(this));
        this.pause_menu_container.addChild(this.saveButton);
        this.loadButton = new Button("Load", buttonX, loadButtonY, this.onLoadGame.bind(this));
        this.pause_menu_container.addChild(this.loadButton);

        this.stage.addChild(this.pause_menu_container);
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

    private update(event: any) {
        this.currentState.update(event);
    }

    handleKeyDown(event: KeyboardEvent) {
        this.currentState.handleKeyDown(event);
    }
    handleKeyUp(event: KeyboardEvent) {
        this.currentState.handleKeyUp(event);
    }

    transitionTo(stateName: string) {
        if (stateName === States.PLAYING) {
            this.changeState(new PlayingState(this, this.character, this.inputManager));
        } else if (stateName === States.PAUSED) {
            this.changeState(new PausedState(this, this.character));
        }
    }

    changeState(newState: IGameState) {
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    private onSaveGame(): void {
        try {
            const saveFile: ISaveFile = this.serialize();

            this.saveManager.save(saveFile, "savegame.xml");
            this.transitionTo(States.PLAYING);
            console.log("Save complete.");
        } catch (error) {
            console.error("Error during save:", error);
            alert("Game could not be saved.");
        }
    }

    private async onLoadGame(): Promise<void> {
        try {
            const saveFile = await this.saveManager.load();

            if (saveFile) {
                this.deserialize(saveFile);
                
                this.transitionTo(States.PLAYING);
                console.log("Load complete.");
            } else {
                console.log("Load operation cancelled.");
            }

        } catch (error) {
            console.error("Error during load:", error);
            alert("Failed to load save file. The file may be corrupt or invalid.");
        }
    }

    public serialize(): ISaveFile {
        const charData = this.character.serialize();

        const bgData: IBackgroundLayerSaveData[] = this.backgroundLayers.map(layer => {
            return { x: layer.bitmap.x };
        });

        console.log(bgData);

        return {
            characterSaveData: charData,
            backgroundLayers: bgData
        };
    }

    public deserialize(data: ISaveFile): void {
        this.character.deserialize(data.characterSaveData);
        console.log(data);
        if (data.backgroundLayers && data.backgroundLayers.length === this.backgroundLayers.length) {
            this.backgroundLayers.forEach((layer, index) => {
                layer.bitmap.x = data.backgroundLayers[index].x;
            });
        } else {
            console.warn("Could not load background data: Layer count mismatch.");
        }

        this.updateLabels();
    }

}