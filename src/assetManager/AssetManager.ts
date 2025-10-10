
import { assetManifest, soundManifest } from "./manifest";
import { Sound } from "./sound.model";

export class AssetManager {
    
    private loader = new createjs.LoadQueue(false);
    private soundLoader = createjs.Sound

    loadAssets(onComplete: () => void) {

        this.loader.loadManifest(assetManifest);
        this.loader.on("complete", onComplete);
        this.loader.load();
        this.loadSoundManifest();
    }

    getResult(id: string): HTMLImageElement {
        return this.loader.getResult(id) as HTMLImageElement;
    }

    loadSoundManifest() {
        soundManifest.forEach(sound => {
            this.loadSound(sound)
        });
    }

    loadSound(sound: Sound) {
        this.soundLoader.registerSound(sound.src, sound.id);
    }

    playSound(id: string, delay: number) {
        setTimeout(() => {
            createjs.Sound.play(id);
        }, delay);
    }
}

