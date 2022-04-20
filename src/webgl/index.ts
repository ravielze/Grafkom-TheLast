import BodyVertexShader from './shaders/body-vertex-shader.glsl';
import BodyFragmentShader from './shaders/body-fragment-shader.glsl';
import Matrix, { Matrix3, Matrix4 } from '../utils/matrix';
import { Control } from '../control';
import ProjectionMatrix from '../utils/projection-matrix';
import { Cow, CowSkeleton } from '../model/models/cow';
import { Cat, CatSkeleton } from '../model/models/cat';
import { Vec3 } from '../types';
import TransformationMatrix from '../utils/transformation-matrix';

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

    private cowSkeleton?: CowSkeleton;
    private catSkeleton?: CatSkeleton;

    constructor(
        gl: WebGLRenderingContext,
        private readonly control: Control,
        canvas: HTMLCanvasElement
    ) {
        var glx = gl as WebGLRenderingContext;

        glx.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
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
        this.mBump = gl.getUniformLocation(glp, 'normalMatrix') as WebGLUniformLocation;
        this.mode = gl.getUniformLocation(glp, 'mode') as WebGLUniformLocation;
        this.stateShade = gl.getUniformLocation(glp, 'stateShade') as WebGLUniformLocation;
        this.stateTexture = gl.getUniformLocation(glp, 'textureOn') as WebGLUniformLocation;
        this.uSampler = gl.getUniformLocation(glp, 'uSampler') as WebGLUniformLocation;
        this.uSamplerCube = gl.getUniformLocation(glp, 'uSamplerCube') as WebGLUniformLocation;

        this.initMatrix();

        gl.uniform1i(this.stateTexture!, this.control.useTexture ? 1 : 0);
        gl.uniform1i(this.stateShade!, this.control.useShader ? 1 : 0);

        gl.uniformMatrix4fv(this.mWorld!, false, new Float32Array(this.worldMatrix));
        gl.uniformMatrix4fv(this.mView!, false, new Float32Array(this.cameraMatrix));
        gl.uniformMatrix4fv(this.mProj!, false, new Float32Array(this.projMatrix));
        gl.uniformMatrix4fv(this.mNorm!, false, new Float32Array(this.normMatrix));
        gl.uniform1i(this.uSampler!, 1);
        gl.uniform1i(this.uSamplerCube!, 0);
        gl.uniformMatrix3fv(this.mBump!, false, new Float32Array(this.normBumpMatrix));

        const cow = new Cow(this.control);
        this.cowSkeleton = new CowSkeleton(this, cow);
        const cat = new Cat(this.control);
        this.catSkeleton = new CatSkeleton(this, cat);

        this.gl = gl;
        this.glProgram = glp;
        this.render();
    }

    public render(): void {
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
        this.calculateWorldMatrix();
        this.calculateProjection();
        this.calculateToggle();
        this.cowSkeleton!.draw();
        this.catSkeleton!.draw();

        this.gl = gl;
    }

    private initMatrix(): void {
        this.worldMatrix = Matrix.identity();
        this.cameraMatrix = Matrix.matLookAt([0, 0, -8], [0, 0, 0], [0, 1, 0]);
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

    public calculateWorldMatrix(): void {
        const { x: x1, y: y1, z: z1 } = this.control.rotation;
        const { x: x2, y: y2, z: z2 } = this.control.animation.rotation;
        const inputPlusAnimation: Vec3 = {
            x: x1 + x2,
            y: y1 + y2,
            z: z1 + z2,
        };

        const rotation = TransformationMatrix.getRotationMatrix(inputPlusAnimation);
        const translation = TransformationMatrix.getTranslationMatrixTranspose(
            this.control.translation
        );
        const scale = TransformationMatrix.getScaleMatrix(this.control.scale);
        this.worldMatrix = Matrix.multiply(rotation, translation);
        this.worldMatrix = Matrix.multiply(this.worldMatrix, scale);

        this.gl.uniformMatrix4fv(this.mWorld!, false, new Float32Array(this.worldMatrix));
    }

    public calculateToggle(): void {
        this.gl.uniform1i(this.stateShade!, this.control.useShader ? 1 : 0);
        this.gl.uniform1i(this.stateTexture!, this.control.useTexture ? 1 : 0);
    }

    public calculateProjection(): void {
        this.projMatrix = ProjectionMatrix.getPerspectiveMatrix(
            this.control.near,
            this.control.far
        );
        this.gl.uniformMatrix4fv(this.mProj!, false, new Float32Array(this.projMatrix));
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
