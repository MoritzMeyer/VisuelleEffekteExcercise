import Webgl from "../Engine/Webgl.js";
import Renderer from "../Engine/Renderer.js";
import Camera from "../Engine/Camera.js";
import Color from "../Engine/Color.js";
import Shader from "../Engine/Shader.js";
import Cube3D from "../Engine/GameObjects/Cube3D.js";
import Sphere3D from "../Engine/GameObjects/Sphere3D.js";
import OBJ from "../Engine/OBJ.js";



// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();
renderer.enableBlending();

Webgl.addNavigationListener(canvas, camera);
Webgl.addCameraRotation(canvas, camera);
//Webgl.addCameraExamine(canvas, camera);
camera.gameObject.transform.translate([0, 0, -10.0]);
//camera.viewMatrix.rotateX(35);

let cube = new Cube3D(new Color(Shader.getDefaultColorShader(false), [0.8, 0, 0], 0.5));
let sphere = new Sphere3D(new Color(Shader.getDefaultColorShader(false), [0, 0, 0.8], 0.5));
let capsule = new OBJ("./textures/capsule/capsule.obj", 1, false, null);

cube.gameObject.transform.translate([-4, 0, 0]);
sphere.gameObject.transform.translate([2, 0, 0]);

let elements = [cube, sphere];

capsule.checkLoaded(() =>
{
    capsule.gameObject.transform.rotateX(90);
    capsule.gameObject.transform.translate([-1, 0, 0]);
    capsule.gameObject.material.setAlpha(0.5);
});

requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);

    if (capsule.isLoaded)
    {
        elements.push(capsule);
    }

    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}
