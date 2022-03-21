import { Control } from './control';
import './style.css';
import { WebGL } from './webgl';

// Program State
const canvas = document.getElementById('canvas-object') as HTMLCanvasElement;
const gl = canvas.getContext('webgl');
if (!gl) {
    alert('WebGL is not supported in your machine/browser.');
}
const webGL: WebGL = new WebGL(gl);
const control: Control = new Control((e: Event) => {});
