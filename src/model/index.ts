import CubeModel from './cube.json';
import BlockModel from './block.json';
import TriangleModel from './triangle.json';

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
    private static readonly cubeModel: Model = ModelManager.transform(CubeModel);
    private static readonly blockModel: Model = ModelManager.transform(BlockModel);
    private static readonly triangleModel: Model = ModelManager.transform(TriangleModel);
    private static model: { [key: string]: Model } = {
        cube: ModelManager.cubeModel,
        block: ModelManager.blockModel,
        triangle: ModelManager.triangleModel,
    };
    private static current: string | null = 'cube';

    public static getCurrentModel(): Model | null {
        if (!ModelManager.current) {
            return null;
        }
        const currentModel = ModelManager.model[ModelManager.current];
        return { ...currentModel };
    }

    public static getModel(id: string): Model | null {
        if (!(id in ModelManager.model)) {
            return null;
        }
        return { ...ModelManager.model[id] };
    }

    public static getModelName(): string[] {
        return Object.entries(ModelManager.model).map(([modelName]) => modelName);
    }

    public static load(id: string): Model | null {
        if (!(id in ModelManager.model)) {
            return null;
        }
        const currentModel = ModelManager.model[id];
        ModelManager.current = id;
        return { ...currentModel };
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

    private static convertBack(model: Model): IRawModel {
        return {
            positions: Array.prototype.slice.call(model.positions),
            indices: Array.prototype.slice.call(model.indices),
            colors: Array.prototype.slice.call(model.colors),
            material: model.material,
        };
    }

    public static loadFromFile(fileName: string, fileData: any): [boolean, string] {
        const model = this.assertModel(fileData);
        if (!model) {
            return [false, ''];
        }

        var i = 1;
        var fixFileName = fileName;
        while (fixFileName in ModelManager.model) {
            fixFileName = `${fileName}-${i}`;
            i++;
        }

        const convertedModel: Model = ModelManager.transform(model);

        ModelManager.model[fixFileName] = convertedModel;
        ModelManager.load(fixFileName);
        return [true, fixFileName];
    }

    public static saveToFile(): void {
        if (!ModelManager.current) {
            alert('No valid model to download.');
            return;
        }
        const element = document.createElement('a');
        const currentModel = ModelManager.model[ModelManager.current];
        const content = JSON.stringify(ModelManager.convertBack(currentModel));
        element.setAttribute('href', 'data:text/json, ' + encodeURIComponent(content));
        element.setAttribute('download', [ModelManager.current, '.json'].join(''));

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return;
    }
}

export { Model, IRawModel, ModelManager, ModelMaterial };
