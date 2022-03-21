import CubeModel from './cube.json';

interface Model {
    positions: Float32Array;
    indices: Uint16Array;
    colors: Float32Array;
    material: ModelMaterial;
}

interface ModelMaterial {
    ambient: number[];
    diffuse: number[];
    specular: number[];
    shininess: number;
}

interface IRawModel {
    positions: number[];
    indices: number[];
    colors: number[];
    material: ModelMaterial;
}

class ModelManager {
    private static cubeModel: Model = ModelManager.transform(CubeModel);
    private static model: { [key: string]: Model } = { cube: ModelManager.cubeModel };
    private static currentModel: Model | null = ModelManager.cubeModel;

    public static getCurrentModel(): Model | null {
        if (!ModelManager.currentModel) {
            return null;
        }
        return { ...ModelManager.currentModel };
    }

    public static load(id: string): Model | null {
        if (!(id in ModelManager.model)) {
            return null;
        }
        ModelManager.currentModel = ModelManager.model[id];
        return { ...ModelManager.currentModel };
    }

    public static assertModel(obj: any): IRawModel | null {
        if (
            obj.positions &&
            obj.indices &&
            obj.colors &&
            obj.material &&
            obj.material.ambient &&
            obj.material.diffuse &&
            obj.material.specular &&
            obj.material.shininess
        ) {
            return {
                positions: obj.positions,
                indices: obj.indices,
                colors: obj.colors,
                material: {
                    ambient: obj.material.ambient,
                    diffuse: obj.material.diffuse,
                    specular: obj.material.specular,
                    shininess: obj.material.shininess,
                },
            };
        }
        alert('Failed to parse model.');
        return null;
    }

    private static transform(raw: IRawModel): Model {
        return {
            positions: new Float32Array(raw.positions),
            indices: new Uint16Array(raw.indices),
            colors: new Float32Array(raw.colors),
            material: raw.material,
        };
    }

    public static loadFromFile(fileName: string, fileData: any): boolean {
        const model = this.assertModel(fileData);
        if (!model) {
            return false;
        }

        const convertedModel: Model = ModelManager.transform(model);

        ModelManager.model[fileName] = convertedModel;
        ModelManager.load(fileName);
        return true;
    }

    public static saveToFile(): void {
        return;
    }
}

export { Model, IRawModel, ModelManager, ModelMaterial };
