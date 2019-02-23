import Material from "./Renderer/Material.js";
import Webgl from "./Renderer/Webgl.js";
import Renderer from "./Renderer/Renderer.js";
import Shader from "./Renderer/Shader.js";
import VertexBuffer from "./Renderer/VertexBuffer.js";
import Color from "./Renderer/Color.js";
import Drawable from "./Renderer/Drawable.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
const gl = Webgl.getGL();

const vsSource =
`
    attribute vec3 aPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }
`;
/*
const vsSource =
`
    attribute vec3 position;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(position, 1.0);
}
`;
*/

const fsSource = 
`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec3 uColor;
    void main() {
        gl_FragColor = vec4(uColor, 1.0);
}`;

let positions =
[
    // pointer minutes
     0.04, 0,
    -0.04,  1.65,
     0.04,  1.65,
    -0.04, 0,

    // pointer seconds
     0.025, 0,
    -0.025, 1.85,
     0.025, 1.85,
    -0.025, 0,

    // triangle minutes
    -0.04, 1.65,
     0, 1.75,
     0.04, 1.65,

    // triangle seconds
    -0.025, 1.85,
     0, 1.95,
     0.025, 1.85
];

// color Arrays
let minutesColors = [0.0, 0.8, 0.0];
let secondsColors = [0.8, 0.0, 0.0];

// Index Arrays
let indicesMinutes = [0, 1, 2, 0, 1 , 3, 8, 9, 10];
let indicesSeconds = [4, 5, 6, 4, 5, 7, 11, 12, 13];

let canvasColor = [0.0, 0.0, 0.0, 0.0];

// Renderer erzeugen und canvas initialisieren
let renderer = new Renderer();
renderer.clear(canvas, canvasColor);
const vertexBuffer = new VertexBuffer(positions, 2);

// initialize MinutesPointer data
// create projectionMatrix
const fieldOfView = 45 * Math.PI / 180; // degree to radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 100.0;
const projectionMatrixMinutes = mat4.create();

mat4.perspective(projectionMatrixMinutes, fieldOfView, aspect, zNear, zFar);

// create modelViewMatrix
const modelViewMatrixMinutes = mat4.create();
mat4.translate(modelViewMatrixMinutes, modelViewMatrixMinutes, [0.0, 0.0, -6.0]);

// shader
let shaderMinutePointer = new Shader(vsSource, fsSource);
let colorMinutePointer = new Color("uColor", shaderMinutePointer, minutesColors);
let drawableMinutePointer = new Drawable(vertexBuffer, indicesMinutes, colorMinutePointer);

shaderMinutePointer.bind();
shaderMinutePointer.setUniformMatrix4fv("uProjectionMatrix", false, projectionMatrixMinutes);
shaderMinutePointer.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrixMinutes);

// initialize SecondsPointer data
// create projectionMatrix
const projectionMatrixSeconds = mat4.create();

mat4.perspective(projectionMatrixSeconds, fieldOfView, aspect, zNear, zFar);

// create modelViewMatrix
const modelViewMatrixSeconds = mat4.create();
mat4.translate(modelViewMatrixSeconds, modelViewMatrixSeconds, [0.0, 0.0, -6.0]);

// shader
let shaderSecondsPointer = new Shader(vsSource, fsSource);
let colorSecondsPointer = new Color("uColor", shaderSecondsPointer, secondsColors);
let drawableSecondsPointer = new Drawable(vertexBuffer, indicesSeconds, colorSecondsPointer);

shaderSecondsPointer.bind();
shaderSecondsPointer.setUniformMatrix4fv("uProjectionMatrix", false, projectionMatrixSeconds);
shaderSecondsPointer.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrixSeconds);


let then = 0;
let secondsCounter = 0;
let minutesCounter = 0;

requestAnimationFrame(render);

function render(now)
{
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    secondsCounter += deltaTime;
    minutesCounter += deltaTime;

    // rotate seconds pointer
    if (secondsCounter >= 1)
    {
        mat4.rotate(modelViewMatrixSeconds, // destination matrix
                    modelViewMatrixSeconds, // matrix to rotate
                    -6 * Math.PI / 180,      // amount to rotate in radians
                    [0, 0, 1]);             // axis to rotate around (z axis)

        drawableSecondsPointer.material.shader.bind();
        drawableSecondsPointer.material.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrixSeconds);
        secondsCounter = 0;
    }


    // rotate minutes counter
    if (minutesCounter >= 60)
    {
        mat4.rotate(modelViewMatrixMinutes, // destination matrix
                    modelViewMatrixMinutes, // matrix to rotate
                    -6 * Math.PI / 180,      // amount to rotate in radians
                    [0, 0, 1]);             // axis to rotate around (z axis)

        shaderMinutePointer.material.shader.bind();
        shaderMinutePointer.material.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrixMinutes);
        minutesCounter = 0;
    }


    // Draw Minutes & SecondsPointer
    renderer.clear(canvas, canvasColor);
    renderer.drawDrawable(drawableSecondsPointer);
    renderer.drawDrawable(drawableMinutePointer);
    requestAnimationFrame(render);
}



