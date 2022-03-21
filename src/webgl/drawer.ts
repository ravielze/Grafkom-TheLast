import { WebGL } from '.';
import { Control } from '../control';
import Matrix from '../utils/matrix';
import Vector from '../utils/vector';

export class Drawer {
    public matrix: number[] = Array(16).fill(0);

    constructor(private readonly gl: WebGL, private readonly control: Control) {}

    public calculateTransformation(): void {
        var rotation = Matrix.getRotationMatrix(this.control.rotation);
        var translation = Matrix.getTranslationMatrix(this.control.translation);
        var scale = Matrix.getScaleMatrix(this.control.scale);
        this.matrix = Matrix.multiply(rotation, translation);
        this.matrix = Matrix.multiply(this.matrix, scale);
    }

    public calculateCameraProjection(): void {
        var cameraPosition = [0, 0, this.control.cameraDistance];
        var targetPosition = [0, 0, 0];

        const xRotMat = Matrix.getRotationMatrix({ x: this.control.cameraRotation.x, y: 0, z: 0 });
        const forwardVectorX = [...cameraPosition, 1];
        cameraPosition = Vector.add(Vector.transform(xRotMat, forwardVectorX), targetPosition);

        const yRotMat = Matrix.getRotationMatrix({ x: 0, y: this.control.rotation.y, z: 0 });
        const forwardVectorY = [...cameraPosition, 1];
        cameraPosition = Vector.add(Vector.transform(yRotMat, forwardVectorY), targetPosition);

        var up = [0, 1, 0];
        //TODO Not done
    }
}
