import { Control } from '.';
import { ModelManager } from '../model';

export default class ModelControl {
    private cloneable: HTMLElement;
    private container: HTMLElement;

    constructor(private readonly parent: Control) {
        this.cloneable = document.getElementById('model-clone') as HTMLElement;
        this.container = document.getElementById('model-container') as HTMLElement;
        this.refresh();
    }

    private refresh(): void {
        ModelManager.getModelName().forEach((x) => {
            if (x === 'cube') return;

            this.add(x);
        });
    }

    public add(content: string) {
        const cloned: HTMLElement = this.cloneable.cloneNode(true) as HTMLElement;
        const button: HTMLElement = cloned.childNodes[1] as HTMLElement;
        button.innerText = content;
        button.id = 'model-btn-' + (this.container.childNodes.length - 2);
        cloned.addEventListener('click', this.onModelButtonClicked.bind(this));
        this.container.appendChild(cloned);
    }

    private onModelButtonClicked(e: MouseEvent): void {
        const button: HTMLElement = e.target as EventTarget as HTMLElement;
        const model = ModelManager.load(button.innerText.toLowerCase());
        if (!model) {
            this.container.removeChild(button.parentElement as HTMLElement);
            alert('Model not found.');
        }
        this.parent.onInputChanged();
    }

    public clear() {
        const childs = this.container.childNodes;
        for (var iterator of Array.prototype.slice.call(childs)) {
            const child: HTMLElement = iterator as HTMLElement;
            const button: HTMLElement = child.childNodes[1] as HTMLElement;
            if (!button || button.id === 'model-btn') {
                continue;
            }

            this.container.removeChild(iterator);
        }
        this.refresh();
    }
}
