export interface ICharacterSaveData {
    x: number;
    y: number;
    jumpCount: number;
    distanceTraveled: number;
}

export interface ISaveFile {
    characterSaveData: ICharacterSaveData;
}