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
    if (this.mContent[this.mData[posPoint]] == "special" && posPoint != this.mEventBuffer) {
        this.mEventBuffer = posPoint;
        return true;
    }
    return false;
};

Map.prototype.clearEventBuffer = function (x, y) {
    var posPoint = this.reducePoint(x, y);
    if (posPoint != this.mEventBuffer)
        this.mEventBuffer = null;
};

Map.prototype.canWalk = function(x, y, dir) {
    var posPoint = this.reducePoint(x, y);
    switch(dir) {
        case "Up":
        var nextStepPoint = posPoint - this.mWidth;
        if (nextStepPoint < 0)
            return true;
        if (this.mContent[this.mData[nextStepPoint]] == "unwalkable") {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y + 1 > nextStepVec[1])
                return false;        }
        break;
        case "Right":
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
