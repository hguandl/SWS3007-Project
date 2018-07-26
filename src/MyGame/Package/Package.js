"use strict";

function Package(name, bgFile, brickFile, UIBgFile, moneyIconFile, fontType, capacity/*, aCamera*/) {

    this.kFontType = fontType;

    this.leftX = -5;
    this.topY = 90;
    this.width = 65;

    this.mRow = 4;
    this.mColumn = 5;

    this.mCamera = new Camera(
        vec2.fromValues(50, 50),
        100,
        [0, 0, 800, 600],
        true
    );
    //this.mCamera = aCamera;
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 0]);

    // region name, brick file, bg file
    this.mName = name;
    this.mNameText = new FontRenderable(name);
    this.mNameText.setFont(fontType);

    this.mBrick = new TextureRenderable(brickFile);
    this.mBrick.setColor([1, 1, 1, 0]);
    this.mBrick.getXform().setPosition(-200, -200);

    this.mBgFile = new TextureRenderable(bgFile);
    this.mBgFile.setColor([1, 1, 1, 0]);
    this.mBgFile.getXform().setPosition(-200, -200);
    //endregion

    this.mCapacity = capacity;
    this.mSize = 0;

    this.mBrickW = 0.097 * this.width;
    this.mBrickH = 0.097 * this.width;

    this.mGapX = 0.0075 * this.width;
    this.mGapY = 0.0012 * this.width;

    this.mMoney = 1000;
    this.mMoneyH = 3;
    this.mMoneyColor = [0.2, 0.2, 0.2, 0.8];    // default color of money

    this.mPropsSet = [];
    this.mPropsSetColor = [0.3, 0, 0, 0.7];     // default color of props description
    this.mCurrentSelected = -1;
    this.mCurrentShowing = -1;

    this.tickThreshold = 6;
    this.tickRight = this.tickLeft = 2 * this.tickThreshold;
    this.tickJ = this.tickThreshold;

    this.mUIBgFile = UIBgFile;
    this.choosingUI = null;

    this.mBgFile.getXform().setPosition(this.leftX + 0.5 * this.width, this.topY - 0.5 * this.width);
    this.mBgFile.getXform().setSize(this.width, this.width);

    this.mMoneyText = new FontRenderable("$ " + this.mMoney);
    this.mMoneyText.setFont(this.kFontType);
    this.mMoneyText.setColor(this.mMoneyColor);
    this.mMoneyText.getXform().setPosition(this.leftX + 0.27 * this.width, this.topY - 0.175 * this.width);
    this.mMoneyText.setTextHeight(0.043 * this.width);
}


Package.prototype.getName = function () {
    return this.mName;
};

Package.prototype.showNameByPos = function (fontType, leftX, topY, color, textH, aCamera) {
    this.mNameText.setFont(fontType);
    this.mNameText.setColor(color);
    this.mNameText.getXform().setPosition(leftX, topY);
    this.mNameText.setTextHeight(textH);
    this.mNameText.draw(aCamera);
};


//region functions about capacity and size
Package.prototype.setCapacity = function (c) {
    this.mCapacity = c;
};

Package.prototype.getCapacity = function () {
    return this.mCapacity;
};

Package.prototype.incCapacity = function (deltaC) {
    this.mCapacity += deltaC;
};

Package.prototype.getSize = function () {
    return this.mSize;
};
//endregion


// region functions about money
Package.prototype.getMoney = function () {
    return this.mMoney;
};

Package.prototype.setMoney = function (money) {
    this.mMoney = money;
};

Package.prototype.incMoney = function (deltaM) {
    this.mMoney += deltaM;
};
// endregion


//region functions about props adding and using(not usable yet)
Package.prototype.addProps = function (newProps) {
    if (this.mSize < this.mCapacity) {
        this.mPropsSet.push(newProps);
        this.mSize += 1;
    }
};

// not usable yet
Package.prototype.useProps = function (propsName) {
    var i;
    for (i = 0; i < this.mPropsSet.length; i++) {
        if (this.mPropsSet[i].getName() == propsName) {
            this.mPropsSet[i].splice(i, 1);
            return;
        }
    }
};
// endregion


// region draw()
// draw background, money, bricks, and props (press <I> with description)
// left-top position: [leftX, topY]
var isChoosingUI = false;
Package.prototype.draw = function (/*aCameraFromHero*/) {

    var aCamera = new Camera(
        vec2.fromValues(50, 50),
        100,
        [0, 0, 800, 600],
        true                // transparent
    );
    aCamera.setBackgroundColor([1.0, 1.0, 1.0, 0]);
    aCamera.setupViewProjection();

    // background of the package
    this.mBgFile.draw(aCamera);

    // show money
    this.mMoneyText.setText("$ " + this.mMoney);
    this.mMoneyText.draw(aCamera);

    // draw bricks and props
    var i, j, count = 0;
    for (i = 0; i < this.mRow; i++) {
        for (j = 0; j < this.mColumn; j++) {
            var x = this.leftX + 0.239 * this.width + j * (this.mBrickW + this.mGapX) + 0.5 * this.mBrickW;
            var y = this.topY - 0.227 * this.width - i * (this.mBrickH + this.mGapY) - 0.5 * this.mBrickH;
            this.mBrick.getXform().setPosition(x, y);

            if (i * this.mColumn + j == this.mCurrentSelected) {
                this.mBrick.getXform().setSize(this.mBrickW + 0.015 * this.width, this.mBrickH + 0.015 * this.width);
            } else {
                this.mBrick.getXform().setSize(this.mBrickW, this.mBrickH);
            }

            this.mBrick.draw(aCamera);
            if (count < this.mSize) {
                if (count == this.mCurrentSelected) {
                    this.mPropsSet[count].drawIconByPos(x, y, this.mBrickW + 0.012 * this.width, this.mBrickH + 0.012 * this.width, aCamera);
                } else {
                    this.mPropsSet[count].drawIconByPos(x, y, this.mBrickW - 0.008 * this.width, this.mBrickH - 0.008 * this.width, aCamera);
                }
                //this.mPropsSet[count].drawIconByPos(x, y, this.mBrickW - 1, this.mBrickH - 1, aCamera);
                count++;
            }

            if (this.mCurrentShowing >= 0) {
                this.mPropsSet[this.mCurrentShowing].showNameByPos(this.kFontType, this.leftX + 0.245 * this.width, this.topY - 0.645 * this.width, this.mPropsSetColor, 0.04 * this.width, aCamera);
                //this.mPropsSet[this.mCurrentShowing].showNameByPos(this.kFontType, 30, 40, this.mPropsSetColor, 5, aCamera);
                this.mPropsSet[this.mCurrentShowing].showInfoByPos(this.kFontType, this.leftX + 0.248 * this.width, this.topY - 0.7 * this.width, this.mPropsSetColor, 0.032 * this.width, aCamera);
                this.mCurrentShowing = -1;
            }
        }
    }

    if (isChoosingUI) {
        this.choosingUI.draw(aCamera, this.leftX, this.topY, this.width);
    }

};
// endregion

// region update()
var isFirstClicked;
var latestPressedAloneKey;
// when exiting, return -1
// if aCurState = "Battle", after using one props, immediately return -1
Package.prototype.update = function (aHero, aCurState) {

    if (!isChoosingUI) {

        if (gEngine.Input.isKeyReleased(gEngine.Input.keys.Escape)) {
            return -1;
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.I)) {
            if (this.mCurrentSelected < this.mSize) {
                this.mCurrentShowing = this.mCurrentSelected;
            } else {
                this.mCurrentShowing = -1;
            }
        }

        // region press left or right to select a props
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {

            console.log("#");
            console.log(this.mCurrentSelected);

            if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
                latestPressedAloneKey = "Right";

            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A) && latestPressedAloneKey == "Right") {

            } else {
                if ((this.tickRight >= 1.2 * this.tickThreshold && !isFirstClicked) /*|| gEngine.Input.isKeyReleased(gEngine.Input.keys.A)*/) {
                    this.mCurrentSelected = Math.min(this.mCurrentSelected + 1, this.mRow * this.mColumn - 1);
                    this.mCurrentShowing = -1;
                    this.tickRight = 0;
                    isFirstClicked = true;
                } else {
                    if (isFirstClicked) {
                        if (this.tickRight >= 8 * this.tickThreshold) {
                            this.mCurrentSelected = Math.min(this.mCurrentSelected + 1, this.mRow * this.mColumn - 1);
                            this.mCurrentShowing = -1;
                            this.tickRight = 0;
                            isFirstClicked = false;
                        } else {
                            this.tickRight++;
                        }
                    } else {
                        if (this.tickRight >= this.tickThreshold) {
                            this.mCurrentSelected = Math.min(this.mCurrentSelected + 1, this.mRow * this.mColumn - 1);
                            this.mCurrentShowing = -1;
                            this.tickRight = 0;
                            isFirstClicked = false;
                        } else {
                            this.tickRight++;
                        }
                    }
                }
            }
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {

            if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
                latestPressedAloneKey = "Left";

            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D) && latestPressedAloneKey == "Left") {

            } else {
                if ((this.tickLeft >= 1.2 * this.tickThreshold && !isFirstClicked) /*|| gEngine.Input.isKeyReleased(gEngine.Input.keys.D)*/) {
                    this.mCurrentSelected = Math.max(this.mCurrentSelected - 1, 0);
                    this.mCurrentShowing = -1;
                    this.tickLeft = 0;
                    isFirstClicked = true;
                } else {
                    if (isFirstClicked) {
                        if (this.tickLeft >= 8 * this.tickThreshold) {
                            this.mCurrentSelected = Math.max(this.mCurrentSelected - 1, 0);
                            this.mCurrentShowing = -1;
                            this.tickLeft = 0;
                            isFirstClicked = false;
                        } else {
                            this.tickLeft++;
                        }
                    } else {
                        if (this.tickLeft >= this.tickThreshold) {
                            this.mCurrentSelected = Math.max(this.mCurrentSelected - 1, 0);
                            this.mCurrentShowing = -1;
                            this.tickLeft = 0;
                            isFirstClicked = false;
                        } else {
                            this.tickLeft++;
                        }
                    }
                }
            }
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D) && this.tickRight >= 1.2 * this.tickThreshold) {
            this.mCurrentSelected = Math.min(this.mCurrentSelected + 1, this.mRow * this.mColumn - 1);
            this.mCurrentShowing = -1;
            this.tick = 0;
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A) && this.tickLeft >= 1.2 * this.tickThreshold) {
            this.mCurrentSelected = Math.max(this.mCurrentSelected - 1, 0);
            this.mCurrentShowing = -1;
            this.tick = 0;
        }
        // endregion

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W)) {
            if (this.mCurrentSelected >= this.mColumn) {
                this.mCurrentSelected -= this.mColumn;
            }
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
            if (this.mCurrentSelected == -1) {
                this.mCurrentSelected = 0;
            } else if (this.mCurrentSelected <= (this.mRow - 1) * this.mColumn - 1) {
                this.mCurrentSelected += this.mColumn;
            }
        }

        if (gEngine.Input.isKeyReleased(gEngine.Input.keys.J)) {
            if (this.mCurrentSelected < this.mPropsSet.length && this.tickJ >= this.tickThreshold) {

                this.choosingUI = new PropsUsingUI(this.mUIBgFile, this.kFontType, this.mCamera);
                isChoosingUI = true;

                this.tickJ = 0;
            }
        }

        this.tickRight++;
        this.tickLeft++;
        this.tickJ++;

        return 0;

    } else {

        var result = this.choosingUI.update();
        var dHP = this.mPropsSet[this.mCurrentSelected].getHP();
        var dVP = this.mPropsSet[this.mCurrentSelected].getVP();
        var dATK = this.mPropsSet[this.mCurrentSelected].getATK();
        var dDEF = this.mPropsSet[this.mCurrentSelected].getDEF();
        var dM = this.mPropsSet[this.mCurrentSelected].getMoney();

        switch (result) {
            case 0:
                isChoosingUI = false;
                break;
            case 1:
                isChoosingUI = false;

                // add HP/VP to monkey
                CharacterSet[0].incCurrentHP(dHP);
                CharacterSet[0].incCurrentVP(dVP);
                CharacterSet[0].incCurrentATK(dATK);
                CharacterSet[0].incCurrentDEF(dDEF);
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
                if (aCurState == "Battle") {
                    return -1;
                }
                break;
            case 2:
                isChoosingUI = false;

                // add HP/VP to pig
                CharacterSet[1].incCurrentHP(dHP);
                CharacterSet[1].incCurrentVP(dVP);
                CharacterSet[1].incCurrentATK(dATK);
                CharacterSet[1].incCurrentDEF(dDEF);
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
                if (aCurState == "Battle") {
                    return -1;
                }
                break;
            case 3:
                isChoosingUI = false;

                CharacterSet[2].incCurrentHP(dHP);
                CharacterSet[2].incCurrentVP(dVP);
                CharacterSet[2].incCurrentATK(dATK);
                CharacterSet[2].incCurrentDEF(dDEF);
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
                if (aCurState == "Battle") {
                    return -1;
                }
                break;
            case 4:
                isChoosingUI = false;

                aHero.getPackage().incMoney(dM);
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
        }

        return 0;

    }
};
// endregion

