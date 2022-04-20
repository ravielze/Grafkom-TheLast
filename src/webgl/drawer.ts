import { Control } from '../control';
import { ProjectionMode, Vec3 } from '../types';
import Matrix, { Matrix4 } from '../utils/matrix';
import ProjectionMatrix from '../utils/projection-matrix';
import TransformationMatrix from '../utils/transformation-matrix';
import Vector, { Vector3 } from '../utils/vector';

export class Drawer {
    constructor(private readonly control: Control) {}

    // public calculateTransformation(): void {
    //     const { x: x1, y: y1, z: z1 } = this.control.rotation;
    //     const { x: x2, y: y2, z: z2 } = this.control.animation.rotation;
    //     const inputPlusAnimation: Vec3 = {
    //         x: x1 + x2,
    //         y: y1 + y2,
    //         z: z1 + z2,
    //     };

    //     const rotation = TransformationMatrix.getRotationMatrix(inputPlusAnimation);
    //     const translation = TransformationMatrix.getTranslationMatrix(this.control.translation);
    //     const scale = TransformationMatrix.getScaleMatrix(this.control.scale);
    //     this.matrix = Matrix.multiply(rotation, translation);
    //     this.matrix = Matrix.multiply(this.matrix, scale);
    // }

    // NOTE Rusak!!! males benerin
    // public calculateNormal(model: Model): Float32Array {
    //     const result = Array(model.positions.length).fill(0);

    //     const modelPos = model.positions;
    //     const modelInd = model.indices;

    //     for (var i = 0; i < modelInd.length / 3; i = i + 3) {
    //         const v1: Vector3 = [];
    //         const v2: Vector3 = [];
    //         const v3: Vector3 = [];
    //         for (var j = 0; j < 3; j++) {
    //             v1.push(modelPos[modelInd[i] * 3 + j]);
    //             v2.push(modelPos[modelInd[i + 1] * 3 + j]);
    //             v3.push(modelPos[modelInd[i + 2] * 3 + j]);
    //         }

    //         const [a, b]: number[][] = [[], []];
    //         for (var k = 0; k < 3; k++) {
    //             a.push(v2[k] - v1[k]);
    //             b.push(v3[k] - v1[k]);
    //         }

    //         //prettier-ignore
    //         const normal = [
    //             a[1] * b[2] - a[2] * b[1],
    //             a[2] * b[0] - a[0] * b[2],
    //             a[0] * b[1] - a[1] * b[0]
    //         ]

    //         for (var l = 0; l < 3; l++) {
    //             result[modelInd[i] * 3 + l] += normal[l];
    //             result[modelInd[i + 1] * 3 + l] += normal[l];
    //             result[modelInd[i + 2] * 3 + l] += normal[l];
    //         }
    //     }

    //     console.log(result);
    //     return new Float32Array(result);
    // }

    // public calculateCameraProjection(): void {
    //     var cameraPosition: Vector3 = [0, 0, this.control.cameraDistance];
    //     var targetPosition = [0, 0, 0];

    //     const xRotMat = TransformationMatrix.getRotationMatrix({
    //         x: this.control.cameraRotation.y,
    //         y: 0,
    //         z: 0,
    //     });
    //     const forwardVectorX = [...cameraPosition, 1];
    //     cameraPosition = Vector.add(Vector.transform(xRotMat, forwardVectorX), targetPosition);

    //     const yRotMat = TransformationMatrix.getRotationMatrix({
    //         x: 0,
    //         y: this.control.cameraRotation.x,
    //         z: 0,
    //     });
    //     const forwardVectorY = [...cameraPosition, 1];
    //     cameraPosition = Vector.add(Vector.transform(yRotMat, forwardVectorY), targetPosition);

    //     this.cameraMatrix = Matrix.getLookAtMatrix(cameraPosition, targetPosition);

    //     const invCameraMatrix = Matrix.inverse(this.cameraMatrix);
    //     switch (this.control.projectionMode) {
    //         case ProjectionMode.Perspective:
    //             this.projMatrix = Matrix.multiply(
    //                 invCameraMatrix,
    //                 ProjectionMatrix.getPerspectiveMatrix(this.control.near, this.control.far)
    //             );
    //             break;
    //         case ProjectionMode.Orthographic:
    //             this.projMatrix = Matrix.multiply(
    //                 invCameraMatrix,
    //                 ProjectionMatrix.getOrthographicMatrix()
    //             );
    //             break;
    //         case ProjectionMode.Oblique:
    //             const tempMatrix = Matrix.multiply(
    //                 invCameraMatrix,
    //                 ProjectionMatrix.getOrthographicMatrix()
    //             );
    //             this.projMatrix = Matrix.multiply(ProjectionMatrix.getObliqueMatrix(), tempMatrix);
    //             break;
    //         default:
    //             throw new Error('Projection Mode not found.');
    //     }
    // }
}
