import GameObject from "../GameObject.js";
import VertexBuffer from "../VertexBuffer.js";
import Drawable from "../Drawable.js";
import Color from "../Color.js";
import Shader from "../Shader.js";

const positions =
[
    // vordere Fläche
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // hintere Fläche
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // obere Fläche
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // untere Fläche
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // rechte Fläche
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // linke Fläche
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
];

const indices = [
    0,  1,  2,      0,  2,  3,    // vorne
    4,  5,  6,      4,  6,  7,    // hinten
    8,  9,  10,     8,  10, 11,   // oben
    12, 13, 14,     12, 14, 15,   // unten
    16, 17, 18,     16, 18, 19,   // rechts
    20, 21, 22,     20, 22, 23    // links
];

const colors = [0.7, 0.0, 0.0, 1.0];

class Cube3D extends GameObject
{
    constructor(material)
    {
        if (!material)
        {
            const shader = Shader.getDefaultShader();
            material = new Color("uColor", shader, colors);
        }

        const vertexBuffer = new VertexBuffer(positions, 3);
        const drawable = new Drawable(vertexBuffer, indices, material);
        super(positions, indices, drawable);
    }
}
export default Cube3D;