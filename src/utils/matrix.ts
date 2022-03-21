import { Vec3 } from '../types';

export type Matrix4 = number[];

export default class Matrix {
    public static multiply(m1: Matrix4, m2: Matrix4): Matrix4 {
        if (m1.length !== 16 || m2.length !== 16) {
            throw new Error('Matrix Multiplication only works for 4x4');
        }

        const temp = Array(16).fill(0);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var result = 0;
                for (var k = 0; k < 4; k++) {
                    result += m1[4 * i + k] * m2[4 * k + j];
                }
                temp[4 * i + j] = result;
            }
        }
        return temp;
    }

    public static getRotationMatrix(angle: Vec3): Matrix4 {
        const cosZ = Math.cos((angle.z * Math.PI) / 180.0);
        const sinZ = Math.sin((angle.z * Math.PI) / 180.0);
        const cosY = Math.cos((angle.y * Math.PI) / 180.0);
        const sinY = Math.sin((angle.y * Math.PI) / 180.0);
        const cosX = Math.cos((angle.x * Math.PI) / 180.0);
        const sinX = Math.sin((angle.x * Math.PI) / 180.0);
        return Matrix.multiply(
            [cosZ, sinZ, 0, 0, -sinZ, cosZ, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            Matrix.multiply(
                [cosY, 0, -sinY, 0, 0, 1, 0, 0, sinY, 0, cosY, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, cosX, sinX, 0, 0, -sinX, cosX, 0, 0, 0, 0, 1]
            )
        );
    }

    public static getTranslationMatrix(translate: Vec3): Matrix4 {
        const { x, y, z } = translate;
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    }

    public static getScaleMatrix(factor: Vec3): Matrix4 {
        const { x, y, z } = factor;
        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    }
}
