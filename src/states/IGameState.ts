export interface IGameState {
    enter(): void;
    exit(): void;
    update(event:any): void;
    handleKeyDown(event:KeyboardEvent): void;
    handleKeyUp(event:KeyboardEvent): void;
}