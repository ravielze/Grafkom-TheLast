import { Control } from '.';
import { Vec3 } from '../types';

export class AnimationControl {
    private then: DOMHighResTimeStamp = 0;
    public rotation: Vec3 = {
        x: Control.ROTATION_DEFAULT_VALUE,
        y: Control.ROTATION_DEFAULT_VALUE,
        z: Control.ROTATION_DEFAULT_VALUE,
    };

    constructor(private readonly control: Control) {
        window.requestAnimationFrame(this.tick.bind(this));
    }

    public reset(): void {
        this.rotation = {
            x: Control.ROTATION_DEFAULT_VALUE,
            y: Control.ROTATION_DEFAULT_VALUE,
            z: Control.ROTATION_DEFAULT_VALUE,
        };
    }

    public tick(now: DOMHighResTimeStamp): void {
        now *= 0.025;
        const delta = now - this.then;
        this.then = now;

        const { x, y, z } = this.control.autoRotation;
        if (x) {
            this.rotation.x += delta;
            this.rotation.x = this.rotation.x % 360;
        }
        if (y) {
            this.rotation.y += delta;
            this.rotation.y = this.rotation.y % 360;
        }
        if (z) {
            this.rotation.z += delta;
            this.rotation.z = this.rotation.z % 360;
        }

        this.control.onInputChanged();
        window.requestAnimationFrame(this.tick.bind(this));
    }
}
