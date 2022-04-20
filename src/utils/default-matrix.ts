import { Vec3 } from '../types';
import Matrix, { Matrix4 } from './matrix';
import Utils from './other';

export type DefMatrix = number[][];

export default class DefaultMatrix {
    public static identity(): DefMatrix {
        return DefaultMatrix.import(Matrix.identity());
    }

    public static multiply(m1: DefMatrix, m2: DefMatrix): DefMatrix {
        const m1R = m1.length;
        const m1C = m1[0].length;
        const m2C = m2[0].length;

        const result = new Array(m1R);
        for (var i = 0; i < m1R; ++i) {
            result[i] = new Array(m2C);
            for (var j = 0; j < m2C; ++j) {
                result[i][j] = 0;
                for (var k = 0; k < m1C; ++k) {
                    result[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }

        return result;
    }

    public static translate(origin: Vec3): DefMatrix {
        const { x, y, z } = origin;
        return [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1],
        ];
    }

    public static rotate(theta: Vec3, origin: Vec3): DefMatrix {
        const { x: tetax, y: tetay, z: tetaz } = theta;
        const { x, y, z } = origin;

        const minTrans = DefaultMatrix.translate({ x: -x, y: -y, z: -z });

        // prettier-ignore
        const rotatex = [
            [1, 0, 0, 0],
            [0, Math.cos(Utils.degreesToRadians(tetax)), Math.sin(Utils.degreesToRadians(tetax)), 0],
            [0, -Math.sin(Utils.degreesToRadians(tetax)), Math.cos(Utils.degreesToRadians(tetax)), 0],
            [0, 0, 0, 1]
        ]
        // prettier-ignore
        const rotatey = [
            [Math.cos(Utils.degreesToRadians(tetay)), 0, -Math.sin(Utils.degreesToRadians(tetay)), 0],
            [0, 1, 0, 0],
            [Math.sin(Utils.degreesToRadians(tetay)), 0, Math.cos(Utils.degreesToRadians(tetay)), 0],
            [0, 0, 0, 1]
        ]
        // prettier-ignore
        const rotatez = [
            [Math.cos(Utils.degreesToRadians(tetaz)), -Math.sin(Utils.degreesToRadians(tetaz)), 0, 0],
            [Math.sin(Utils.degreesToRadians(tetaz)), Math.cos(Utils.degreesToRadians(tetaz)), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]

        const posTrans = DefaultMatrix.translate({ x, y, z });
        const ret = DefaultMatrix.multiply(
            DefaultMatrix.multiply(
                DefaultMatrix.multiply(DefaultMatrix.multiply(posTrans, rotatez), rotatey),
                rotatex
            ),
            minTrans
        );
        return ret;
    }

    public static import(m: Matrix4): DefMatrix {
        const N = Math.sqrt(m.length);
        const result = new Array(N);
        for (var i = 0; i < N; ++i) {
            result[i] = new Array(N);
            for (var j = 0; j < N; ++j) {
                result[i][j] = m[i * N + j];
            }
        }
        return result;
    }

    public static export(m: DefMatrix): Matrix4 {
        const result = [];
        for (var i = 0; i < m.length; ++i) {
            result.push(...m[i]);
        }
        return result;
    }
}
