// Minimal interface for Game, used by state classes to break circular dependency

export interface IGame {
    pause_menu_container: createjs.Container;
    isDoubleClickActive: boolean;
    stage: createjs.Stage;
    isLeftPressed: boolean;
    isRightPressed: boolean;
    character_bitmap: createjs.Bitmap;
    changeCharacterAnimationToStanding(): void;
    changeCharacterAnimationToRunning(direction: string): void;
    changeCharacterAnimationToWalking(direction: string): void;
    changeCharacterAnimationToJumping(): void;
    isBitmapOnGround(bitmap: createjs.Bitmap): boolean;
    canBitmapMoveLeft(bitmap: createjs.Bitmap): boolean;
    canBitmapMoveRight(bitmap: createjs.Bitmap): boolean;
    characterJump(): void;
    handleMoveLeft(): void;
    handleMoveRight(): void;
    isDoubleClick(): boolean;
    transitionTo(stateName: string): void;
    // Add more as needed for state logic
}