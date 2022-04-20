import {
    ConstantContainer,
    FloatContainer,
    Model,
    NumberContainer,
    Renderer,
    StringContainer,
} from '..';
import { CUBE_INDICES, CUBE_POSITIONS, CUBE_TEXTURE_COORDINATES } from '../../cube';
import { CubeOperation } from '../../cube/operation';
import DefaultMatrix from '../../utils/default-matrix';
import { WebGL } from '../../webgl';
import { NodePoint } from '../node-point';
import texture from '../../texture/stone.jpg';
import { Control } from '../../control';

export class CatSkeleton extends Renderer {
    constructor(webGL: WebGL, public cat: Cat) {
        super(webGL, 1, cat.root!);
    }
}

export class Cat extends Model {
    public centers: NumberContainer;
    public skeletons: FloatContainer;
    public colors: FloatContainer;
    public jointPoints: NumberContainer;
    public textures: StringContainer;
    public textureCoords: FloatContainer;
    public normals: FloatContainer;
    public tangents: FloatContainer;
    public bitangents: FloatContainer;
    public inRotation: ConstantContainer;
    public bodyLocation: number[];
    public root?: NodePoint;

    public catTime: number = 0;

    constructor(private readonly control: Control) {
        super();

        this.control.animation.addAnimationHandler((val: number) => {
            this.catTime += (val * 0.1) % 360;
            this.distributeRotation(30 * Math.sin(this.catTime));
            this.updateAnimation();
            this.updateTransform();
        });

        const xCenter = -2;
        const yCenter = 0;
        const scale = 1.25;
        const cubeSize = 2;
        const bodySize = [1 / scale, 1 / scale, 3 / scale];
        const neckSize = [1 / scale, 0.4 / scale, 0.1 / scale];
        const headSize = [1 / scale, 1 / scale, 1 / scale];
        const earSize = [0.1 / scale, 0.2 / scale, 0.1 / scale];
        const tailSize = [0.1 / scale, 0.2 / scale, 1.5 / scale];
        const legSize = [0.2 / scale, 0.8 / scale, 0.2 / scale];

        const kScaleBody = [bodySize[0] / cubeSize, bodySize[1] / cubeSize, bodySize[2] / cubeSize];
        const kScaleNeck = [neckSize[0] / cubeSize, neckSize[1] / cubeSize, neckSize[2] / cubeSize];
        const kScaleHead = [headSize[0] / cubeSize, headSize[1] / cubeSize, headSize[2] / cubeSize];
        const kScaleEar = [earSize[0] / cubeSize, earSize[1] / cubeSize, earSize[2] / cubeSize];
        const kScaleTail = [tailSize[0] / cubeSize, tailSize[1] / cubeSize, tailSize[2] / cubeSize];
        const kScaleLeg = [legSize[0] / cubeSize, legSize[1] / cubeSize, legSize[2] / cubeSize];

        const translateBody = [xCenter, 0, 0];
        const translateNeck = [
            xCenter,
            bodySize[1] / 2 + neckSize[1] / 2,
            -(bodySize[2] / 2 - neckSize[2] / 2),
        ];
        const translateHead = [
            xCenter,
            translateNeck[1] + neckSize[1] / 2 + headSize[1] / 2,
            translateNeck[2] - neckSize[2] / 2 - headSize[2] / 2,
        ];
        const translateFrontLeg = {
            left: [
                xCenter + bodySize[0] / 2 - legSize[0] / 2,
                -(bodySize[1] / 2 + legSize[1] / 2),
                -(bodySize[2] / 2 - legSize[2] / 2),
            ],
            right: [
                xCenter - (bodySize[0] / 2 - legSize[0] / 2),
                -(bodySize[1] / 2 + legSize[1] / 2),
                -(bodySize[2] / 2 - legSize[2] / 2),
            ],
        };
        const translateBackLeg = {
            left: [
                xCenter + bodySize[0] / 2 - legSize[0] / 2,
                -(bodySize[1] / 2 + legSize[1] / 2),
                bodySize[2] / 2 - legSize[2] / 2,
            ],
            right: [
                xCenter - (bodySize[0] / 2 - legSize[0] / 2),
                -(bodySize[1] / 2 + legSize[1] / 2),
                bodySize[2] / 2 - legSize[2] / 2,
            ],
        };
        const translateTail = [xCenter, yCenter + 0.2, bodySize[2] / 2 + tailSize[2] / 2];
        const translateEar = {
            left: [
                xCenter + bodySize[0] / 2 - earSize[0] / 2,
                translateHead[1] + headSize[1] / 2 + earSize[1] / 2,
                translateHead[2] + headSize[2] / 2 - earSize[2] / 2,
            ],
            right: [
                xCenter - (bodySize[0] / 2 - earSize[0] / 2),
                translateHead[1] + headSize[1] / 2 + earSize[1] / 2,
                translateHead[2] + headSize[2] / 2 - earSize[2] / 2,
            ],
        };

        const body = CubeOperation.scale(CUBE_POSITIONS, {
            x: kScaleBody[0],
            y: kScaleBody[1],
            z: kScaleBody[2],
        });

        const neck = CubeOperation.scale(CUBE_POSITIONS, {
            x: kScaleNeck[0],
            y: kScaleNeck[1],
            z: kScaleNeck[2],
        });

        const head = CubeOperation.scale(CUBE_POSITIONS, {
            x: kScaleHead[0],
            y: kScaleHead[1],
            z: kScaleHead[2],
        });
        const leg = CubeOperation.scale(CUBE_POSITIONS, {
            x: kScaleLeg[0],
            y: kScaleLeg[1],
            z: kScaleLeg[2],
        });
        const ear = CubeOperation.scale(CUBE_POSITIONS, {
            x: kScaleEar[0],
            y: kScaleEar[1],
            z: kScaleEar[2],
        });
        const tail = CubeOperation.scale(CUBE_POSITIONS, {
            x: kScaleTail[0],
            y: kScaleTail[1],
            z: kScaleTail[2],
        });

        this.centers = {
            body: translateBody,
            head: translateHead,
            neck: translateNeck,
            tail: translateTail,
            'ear-left': translateEar['left'],
            'ear-right': translateEar['right'],
            'leg-front-left': translateFrontLeg['left'],
            'leg-front-right': translateFrontLeg['right'],
            'leg-back-left': translateBackLeg['left'],
            'leg-back-right': translateBackLeg['right'],
        };

        this.skeletons = {
            body: CubeOperation.translate(body, {
                x: this.centers['body'][0],
                y: this.centers['body'][1],
                z: this.centers['body'][2],
            }),
            head: CubeOperation.translate(head, {
                x: this.centers['head'][0],
                y: this.centers['head'][1],
                z: this.centers['head'][2],
            }),
            neck: CubeOperation.translate(neck, {
                x: this.centers['neck'][0],
                y: this.centers['neck'][1],
                z: this.centers['neck'][2],
            }),
            tail: CubeOperation.translate(tail, {
                x: this.centers['tail'][0],
                y: this.centers['tail'][1],
                z: this.centers['tail'][2],
            }),
            'ear-left': CubeOperation.translate(ear, {
                x: this.centers['ear-left'][0],
                y: this.centers['ear-left'][1],
                z: this.centers['ear-left'][2],
            }),
            'ear-right': CubeOperation.translate(ear, {
                x: this.centers['ear-right'][0],
                y: this.centers['ear-right'][1],
                z: this.centers['ear-right'][2],
            }),
            'leg-front-left': CubeOperation.translate(leg, {
                x: this.centers['leg-front-left'][0],
                y: this.centers['leg-front-left'][1],
                z: this.centers['leg-front-left'][2],
            }),
            'leg-front-right': CubeOperation.translate(leg, {
                x: this.centers['leg-front-right'][0],
                y: this.centers['leg-front-right'][1],
                z: this.centers['leg-front-right'][2],
            }),
            'leg-back-left': CubeOperation.translate(leg, {
                x: this.centers['leg-back-left'][0],
                y: this.centers['leg-back-left'][1],
                z: this.centers['leg-back-left'][2],
            }),
            'leg-back-right': CubeOperation.translate(leg, {
                x: this.centers['leg-back-right'][0],
                y: this.centers['leg-back-right'][1],
                z: this.centers['leg-back-right'][2],
            }),
        };

        this.colors = {
            body: new Float32Array(CubeOperation.colorFactory(this.skeletons['body'], 1, 1, 0)),
            head: new Float32Array(CubeOperation.colorFactory(this.skeletons['head'], 1, 1, 0)),
            neck: new Float32Array(CubeOperation.colorFactory(this.skeletons['neck'], 1, 1, 0)),
            tail: new Float32Array(CubeOperation.colorFactory(this.skeletons['tail'], 1, 1, 0)),
            'ear-left': new Float32Array(
                CubeOperation.colorFactory(this.skeletons['ear-left'], 1, 1, 0)
            ),
            'ear-right': new Float32Array(
                CubeOperation.colorFactory(this.skeletons['ear-right'], 1, 1, 0)
            ),
            'leg-front-left': new Float32Array(
                CubeOperation.colorFactory(this.skeletons['leg-front-left'], 1, 1, 0)
            ),
            'leg-front-right': new Float32Array(
                CubeOperation.colorFactory(this.skeletons['leg-front-right'], 1, 1, 0)
            ),
            'leg-back-left': new Float32Array(
                CubeOperation.colorFactory(this.skeletons['leg-back-left'], 1, 1, 0)
            ),
            'leg-back-right': new Float32Array(
                CubeOperation.colorFactory(this.skeletons['leg-back-right'], 1, 1, 0)
            ),
        };

        this.jointPoints = {
            body: this.centers['body'],
            head: this.centers['head'],
            neck: [this.centers['neck'][0], this.centers['body'][1], this.centers['neck'][2]],
            tail: [
                this.centers['tail'][0],
                this.centers['tail'][1],
                this.centers['tail'][2] - tailSize[2] / 2,
            ],
            'ear-left': [
                this.centers['ear-left'][0],
                this.centers['ear-left'][1] - earSize[1] / 2,
                this.centers['head'][2] + headSize[2] / 2,
            ],
            'ear-right': [
                this.centers['ear-right'][0],
                this.centers['ear-right'][1] - earSize[1] / 2,
                this.centers['head'][2] + headSize[2] / 2,
            ],
            'leg-front-left': this.centers['leg-front-left'],
            'leg-front-right': this.centers['leg-front-right'],
            'leg-back-left': this.centers['leg-back-left'],
            'leg-back-right': this.centers['leg-back-right'],
        };

        this.textures = {
            body: texture,
            head: texture,
            neck: texture,
            tail: texture,
            'ear-left': texture,
            'ear-right': texture,
            'leg-front-left': texture,
            'leg-front-right': texture,
            'leg-back-left': texture,
            'leg-back-right': texture,
        };

        this.textureCoords = {
            body: CUBE_TEXTURE_COORDINATES,
            head: CUBE_TEXTURE_COORDINATES,
            neck: CUBE_TEXTURE_COORDINATES,
            tail: CUBE_TEXTURE_COORDINATES,
            'ear-left': CUBE_TEXTURE_COORDINATES,
            'ear-right': CUBE_TEXTURE_COORDINATES,
            'leg-front-left': CUBE_TEXTURE_COORDINATES,
            'leg-front-right': CUBE_TEXTURE_COORDINATES,
            'leg-back-left': CUBE_TEXTURE_COORDINATES,
            'leg-back-right': CUBE_TEXTURE_COORDINATES,
        };

        this.normals = {
            body: CubeOperation.getNormal(this.skeletons['body']),
            head: CubeOperation.getNormal(this.skeletons['head']),
            neck: CubeOperation.getNormal(this.skeletons['neck']),
            tail: CubeOperation.getNormal(this.skeletons['tail']),
            'ear-left': CubeOperation.getNormal(this.skeletons['ear-left']),
            'ear-right': CubeOperation.getNormal(this.skeletons['ear-right']),
            'leg-front-left': CubeOperation.getNormal(this.skeletons['leg-front-left']),
            'leg-front-right': CubeOperation.getNormal(this.skeletons['leg-front-right']),
            'leg-back-left': CubeOperation.getNormal(this.skeletons['leg-back-left']),
            'leg-back-right': CubeOperation.getNormal(this.skeletons['leg-back-right']),
        };

        this.tangents = {
            body: CubeOperation.getTangent(this.skeletons['body']),
            head: CubeOperation.getTangent(this.skeletons['head']),
            neck: CubeOperation.getTangent(this.skeletons['neck']),
            'leg-front-left': CubeOperation.getTangent(this.skeletons['leg-front-left']),
            'leg-front-right': CubeOperation.getTangent(this.skeletons['leg-front-right']),
            'leg-back-left': CubeOperation.getTangent(this.skeletons['leg-back-left']),
            'leg-back-right': CubeOperation.getTangent(this.skeletons['leg-back-right']),
        };

        this.bitangents = {
            body: CubeOperation.getBitangent(this.skeletons['body']),
            head: CubeOperation.getBitangent(this.skeletons['head']),
            neck: CubeOperation.getBitangent(this.skeletons['neck']),
            'leg-front-left': CubeOperation.getBitangent(this.skeletons['leg-front-left']),
            'leg-front-right': CubeOperation.getBitangent(this.skeletons['leg-front-right']),
            'leg-back-left': CubeOperation.getBitangent(this.skeletons['leg-back-left']),
            'leg-back-right': CubeOperation.getBitangent(this.skeletons['leg-back-right']),
        };

        this.inRotation = {
            body: { x: 0, y: 0, z: 0 },
            head: { x: 0, y: 0, z: 0 },
            neck: { x: 0, y: 0, z: 0 },
            tail: { x: 0, y: 0, z: 0 },
            'ear-left': { x: 0, y: 0, z: 0 },
            'ear-right': { x: 0, y: 0, z: 0 },
            'leg-front-left': { x: 0, y: 0, z: 0 },
            'leg-front-right': { x: 0, y: 0, z: 0 },
            'leg-back-left': { x: 0, y: 0, z: 0 },
            'leg-back-right': { x: 0, y: 0, z: 0 },
        };

        this.bodyLocation = [2, 0, 0];

        //this.createTree();
        const skeletonNodes: { [key: string]: NodePoint } = {};
        for (var k in this.skeletons) {
            skeletonNodes[k] = new NodePoint(
                DefaultMatrix.identity(),
                this.jointPoints[k],
                this.centers[k],
                this.skeletons[k],
                CUBE_INDICES,
                this.colors[k],
                this.normals[k],
                this.tangents[k],
                this.bitangents[k],
                this.textures[k],
                this.textureCoords[k],
                k
            );
        }

        this.root = skeletonNodes['body'];
        this.root.L = skeletonNodes['neck'];
        this.root.L!.L = skeletonNodes['head'];
        this.root.L!.L!.L = skeletonNodes['ear-left'];
        this.root.L!.L!.L!.R = skeletonNodes['ear-right'];
        this.root.L!.R = skeletonNodes['leg-front-left'];
        this.root.L!.R!.R = skeletonNodes['leg-front-right'];
        this.root.L!.R!.R!.R = skeletonNodes['leg-back-left'];
        this.root.L!.R!.R!.R!.R = skeletonNodes['leg-back-right'];
        this.root.L!.R!.R!.R!.R!.R = skeletonNodes['tail'];

        this.transformModel();
        this.updateAnimation();
        this.updateTransform();
    }

    public updateTransform(node: NodePoint = this.root!): void {
        node.vertices = CubeOperation.transform(node.defVertices, node.transform);
        node.normal = CubeOperation.getNormal(node.vertices);
        node.tangent = CubeOperation.getTangent(node.vertices);
        node.bitangent = CubeOperation.getBitangent(node.vertices);
        if (node.L) {
            const matJointNodeLeft = [
                [node.L!.defJointPoint[0]],
                [node.L!.defJointPoint[1]],
                [node.L!.defJointPoint[2]],
                [1],
            ];
            node.L!.jointPoint = DefaultMatrix.export(
                DefaultMatrix.multiply(node.transform, matJointNodeLeft)
            );
            node.L!.baseTransform = DefaultMatrix.rotate(
                {
                    x: this.inRotation[node.L!.name]['x'],
                    y: this.inRotation[node.L!.name]['y'],
                    z: this.inRotation[node.L!.name]['z'],
                },
                { x: node.L!.jointPoint[0], y: node.L!.jointPoint[1], z: node.L!.jointPoint[2] }
            );
            node.L!.transform = DefaultMatrix.multiply(node.L!.baseTransform, node.transform);

            node.L!.vertices = CubeOperation.transform(node.L!.defVertices, node.L!.transform);
            node.L!.normal = CubeOperation.getNormal(node.L!.vertices);
            node.L!.tangent = CubeOperation.getTangent(node.L!.vertices);
            node.L!.bitangent = CubeOperation.getBitangent(node.L!.vertices);
            var siblingNode = node.L!.R;
            var matJointNodeRight;
            while (siblingNode) {
                matJointNodeRight = [
                    [siblingNode.defJointPoint[0]],
                    [siblingNode.defJointPoint[1]],
                    [siblingNode.defJointPoint[2]],
                    [1],
                ];
                siblingNode.jointPoint = DefaultMatrix.export(
                    DefaultMatrix.multiply(node.transform, matJointNodeRight)
                );
                siblingNode.baseTransform = DefaultMatrix.rotate(
                    {
                        x: this.inRotation[siblingNode.name]['x'],
                        y: this.inRotation[siblingNode.name]['y'],
                        z: this.inRotation[siblingNode.name]['z'],
                    },
                    {
                        x: siblingNode.jointPoint[0],
                        y: siblingNode.jointPoint[1],
                        z: siblingNode.jointPoint[2],
                    }
                );
                siblingNode.transform = DefaultMatrix.multiply(
                    siblingNode.baseTransform,
                    node.transform
                );

                siblingNode.vertices = CubeOperation.transform(
                    siblingNode.defVertices,
                    siblingNode.transform
                );
                siblingNode.normal = CubeOperation.getNormal(siblingNode.vertices);
                siblingNode.tangent = CubeOperation.getTangent(siblingNode.vertices);
                siblingNode.bitangent = CubeOperation.getBitangent(siblingNode.vertices);
                if (siblingNode.L!) {
                    this.updateTransform(siblingNode.L!);
                }
                siblingNode = siblingNode.R;
            }
            this.updateTransform(node.L!);
        }
    }

    public distributeRotation(val: number): void {
        this.inRotation['neck']['x'] = val / 5;
        this.inRotation['leg-front-left']['x'] = val;
        this.inRotation['leg-front-right']['x'] = -val;
        this.inRotation['leg-back-left']['x'] = val;
        this.inRotation['leg-back-right']['x'] = -val;
        this.inRotation['tail']['y'] = val;
        this.inRotation['ear-left']['z'] = val;
        this.inRotation['ear-right']['z'] = -val;
    }

    public transformModel(): void {
        this.root!.transform = DefaultMatrix.multiply(
            DefaultMatrix.identity(),
            DefaultMatrix.translate({
                x: this.bodyLocation[0],
                y: this.bodyLocation[1],
                z: this.bodyLocation[2],
            })
        );
        this.root!.transform = DefaultMatrix.multiply(
            this.root!.transform,
            DefaultMatrix.rotate(
                {
                    x: this.inRotation['body']['x'],
                    y: this.inRotation['body']['y'],
                    z: this.inRotation['body']['z'],
                },
                { x: 0, y: 0, z: 0 }
            )
        );
    }

    public updateAnimation(): void {
        this.root!.L!.baseTransform = DefaultMatrix.rotate(
            { x: this.inRotation['neck']['x'], y: 0, z: 0 },
            {
                x: this.root!.L!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.L!.baseTransform = DefaultMatrix.rotate(
            { x: this.inRotation['head']['x'], y: 0, z: 0 },
            {
                x: this.root!.L!.L!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.L!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.L!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.L!.L!.baseTransform = DefaultMatrix.rotate(
            { x: 0, y: 0, z: this.inRotation['ear-left']['z'] },
            {
                x: this.root!.L!.L!.L!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.L!.L!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.L!.L!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.L!.L!.R!.baseTransform = DefaultMatrix.rotate(
            { x: 0, y: 0, z: this.inRotation['ear-right']['z'] },
            {
                x: this.root!.L!.L!.L!.R!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.L!.L!.R!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.L!.L!.R!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.R!.baseTransform = DefaultMatrix.rotate(
            { x: this.inRotation['leg-front-left']['x'], y: 0, z: 0 },
            {
                x: this.root!.L!.R!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.R!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.R!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.R!.R!.baseTransform = DefaultMatrix.rotate(
            { x: this.inRotation['leg-front-right']['x'], y: 0, z: 0 },
            {
                x: this.root!.L!.R!.R!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.R!.R!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.R!.R!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.R!.R!.R!.baseTransform = DefaultMatrix.rotate(
            { x: this.inRotation['leg-back-left']['x'], y: 0, z: 0 },
            {
                x: this.root!.L!.R!.R!.R!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.R!.R!.R!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.R!.R!.R!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.R!.R!.R!.R!.baseTransform = DefaultMatrix.rotate(
            { x: this.inRotation['leg-back-right']['x'], y: 0, z: 0 },
            {
                x: this.root!.L!.R!.R!.R!.R!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.R!.R!.R!.R!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.R!.R!.R!.R!.jointPoint[2] + this.bodyLocation[2],
            }
        );
        this.root!.L!.R!.R!.R!.R!.R!.baseTransform = DefaultMatrix.rotate(
            { x: 0, y: this.inRotation['tail']['y'], z: 0 },
            {
                x: this.root!.L!.R!.R!.R!.R!.R!.jointPoint[0] + this.bodyLocation[0],
                y: this.root!.L!.R!.R!.R!.R!.R!.jointPoint[1] + this.bodyLocation[1],
                z: this.root!.L!.R!.R!.R!.R!.R!.jointPoint[2] + this.bodyLocation[2],
            }
        );
    }
}
