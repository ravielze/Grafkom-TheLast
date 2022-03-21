interface Vec3 {
    x: number;
    y: number;
    z: number;
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

export { Vec3, Vec2, ProjectionMode };
