import BodyVertexShader from './shaders/body-vertex-shader.glsl';
import BodyFragmentShader from './shaders/body-fragment-shader.glsl';
import WireVertexShader from './shaders/wire-vertex-shader.glsl';
import WireFragmentShader from './shaders/wire-fragment-shader.glsl';

export class WebGL {
    public gl: WebGLRenderingContext | null = null;
    public program: WebGLProgram | null = null;
    public wireProgram: WebGLProgram | null = null;

    public vbo: WebGLBuffer | null = null;
    public wireVbo: WebGLBuffer | null = null;
    public elementVbo: WebGLBuffer | null = null;

    public matrixLocation: WebGLUniformLocation | null = null;
    public wireMatrixLocation: WebGLUniformLocation | null = null;
    public projectionMatrixLocation: WebGLUniformLocation | null = null;
    public wireProjectionMatrixLocation: WebGLUniformLocation | null = null;
    public normalMatrixLocation: WebGLUniformLocation | null = null;

    public mode: WebGLUniformLocation | null = null;
    public ka: WebGLUniformLocation | null = null;
    public kd: WebGLUniformLocation | null = null;
    public ks: WebGLUniformLocation | null = null;
    public shineValue: WebGLUniformLocation | null = null;
    public ambientColor: WebGLUniformLocation | null = null;
    public diffuseColor: WebGLUniformLocation | null = null;
    public specularColor: WebGLUniformLocation | null = null;
    public lightPos: WebGLUniformLocation | null = null;
    public shadingModeLocation: WebGLUniformLocation | null = null;

    constructor(gl: WebGLRenderingContext | null) {
        var glx = gl as WebGLRenderingContext;
        this.gl = glx;

        glx.enable(glx.DEPTH_TEST);
        glx.clearColor(0.0, 0.0, 0.0, 0.0);
        this.initShaders();
    }

    private initShaders(): void {
        var gl = this.gl as WebGLRenderingContext;

        // Shaders
        const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vertexShader, BodyVertexShader);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fragmentShader, BodyFragmentShader);
        gl.compileShader(fragmentShader);

        this.program = gl.createProgram() as WebGLProgram;
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);

        gl.bindAttribLocation(this.program, 0, 'a_position');
        gl.bindAttribLocation(this.program, 1, 'normal');
        gl.bindAttribLocation(this.program, 2, 'a_color');

        gl.linkProgram(this.program);
        this.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
        this.projectionMatrixLocation = gl.getUniformLocation(this.program, 'u_proj_matrix');
        this.mode = gl.getUniformLocation(this.program, 'mode');
        this.shadingModeLocation = gl.getUniformLocation(this.program, 'shading');
        this.ka = gl.getUniformLocation(this.program, 'Ka');
        this.kd = gl.getUniformLocation(this.program, 'Kd');
        this.ks = gl.getUniformLocation(this.program, 'Ks');
        this.shineValue = gl.getUniformLocation(this.program, 'shininessValue');
        this.ambientColor = gl.getUniformLocation(this.program, 'ambientColor');
        this.diffuseColor = gl.getUniformLocation(this.program, 'diffuseColor');
        this.specularColor = gl.getUniformLocation(this.program, 'specularColor');
        this.lightPos = gl.getUniformLocation(this.program, 'lightPos');
        this.normalMatrixLocation = gl.getUniformLocation(this.program, 'normalMat');

        // Wire Shaders
        const wireVertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(wireVertexShader, WireVertexShader);
        gl.compileShader(wireVertexShader);

        const wireFragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(wireFragmentShader, WireFragmentShader);
        gl.compileShader(wireFragmentShader);

        this.wireProgram = gl.createProgram() as WebGLProgram;
        gl.attachShader(this.wireProgram, wireVertexShader);
        gl.attachShader(this.wireProgram, wireFragmentShader);

        this.wireProgram = gl.createProgram() as WebGLProgram;
        gl.attachShader(this.wireProgram, wireVertexShader);
        gl.attachShader(this.wireProgram, wireFragmentShader);

        gl.bindAttribLocation(this.wireProgram, 0, 'a_position');
        gl.linkProgram(this.wireProgram);
        this.wireMatrixLocation = gl.getUniformLocation(this.wireProgram, 'u_matrix');
        this.wireProjectionMatrixLocation = gl.getUniformLocation(
            this.wireProgram,
            'u_proj_matrix'
        );

        this.gl = gl;
    }
}
