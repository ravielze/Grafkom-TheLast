import { Control } from './control';
import './style.css';
import { WebGL } from './webgl';
import { Drawer } from './webgl/drawer';

const canvas = document.getElementById('canvas-object') as HTMLCanvasElement;
const ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;
canvas.width = 1000 * ratio;
canvas.height = 1000 * ratio;
const gl = canvas.getContext('webgl');
if (!gl) {
    alert('WebGL is not supported in your machine/browser.');
}
const control: Control = new Control();
const drawer: Drawer = new Drawer(control);
const webGL: WebGL = new WebGL(gl, drawer, control);
control.onInputChanged = () => {
    webGL.loadModel();
    drawer.calculateCameraProjection();
    drawer.calculateTransformation();
    webGL.draw();
};
webGL.start();

// const animation = () => {
//     console.log('x');
//     window.requestAnimationFrame(animation);
// };
// window.requestAnimationFrame(animation);
