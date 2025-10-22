// Minimal interface for Game, used by state classes to break circular dependency

import { Character } from "./models/character.model";

export interface IGame {
    character: Character;
    pause_menu_container: createjs.Container;
    stage: createjs.Stage;
    transitionTo(stateName: string): void;
    updateBackgroundLayers(characterMovement: number): void;
    updateLabels(): void;
    // Add more as needed for state logic
}