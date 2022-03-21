import { Matrix4 } from './matrix';
import Utils from './other';

export default class ProjectionMatrix {
    private static readonly FOV: number = 60;
    private static readonly ASPECT: number = 1;

    private static readonly MIN_DISTANCE_VAL: number = 0.05;
    private static readonly MAX_DISTANCE_VAL: number = 50;
    private static readonly ORTHOGRAPHIC_DISTANCE: number = 2;
    private static readonly OBLIQUE_THETA: number = 45;
    private static readonly OBLIQUE_PHI: number = 45;

    public static getPerspectiveMatrix(near: number, far: number): Matrix4 {
        const a = 1 / Math.tan(Utils.degreesToRadians(ProjectionMatrix.FOV / 2));
        const a2 = a / ProjectionMatrix.ASPECT;
        const b = far - near;
        const c = -(near + far) / b;
        const d = (-2 * near * far) / b;

        //prettier-ignore
        return [
            a2, 0, 0, 0,
            0, a, 0, 0,
            0, 0, c, d,
            0, 0, -1, 0
        ];
    }

    public static getOrthographicMatrix(): Matrix4 {
        const dist = ProjectionMatrix.ORTHOGRAPHIC_DISTANCE;
        const t = ProjectionMatrix.MAX_DISTANCE_VAL - ProjectionMatrix.MIN_DISTANCE_VAL;
        const v = -(ProjectionMatrix.MAX_DISTANCE_VAL + ProjectionMatrix.MIN_DISTANCE_VAL);
        //prettier-ignore
        return [
            1/dist, 0, 0, 0,
            0, 1/dist, 0, 0,
            0, 0, -1/t, 0,
            0, 0, v/t, 1
        ]
    }

    public static getObliqueMatrix(): Matrix4 {
        const thetaRad = Utils.degreesToRadians(ProjectionMatrix.OBLIQUE_THETA);
        const phiRad = Utils.degreesToRadians(ProjectionMatrix.OBLIQUE_PHI);

        const cotTheta = -1 / Math.tan(thetaRad);
        const cotPhi = -1 / Math.tan(phiRad);

        //prettier-ignore
        return [
            1, 0, cotTheta, 0,
            0, 1, cotPhi, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    }
}
