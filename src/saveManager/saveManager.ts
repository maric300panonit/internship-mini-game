import { ISaveFile, ICharacterSaveData, IBackgroundLayerSaveData } from "./ISaveData"; // Obavezno importuj i IBackgroundLayerSaveData

export class SaveManager {

    public save(data: ISaveFile, filename: string = "savegame.xml"): void {
        try {
            // Sada prosleđuješ ceo ISaveFile objekat
            const xmlString = this.createXmlString(data); 
            const blob = new Blob([xmlString], { type: "application/xml" });
            const url = URL.createObjectURL(blob);

            // ... (ostatak save metode je isti)
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Game saved!");
        } catch (error) {
            console.error("Error saving game:", error);
        }
    }

    public load(): Promise<ISaveFile | null> {
        // ... (load metoda ostaje potpuno ista)
        return new Promise((resolve, reject) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".xml,application/xml";
            input.onchange = (event) => {
                const target = event.target as HTMLInputElement;
                if (!target.files || target.files.length === 0) {
                    console.log("No file selected.");
                    resolve(null);
                    return;
                }
                const file = target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const xmlString = e.target?.result as string;
                        // parseXmlString će sada vratiti ceo ISaveFile
                        const data = this.parseXmlString(xmlString); 
                        console.log("Game loaded!");
                        resolve(data);
                    } catch (error) {
                        console.error("Failed to parse save file:", error);
                        reject(error);
                    }
                };
                reader.onerror = (e) => {
                    console.error("Failed to read file:", e);
                    reject(e);
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    /**
     * Helper to convert ISaveFile data into an XML string.
     */
    private createXmlString(data: ISaveFile): string {
        const charData = data.characterSaveData;
        
        // --- NOVO: Kreiranje XML-a za pozadine ---
        // Mapiramo niz pozadina u niz stringova (XML tagova)
        const backgroundLayersXml = data.backgroundLayers.map(layer => 
            `        <BackgroundLayer>
            <x>${layer.x}</x>
        </BackgroundLayer>`
        ).join("\n"); // Spajamo sve stringove u jedan, razdvojene novim redom
        // --- KRAJ NOVOG DELA ---

        // Ažurirani return sa uključenim backgroundLayersXml
        return `<?xml version="1.0" encoding="UTF-8"?>
                <SaveFile>
                    <CharacterData>
                        <x>${charData.x}</x>
                        <y>${charData.y}</y>
                        <jumpCount>${charData.jumpCount}</jumpCount>
                        <distanceTraveled>${charData.distanceTraveled}</distanceTraveled>
                    </CharacterData>
                    <BackgroundLayers>
                ${backgroundLayersXml}
                    </BackgroundLayers>
                </SaveFile>`;
    }

    /**
     * Helper to parse an XML string back into an ISaveFile object.
     */
    private parseXmlString(xmlString: string): ISaveFile | null {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
            throw new Error("Error parsing XML: " + parserError.textContent);
        }

        const getElementText = (tagName: string, parent: Element): string | null => {
            const element = parent.querySelector(tagName);
            return element ? element.textContent : null;
        };
        
        // --- 1. Parsiranje CharacterData (isto kao pre) ---
        const charDataNode = xmlDoc.querySelector("CharacterData");
        if (!charDataNode) {
            throw new Error("Invalid save file: <CharacterData> not found.");
        }
        const x = getElementText("x", charDataNode);
        const y = getElementText("y", charDataNode);
        const jumpCount = getElementText("jumpCount", charDataNode);
        const distanceTraveled = getElementText("distanceTraveled", charDataNode);

        if (x === null || y === null || jumpCount === null || distanceTraveled === null) {
            throw new Error("Save file is missing required character data.");
        }

        const characterSaveData: ICharacterSaveData = {
            x: parseFloat(x),
            y: parseFloat(y),
            jumpCount: parseInt(jumpCount, 10),
            distanceTraveled: parseFloat(distanceTraveled)
        };

        // --- 2. NOVO: Parsiranje BackgroundLayers ---
        const backgroundLayers: IBackgroundLayerSaveData[] = [];
        const layerNodes = xmlDoc.querySelectorAll("BackgroundLayers > BackgroundLayer");

        layerNodes.forEach(node => {
            const layerX = getElementText("x", node as Element);
            if (layerX !== null) {
                backgroundLayers.push({ x: parseFloat(layerX) });
            }
        });
        // --- KRAJ NOVOG DELA ---

        // Vraćamo kompletan ISaveFile objekat
        return {
            characterSaveData: characterSaveData,
            backgroundLayers: backgroundLayers // Dodato
        };
    }
}