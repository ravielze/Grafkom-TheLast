import { ModelManager } from '../model';
import { ProjectionMode, Vec2, Vec3 } from '../types';
import ModelControl from './model-control';

export class Control {
    private static readonly ROTATION_DEFAULT_VALUE: number = 0;
    private static readonly SCALE_DEFAULT_VALUE: number = 1;
    private static readonly TRANSLATION_DEFAULT_VALUE: number = 0;
    private static readonly CAMERA_DISTANCE_DEFAULT_VALUE: number = 2;
    private static readonly NEAR_DEFAULT_VALUE: number = 1;
    private static readonly FAR_DEFAULT_VALUE: number = 50;

    public light: Vec3 = {
        x: Control.ROTATION_DEFAULT_VALUE,
        y: Control.ROTATION_DEFAULT_VALUE,
        z: Control.ROTATION_DEFAULT_VALUE,
    };

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
    public projectionMode: ProjectionMode = ProjectionMode.Perspective;

    public cameraRotation: Vec2 = {
        x: Control.ROTATION_DEFAULT_VALUE,
        y: Control.ROTATION_DEFAULT_VALUE,
    };
    public cameraDistance: number = Control.CAMERA_DISTANCE_DEFAULT_VALUE;
    public near: number = Control.NEAR_DEFAULT_VALUE;
    public far: number = Control.FAR_DEFAULT_VALUE;
    private readonly modelControl: ModelControl = new ModelControl(this);

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
        'x-light',
        'y-light',
        'z-light',
    ];

    private static readonly PROJECTION_BUTTON_MAPS: { [key: string]: ProjectionMode } = {
        oblique: ProjectionMode.Oblique,
        perspective: ProjectionMode.Perspective,
        orthographic: ProjectionMode.Orthographic,
    };
    public onInputChanged: (e: Event) => void = (): void => {};

    constructor() {
        this.update();
        this.getElement('model-btn').addEventListener('click', (e: MouseEvent) => {
            ModelManager.load('cube');
            this.onInputChanged(e);
        });

        this.getElement('model-file').addEventListener('change', this.onModelFileLoaded.bind(this));

        this.getElement('download-btn').addEventListener('click', () => {
            ModelManager.saveToFile();
        });

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
                this.onInputChanged(ev);
            });
        });

        Object.entries(Control.PROJECTION_BUTTON_MAPS).forEach((each) => {
            const [id, mode] = each;
            this.getElement(id).addEventListener(
                'click',
                this.onProjectionModeButtonClicked(mode).bind(this)
            );
        });
    }

    private update(): void {
        this.rotation.x = this.getNumber('x-rotation');
        this.rotation.y = this.getNumber('y-rotation');
        this.rotation.z = this.getNumber('z-rotation');
        this.light.x = this.getNumber('x-light');
        this.light.y = this.getNumber('y-light');
        this.light.z = this.getNumber('z-light');
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

    private onModelFileLoaded(): void {
        const fileInput = this.getElement('model-file');

        if (!fileInput.files) {
            return;
        }

        const data = fileInput.files[0];

        if (!data) {
            alert('File is not found.');
            return;
        }

        const reader = new FileReader();
        const fileName = data.name.replace('.json', '').toLowerCase();
        reader.onload = (e) => {
            var result: any = {};
            try {
                result = JSON.parse((e.target as FileReader).result as string);
            } catch (e) {
                alert('Failed to parse file as JSON.');
                return;
            }
            if (!result) {
                return;
            }

            const [loaded, fixedFileName] = ModelManager.loadFromFile(fileName, result);
            if (loaded) {
                this.onInputChanged(e);
                this.modelControl.add(fixedFileName);
            }
        };

        reader.readAsText(data);
    }

    private onProjectionModeButtonClicked(mode: ProjectionMode): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            this.projectionMode = mode;
            this.onInputChanged(e);
            e.preventDefault();
        };
    }

    private onToggleShadersButtonClicked(e: MouseEvent): void {
        this.useShader = !this.useShader;
        this.onInputChanged(e);
        e.preventDefault();
    }

    private onResetButtonClicked(e: MouseEvent): void {
        this.modelControl.clear();
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
        this.setNumber('x-light', Control.ROTATION_DEFAULT_VALUE);
        this.setNumber('y-light', Control.ROTATION_DEFAULT_VALUE);
        this.setNumber('z-light', Control.ROTATION_DEFAULT_VALUE);
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
