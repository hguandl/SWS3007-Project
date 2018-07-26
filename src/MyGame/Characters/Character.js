"use strict";

function Character(characterInfo, iconFile, dialogFigureFile, battleFigureFile, characterType = _C.Hero) {
    this.mName = null;

    this.charaterType = characterType;
    /* Reserved for next version
    // [0]: Icon Image
    // [1]: Dialog Figure Image
    // [2]: Battle Figure Image
    this.mCharacterImageSet = [];
    this.mCharacterImageSet.push(createCharacterImage(iconFile));
    this.mCharacterImageSet.push(createCharacterImage(dialogFigureFile));
    this.mCharacterImageSet.push(createCharacterImage(battleFigureFile));
    */

    /* Deprecated because there is only one hero on the map, which is MyGame.mMyHero
    movement support
    this.mXSpeed = [];
    this.mYSpeed = [];
    this.mEndX = [];
    this.mEndY = [];

    this.mIsShowing = [];

    var i;
    for (i = 0; i < 3; i++) {
        this.mXSpeed[i] = 0;
        this.mYSpeed[i] = 0;
        this.mEndX[i] = -100;
        this.mEndY[i] = -100;
        this.mIsShowing[i] = false;
    }
    */

    this.mName = characterInfo["Name"];

    this.mMaxHP = this.mCurrentHP = characterInfo["HP"];
    this.mMaxVP = characterInfo["VP"];
    this.mCurrentVP = 0;
    this.mATK = this.mCurrentATK = characterInfo["ATK"];
    this.mDEF = this.mCurrrentDEF = characterInfo["DEF"];
    this.mSPD = this.mCurrentSPD = characterInfo["SPD"];
}

Character.prototype.statusString = function() {
    return String(this.mName + " - HP: " + this.mCurrentHP + "/" + this.mMaxHP + "; VP: " + this.mCurrentVP + "/" + this.mMaxVP);
};

//<editor-fold desc="set size functions">
Character.prototype.setIconSize = function (width, height) {
    this.mCharacterImageSet[0].getXform().setSize(width, height);
};

Character.prototype.setDialogFigureSize = function (width, height) {
    this.mCharacterImageSet[1].getXform().setSize(width, height);
};

Character.prototype.setBattleFigureSize = function (width, height) {
    this.mCharacterImageSet[2].getXform().setSize(width, height);
};
//</editor-fold>

//<editor-fold desc="set position functions">
Character.prototype.setIconPosition = function (centerX, centerY) {
    this.mCharacterImageSet[0].getXform().setPosition(centerX, centerY);
};

Character.prototype.setDialogFigurePosition = function (centerX, centerY) {
    this.mCharacterImageSet[1].getXform().setPosition(centerX, centerY);
};

Character.prototype.setBattleFigurePosition = function (centerX, centerY) {
    this.mCharacterImageSet[2].getXform().setPosition(centerX, centerY);
};
//</editor-fold>

//<editor-fold desc="draw by position function">
Character.prototype.drawIconByPos = function (centerX, centerY, width, height, aCamera) {
    this.mCharacterImageSet[0].getXform().setPosition(centerX, centerY);
    this.mCharacterImageSet[0].getXform().setSize(width, height);
    this.mCharacterImageSet[0].draw(aCamera);
};

Character.prototype.drawDialogFigureByPos = function (centerX, centerY, width, height, aCamera) {
    this.mCharacterImageSet[1].getXform().setPosition(centerX, centerY);
    this.mCharacterImageSet[1].getXform().setSize(width, height);
    this.mCharacterImageSet[1].draw(aCamera);
};

Character.prototype.drawBattleFigureByPos = function (centerX, centerY, width, height, aCamera) {
    this.mCharacterImageSet[2].getXform().setPosition(centerX, centerY);
    this.mCharacterImageSet[2].getXform().setSize(width, height);
    this.mCharacterImageSet[2].draw(aCamera);
};

Character.prototype.drawImageByPos = function (centerX, centerY, width, height, aCamera, imageNum) {
    this.mCharacterImageSet[imageNum].getXform().setPosition(centerX, centerY);
    this.mCharacterImageSet[imageNum].getXform().setSize(width, height);
    this.mCharacterImageSet[imageNum].draw(aCamera);
};
//</editor-fold>


Character.prototype.setImageMovement = function (startX, startY, endX, endY, durationSecond, width, height, imageNum) {
    this.mCharacterImageSet[imageNum].getXform().setPosition(startX, startY);
    this.mCharacterImageSet[imageNum].getXform().setSize(width, height);
    this.mEndX[imageNum] = endX;
    this.mEndY[imageNum] = endY;
    this.mXSpeed[imageNum] = (endX - startX) / (durationSecond * 60.0);
    this.mYSpeed[imageNum] = (endY - startY) / (durationSecond * 60.0);
    this.mIsShowing[imageNum] = true;
};

Character.prototype.update = function () {
    var i;
    for (i = 0; i < this.mCharacterImageSet.length; i++) {
        this.mCharacterImageSet[i].getXform().incXPosBy(this.mXSpeed[i]);
        this.mCharacterImageSet[i].getXform().incYPosBy(this.mYSpeed[i]);
        var xPos = this.mCharacterImageSet[i].getXform().getXPos();
        var yPos = this.mCharacterImageSet[i].getXform().getYPos();
        if (Math.abs(xPos - this.mEndX[i]) < 0.2 && Math.abs(yPos - this.mEndY[i]) < 0.2) {
            this.mXSpeed[i] = 0;
            this.mYSpeed[i] = 0;
        }
    }
};

Character.prototype.drawIcon = function (aCamera) {
    //this.mCharacterImageSet[0].draw(aCamera);
};

Character.prototype.drawDialogFigure = function (aCamera) {
    //this.mCharacterImageSet[1].draw(aCamera);
};

Character.prototype.drawBattleFigure = function (aCamera) {
    //this.mCharacterImageSet[2].draw(aCamera);
};

Character.prototype.setImageShowing = function (b, imageNum) {
    this.mIsShowing[imageNum] = b;
};

Character.prototype.drawAllShowing = function (aCamera) {
    var i;
    for (i = 0; i < this.mCharacterImageSet.length; i++) {
        if (this.mIsShowing[i]) {
            this.mCharacterImageSet[i].draw(aCamera);
        }
    }
};

Character.prototype.isFainting = function () {
    return (this.mCurrentHP == 0);
};

Character.prototype.getCurrentHP = function () {
    return this.mCurrentHP;
};
Character.prototype.getMaxHP = function () {
    return this.mMaxHP;
};
Character.prototype.incCurrentHP = function (delta) {
    if (this.mCurrentHP + delta >= this.mMaxHP) {
        this.mCurrentHP = this.mMaxHP;
    } else if (this.mCurrentHP + delta <= 0) {
        this.mCurrentHP = 0;
    }
};
Character.prototype.incMaxHP = function (delta) {
    this.mMaxHP += delta;
};

Character.prototype.getCurrentVP = function () {
    return this.mCurrentVP;
};
Character.prototype.getMaxVP = function () {
    return this.mMaxVP;
};
Character.prototype.incCurrentVP = function (delta) {
    if (this.mCurrentVP + delta >= this.mMaxVP) {
        this.mCurrentVP = this.mMaxVP;
    } else if (this.mCurrentVP + delta <= 0) {
        this.mCurrentVP = 0;
    }
};
Character.prototype.incMaxVP = function (delta) {
    this.mMaxVP += delta;
};

Character.prototype.getCurrentATK = function () {
    return this.mCurrentATK;
};
Character.prototype.getATK = function () {
    return this.mATK;
};
Character.prototype.incCurrentATK = function (delta) {
    this.mCurrentATK += delta;
};
Character.prototype.incATK = function (delta) {
    this.mATK += delta;
};

Character.prototype.getCurrentDEF = function () {
    return this.mCurrentDEF;
};
Character.prototype.getDEF = function () {
    return this.mDEF;
};
Character.prototype.incCurrentDEF = function (delta) {
    this.mCurrentDEF += delta;
};
Character.prototype.incDEF = function (delta) {
    this.mDEF += delta;
};

Character.prototype.getCurrentSPD = function () {
    return this.mCurrentSPD;
};
Character.prototype.getSPD = function () {
    return this.mSPD;
};
Character.prototype.incCurrentSPD = function (delta) {
    this.mCurrentSPD += delta;
};
Character.prototype.incSPD = function (delta) {
    this.mSPD += delta;
};


function createCharacterImage(textureFile) {
    var image = new TextureRenderable(textureFile);
    image.setColor([1, 1, 1, 0]);
    image.getXform().setPosition(-100, -100);
    return image;
}
