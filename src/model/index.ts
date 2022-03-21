interface Model {
    positions: Float32Array;
    colors: Float32Array;
    vertices: Uint16Array;
}

interface IRawModel {
    positions: number[];
    colors: number[];
    vertices: number[];
}

class ModelManager {
    private static model: { [key: string]: Model } = {};

    public static load(id: string): Model | null {
        if (!(id in ModelManager.model)) {
            return null;
        }
        return ModelManager.model[id];
    }

    public static loadFromFile(fileName: string): boolean {
        return false;
    }

    public static saveToFile(fileName: string): boolean {
        return false;
    }
}

export { Model, IRawModel, ModelManager };
