"use scrict";


Map.prototype.load = function(mapFile) {

};

Map.prototype.getCamera = function(pos, percent, viewConfig) {
    var camera = new Camera(
        vec2.fromValues(pos[0], pos[1]),
        Math.round(percent * this.mWidth),
        viewConfig
        );
    camera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    return camera;
};

Map.prototype.pixelCenter = function(pos) {
    var x = pos % this.mWidth + 0.5;
    var y = this.mHeight - Math.floor(pos / this.mWidth) - 0.5;
    return [x, y];
};

Map.prototype.reducePoint = function(x, y) {
    return this.mWidth * Math.round(this.mHeight - 0.5 - y) + Math.round(x - 0.5);
};

Map.prototype.detectEvent = function (x, y, dir) {
    var posPoint = this.reducePoint(x, y);
    var e = null;
    if (Math.floor(this.mData[posPoint] % 100 / 10) == 1) {
        e = GameEvents.handle(this.mEvents[posPoint]);
    }
    if (e) return e;
    var nextStepPoint = this.nextToNPC(posPoint, x, y, dir);
    if (nextStepPoint) {
        e = GameEvents.handle(this.mEvents[nextStepPoint]);
    }
    return e;
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

Map.prototype.nextToNPC = function(posPoint, x, y, dir) {
    var nextStepPoint = null;
    switch(dir) {
        case "Up":
        nextStepPoint = posPoint - this.mWidth;
        if (nextStepPoint < 0)
            return null;
        if (Math.floor(this.mData[nextStepPoint] / 10) == 21) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y + 1 > nextStepVec[1])
                return nextStepPoint;
        }
        break;
        case "Right":
        if (posPoint % this.mWidth == this.mWidth - 1) return null;
        nextStepPoint = posPoint + 1;
        if (nextStepPoint > this.mData.length)
            return null;
        if (Math.floor(this.mData[nextStepPoint] / 10) == 21) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (x + 1 > nextStepVec[0])
                return nextStepPoint;
        }
        break;
        case "Down":
        nextStepPoint = posPoint + this.mWidth;
        if (nextStepPoint > this.mData.length)
            return null;
        if (Math.floor(this.mData[nextStepPoint] / 10) == 21) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y - 1 < nextStepVec[1])
                return nextStepPoint;
        }
        break;
        case "Left":
        if (posPoint % this.mWidth == 0) return null;
        nextStepPoint = posPoint - 1;
        if (nextStepPoint < 0)
            return null;
        if (Math.floor(this.mData[nextStepPoint] / 10) == 21) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (x - 1 < nextStepVec[0])
                return nextStepPoint;
        }
        break;
    }
    return null;
}

Map.prototype.canWalkDirection = function(posPoint, x, y, dir) {
    var nextStepPoint = null;
    switch(dir) {
        case "Up":
        nextStepPoint = posPoint - this.mWidth;
        if (nextStepPoint < 0)
            return true;
        if (Math.floor(this.mData[nextStepPoint] / 100) == 2 || Math.abs(this.mData[nextStepPoint] % 10 - this.mData[posPoint] % 10) > 1) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y + 1 > nextStepVec[1])
                return false;
        }
        break;
        case "Right":
        if (posPoint % this.mWidth == this.mWidth - 1) return true;
        nextStepPoint = posPoint + 1;
        if (nextStepPoint > this.mData.length)
            return true;
        if (Math.floor(this.mData[nextStepPoint] / 100) == 2 || Math.abs(this.mData[nextStepPoint] % 10 - this.mData[posPoint] % 10) > 1) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (x + 1 > nextStepVec[0])
                return false;
        }
        break;
        case "Down":
        nextStepPoint = posPoint + this.mWidth;
        if (nextStepPoint > this.mData.length)
            return true;
        if (Math.floor(this.mData[nextStepPoint] / 100) == 2 || Math.abs(this.mData[nextStepPoint] % 10 - this.mData[posPoint] % 10) > 1) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (y - 1 < nextStepVec[1])
                return false;
        }
        break;
        case "Left":
        if (posPoint % this.mWidth == 0) return true;
        nextStepPoint = posPoint - 1;
        if (nextStepPoint < 0)
            return true;
        if (Math.floor(this.mData[nextStepPoint] / 100) == 2 || Math.abs(this.mData[nextStepPoint] % 10 - this.mData[posPoint] % 10) > 1) {
            var nextStepVec = this.pixelCenter(nextStepPoint);
            if (x - 1 < nextStepVec[0])
                return false;
        }
        break;
    }
    return true;
};
