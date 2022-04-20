import { Vec3 } from '../types';
import DefaultMatrix, { DefMatrix } from '../utils/default-matrix';
import { Matrix4 } from '../utils/matrix';
import TransformationMatrix from '../utils/transformation-matrix';
import Vector from '../utils/vector';

export class CubeOperation {
    public static colorFactory(cube: Float32Array, r: number, g: number, b: number) {
        const result = [];
        for (var i = 0; i < cube.length; i += 3) {
            result.push(...[r, g, b]);
        }
        return result;
    }

    public static getNormal(cube: Float32Array): Float32Array {
        const result: number[] = [];

        for (var i = 0; i < cube.length; i += 12) {
            var p2 = [cube[i], cube[i + 1], cube[i + 2]];
            var p1 = [cube[i + 3], cube[i + 4], cube[i + 5]];
            var p3 = [cube[i + 6], cube[i + 7], cube[i + 8]];

            const Ax = p1[0];
            const Ay = p1[1];
            const Az = p1[2];
            const Bx = p2[0];
            const By = p2[1];
            const Bz = p2[2];
            const Cx = p3[0];
            const Cy = p3[1];
            const Cz = p3[2];

            const x = (By - Ay) * (Cz - Az) - (Cy - Ay) * (Bz - Az);
            const y = (Bz - Az) * (Cx - Ax) - (Cz - Az) * (Bx - Ax);
            const z = (Bx - Ax) * (Cy - Ay) - (Cx - Ax) * (By - Ay);
            const normal = Vector.normalize([x, y, z]);

            for (var j = 0; j < 4; ++j) {
                result.push(...normal);
            }
        }
        return new Float32Array(result);
    }

    public static getTangent(cube: Float32Array): Float32Array {
        const result: number[] = [];
        for (var i = 0; i < cube.length; i += 12) {
            var p2 = [cube[i], cube[i + 1], cube[i + 2]];
            var p1 = [cube[i + 3], cube[i + 4], cube[i + 5]];

            const x = p2[0] - p1[0];
            const y = p2[1] - p1[1];
            const z = p2[2] - p1[2];
            const tangent = Vector.normalize([x, y, z]);

            for (var j = 0; j < 4; ++j) {
                result.push(...tangent);
            }
        }
        return new Float32Array(result);
    }

    public static getBitangent(cube: Float32Array): Float32Array {
        const result: number[] = [];
        for (var i = 0; i < cube.length; i += 12) {
            const p3 = [cube[i + 6], cube[i + 7], cube[i + 8]];
            const p1 = [cube[i + 3], cube[i + 4], cube[i + 5]];

            const x = p3[0] - p1[0];
            const y = p3[1] - p1[1];
            const z = p3[2] - p1[2];

            const bitangent = Vector.normalize([x, y, z]);

            for (var j = 0; j < 4; ++j) {
                result.push(...bitangent);
            }
        }
        return new Float32Array(result);
    }

    public static verticesToMatrix(vert: Float32Array): DefMatrix[] {
        const result: DefMatrix[] = [];
        for (var i = 0; i < vert.length; i += 3) {
            result.push([[vert[i]], [vert[i + 1]], [vert[i + 2]], [1]]);
        }
        return result;
    }

    public static translate(cube: Float32Array, delta: Vec3): Float32Array {
        const matrices = this.verticesToMatrix(cube);
        const result: number[] = [];
        const tM = DefaultMatrix.import(TransformationMatrix.getTranslationMatrix(delta));
        for (var i = 0; i < matrices.length; ++i) {
            const translated = DefaultMatrix.export(DefaultMatrix.multiply(tM, matrices[i]));
            result.push(...[translated[0], translated[1], translated[2]]);
        }
        return new Float32Array(result);
    }

    public static scale(cube: Float32Array, factor: Vec3): Float32Array {
        const matrices = this.verticesToMatrix(cube);
        const result: number[] = [];
        const kM = DefaultMatrix.import(TransformationMatrix.getScaleMatrix(factor));
        for (var i = 0; i < matrices.length; ++i) {
            const scaled = DefaultMatrix.export(DefaultMatrix.multiply(kM, matrices[i]));
            result.push(...[scaled[0], scaled[1], scaled[2]]);
        }
        return new Float32Array(result);
    }

    public static transform(cube: Float32Array, M: DefMatrix): Float32Array {
        const result: number[] = [];
        for (var i = 0; i < cube.length; i += 3) {
            const transformed = DefaultMatrix.multiply(M, [
                [cube[i]],
                [cube[i + 1]],
                [cube[i + 2]],
                [1],
            ]);
            const transformedExported = DefaultMatrix.export(transformed);
            result.push(
                ...[transformedExported[0], transformedExported[1], transformedExported[2]]
            );
        }

        return new Float32Array(result);
    }
}
