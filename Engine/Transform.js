import Matrix from "./Matrix.js";

class Transform
{
    constructor()
    {
        this.childs = [];
        this.parent = null;

        this.localSpace = mat4.create();
        this.worldSpace = mat4.create();

        this.worldChanged = true;
        this.localChanged = true;

        this.position = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
        this.rotationQuaternion = quat.create();
        quat.fromEuler(this.rotationQuaternion, 0, 0, 0);
    }

    getWorldSpaceMatrix()
    {
        if (this.localChanged || this.worldChanged)
        {
            if (this.localChanged)
            {
                mat4.fromRotationTranslationScale(this.localSpace, this.rotationQuaternion, this.position, this.scale);
                this.localChanged = false;
            }

            if (this.parent)
            {
                mat4.multiply(this.worldSpace, this.parent.getWorldSpaceMatrix(), this.localSpace);
            }
            else
            {
                mat4.copy(this.worldSpace, this.localSpace);
            }

            this.worldChanged = false;
        }

        return this.worldSpace;
    }

    setParent(parent)
    {
        this.parent = parent;
        parent.childs.push(this);
    }

    addChild(child)
    {
        child.parent = this;
        this.childs.push(child);
    }

    setLocalChanged()
    {
        this.localChanged = true;
        this.childs.forEach((child) => child.setWorldChanged());
    }

    setWorldChanged()
    {
        this.worldChanged = true;
        this.childs.forEach((child) => child.setWorldChanged());
    }

    setPosition(position)
    {
        this.position = position;
        this.setLocalChanged();
    }

    translate(translation)
    {
        this.position = vec3.add(this.position, this.position, translation);
        this.setLocalChanged();
    }

    setAxisAngle(angle, axis)
    {
        quat.setAxisAngle(this.rotationQuaternion, axis, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotateX(angle)
    {
        quat.rotateX(this.rotationQuaternion, this.rotationQuaternion, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotateY(angle)
    {
        quat.rotateY(this.rotationQuaternion, this.rotationQuaternion, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotateZ(angle)
    {
        quat.rotateZ(this.rotationQuaternion, this.rotationQuaternion, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotate(angle, axis)
    {
        if (axis[0] == 1)
        {
            this.rotateX(angle);
        }

        if (axis[1] == 1)
        {
            this.rotateY(angle);
        }

        if (axis[2] == 1)
        {
            this.rotateZ(angle);
        }

        this.setLocalChanged();
    }

    setScale(scale)
    {
        this.scale = scale;
        this.setLocalChanged();
    }

    relativeScale(factor)
    {
        this.scale[0] *= factor[0];
        this.scale[1] *= factor[1];
        this.scale[2] *= factor[2];

        this.setLocalChanged();
    }

    scale(factor)
    {
        vec3.scale(this.scale, this.scale, factor);
        this.setLocalChanged();
    }
}

export default Transform