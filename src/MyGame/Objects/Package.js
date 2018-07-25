"use strict";

function Package(name, brickFile, bgFile, UIBgFile, fontType, capacity, aCamera) {

    this.kFontType = fontType;

    this.mCamera = aCamera;

    // region name, brick, bg
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

    this.mRow = 0;
    this.mColumn = 0;

    this.mBrickW = 5;
    this.mBrickH = 5;

    this.mGapX = 0;
    this.mGapY = 0;

    this.mLeftX = 0;
    this.mTopY = 0;

    this.mMoney = 1000;
    this.mMoneyH = 3;
    this.mMoneyColor = [0, 0, 0, 0.8];    // default color of money

    this.mPropsSet = [];
    this.mPropsSetColor = [0.3, 0, 0, 0.7];     // default color of props description
    this.mPropsSetState = [];
    this.mCurrentSelected = -1;
    this.mCurrentShowing = -1;

    this.tickThreshold = 6;
    this.tickRight = this.tickLeft = 2 * this.tickThreshold;
    this.tickJ = this.tickThreshold;

    this.mUIBgFile = UIBgFile;
    this.choosingUI = null;
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

// region functions about setting drawing of the package
Package.prototype.setRowColumn = function (row, column) {
    this.mRow = row;
    this.mColumn = column;
};

Package.prototype.setBrickSize = function (w, h) {
    this.mBrickW = w;
    this.mBrickH = h;
};

Package.prototype.setGapSize = function (x, y) {
    this.mGapX = x;
    this.mGapY = y;
};

Package.prototype.setLeftTop = function (x, y) {
    this.mLeftX = x;
    this.mTopY = y;
};

Package.prototype.setPropsDescColor = function (color) {
    this.mPropsSetColor = color;
};
// endregion

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

Package.prototype.setMoneyTextHeight = function (h) {
    this.mMoneyH = h;
};

Package.prototype.setMoneyColor = function (color) {
    this.mMoneyColor = color;
};

// better not use this, only for test
Package.prototype.showMoneyByPos = function (fontType, leftX, topY, color, textH, aCamera){
    var m = new FontRenderable("Money : " + this.mMoney);
    m.setFont(fontType);
    m.setColor(color);
    m.getXform().setPosition(leftX, topY);
    m.setTextHeight(textH);
    m.draw(aCamera);
};
// endregion

//region functions about props adding and using
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

// better not use, only for test
Package.prototype.drawAllProps = function (leftX, topY, width, height, aCamera) {
    var i;
    for (i = 0; i < this.mPropsSet.length; i++) {
        this.mPropsSet[i].drawIconByPos(20 + 5 * i, 40, 5, 5, aCamera);
    }
};

// region draw()
// draw background, money, bricks, and props (press <I> with description)
// left-top position: [leftX, topY]
var isChoosingUI = false;
Package.prototype.draw = function (aCamera) {

    var totalW = this.mColumn * (this.mBrickW + this.mGapX) - this.mGapX;
    var totalH = this.mRow * (this.mBrickH + this.mGapY) - this.mGapY;

    // background of the package
    this.mBgFile.getXform().setPosition(this.mLeftX + 0.5 * totalW, this.mTopY - 0.5 * totalH);
    this.mBgFile.getXform().setSize(totalH + this.mGapY * 2 + 10, totalH + this.mGapY * 2 + 30);
    this.mBgFile.draw(aCamera);

    // show money
    var m = new FontRenderable("Money : " + this.mMoney);
    m.setFont(this.kFontType);
    m.setColor(this.mMoneyColor);
    m.getXform().setPosition(this.mLeftX, this.mTopY + this.mMoneyH);
    m.setTextHeight(this.mMoneyH);
    m.draw(aCamera);

    // draw bricks and props
    var i, j, count = 0;
    for (i = 0; i < this.mRow; i++) {
        for (j = 0; j < this.mColumn; j++) {
            var x = this.mLeftX + j * (this.mBrickW + this.mGapX) + 0.5 * this.mBrickW;
            var y = this.mTopY - i * (this.mBrickH + this.mGapY) - 0.5 * this.mBrickH;
            this.mBrick.getXform().setPosition(x, y);

            if (i * this.mRow + j == this.mCurrentSelected) {
                this.mBrick.getXform().setSize(this.mBrickW + 2, this.mBrickH + 2);
            } else {
                this.mBrick.getXform().setSize(this.mBrickW, this.mBrickH);
            }

            this.mBrick.draw(aCamera);
            if (count < this.mSize) {
                if (count == this.mCurrentSelected) {
                    this.mPropsSet[count].drawIconByPos(x, y, this.mBrickW + 0.5, this.mBrickH + 0.5, aCamera);
                } else {
                    this.mPropsSet[count].drawIconByPos(x, y, this.mBrickW - 1, this.mBrickH - 1, aCamera);
                }
                //this.mPropsSet[count].drawIconByPos(x, y, this.mBrickW - 1, this.mBrickH - 1, aCamera);
                count++;
            }

            if (this.mCurrentShowing >= 0) {
                this.mPropsSet[this.mCurrentShowing].showNameByPos(this.kFontType, this.mLeftX, this.mTopY - totalH - 2, this.mPropsSetColor, 3, this.mCamera);
                this.mPropsSet[this.mCurrentShowing].showInfoByPos(this.kFontType, this.mLeftX, this.mTopY - totalH - 5, this.mPropsSetColor, 2, this.mCamera);
                this.mCurrentShowing = -1;
            }
        }
    }

    if (isChoosingUI) {
        this.choosingUI.draw(this.mCamera);
    }

};
// endregion

// region update()
var isFirstClicked;
var latestPressedAloneKey;
Package.prototype.update = function () {

    if (!isChoosingUI) {

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

    } else {

        var result = this.choosingUI.update();

        switch (result) {
            case 0:
                console.log("go back to here");
                isChoosingUI = false;
                break;
            case 1:
                isChoosingUI = false;
                console.log("You use a " + this.mPropsSet[this.mCurrentSelected].getName() + " on monkey");
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
                return [0, 100, 0, 0, 0, 0];
            case 2:
                isChoosingUI = false;
                console.log("You use a " + this.mPropsSet[this.mCurrentSelected].getName() + " on pigsy");
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
                return [1, 100, 0, 0, 0, 0];
            case 3:
                isChoosingUI = false;
                console.log("You use a " + this.mPropsSet[this.mCurrentSelected].getName() + " on sha");
                this.mPropsSet.splice(this.mCurrentSelected, 1);
                this.mSize--;
                return [2, 100, 0, 0, 0, 0];
        }

    }
};
// endregion

