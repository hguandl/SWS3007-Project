"use scrict";

function Map(mapFile) {
    var mapJson = gEngine.ResourceMap.retrieveAsset(mapFile);
    this.mWidth = Number(mapJson["width"]);
    this.mHeight = Number(mapJson["height"]);
    this.mData = mapJson["data"];
    this.mContent = mapJson["content"];

    this.mViewWidth = 970;
    this.mViewHeight = 600;

    this.mPixelArray = new Array();
    this.mItems = [];
    this.mEventBuffer = null;
}

Map.prototype.addItems = function () {
    var mapInfo = this.mData;
    var i;
    for (i = 0; i < mapInfo.length; ++i) {
        var tmp = new Renderable();
        var tmpCenter = this.pixelCenter(i);
        tmp.getXform().setPosition(tmpCenter[0], tmpCenter[1]);
        switch (mapInfo[i]) {
            case 1:
            // #ffff99
            tmp.setColor([0.8, 0.8, 0.8, 1]);
            this.mItems.push(tmp);
            break;
            case 2:
            // tmp.setColor([0.105, 0.169, 0.204, 1]);
            // this.mItems.push(tmp);
            break;
            case 3:
            tmp.setColor([1, 1, 0.2, 1]);
            this.mItems.push(tmp);
            break;
        }
        // this.mItems.push(tmp);
    }
}
