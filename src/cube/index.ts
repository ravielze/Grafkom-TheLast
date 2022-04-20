// prettier-ignore
const CUBE_POSITIONS = new Float32Array([

    // x, y, z, R, G, B
    // Top
    -1, 1, -1,
    1, 1, -1, 
    1, 1, 1, 
    -1, 1, 1, 

    // Right
    -1, 1, 1, 
    -1, -1, 1, 
    -1, -1, -1,
    -1, 1, -1, 

    // Left
    1, 1, 1,  
    1, 1, -1, 
    1, -1, -1,
    1, -1, 1, 

    // Back
    1, 1, 1, 
    1, -1, 1, 
    -1, -1, 1,
    -1, 1, 1, 

    // Front
    1, 1, -1, 
    -1, 1, -1, 
    -1, -1, -1,
    1, -1, -1, 

    // Bottom
    -1, -1, -1,
    -1, -1, 1, 
    1, -1, 1, 
    1, -1, -1, 
]);

// prettier-ignore
const CUBE_INDICES = new Uint16Array([
    // Top
    0, 1, 2,
    0, 2, 3,

    // Right
    4, 5, 6,
    4, 6, 7,

    // Left
    8, 9, 10,
    8, 10, 11,

    // Back
    12, 13, 14,
    12, 14, 15,

    // Front
    16, 17, 18,
    16, 18, 19,

    // Bottom
    20, 21, 22,
    20, 22, 23
]);

// prettier-ignore
const CUBE_TEXTURE_COORDINATES = new Float32Array([
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
]);

export { CUBE_POSITIONS, CUBE_INDICES, CUBE_TEXTURE_COORDINATES };
