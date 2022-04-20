#extension GL_OES_standard_derivatives : enable
precision mediump float;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying vec3 fragColor;

varying vec3 fmNorm;
varying vec3 fmWorldPos;

uniform sampler2D uSampler;
uniform samplerCube uSamplerCube;

uniform bool stateShade;
uniform int mode;
uniform bool textureOn;

void main() {
    if (textureOn) {
        if (stateShade) {
            if (mode == 0) {
                highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
                gl_FragColor = vec4(texelColor.rgb * vLighting.xyz, texelColor.a);
            } else if (mode == 1) {
                vec3 albedo = texture2D(uSampler, vTextureCoord).rgb;

                vec3 norm = normalize(albedo * 2.0 - 1.0);
                float diffuse = max(dot(vLighting, norm), 0.0);
                gl_FragColor = vec4(diffuse * albedo, 1.0);
            } else if (mode == 2) {
                vec3 worldNormal = normalize(fmNorm);
                vec3 eyeToSurfaceFaceDir = normalize(fmWorldPos - vec3(0, 0, 0));
                vec3 direction = reflect(eyeToSurfaceFaceDir, worldNormal);
                
                gl_FragColor = vec4(vec4(textureCube(uSamplerCube, direction)).rgb * vLighting.xyz, 1);
            }
        } else {
            if (mode == 0) {
                highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
                gl_FragColor = vec4(texelColor.rgb * vec3(1, 1, 1), texelColor.a);
            } else if (mode == 1) {
                vec3 albedo = texture2D(uSampler, vTextureCoord).rgb;

                vec3 norm = normalize(albedo * 2.0 - 1.0);
                gl_FragColor = vec4(albedo, 1.0);
            } else if (mode == 2) {
                vec3 worldNormal = normalize(fmNorm);
                vec3 eyeToSurfaceFaceDir = normalize(fmWorldPos - vec3(0, 0, 0));
                vec3 direction = reflect(eyeToSurfaceFaceDir, worldNormal);
                
                gl_FragColor = textureCube(uSamplerCube, direction);
            }
        }
    } else {
        if (stateShade) {
            gl_FragColor = vec4(fragColor * vLighting, 1.0);
        } else {
            gl_FragColor = vec4(fragColor, 1.0);
        }
    }
}