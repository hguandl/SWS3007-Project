"use scrict";


Map.prototype.load = function(mapFile) {

};

Map.prototype.centerCamera = function(percent, viewConfig) {
    var centerPosX = this.mWidth / 2;
    var centerPosY = this.mHeight / 2;

    var camera = new Camera(
        vec2.fromValues(centerPosX, centerPosY),
        Math.round(percent * this.mWidth),
        viewConfig
        );
    camera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    return camera;
};

Map.prototype.pixelCenter = function(pos) {
    var x = pos % this.mWidth + 0.5;
    var y = this.mHeight - Math.floor(pos / this.mWidth) - 0.5;
    return vec2.fromValues(x, y);
};

Map.prototype.reducePoint = function(x, y) {
    return 20 * Math.round(this.mHeight - 0.5 - y) + Math.round(x - 0.5);
};

Map.prototype.detectEvent = function (x, y) {
    var posPoint = this.reducePoint(x, y);
    // if (this.mData[posPoint] > 2 && posPoint != this.mEventBuffer) {
    if (this.mData[posPoint] > 2) {
        // this.mEventBuffer = posPoint;
        return this.mContent[this.mData[posPoint]];
    }
    return null;
};

Map.prototype.clearEventBuffer = function (x, y) {
    var posPoint = this.reducePoint(x, y);
    if (posPoint != this.mEventBuffer)
        this.mEventBuffer = null;
};

Map.prototype.canWalk = function(x, y, dir) {
    var posPoint1 = this.reducePoint(x + 0.2, y - 0.4);
    var posPoint2 = this.reducePoint(x - 0.2, y);
    if (!this.canWalkDirection(posPoint1, x, y, dir)) {
        return false;
    }
    if (!this.canWalkDirection(posPoint2, x, y, dir)) {
        return false;
    }
    return true;
};

Map.prototype.canWalkDirection = function(posPoint, x, y, dir) {
    switch(dir) {
        case "Up":
        var nextStepPoint = posPoint - this.mWidth;
        if (nextStepPoint < 0)
            return true;
        if (this.mContent[this.mData[nextStepPoint]] == "unwalkable") {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y + 1 > nextStepVec[1])
                return false;
        }
        break;
        case "Right":
        if (posPoint % this.mWidth == this.mWidth - 1) return true;
        var nextStepPoint = posPoint + 1;
        if (nextStepPoint > this.mData.length)
            return true;
        if (this.mContent[this.mData[nextStepPoint]] == "unwalkable") {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (x + 1 > nextStepVec[0])
                return false;
        }
        break;
        case "Down":
        var nextStepPoint = posPoint + this.mWidth;
        if (nextStepPoint > this.mData.length)
            return true;
        if (this.mContent[this.mData[nextStepPoint]] == "unwalkable") {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y - 1 < nextStepVec[1])
                return false;
        }
        break;
        case "Left":
        if (posPoint % this.mWidth == 0) return true;
        var nextStepPoint = posPoint - 1;
        if (nextStepPoint < 0)
            return true;
        if (this.mContent[this.mData[nextStepPoint]] == "unwalkable") {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (x - 1 < nextStepVec[0])
                return false;
        }
        break;
    }
    return true;
};
