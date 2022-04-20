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
import { NodePoint, TextureFaceInfo } from '../node-point';
import texture  from '../../texture/env.jpg';

export class HumanSkeleton extends Renderer {
    constructor(webGL: WebGL, public human: Human) {
        super(webGL, 2, human.root!);
    }
}

export class Human extends Model {
    public centers: NumberContainer;
    public skeletons: FloatContainer;
    public colors: FloatContainer;
    public jointPoints: NumberContainer;
    public textures: TextureFaceInfo;
    public textureCoords: FloatContainer;
    public normals: FloatContainer;
    public tangents: FloatContainer;
    public bitangents: FloatContainer;
    public inRotation: ConstantContainer;
    public bodyLocation: number[];
    public root?: NodePoint;
    public rotation: number;

    constructor(private webGL: WebGL) {
        super();

        const cubeSize = 2;
        const bodyShape = [0.8, 0.6, 0.4];
        const headShape = [1, 1, 0.8];
        const handLeftShape = [0.1, 0.5, 0.1];
        const handRightShape = [0.1, 0.5, 0.1];
        const legShape = [0.1, 0.5, 0.1];

        const kScaleBody = [bodyShape[0]/cubeSize, bodyShape[1]/cubeSize, bodyShape[2]/cubeSize]
        const kScaleHead = [headShape[0]/cubeSize, headShape[1]/cubeSize, headShape[2]/cubeSize]
        const kScaleHand1 = [handLeftShape[0]/cubeSize, handLeftShape[1]/cubeSize, handLeftShape[2]/cubeSize]
        const kScaleHand2 = [handRightShape[0]/cubeSize, handRightShape[1]/cubeSize, handRightShape[2]/cubeSize]
        const kScaleLeg = [legShape[0]/cubeSize, legShape[1]/cubeSize, legShape[2]/cubeSize]

        const translateBody = [0, 0, 0];
        const translateFrontLeg = {
            'left': [translateBody[0]+0.2, translateBody[1]-0.4,translateBody[2]],
            'right': [translateBody[0]-0.2, translateBody[1]-0.4,translateBody[2]],
        }
        const translateHead = [0, 0.5, 0];
        const translateHand1 = [translateBody[0]+0.55,translateBody[1],translateBody[2]];
        const translateHand2 = [translateBody[0]-0.55,translateBody[1],translateBody[2]];

        const body = CubeOperation.scale(CUBE_POSITIONS, {x:kScaleBody[0], y:kScaleBody[1], z:kScaleBody[2]})
        const head = CubeOperation.scale(CUBE_POSITIONS, {x:kScaleHead[0], y:kScaleHead[1], z:kScaleHead[2]})
        const leg = CubeOperation.scale(CUBE_POSITIONS, {x:kScaleLeg[0], y:kScaleLeg[1], z:kScaleLeg[2]})
        const hand1 = CubeOperation.scale(CUBE_POSITIONS, {x:kScaleHand1[0], y:kScaleHand1[1], z:kScaleHand1[2]})
        const hand2 = CubeOperation.scale(CUBE_POSITIONS, {x:kScaleHand2[0], y:kScaleHand2[1], z:kScaleHand2[2]})

        this.centers = {
            'body': translateBody,
            'leg-front-left': translateFrontLeg['left'],
            'leg-front-right': translateFrontLeg['right'],
            'head': translateHead,
            'hand2': translateHand2,
            'hand1': translateHand1,
        }

        this.skeletons = {
            'body': CubeOperation.translate(body, {x:this.centers['body'][0], y:this.centers['body'][1], z:this.centers['body'][2]}),
            'head': CubeOperation.translate(head, {x:this.centers['body'][0], y:this.centers['body'][1]+0.6, z:this.centers['body'][2]}),
            'leg-front-left': CubeOperation.translate(leg, {x:this.centers['leg-front-left'][0], y:this.centers['leg-front-left'][1], z:this.centers['leg-front-left'][2]}),
            'leg-front-right': CubeOperation.translate(leg, {x:this.centers['leg-front-right'][0], y:this.centers['leg-front-right'][1], z:this.centers['leg-front-right'][2]}),
            'hand1': CubeOperation.translate(hand1, {x:this.centers['hand1'][0], y:this.centers['hand1'][1], z:this.centers['hand1'][2]}),
            'hand2': CubeOperation.translate(hand2, {x:this.centers['hand2'][0], y:this.centers['hand2'][1], z:this.centers['hand2'][2]}),
        } 

        this.colors = {
            'body': new Float32Array(CubeOperation.colorFactory(this.skeletons['body'], 1, 0, 0)),
            'head': new Float32Array(CubeOperation.colorFactory(this.skeletons['head'], 0, 1, 0)),
            'leg-front-left': new Float32Array(CubeOperation.colorFactory(this.skeletons['leg-front-left'], 1, 1, 0)),
            'leg-front-right': new Float32Array(CubeOperation.colorFactory(this.skeletons['leg-front-right'], 1, 0, 1)),
            'hand1': new Float32Array(CubeOperation.colorFactory(this.skeletons['hand1'], 0, 1, 1)),
            'hand2': new Float32Array(CubeOperation.colorFactory(this.skeletons['hand2'], 1, 0, 1))
        };

        this.jointPoints = {
            'body': this.centers['body'],
            'head': [this.centers['body'][0], this.centers['body'][1]+0.6, this.centers['body'][2]],
            'leg-front-left': this.centers['leg-front-left'],
            'leg-front-right': this.centers['leg-front-right'],
            'hand1': [this.centers['hand1'][0], this.centers['body'][1], this.centers['hand1'][2]],
            'hand2': [this.centers['hand2'][0], this.centers['body'][1], this.centers['hand2'][2]],
        }

        this.normals = {
            'body': CubeOperation.getNormal(this.skeletons['body']),
            'head': CubeOperation.getNormal(this.skeletons['head']),
            'leg-front-left': CubeOperation.getNormal(this.skeletons['leg-front-left']),
            'leg-front-right': CubeOperation.getNormal(this.skeletons['leg-front-right']),
            'hand1': CubeOperation.getNormal(this.skeletons['hand1']),
            'hand2': CubeOperation.getNormal(this.skeletons['hand2']),
        }
        this.textureCoords = {
            'body': CUBE_TEXTURE_COORDINATES,
            'head': CUBE_TEXTURE_COORDINATES,
            'leg-front-left': CUBE_TEXTURE_COORDINATES,
            'leg-front-right': CUBE_TEXTURE_COORDINATES,
            'hand1': CUBE_TEXTURE_COORDINATES,
            'hand2': CUBE_TEXTURE_COORDINATES,
        }

        this.tangents = {
            'body': CubeOperation.getTangent(this.skeletons['body']),
            'head': CubeOperation.getTangent(this.skeletons['head']),
            'leg-front-left': CubeOperation.getTangent(this.skeletons['leg-front-left']),
            'leg-front-right': CubeOperation.getTangent(this.skeletons['leg-front-right']),
            'hand1': CubeOperation.getTangent(this.skeletons['hand1']),
            'hand2': CubeOperation.getTangent(this.skeletons['hand2']),
        }

        this.bitangents = {
            'body': CubeOperation.getBitangent(this.skeletons['body']),
            'head': CubeOperation.getBitangent(this.skeletons['head']),
            'leg-front-left': CubeOperation.getBitangent(this.skeletons['leg-front-left']),
            'leg-front-right': CubeOperation.getBitangent(this.skeletons['leg-front-right']),
            'hand1': CubeOperation.getBitangent(this.skeletons['hand1']),
            'hand2': CubeOperation.getBitangent(this.skeletons['hand2']),
        }

        this.inRotation = {
            'body': {'x': 0, 'y': 0, 'z': 0},
            'head': {'x': 0, 'y': 0, 'z': 0},
            'leg-front-left': {'x': 0, 'y': 0, 'z': 0},
            'leg-front-right': {'x': 0, 'y': 0, 'z': 0},
            'hand1': {'x': 0, 'y': 0, 'z': 0},
            'hand2': {'x': 0, 'y': 0, 'z': 0},
        }

        this.bodyLocation = [2, 0, 0];

        this.textures = [
            {
            target: this.webGL.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            imageData: texture,
        },
        {
            target: this.webGL.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            imageData: texture,
        },
        {
            target: this.webGL.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            imageData: texture,
        },
        {
            target: this.webGL.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            imageData: texture,
        },
        {
            target: this.webGL.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            imageData: texture,
        },
        {
            target: this.webGL.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            imageData: texture,
        },];

        //this.createTree();
        this.rotation = 0;
        this.bodyLocation = [-1, -2, -1];

        // this.createTree()
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
                this.textures,
                this.textureCoords[k],
                k
            );
        }

        this.root = skeletonNodes['body'];
        this.root.L! = skeletonNodes['head'];
        this.root.L!.R! = skeletonNodes['leg-front-left'] 
        this.root.L!.R!.R! = skeletonNodes['leg-front-right']
        this.root.L!.R!.R!.R! = skeletonNodes['hand1']
        this.root.L!.R!.R!.R!.R! = skeletonNodes['hand2']

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
                [1]
            ]
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

    distributeRotation(val: number) {
        this.inRotation['leg-front-left']['x'] = val
        this.inRotation['leg-front-right']['x'] = -val
        this.inRotation['head']['x'] = val
        this.inRotation['body']['x'] = val
        this.inRotation['hand1']['x'] = val
        this.inRotation['hand2']['x'] = -val
    }

    transformModel() {
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

    updateAnimation() {
        this.root!.L!.baseTransform = DefaultMatrix.rotate({x:this.inRotation['head']['x'], y:this.inRotation['head']['y'], z:this.inRotation['head']['z']}, {x:0, y:0, z:0})
        this.root!.L!.R!.baseTransform = DefaultMatrix.rotate({x:this.inRotation['hand1']['x'], y:this.inRotation['hand1']['y'], z:this.inRotation['hand1']['z']}, {x:this.root!.L!.jointPoint[0]+this.bodyLocation[0], y:this.root!.L!.jointPoint[1]+this.bodyLocation[1], z:this.root!.L!.jointPoint[2]+this.bodyLocation[2]})
        this.root!.L!.R!.R!.baseTransform = DefaultMatrix.rotate(
            {x:this.inRotation['hand2']['x'], y:this.inRotation['hand2']['y'], z:this.inRotation['hand2']['z']}, {x:this.root!.L!.R!.jointPoint[0]+this.bodyLocation[0], y:this.root!.L!.R!.jointPoint[1]+this.bodyLocation[1], z:this.root!.L!.R!.jointPoint[2]+this.bodyLocation[2]})
        this.root!.L!.R!.R!.R!.baseTransform = DefaultMatrix.rotate(
            {x:this.inRotation['leg-front-left']['x'], y:this.inRotation['leg-front-left']['y'], z:this.inRotation['leg-front-left']['z']}, {x:this.root!.L!.R!.R!.jointPoint[0]+this.bodyLocation[0], y:this.root!.L!.R!.R!.jointPoint[1]+this.bodyLocation[1], z:this.root!.L!.R!.R!.jointPoint[2]+this.bodyLocation[2]})
        this.root!.L!.R!.R!.R!.R!.baseTransform = DefaultMatrix.rotate({x:this.inRotation['leg-front-right']['x'], y:this.inRotation['leg-front-right']['y'], z:this.inRotation['leg-front-right']['z']}, {x:this.root!.L!.R!.R!.R!.jointPoint[0]+this.bodyLocation[0], y:this.root!.L!.R!.R!.R!.jointPoint[1]+this.bodyLocation[1], z:this.root!.L!.R!.R!.R!.jointPoint[2]+this.bodyLocation[2]})
    }
}
