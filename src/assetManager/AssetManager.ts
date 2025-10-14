
import { assetManifest } from "./manifest";
export class AssetManager {
    
    private loader = new createjs.LoadQueue(false);

    loadAssets(onComplete: () => void) {

        this.loader.loadManifest(assetManifest);
        this.loader.on("complete", onComplete);
        this.loader.load();
    }

    getResult(id: string): HTMLImageElement {
        return this.loader.getResult(id) as HTMLImageElement;
    }
}

