import RenderObject from "../RenderObject.js";
import Shader from "../Shader.js";
import Color from "../Color.js";
import VertexBuffer from "../VertexBuffer.js";
import GameObject from "../GameObject.js";
import PBRTexture from "../PBRTexture.js";

const colors = [0.0, 0.0, 0.8];

class Sphere3D extends RenderObject
{
    constructor(material, sphereDiv = 18)
    {
        let rawData = Sphere3D.CalcSphereData(sphereDiv);

        if (!material)
        {
            const shader = Shader.getDefaultColorShader(false);
            material = new Color(shader, colors);
        }

        if (material.isTexture)
        {
            let texCoordsBuffer = new VertexBuffer(rawData["texCoords"], 2);
            material.setTextureCoords(texCoordsBuffer);
        }

        Sphere3D.waitUntilLoaded(material);
        /*
        let waitUntilLoaded = setInterval(() =>
        {
            if (!material.loaded)
            {
                console.log("PBR-Texture loaded");
                clearInterval(waitUntilLoaded);
            }
        }, 100);
        */


        const vertexBuffer = new VertexBuffer(rawData["vertices"], 3);
        const normalsBuffer = new VertexBuffer(rawData["normals"], 3);
        const gameObject = new GameObject(vertexBuffer, rawData["indices"], material, false, normalsBuffer);
        super(rawData["vertices"], rawData["indices"], gameObject);
    }

    static waitUntilLoaded(material)
    {
        if (!material.loaded)
        {
            setTimeout(() => Sphere3D.waitUntilLoaded(material), 100);
        }
    }

    static CalcSphereData(sphereDiv)
    {
        let SPHERE_DIV = sphereDiv;
        let i, ai, si, ci;
        let j, aj, sj, cj;
        let x, y, z;
        let p1, p2;
        let vertices = [],indices = [], normals = [], texCoords = [];

        // calc vertices
        for (j = 0; j <= SPHERE_DIV; j++)
        {
            aj = j * Math.PI / SPHERE_DIV;
            sj = Math.sin(aj);
            cj = Math.cos(aj);
            for (i = 0; i <= SPHERE_DIV; i++)
            {
                ai = i * 2 * Math.PI / SPHERE_DIV;
                si = Math.sin(ai);
                ci = Math.cos(ai);

                texCoords.push(ai);
                texCoords.push(aj);

                x = si * sj;   // x
                y = cj;        // y
                z = ci * sj;   // z

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                // calc normal
                let vertex = vec3.fromValues(x, y, z);
                let normal = vec3.create();
                //vec3.negate(vertex, vertex);
                vec3.normalize(normal, vertex);

                normals.push(normal[0]);
                normals.push(normal[1]);
                normals.push(normal[2]);
            }
        }

        // calc indices
        for (j = 0; j < SPHERE_DIV; j++)
        {
            for (i = 0; i < SPHERE_DIV; i++)
            {
                p1 = j * (SPHERE_DIV+1) + i;
                p2 = p1 + (SPHERE_DIV+1);
                indices.push(p1);
                indices.push(p2);
                indices.push(p1 + 1);
                indices.push(p1 + 1);
                indices.push(p2);
                indices.push(p2 + 1);
            }
        }

        return {"vertices": vertices, "indices" : indices, "normals": normals, "texCoords": texCoords};
    }

    static getRustedIronSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/rustediron/rustediron2_basecolor.png";
        let metallicPath = "./PBR_Materials/rustediron/rustediron2_metallic.png";
        let roughnessPath = "./PBR_Materials/rustediron/rustediron2_roughness.png";
        let normalPath = "./PBR_Materials/rustediron/rustediron2_normal.png";
        let ambientOcclusionPath = "./PBR_Materials/ambientocclusion.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }

    static getRustedIronStreaksSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/rustediron-streaks/rustediron-streaks_basecolor.png";
        let metallicPath = "./PBR_Materials/rustediron-streaks/rustediron-streaks_metallic.png";
        let roughnessPath = "./PBR_Materials/rustediron-streaks/rustediron-streaks_roughness.png";
        let normalPath = "./PBR_Materials/rustediron-streaks/rustediron-streaks_normal.png";
        let ambientOcclusionPath = "./PBR_Materials/ambientocclusion.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }

    static getRustyPanelSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/rusty-panel/rusty-panel-albedo3b.png";
        let metallicPath = "./PBR_Materials/rusty-panel/rusty-panel-metalness3b.png";
        let roughnessPath = "./PBR_Materials/rusty-panel/rusty-panel-roughness3b.png";
        let normalPath = "./PBR_Materials/rusty-panel/rusty-panel-norma-dx.png";
        let ambientOcclusionPath = "./PBR_Materials/rusty-panel/rusty-panel-ao3.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }

    static getTitaniumSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/titanium/Titanium-Scuffed_basecolor.png";
        let metallicPath = "./PBR_Materials/titanium/Titanium-Scuffed_metallic.png";
        let roughnessPath = "./PBR_Materials/titanium/Titanium-Scuffed_roughness.png";
        let normalPath = "./PBR_Materials/titanium/Titanium-Scuffed_normal.png";
        let ambientOcclusionPath = "./PBR_Materials/ambientocclusion.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }

    static getMetalgridSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/metalgrid/metalgrid3_basecolor.png";
        let metallicPath = "./PBR_Materials/metalgrid/metalgrid3_metallic.png";
        let roughnessPath = "./PBR_Materials/metalgrid/metalgrid3_roughness.png";
        let normalPath = "./PBR_Materials/metalgrid/metalgrid3_normal-dx.png";
        let ambientOcclusionPath = "./PBR_Materials/metalgrid/metalgrid3_AO.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }

    static getGrimmyMetalSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/grimy-metal/grimy-metal-albedo.png";
        let metallicPath = "./PBR_Materials/grimy-metal/grimy-metal-metalness.png";
        let roughnessPath = "./PBR_Materials/grimy-metal/grimy-metal-roughness.png";
        let normalPath = "./PBR_Materials/grimy-metal/grimy-metal-normal-dx.png";
        let ambientOcclusionPath = "./PBR_Materials/ambientocclusion.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }

    static getGoldSphere(numberOfLights, sphereDiv)
    {
        let albedoPath = "./PBR_Materials/gold-scuffed/gold-scuffed_basecolor.png";
        let metallicPath = "./PBR_Materials/gold-scuffed/gold-scuffed_metallic.png";
        let roughnessPath = "./PBR_Materials/gold-scuffed/gold-scuffed_roughness.png";
        let normalPath = "./PBR_Materials/gold-scuffed/gold-scuffed_normal.png";
        let ambientOcclusionPath = "./PBR_Materials/ambientocclusion.png";

        return new Sphere3D(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath), sphereDiv);
    }
}
export default Sphere3D;