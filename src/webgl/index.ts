import BodyVertexShader from './shaders/body-vertex-shader.glsl';
import BodyFragmentShader from './shaders/body-fragment-shader.glsl';
import { Drawer } from './drawer';
import Matrix from '../utils/matrix';
import { Control } from '../control';
import { ModelManager } from '../model';

export class WebGL {
    public gl: WebGLRenderingContext | null = null;
    public program: WebGLProgram | null = null;

    public vbo: WebGLBuffer | null = null;
    public wireVbo: WebGLBuffer | null = null;
    public elementVbo: WebGLBuffer | null = null;

    public matrixLocation: WebGLUniformLocation | null = null;
    public projectionMatrixLocation: WebGLUniformLocation | null = null;
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
    public colorOffset: number = 0;
    public normalOffset: number = 0;
    public normal: Float32Array = new Float32Array([]);

    constructor(
        gl: WebGLRenderingContext | null,
        private drawer: Drawer,
        private readonly control: Control
    ) {
        var glx = gl as WebGLRenderingContext;
        this.gl = glx;

        glx.enable(glx.DEPTH_TEST);
        glx.clearColor(0.0, 0.0, 0.0, 0.0);

        const normal = ModelManager.getModel('block');
        if (!normal) {
            alert('Something went wrong!');
            return;
        }
        this.normal = new Float32Array(normal.positions);
    }

    public start(): void {
        this.loadModel();
        this.initShaders();
        this.drawer.calculateTransformation();
        this.drawer.calculateCameraProjection();
        this.draw();
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
        this.gl = gl;
    }

    public loadModel(): void {
        const gl = this.gl as WebGLRenderingContext;
        const model = ModelManager.getCurrentModel();
        if (!model) {
            return;
        }

        this.vbo = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            model.positions.byteLength + model.colors.byteLength + this.normal.byteLength,
            gl.STATIC_DRAW
        );
        this.normalOffset = model.positions.byteLength;
        this.colorOffset = this.normalOffset + this.normal.byteLength;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, model.positions);
        gl.bufferSubData(gl.ARRAY_BUFFER, this.normalOffset, this.normal);
        gl.bufferSubData(gl.ARRAY_BUFFER, this.colorOffset, model.colors);

        this.elementVbo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementVbo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indices, gl.STATIC_DRAW);

        this.gl = gl;
    }

    public draw(): void {
        const gl = this.gl as WebGLRenderingContext;
        const model = ModelManager.getCurrentModel();
        if (!model) {
            return;
        }

        // NOTE Rusak D: males benerin
        // this.normal = this.drawer.calculateNormal(model);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        // Retrieve Positionns
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // Retrieve Normals
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, this.normalOffset);
        gl.enableVertexAttribArray(1);

        // Retrieve Colors
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, this.colorOffset);
        gl.enableVertexAttribArray(2);

        gl.uniformMatrix4fv(this.matrixLocation, false, new Float32Array(this.drawer.matrix));
        gl.uniformMatrix4fv(
            this.projectionMatrixLocation,
            false,
            new Float32Array(this.drawer.projMatrix)
        );

        const inversedMatrix = Matrix.inverse(this.drawer.matrix);
        gl.uniformMatrix4fv(
            this.normalMatrixLocation,
            false,
            new Float32Array(Matrix.transpose(inversedMatrix))
        );

        gl.uniform1i(this.mode, 1);
        gl.uniform1i(this.shadingModeLocation, this.control.useShader ? 1 : 0);
        gl.uniform1f(this.ka, 1);
        gl.uniform1f(this.kd, 1);
        gl.uniform1f(this.ks, 1);

        gl.uniform1f(this.shineValue, model.material.shininess);
        gl.uniform3fv(this.ambientColor, new Float32Array(model.material.ambient));
        gl.uniform3fv(this.diffuseColor, new Float32Array(model.material.diffuse));
        gl.uniform3fv(this.specularColor, new Float32Array(model.material.specular));
        gl.uniform3fv(
            this.lightPos,
            new Float32Array([this.control.light.x, this.control.light.y, this.control.light.z])
        );

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementVbo);
        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

        this.gl = gl;
    }
}
