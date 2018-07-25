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
    this.mTextColor = [1, 1, 1, 1];
    this.textH = 3;
    this.leftX = 15;
    this.topY = 20;

    this.mCurrentSelected = 0;

    this.tick = 0;
}

PropsUsingUI.prototype.draw = function (aCamera) {

    this.mBgFile.getXform().setPosition(50, 10);
    this.mBgFile.getXform().setSize(120, 25);
    this.mBgFile.draw(this.mCamera);

    this.mText[0] = new FontRenderable("Monkey King");
    this.mText[0].setFont(this.kFontType);
    this.mText[0].setColor(this.mTextColor);
    this.mText[0].getXform().setPosition(this.leftX, this.topY);
    this.mText[0].setTextHeight(this.textH);

    this.mText[1] = new FontRenderable("Pigsy");
    this.mText[1].setFont(this.kFontType);
    this.mText[1].setColor(this.mTextColor);
    this.mText[1].getXform().setPosition(this.leftX, this.topY - this.textH - 1);
    this.mText[1].setTextHeight(this.textH);

    this.mText[2] = new FontRenderable("Mont Sha");
    this.mText[2].setFont(this.kFontType);
    this.mText[2].setColor(this.mTextColor);
    this.mText[2].getXform().setPosition(this.leftX, this.topY - this.textH * 2 - 2);
    this.mText[2].setTextHeight(this.textH);

    this.mText[3] = new FontRenderable("press Esc to go back..");
    this.mText[3].setFont(this.kFontType);
    this.mText[3].setColor(this.mTextColor);
    this.mText[3].getXform().setPosition(this.leftX, this.topY - this.textH * 3 - 3);
    this.mText[3].setTextHeight(this.textH);

    if (this.mCurrentSelected >= 0) {
        this.mText[this.mCurrentSelected].setTextHeight(this.textH + 1);
    }
    this.mText[0].draw(aCamera);
    this.mText[1].draw(aCamera);
    this.mText[2].draw(aCamera);
    this.mText[3].draw(aCamera);

};


PropsUsingUI.prototype.update = function () {

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W)) {
        this.mCurrentSelected = Math.max(this.mCurrentSelected - 1, 0);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.mCurrentSelected = Math.min(this.mCurrentSelected + 1, 2);
    }

    if (gEngine.Input.isKeyReleased(gEngine.Input.keys.J)) {
        return (this.mCurrentSelected + 1);
    }

    if (gEngine.Input.isKeyReleased(gEngine.Input.keys.Escape)) {
        return 0;
    }

    return -1;
    // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.M)) {
    //     return 1;
    // } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.P)) {
    //     return 2;
    // } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
    //     return 3;
    // } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Escape)) {      // go back
    //     return 0;
    // } else {
    //     return -1;
    // }



};
