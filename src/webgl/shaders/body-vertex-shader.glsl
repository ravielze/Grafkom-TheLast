precision highp float;
attribute vec3 vertPosition;
attribute vec2 vertTexture;
attribute vec3 vertNormal;
attribute vec3 vertTangent;
attribute vec3 vertBitangent;
attribute vec3 vertColor;

varying vec2 vTextureCoord;
varying vec3 fragColor;
varying highp vec3 vLighting;
varying vec3 L;

varying vec3 fmNorm;
varying vec3 fmWorldPos;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mNorm;

uniform mat3 mBump;

mat3 transpose(in mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
        vec3(i0.x, i1.x, i2.x),
        vec3(i0.y, i1.y, i2.y),
        vec3(i0.z, i1.z, i2.z)
    );

    return outMatrix;
}

void main() {
    fragColor = vertColor;
    vTextureCoord = vertTexture;
    vec4 worldPos = mWorld * vec4(vertPosition, 1.0);
    gl_Position = mProj * mView * worldPos;

    fmWorldPos = vec3(worldPos);
    fmNorm = mat3(mWorld) * vertNormal;

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    highp vec4 transformedNormal = mNorm * vec4(vertNormal, 1);
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);

    vec3 N = normalize(mBump*cross(vertBitangent, vertTangent));
    vec3 T = normalize(mBump*vertTangent);
    vec3 B = normalize(mBump*vertBitangent);
    mat3 tbn = mat3(T, B, N);
}