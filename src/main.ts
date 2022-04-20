import { Control } from './control';
import './style.css';
import { WebGL } from './webgl';

const canvas = document.getElementById('canvas-object') as HTMLCanvasElement;
const ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;
const scale = 0.9;
canvas.width = 1500 * ratio * scale;
canvas.height = 1000 * ratio * scale;
var gl: WebGLRenderingContext | null = canvas.getContext('webgl');
const ext: OES_standard_derivatives | null = gl!.getExtension('OES_standard_derivatives');
if (gl == null || ext == null) {
    alert('WebGL is not supported in your machine/browser.');
}
const control: Control = new Control();
const wgl = new WebGL(gl as WebGLRenderingContext, control, canvas);
control.onInputChanged = () => {
    wgl.render();
};
// const control: Control = new Control();
// const drawer: Drawer = new Drawer(control);
// const webGL: WebGL = new WebGL(gl, drawer, control);
// control.onInputChanged = () => {
//     webGL.loadModel();
//     drawer.calculateCameraProjection();
//     drawer.calculateTransformation();
//     webGL.draw();
// };
// webGL.start();

// const animation = () => {
//     console.log('x');
//     window.requestAnimationFrame(animation);
// };
// window.requestAnimationFrame(animation);
