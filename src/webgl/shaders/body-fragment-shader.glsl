precision mediump float;

varying vec3 normalInterp;  // Surface normal
varying vec3 vertPos;       // Vertex position
varying vec4 v_color;
uniform int mode;           // Rendering mode
uniform int shading;
uniform float Ka;           // Ambient reflection coefficient
uniform float Kd;           // Diffuse reflection coefficient
uniform float Ks;           // Specular reflection coefficient
uniform float shininessValue; // Shininess

// Material Color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

uniform vec3 lightPos; // Light Position

void main() {
    vec3 N = normalize(normalInterp);
    vec3 L = normalize(lightPos - vertPos);

  // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if (lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Light Reflection Vector
        vec3 V = normalize(-vertPos); // Direction Vector to Viewer
    
        float specAngle = max(dot(R, V), 0.0); // Compute the specular term
        specular = pow(specAngle, shininessValue);
    }
    if (shading == 1){
        gl_FragColor = vec4(Ka * ambientColor + Kd * lambertian * diffuseColor + Ks * specular * specularColor + vec3(v_color), 1.0);

        // only ambient
        if(mode == 2) {
            gl_FragColor = vec4(Ka * ambientColor, 1.0);
        }

        // only diffuse
        if(mode == 3) {
            gl_FragColor = vec4(Kd * lambertian * diffuseColor, 1.0);
        }

        // only specular
        if(mode == 4) {
            gl_FragColor = vec4(Ks * specular * specularColor, 1.0);
        }
    } else {
        gl_FragColor = vec4(vec3(v_color), 1.0);
    }
}