import { Vec3 } from '../types';
import Vector, { Vector3 } from './vector';

export type Matrix4 = number[];
export type Matrix3 = number[];

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

    public static getLookAtMatrix(curr: Vector3, target: Vector3): Matrix4 {
        const up = [0, 1, 0];
        const z = Vector.normalize(Vector.subtract(curr, target));
        const x = Vector.normalize(Vector.cross(up, z));
        const y = Vector.normalize(Vector.cross(z, x));

        //prettier-ignore
        return [
            x[0], x[1], x[2], 0,
            y[0], y[1], y[2], 0,
            z[0], z[1], z[2], 0,
            curr[0], curr[1], curr[2], 1,
        ];
    }

    public static inverse(matrix: Matrix4): Matrix4 {
        const m: (x: number) => (y: number) => number = (x: number) => {
            return (y: number): number => {
                return matrix[x * 4 + y];
            };
        };

        const t0 = m(2)(2) * m(3)(3);
        const t1 = m(3)(2) * m(2)(3);
        const t2 = m(1)(2) * m(3)(3);
        const t3 = m(3)(2) * m(1)(3);
        const t4 = m(1)(2) * m(2)(3);
        const t5 = m(2)(2) * m(1)(3);
        const t6 = m(0)(2) * m(3)(3);
        const t7 = m(3)(2) * m(0)(3);
        const t8 = m(0)(2) * m(2)(3);
        const t9 = m(2)(2) * m(0)(3);
        const t10 = m(0)(2) * m(1)(3);
        const t11 = m(1)(2) * m(0)(3);
        const t12 = m(2)(0) * m(3)(1);
        const t13 = m(3)(0) * m(2)(1);
        const t14 = m(1)(0) * m(3)(1);
        const t15 = m(3)(0) * m(1)(1);
        const t16 = m(1)(0) * m(2)(1);
        const t17 = m(2)(0) * m(1)(1);
        const t18 = m(0)(0) * m(3)(1);
        const t19 = m(3)(0) * m(0)(1);
        const t20 = m(0)(0) * m(2)(1);
        const t21 = m(2)(0) * m(0)(1);
        const t22 = m(0)(0) * m(1)(1);
        const t23 = m(1)(0) * m(0)(1);

        //prettier-ignore
        const v0 = t0 * m(1)(1) + t3 * m(2)(1) + t4 * m(3)(1) - (t1 * m(1)(1) + t2 * m(2)(1) + t5 * m(3)(1));
        //prettier-ignore
        const v1 = t1 * m(0)(1) + t6 * m(2)(1) + t9 * m(3)(1) - (t0 * m(0)(1) + t7 * m(2)(1) + t8 * m(3)(1));
        //prettier-ignore
        const v2 = t2 * m(0)(1) + t7 * m(1)(1) + t10 * m(3)(1) - (t3 * m(0)(1) + t6 * m(1)(1) + t11 * m(3)(1));
        //prettier-ignore
        const v3 = t5 * m(0)(1) + t8 * m(1)(1) + t11 * m(2)(1) - (t4 * m(0)(1) + t9 * m(1)(1) + t10 * m(2)(1));

        const k = 1.0 / (m(0)(0) * v0 + m(1)(0) * v1 + m(2)(0) * v2 + m(3)(0) * v3);

        //prettier-ignore
        const result: number[] = [
            v0, v1, v2, v3,

            (t1 * m(1)(0) + t2 * m(2)(0) + t5 * m(3)(0) - (t0 * m(1)(0) + t3 * m(2)(0) + t4 * m(3)(0))),
            (t0 * m(0)(0) + t7 * m(2)(0) + t8 * m(3)(0) - (t1 * m(0)(0) + t6 * m(2)(0) + t9 * m(3)(0))),
            (t3 * m(0)(0) + t6 * m(1)(0) + t11 * m(3)(0) - (t2 * m(0)(0) + t7 * m(1)(0) + t10 * m(3)(0))),
            (t4 * m(0)(0) + t9 * m(1)(0) + t10 * m(2)(0) - (t5 * m(0)(0) + t8 * m(1)(0) + t11 * m(2)(0))),

            (t12 * m(1)(3) + t15 * m(2)(3) + t16 * m(3)(3) - (t13 * m(1)(3) + t14 * m(2)(3) + t17 * m(3)(3))),
            (t13 * m(0)(3) + t18 * m(2)(3) + t21 * m(3)(3) - (t12 * m(0)(3) + t19 * m(2)(3) + t20 * m(3)(3))),
            (t14 * m(0)(3) + t19 * m(1)(3) + t22 * m(3)(3) - (t15 * m(0)(3) + t18 * m(1)(3) + t23 * m(3)(3))),
            (t17 * m(0)(3) + t20 * m(1)(3) + t23 * m(2)(3) - (t16 * m(0)(3) + t21 * m(1)(3) + t22 * m(2)(3))),

            (t14 * m(2)(2) + t17 * m(3)(2) + t13 * m(1)(2) - (t16 * m(3)(2) + t12 * m(1)(2) + t15 * m(2)(2))),
            (t20 * m(3)(2) + t12 * m(0)(2) + t19 * m(2)(2) - (t18 * m(2)(2) + t21 * m(3)(2) + t13 * m(0)(2))),
            (t18 * m(1)(2) + t23 * m(3)(2) + t15 * m(0)(2) - (t22 * m(3)(2) + t14 * m(0)(2) + t19 * m(1)(2))),
            (t22 * m(2)(2) + t16 * m(0)(2) + t21 * m(1)(2) - (t20 * m(1)(2) + t23 * m(2)(2) + t17 * m(0)(2))),
        ];
        return result.map((val) => val * k);
    }

    public static transpose(m: Matrix4): Matrix4 {
        const result = Array(16).fill(0);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                result[i * 4 + j] = m[i + j * 4];
                result[i + j * 4] = m[i * 4 + j];
            }
        }
        return result;
    }

    public static identity(): Matrix4 {
        const result = Array(16).fill(0);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (i == j) {
                    result[i * 4 + j] = 1;
                }
            }
        }
        return result;
    }

    public static matLookAt(eye: number[], center: number[], up: number[]): Matrix4 {
        const EPSILON = 0.001;
        const A: Vec3 = { x: 0, y: 0, z: 0 };
        const B: Vec3 = { x: 0, y: 0, z: 0 };
        const C: Vec3 = { x: 0, y: 0, z: 0 };
        const Eye: Vec3 = { x: eye[0], y: eye[1], z: eye[2] };
        const Up: Vec3 = { x: up[0], y: up[1], z: up[2] };
        const Center: Vec3 = { x: center[0], y: center[1], z: center[2] };
        var N: number = 0;

        if (
            Math.abs(Eye.x - Center.x) < EPSILON &&
            Math.abs(Eye.y - Center.y) < EPSILON &&
            Math.abs(Eye.z - Center.z) < EPSILON
        ) {
            return Matrix.identity();
        }

        A.z = Eye.x - Center.x;
        B.z = Eye.y - Center.y;
        C.z = Eye.z - Center.z;

        N = 1 / Math.sqrt(A.z * A.z + B.z * B.z + C.z * C.z);
        A.z *= N;
        B.z *= N;
        C.z *= N;

        A.x = Up.y * C.z - Up.z * B.z;
        B.x = Up.z * A.z - Up.x * C.z;
        C.x = Up.x * B.z - Up.y * A.z;

        N = Math.sqrt(A.x * A.x + B.x * B.x + C.x * C.x);

        if (!N) {
            A.x = 0;
            B.x = 0;
            C.x = 0;
        } else {
            N = 1 / N;
            A.x *= N;
            B.x *= N;
            C.x *= N;
        }

        A.y = B.z * C.x - C.z * B.x;
        B.y = C.z * A.x - A.z * C.x;
        C.y = A.z * B.x - B.z * A.x;

        N = Math.sqrt(A.y * A.y + B.y * B.y + C.y * C.y);
        if (!N) {
            A.y = 0;
            B.y = 0;
            C.y = 0;
        } else {
            N = 1 / N;
            A.y *= N;
            B.y *= N;
            C.y *= N;
        }

        // prettier-ignore
        return [
            A.x, A.y, A.z, 0,
            B.x, B.y, B.z, 0,
            C.x, C.y, C.z, 0,
            -(A.x*Eye.x + B.x*Eye.y + C.x*Eye.z), -(A.y*Eye.x + B.y*Eye.y + C.y*Eye.z), -(A.z*Eye.x + B.z*Eye.y + C.z*Eye.z), 1
        ];
    }
}
