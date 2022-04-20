import { Vec3 } from '../types';
import { WebGL } from '../webgl';
import { NodePoint, TextureFaceInfo } from './node-point';

export interface FloatContainer {
    [key: string]: Float32Array;
}

export interface NumberContainer {
    [key: string]: number[];
}

export interface StringContainer {
    [key: string]: string;
}

export interface ConstantContainer {
    [key: string]: Vec3;
}

export abstract class Model {}

export abstract class Renderer {
    constructor(protected webGL: WebGL, private mappingMode: number, protected root: NodePoint) {
        this.addTexture(root);
    }

    protected addTexture(node: NodePoint): void {
        if (node.R) {
            this.addTexture(node.R);
        }
        if (node.L) {
            this.addTexture(node.L);
        }

        if (this.mappingMode != 2) {
            node.textureData = this.loadTexture(node.texture as string) as WebGLTexture;
        } else if (this.mappingMode == 2) {
            node.textureData = this.loadCubeTexture(
                node.texture as TextureFaceInfo
            ) as WebGLTexture;
        }
    }

    private loadTexture(imgData: string): WebGLTexture {
        const gl = this.webGL.gl;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([255, 0, 0, 255]);

        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );

        const image = new Image();

        const isPowerOf2 = (value: number): boolean => {
            return (value & (value - 1)) == 0;
        };

        image.src = imgData;
        image.addEventListener('load', function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE0);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        });

        this.webGL.gl = gl;
        return texture as WebGLTexture;
    }

    private loadCubeTexture(textureFaceInfo: TextureFaceInfo): WebGLTexture {
        const gl = this.webGL.gl;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        for (var i = 0; i < textureFaceInfo.length; ++i) {
            const { target, imageData } = textureFaceInfo[i];
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const border = 0;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;

            gl.texImage2D(
                target,
                level,
                internalFormat,
                width,
                height,
                border,
                srcFormat,
                srcType,
                null
            );

            const image = new Image();
            image.src = imageData;
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, srcFormat, srcType, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            };
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        this.webGL.gl = gl;
        return texture as WebGLTexture;
    }

    public draw(node: NodePoint = this.root): void {
        if (node.R) {
            this.draw(node.R);
        }
        if (node.L) {
            this.draw(node.L);
        }
        const gl = this.webGL.gl;

        gl.uniform1i(this.webGL.mode!, this.mappingMode);
        const vertex = gl.createBuffer() as WebGLBuffer;
        const color = gl.createBuffer() as WebGLBuffer;
        const textureCoord = gl.createBuffer() as WebGLBuffer;
        const normal = gl.createBuffer() as WebGLBuffer;
        const tangent = gl.createBuffer() as WebGLBuffer;
        const bitangent = gl.createBuffer() as WebGLBuffer;
        const indices = gl.createBuffer() as WebGLBuffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
        gl.bufferData(gl.ARRAY_BUFFER, node.vertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.webGL.vertPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.webGL.vertPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, color);
        gl.bufferData(gl.ARRAY_BUFFER, node.color, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.webGL.vertColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.webGL.vertColor);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoord);
        gl.bufferData(gl.ARRAY_BUFFER, node.textureCoord, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.webGL.vertTexture, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.webGL.vertTexture);

        gl.bindBuffer(gl.ARRAY_BUFFER, normal);
        gl.bufferData(gl.ARRAY_BUFFER, node.normal, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.webGL.vertNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.webGL.vertNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, tangent);
        gl.bufferData(gl.ARRAY_BUFFER, node.tangent, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.webGL.vertTangent!, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.webGL.vertTangent!);

        gl.bindBuffer(gl.ARRAY_BUFFER, bitangent);
        gl.bufferData(gl.ARRAY_BUFFER, node.bitangent, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.webGL.vertBitangent!, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.webGL.vertBitangent!);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, node.indices, gl.STATIC_DRAW);

        if (this.mappingMode != 2 && node.textureData) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, node.textureData);
            gl.uniform1i(this.webGL.uSampler!, 1);
        }
        gl.drawElements(gl.TRIANGLES, node.indices.length, gl.UNSIGNED_SHORT, 0);

        this.webGL.gl = gl;
    }
}
