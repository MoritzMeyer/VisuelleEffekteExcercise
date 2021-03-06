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
        this.recalcWorldSpaceMatrix();
        return this.worldSpace;
    }

    getLocalSpaceMatrix()
    {
        this.recalcLocalSpaceMatrix();
        return this.localSpace;
    }

    recalcLocalSpaceMatrix()
    {
        if (this.localChanged)
        {
            mat4.fromRotationTranslationScale(this.localSpace, this.rotationQuaternion, this.position, this.scale);
            this.localChanged = false;
        }
    }

    recalcWorldSpaceMatrix()
    {
        if (this.localChanged || this.worldChanged)
        {
            if (this.parent)
            {
                mat4.multiply(this.worldSpace, this.parent.getWorldSpaceMatrix(), this.getLocalSpaceMatrix());
            }
            else
            {
                mat4.copy(this.worldSpace, this.getLocalSpaceMatrix());
            }

            this.worldChanged = false;
        }
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
        this.position = vec3.fromValues(position[0], position[1], position[2]);
        this.setLocalChanged();
    }

    setMatrix(matrix)
    {
        mat4.getTranslation(this.position, matrix);
        mat4.getScaling(this.scale, matrix);
        mat4.getRotation(this.rotationQuaternion, matrix);
        this.setLocalChanged();
    }

    getWorldPosition()
    {
        let worldMat = this.getWorldSpaceMatrix();
        let position = vec3.create();
        mat4.getTranslation(position, worldMat);
        return position;
    }

    translate(trans)
    {
        let translation = vec3.fromValues(trans[0], trans[1], trans[2]);
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

    rotateRoundAxis(angle, axis)
    {
        let rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, this.getLocalSpaceMatrix(), glMatrix.toRadian(angle), vec3.fromValues(axis[0], axis[1], axis[2]));
        let rotationMat3 = mat3.create();
        mat3.fromMat4(rotationMat3, rotationMatrix);
        let rotationQuat = quat.create();
        quat.fromMat3(rotationQuat, rotationMat3);
        //quat.normalize(rotationQuat, rotationQuat);
        this.rotationQuaternion = rotationQuat;
        this.setLocalChanged();
    }

    setScale(scale)
    {
        this.scale = vec3.fromValues(scale[0], scale[1], scale[2]);
        this.setLocalChanged();
    }

    relativeScale(factor)
    {
        this.scale[0] *= factor[0];
        this.scale[1] *= factor[1];
        this.scale[2] *= factor[2];

        this.setLocalChanged();
    }

    scaleByFactor(factor)
    {
        vec3.scale(this.scale, this.scale, factor);
        this.setLocalChanged();
    }
}

export default Transform