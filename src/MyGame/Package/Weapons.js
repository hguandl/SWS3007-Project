"use strict";

function Weapons(name, iconFile, description, type) {
    this.mName = name;
    this.mType = type;
    this.mIcon = new TextureRenderable(iconFile);
    this.mIcon.setColor([1, 1, 1, 0]);
    this.mIcon.getXform().setPosition(-200, -200);
    this.mDescription = description;

    this.mEquipedInfo = -1;

    this.mNameText = new FontRenderable(name);
    this.mDescriptionText = new FontRenderable(description);

    this.HPadd = this.VPadd = this.ATKadd = this.DEFadd = this.SPDadd = this.EXPadd = 0;
    this.HPratio = this.VPratio = this.ATKratio = this.DEFratio = this.SPDratio = this.EXPratio = 1;
    this.Money = 50;

    switch(name) {
        case "Swore_A1" :
            this.ATKadd = 200;
            this.Money = 3000;
            break;
        case "" :
            break;
        case "" :
            break;
    }
}

Weapons.prototype.getName = function () {
    return this.mName;
};

Weapons.prototype.drawIconByPos = function (centerX, centerY, width, height, aCamera) {
    this.mIcon.getXform().setPosition(centerX, centerY);
    this.mIcon.getXform().setSize(width, height);
    this.mIcon.draw(aCamera);
};

// left-top position: [leftX, topY]
Weapons.prototype.showNameByPos = function (fontType, leftX, topY, color, textH, aCamera) {
    this.mNameText.setFont(fontType);
    this.mNameText.setColor(color);
    this.mNameText.getXform().setPosition(leftX, topY);
    this.mNameText.setTextHeight(textH);
    this.mNameText.draw(aCamera);
};

// font: the font type; left-top position: [leftX, topY]
Weapons.prototype.showInfoByPos = function (fontType, leftX, topY, color, textH, aCamera) {
    this.mDescriptionText.setFont(fontType);
    this.mDescriptionText.setColor(color);
    this.mDescriptionText.getXform().setPosition(leftX, topY);
    this.mDescriptionText.setTextHeight(textH);
    this.mDescriptionText.draw(aCamera);
};

Weapons.prototype.getHPadd = function () {
    return (this.HPadd);
};
Weapons.prototype.getVPadd = function () {
    return (this.VPadd);
};
Weapons.prototype.getATKadd = function () {
    return (this.ATKadd);
};
Weapons.prototype.getDEFadd = function () {
    return (this.DEFadd);
};
Weapons.prototype.getMoneyadd = function () {
    return (this.Money);
};

Weapons.prototype.getHPratio = function () {
    return (this.HPratio);
};
Weapons.prototype.getVPratio = function () {
    return (this.VPratio);
};
Weapons.prototype.getATKratio = function () {
    return (this.ATKratio);
};
Weapons.prototype.getDEFratio = function () {
    return (this.DEFratio);
};

Weapons.prototype.getType = function () {
    return (this.mType);
};

Weapons.prototype.getEquipedInfo = function () {
    return (this.mEquipedInfo);
};

Weapons.prototype.setEquipedInfo = function (a) {
    this.mEquipedInfo = a;
};
