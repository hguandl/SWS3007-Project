"use strict";

function Props(name, iconFile, description) {
    this.mName = name;
    this.mIcon = new TextureRenderable(iconFile);
    this.mIcon.setColor([1, 1, 1, 0]);
    this.mIcon.getXform().setPosition(-200, -200);
    this.mDescription = description;

    this.mNameText = new FontRenderable(name);
    this.mDescriptionText = new FontRenderable(description);
}

Props.prototype.getName = function () {
    return this.mName;
};

Props.prototype.drawIconByPos = function (centerX, centerY, width, height, aCamera) {
    this.mIcon.getXform().setPosition(centerX, centerY);
    this.mIcon.getXform().setSize(width, height);
    this.mIcon.draw(aCamera);
};

// left-top position: [leftX, topY]
Props.prototype.showNameByPos = function (fontType, leftX, topY, color, textH, aCamera) {
    this.mNameText.setFont(fontType);
    this.mNameText.setColor(color);
    this.mNameText.getXform().setPosition(leftX, topY);
    this.mNameText.setTextHeight(textH);
    this.mNameText.draw(aCamera);
};

// font: the font type; left-top position: [leftX, topY]
Props.prototype.showInfoByPos = function (fontType, leftX, topY, color, textH, aCamera) {
    this.mDescriptionText.setFont(fontType);
    this.mDescriptionText.setColor(color);
    this.mDescriptionText.getXform().setPosition(leftX, topY);
    this.mDescriptionText.setTextHeight(textH);
    this.mDescriptionText.draw(aCamera);
};
