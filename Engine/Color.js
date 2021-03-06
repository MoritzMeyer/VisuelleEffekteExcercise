import Material from "./Material.js";

class Color extends Material
{
    constructor(shader, colors, alpha = 1.0, uniformName = "uObjectColor")
    {
        super(shader, colors, colors, colors, 16.0, alpha, uniformName);

        if (colors.length < 3 || colors.length > 4)
        {
            console.error("Colors must define 3 or 4 values");
        }

        this.colors = colors;

        // sicherstellen, dass die Farben nicht 0 sind, da ansonsten der Shader falsch berechnet
        for (let i = 0; i < this.colors.length; i++)
        {
            if (this.colors[i] <= 0)
            {
                this.colors[i] = 0.03;
            }
        }
    }

    bind()
    {
        super.bind();

        if (!this.shader.hasLightning)
        {
            if (this.colors.length < 4)
            {
                this.shader.setUniform3f(this.uniformName, this.colors[0], this.colors[1], this.colors[2]);
            }
            else
            {
                this.shader.setUniform4f(this.uniformName, this.colors[0], this.colors[1], this.colors[2], this.colors[3]);
            }
        }
    }
}

export default Color;