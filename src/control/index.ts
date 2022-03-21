import { Vec2, Vec3 } from '../types';

export class Control {
    private static readonly ROTATION_DEFAULT_VALUE: number = 0;
    private static readonly SCALE_DEFAULT_VALUE: number = 1;
    private static readonly TRANSLATION_DEFAULT_VALUE: number = 0;
    private static readonly CAMERA_DISTANCE_DEFAULT_VALUE: number = 2;
    private static readonly NEAR_DEFAULT_VALUE: number = 1;
    private static readonly FAR_DEFAULT_VALUE: number = 50;

    public rotation: Vec3 = {
        x: Control.ROTATION_DEFAULT_VALUE,
        y: Control.ROTATION_DEFAULT_VALUE,
        z: Control.ROTATION_DEFAULT_VALUE,
    };
    public scale: Vec3 = {
        x: Control.SCALE_DEFAULT_VALUE,
        y: Control.SCALE_DEFAULT_VALUE,
        z: Control.SCALE_DEFAULT_VALUE,
    };
    public translation: Vec3 = {
        x: Control.TRANSLATION_DEFAULT_VALUE,
        y: Control.TRANSLATION_DEFAULT_VALUE,
        z: Control.TRANSLATION_DEFAULT_VALUE,
    };
    public useShader: boolean = true;

    public cameraRotation: Vec2 = {
        x: Control.ROTATION_DEFAULT_VALUE,
        y: Control.ROTATION_DEFAULT_VALUE,
    };
    public cameraDistance: number = Control.CAMERA_DISTANCE_DEFAULT_VALUE;
    public near: number = Control.NEAR_DEFAULT_VALUE;
    public far: number = Control.FAR_DEFAULT_VALUE;

    private static readonly ELEMENT_IDS: string[] = [
        'x-rotation',
        'y-rotation',
        'z-rotation',
        'x-scale',
        'y-scale',
        'z-scale',
        'x-translation',
        'y-translation',
        'z-translation',
        'x-camrot',
        'y-camrot',
        'camdist',
        'near',
        'far',
    ];

    constructor(private readonly onInputChanged: (e: Event) => void) {
        this.update();
        //TODO button model
        //TODO camera projection
        this.getElement('reset-btn').addEventListener(
            'click',
            this.onResetButtonClicked.bind(this)
        );
        this.getElement('toggle-shading-btn').addEventListener(
            'click',
            this.onToggleShadersButtonClicked.bind(this)
        );
        Control.ELEMENT_IDS.forEach((id) => {
            this.getElement(id).addEventListener('input', (ev: Event) => {
                this.update();
                onInputChanged(ev);
            });
        });
    }

    private update(): void {
        this.rotation.x = this.getNumber('x-rotation');
        this.rotation.y = this.getNumber('y-rotation');
        this.rotation.z = this.getNumber('z-rotation');
        this.scale.x = this.getNumber('x-scale');
        this.scale.y = this.getNumber('y-scale');
        this.scale.z = this.getNumber('z-scale');
        this.translation.x = this.getNumber('x-translation');
        this.translation.y = this.getNumber('y-translation');
        this.translation.z = this.getNumber('z-translation');
        this.cameraRotation.x = this.getNumber('x-camrot');
        this.cameraRotation.y = this.getNumber('y-camrot');
        this.cameraDistance = this.getNumber('camdist');
        this.near = this.getNumber('near');
        this.far = this.getNumber('far');
    }

    private onToggleShadersButtonClicked(e: MouseEvent): void {
        this.useShader = !this.useShader;
        this.onInputChanged(e);
        e.preventDefault();
    }

    private onResetButtonClicked(e: MouseEvent): void {
        this.setNumber('x-rotation', Control.ROTATION_DEFAULT_VALUE);
        this.setNumber('y-rotation', Control.ROTATION_DEFAULT_VALUE);
        this.setNumber('z-rotation', Control.ROTATION_DEFAULT_VALUE);

        this.setNumber('x-scale', Control.SCALE_DEFAULT_VALUE);
        this.setNumber('y-scale', Control.SCALE_DEFAULT_VALUE);
        this.setNumber('z-scale', Control.SCALE_DEFAULT_VALUE);

        this.setNumber('x-translation', Control.TRANSLATION_DEFAULT_VALUE);
        this.setNumber('y-translation', Control.TRANSLATION_DEFAULT_VALUE);
        this.setNumber('z-translation', Control.TRANSLATION_DEFAULT_VALUE);

        this.setNumber('x-camrot', Control.ROTATION_DEFAULT_VALUE);
        this.setNumber('y-camrot', Control.ROTATION_DEFAULT_VALUE);
        this.setNumber('camdist', Control.CAMERA_DISTANCE_DEFAULT_VALUE);

        this.setNumber('near', Control.NEAR_DEFAULT_VALUE);
        this.setNumber('far', Control.FAR_DEFAULT_VALUE);
        this.useShader = true;

        this.update();
        this.onInputChanged(e);
        e.preventDefault();
    }

    private getNumber(elementId: string): number {
        return this.getElement(elementId).valueAsNumber;
    }

    private setNumber(elementId: string, value: number): void {
        this.getElement(elementId).valueAsNumber = value;
    }

    private getElement(elementId: string): HTMLInputElement {
        return document.getElementById(elementId) as HTMLInputElement;
    }
}
