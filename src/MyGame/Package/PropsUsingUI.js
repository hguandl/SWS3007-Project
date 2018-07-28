/*
    when player select a props and press <J>, this props
    using UI jump out and let user to choose which character to use.
 */

"use strict";

function PropsUsingUI(bgFile, fontType, aCamera) {  // maybe the icons of 3 characters?
    this.mBgFile = new TextureRenderable(bgFile);
    this.kFontType = fontType;
    this.mCamera = aCamera;

    this.mText = [];
    this.mTextColor = [0, 0, 0.3, 0.6];
    this.textH = 3;
    this.leftX = 20;
    this.topY = 35;

    this.mCurrentSelected = 0;

    this.tick = 0;
}

PropsUsingUI.prototype.draw = function (aCamera, leftX, topY, width) {

    //this.mBgFile.getXform().setPosition(leftX + 0.235 * width, topY - 0.6 * width);
    //this.mBgFile.getXform().setSize(120, 25);
    //this.mBgFile.draw(this.mCamera);

    var textH = 0.028 * width;

    this.mText[0] = new FontRenderable("Use on Monkey King");
    this.mText[0].setFont(this.kFontType);
    this.mText[0].setColor(this.mTextColor);
    this.mText[0].getXform().setPosition(leftX + 0.235 * width, topY - 0.65 * width);
    this.mText[0].setTextHeight(textH);

    this.mText[1] = new FontRenderable("Use on Pigsy");
    this.mText[1].setFont(this.kFontType);
    this.mText[1].setColor(this.mTextColor);
    this.mText[1].getXform().setPosition(leftX + 0.235 * width, topY - 0.66 * width - textH);
    this.mText[1].setTextHeight(textH);

    this.mText[2] = new FontRenderable("Use on Mont Sha");
    this.mText[2].setFont(this.kFontType);
    this.mText[2].setColor(this.mTextColor);
    this.mText[2].getXform().setPosition(leftX + 0.235 * width, topY - 0.67 * width - 2 * textH);
    this.mText[2].setTextHeight(textH);

    this.mText[3] = new FontRenderable("Sell");
    this.mText[3].setFont(this.kFontType);
    this.mText[3].setColor(this.mTextColor);
    this.mText[3].getXform().setPosition(leftX + 0.235 * width, topY - 0.68 * width - 3 * textH);
    this.mText[3].setTextHeight(textH * 1);

    this.mText[4] = new FontRenderable("press Esc to go back..");
    this.mText[4].setFont(this.kFontType);
    this.mText[4].setColor(this.mTextColor);
    this.mText[4].getXform().setPosition(leftX + 0.235 * width, topY - 0.69 * width - 4 * textH);
    this.mText[4].setTextHeight(textH * 0.8);

    if (this.mCurrentSelected >= 0) {
        this.mText[this.mCurrentSelected].setTextHeight(textH * 1.4);
    }
    this.mText[0].draw(aCamera);
    this.mText[1].draw(aCamera);
    this.mText[2].draw(aCamera);
    this.mText[3].draw(aCamera);
    this.mText[4].draw(aCamera);

};


PropsUsingUI.prototype.update = function () {

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W)) {
        this.mCurrentSelected = Math.max(this.mCurrentSelected - 1, 0);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.mCurrentSelected = Math.min(this.mCurrentSelected + 1, 3);
    }

    if (gEngine.Input.isKeyReleased(gEngine.Input.keys.J)) {
        return (this.mCurrentSelected + 1);
    }

    if (gEngine.Input.isKeyReleased(gEngine.Input.keys.Escape)) {
        return 0;
    }

    return -1;

};