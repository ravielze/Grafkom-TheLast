export type Vector3 = number[];
export type Vector4 = number[];
export type ArrayVector = number[];

export default class Vector {
    public static add(v1: Vector3, v2: Vector3): Vector3 {
        return v2.map((val, idx) => {
            return val + v1[idx];
        });
    }

    public static subtract(v1: Vector3, v2: Vector3): Vector3 {
        return v2.map((val, idx) => {
            return val + v1[idx];
        });
    }

    public static normalize(v: Vector3): Vector3 {
        const d = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return d > 0 ? v.map((oldVal) => oldVal / d) : [0, 0, 0];
    }

    public static cross(v1: Vector3, v2: Vector3): Vector3 {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0],
        ];
    }

    public static transform(l: ArrayVector, v: Vector3): Vector4 {
        return [
            l[0] * v[0] + l[1] * v[1] + l[2] * v[2] + l[3] * v[3],
            l[4] * v[0] + l[5] * v[1] + l[6] * v[2] + l[7] * v[3],
            l[8] * v[0] + l[9] * v[1] + l[10] * v[2] + l[11] * v[3],
            l[12] * v[0] + l[13] * v[1] + l[14] * v[2] + l[15] * v[3],
        ];
    }
}
