"use strict";

function Props(name, iconFile, description) {
    this.mName = name;
    this.mIcon = null;
    this.mDescription = description;

    this.mIcon = new TextureRenderable(iconFile);
    this.mIcon.setColor([1, 1, 1, 0]);
    this.mIcon.getXform().setPosition(-200, -200);
}

Props.prototype.drawIconByPos = function (centerX, centerY, width, height, aCamera) {
    this.mIcon.getXform().setPosition(centerX, centerY);
    this.mIcon.getXform().setSize(width, height);
    this.mIcon.draw(aCamera);
};
