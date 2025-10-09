// Minimal interface for Game, used by state classes to break circular dependency

export interface IGame {
    stage: createjs.Stage;
    isLeftPressed: boolean;
    isRightPressed: boolean;
    character_bitmap: createjs.Bitmap;
    changeCharacterAnimationToStanding(): void;
    changeCharacterAnimationToWalking(direction: string): void;
    changeCharacterAnimationToJumping(): void;
    isBitmapOnGround(bitmap: createjs.Bitmap): boolean;
    canBitmapMoveLeft(bitmap: createjs.Bitmap): boolean;
    canBitmapMoveRight(bitmap: createjs.Bitmap): boolean;
    characterJump(): void;
    handleMoveLeft(): void;
    handleMoveRight(): void;
    transitionTo(stateName: string): void;
    // Add more as needed for state logic
}