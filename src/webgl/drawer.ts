import { Control } from '../control';
import { ProjectionMode } from '../types';
import Matrix, { Matrix4 } from '../utils/matrix';
import ProjectionMatrix from '../utils/projection-matrix';
import TransformationMatrix from '../utils/transformation-mattrix';
import Vector, { Vector3 } from '../utils/vector';

export class Drawer {
    public matrix: Matrix4 = Array(16).fill(0);
    public cameraMatrix: Matrix4 = Array(16).fill(0);
    public projMatrix: Matrix4 = Array(16).fill(0);

    constructor(private readonly control: Control) {}

    public calculateTransformation(): void {
        var rotation = TransformationMatrix.getRotationMatrix(this.control.rotation);
        var translation = TransformationMatrix.getTranslationMatrix(this.control.translation);
        var scale = TransformationMatrix.getScaleMatrix(this.control.scale);
        this.matrix = Matrix.multiply(rotation, translation);
        this.matrix = Matrix.multiply(this.matrix, scale);
    }

    public calculateCameraProjection(): void {
        var cameraPosition: Vector3 = [0, 0, this.control.cameraDistance];
        var targetPosition = [0, 0, 0];

        const xRotMat = TransformationMatrix.getRotationMatrix({
            x: this.control.cameraRotation.x,
            y: 0,
            z: 0,
        });
        const forwardVectorX = [...cameraPosition, 1];
        cameraPosition = Vector.add(Vector.transform(xRotMat, forwardVectorX), targetPosition);

        const yRotMat = TransformationMatrix.getRotationMatrix({
            x: 0,
            y: this.control.cameraRotation.y,
            z: 0,
        });
        const forwardVectorY = [...cameraPosition, 1];
        cameraPosition = Vector.add(Vector.transform(yRotMat, forwardVectorY), targetPosition);

        this.cameraMatrix = Matrix.getLookAtMatrix(cameraPosition, targetPosition);

        const invCameraMatrix = Matrix.inverse(this.cameraMatrix);
        switch (this.control.projectionMode) {
            case ProjectionMode.Perspective:
                this.projMatrix = Matrix.multiply(
                    invCameraMatrix,
                    ProjectionMatrix.getPerspectiveMatrix(this.control.near, this.control.far)
                );
                break;
            case ProjectionMode.Orthographic:
                this.projMatrix = Matrix.multiply(
                    invCameraMatrix,
                    ProjectionMatrix.getOrthographicMatrix()
                );
                break;
            case ProjectionMode.Oblique:
                const tempMatrix = Matrix.multiply(
                    invCameraMatrix,
                    ProjectionMatrix.getOrthographicMatrix()
                );
                this.projMatrix = Matrix.multiply(ProjectionMatrix.getObliqueMatrix(), tempMatrix);
                break;
            default:
                throw new Error('Projection Mode not found.');
        }
    }
}
