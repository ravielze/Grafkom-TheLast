import DefaultMatrix, { DefMatrix } from '../utils/default-matrix';
import Matrix from '../utils/matrix';
import { Vector3 } from '../utils/vector';

export interface TextureFaceInfoObject {
    target: number;
    imageData: string;
}

export type TextureFaceInfo = TextureFaceInfoObject[];

export class NodePoint {
    public L?: NodePoint;
    public R?: NodePoint;
    public textureData?: WebGLTexture;
    public baseTransform: DefMatrix = DefaultMatrix.import(Matrix.identity());
    public defVertices: Float32Array;
    public defJointPoint: Vector3;

    constructor(
        public transform: DefMatrix,
        public jointPoint: Vector3,
        public center: Vector3,
        public vertices: Float32Array,
        public indices: Uint16Array,
        public color: Float32Array,
        public normal: Float32Array,
        public tangent: Float32Array,
        public bitangent: Float32Array,
        public texture: string | TextureFaceInfo,
        public textureCoord: Float32Array,
        public name: string
    ) {
        this.defVertices = new Float32Array(this.vertices);
        this.defJointPoint = [...this.jointPoint];
    }
}
