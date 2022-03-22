import { Vec3 } from '../types';
import Matrix, { Matrix4 } from './matrix';
import Utils from './other';

export default class TransformationMatrix {
    public static getRotationMatrix(angle: Vec3): Matrix4 {
        const cosZ = Math.cos(Utils.degreesToRadians(angle.z));
        const sinZ = Math.sin(Utils.degreesToRadians(angle.z));
        const cosX = Math.cos(Utils.degreesToRadians(angle.y));
        const sinX = Math.sin(Utils.degreesToRadians(angle.y));
        const cosY = Math.cos(Utils.degreesToRadians(angle.x));
        const sinY = Math.sin(Utils.degreesToRadians(angle.x));

        //prettier-ignore
        return Matrix.multiply(
            [
                cosZ, sinZ, 0, 0,
                -sinZ, cosZ, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ],
            Matrix.multiply(
                [
                    cosY, 0, -sinY, 0,
                    0, 1, 0, 0,
                    sinY, 0, cosY, 0,
                    0, 0, 0, 1
                ],
                [
                    1, 0, 0, 0,
                    0, cosX, sinX, 0,
                    0, -sinX, cosX, 0,
                    0, 0, 0, 1
                ]
            )
        );
    }

    public static getTranslationMatrix(translate: Vec3): Matrix4 {
        const { x, y, z } = translate;
        //prettier-ignore
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];
    }

    public static getScaleMatrix(factor: Vec3): Matrix4 {
        const { x, y, z } = factor;
        //prettier-ignore
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ];
    }
}
