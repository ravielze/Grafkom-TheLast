import BodyVertexShader from './shaders/body-vertex-shader.glsl';
import BodyFragmentShader from './shaders/body-fragment-shader.glsl';
import Matrix, { Matrix3, Matrix4 } from '../utils/matrix';
import { Control } from '../control';
import TransformationMatrix from '../utils/transformation-matrix';
import Vector, { Vector3 } from '../utils/vector';
import ProjectionMatrix from '../utils/projection-matrix';
import { Dog, DogSkeleton } from '../model/models/dog';

export class WebGL {
    public gl: WebGLRenderingContext;
    public glProgram?: WebGLProgram;

    public mWorld?: WebGLUniformLocation;
    public mView?: WebGLUniformLocation;
    public mProj?: WebGLUniformLocation;
    public mNorm?: WebGLUniformLocation;
    public mBump?: WebGLUniformLocation;
    public mode?: WebGLUniformLocation;
    public stateShade?: WebGLUniformLocation;
    public stateTexture?: WebGLUniformLocation;
    public uSampler?: WebGLUniformLocation;
    public uSamplerCube?: WebGLUniformLocation;

    public vertPosition: number = 0;
    public vertColor: number = 0;
    public vertNormal: number = 0;
    public vertTexture: number = 0;
    public vertTangent: number = 0;
    public vertBitangent: number = 0;

    public worldMatrix: Matrix4 = Array(16).fill(0);
    public cameraMatrix: Matrix4 = Array(16).fill(0);
    public projMatrix: Matrix4 = Array(16).fill(0);
    public normMatrix: Matrix4 = Array(16).fill(0);
    public normBumpMatrix: Matrix3 = Array(9).fill(0);

    private dogSkeleton?: DogSkeleton;

    constructor(
        gl: WebGLRenderingContext,
        //private drawer: Drawer,
        private readonly control: Control,
        canvas: HTMLCanvasElement
    ) {
        var glx = gl as WebGLRenderingContext;

        glx.viewport(0, 0, canvas.width, canvas.height);
        glx.clearColor(1.0, 1.0, 1.0, 1.0);
        glx.clear(glx.COLOR_BUFFER_BIT);

        glx.enable(glx.DEPTH_TEST);

        this.gl = glx;
        if (this.initShaders()) {
            this.initiate();
        }

        this.gl = glx;
    }

    private initiate(): void {
        var gl = this.gl as WebGLRenderingContext;
        var glp = this.glProgram!;

        this.vertPosition = gl.getAttribLocation(glp, 'vertPosition');
        this.vertColor = gl.getAttribLocation(glp, 'vertColor');
        this.vertNormal = gl.getAttribLocation(glp, 'vertNormal');
        this.vertTexture = gl.getAttribLocation(glp, 'vertTexture');
        this.vertTangent = gl.getAttribLocation(glp, 'vertTangent');
        this.vertBitangent = gl.getAttribLocation(glp, 'vertBitangent');

        this.mWorld = gl.getUniformLocation(glp, 'mWorld') as WebGLUniformLocation;
        this.mView = gl.getUniformLocation(glp, 'mView') as WebGLUniformLocation;
        this.mProj = gl.getUniformLocation(glp, 'mProj') as WebGLUniformLocation;
        this.mNorm = gl.getUniformLocation(glp, 'mNorm') as WebGLUniformLocation;
        this.mBump = gl.getUniformLocation(glp, 'mBump') as WebGLUniformLocation;
        // this.mode = gl.getUniformLocation(glp, 'mode') as WebGLUniformLocation;
        this.stateShade = gl.getUniformLocation(glp, 'stateShade') as WebGLUniformLocation;
        // this.stateTexture = gl.getUniformLocation(glp, 'textureOn') as WebGLUniformLocation;
        // this.uSampler = gl.getUniformLocation(glp, 'uSampler') as WebGLUniformLocation;
        // this.uSamplerCube = gl.getUniformLocation(glp, 'uSamplerCube') as WebGLUniformLocation;

        this.initMatrix();

        gl.uniform1i(this.stateShade!, this.control.useShader ? 1 : 0);
        //gl.uniform1i(this.stateTexture!, 0);

        gl.uniformMatrix4fv(this.mWorld!, false, new Float32Array(this.worldMatrix));
        gl.uniformMatrix4fv(this.mView!, false, new Float32Array(this.cameraMatrix));
        gl.uniformMatrix4fv(this.mProj!, false, new Float32Array(this.projMatrix));
        gl.uniformMatrix4fv(this.mNorm!, false, new Float32Array(this.normMatrix));
        //gl.uniform1i(this.uSampler!, 1);
        //gl.uniform1i(this.uSamplerCube!, 0);
        gl.uniformMatrix3fv(this.mBump!, false, new Float32Array(this.normBumpMatrix));

        const dog = new Dog();
        this.dogSkeleton = new DogSkeleton(this, dog);

        this.gl = gl;
        this.glProgram = glp;
        this.render();
    }

    private render(): void {
        const gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
        this.dogSkeleton!.draw();

        this.gl = gl;
    }

    private initMatrix(): void {
        this.worldMatrix = Matrix.identity();
        var cameraPosition: Vector3 = [0, 0, this.control.cameraDistance];
        var targetPosition = [0, 0, 0];

        const xRotMat = TransformationMatrix.getRotationMatrix({
            x: this.control.cameraRotation.y,
            y: 0,
            z: 0,
        });
        const forwardVectorX = [...cameraPosition, 1];
        cameraPosition = Vector.add(Vector.transform(xRotMat, forwardVectorX), targetPosition);

        const yRotMat = TransformationMatrix.getRotationMatrix({
            x: 0,
            y: this.control.cameraRotation.x,
            z: 0,
        });
        const forwardVectorY = [...cameraPosition, 1];
        cameraPosition = Vector.add(Vector.transform(yRotMat, forwardVectorY), targetPosition);

        this.cameraMatrix = Matrix.getLookAtMatrix(cameraPosition, targetPosition);
        this.projMatrix = ProjectionMatrix.getPerspectiveMatrix(
            this.control.near,
            this.control.far
        );
        this.normMatrix = Matrix.transpose(
            Matrix.inverse(Matrix.multiply(this.cameraMatrix, this.worldMatrix))
        );

        const cm = (idx: number): number => this.cameraMatrix[idx];

        //prettier-ignore
        this.normBumpMatrix = [
            cm(0), cm(1), cm(2),
            cm(3), cm(4), cm(5),
            cm(6), cm(7), cm(8)
        ]
    }

    private initShaders(): boolean {
        var gl = this.gl as WebGLRenderingContext;
        this.glProgram = gl.createProgram() as WebGLProgram;
        var glp = this.glProgram;

        const vertexShader = this.createShader(BodyVertexShader, gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(BodyFragmentShader, gl.FRAGMENT_SHADER);
        if (vertexShader == null || fragmentShader == null) {
            alert('Shader compilation error!');
            return false;
        }

        gl.attachShader(glp, vertexShader);
        gl.attachShader(glp, fragmentShader);
        gl.linkProgram(glp);

        if (!gl.getProgramParameter(glp, gl.LINK_STATUS)) {
            alert('Shader program initialization failed!');
            return false;
        }
        gl.useProgram(glp);

        this.glProgram = glp;
        this.gl = gl;
        return true;
    }

    private createShader(source: string, type: number): WebGLShader | null {
        var gl = this.gl as WebGLRenderingContext;
        const shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return null;
        }
        this.gl = gl;
        return shader;
    }
}
