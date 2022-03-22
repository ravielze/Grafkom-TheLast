interface Vec3 {
    x: number;
    y: number;
    z: number;
}

interface VecBool3 {
    x: boolean;
    y: boolean;
    z: boolean;
}

interface Vec2 {
    x: number;
    y: number;
}

enum ProjectionMode {
    Perspective = 0,
    Orthographic = 1,
    Oblique = 2,
}

export { Vec3, Vec2, ProjectionMode, VecBool3 };
