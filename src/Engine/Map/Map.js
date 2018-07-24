"use scrict";

function Map(mapFile) {
    var mapJson = gEngine.ResourceMap.retrieveAsset(mapFile);
    this.mWidth = Number(mapJson["width"]);
    this.mHeight = Number(mapJson["height"]);
    this.mData = mapJson["data"];
    this.mContent = mapJson["content"];

    this.mViewWidth = 600;
    this.mViewHeight = 600;

    this.mPixelArray = new Array();
    this.mItems = [];
}

Map.prototype.draw = function () {
    var mapInfo = this.mData;
    var i;
    for (i = 0; i < mapInfo.length; ++i) {
        switch (mapInfo[i]) {
            case 1:
            var tmp = new Renderable();
            tmp.setColor([0, 1, 0, 1]);
            var tmpCenter = pixelCenter(i);
            tmp.getXform().setPosition(tmpCenter[0], tmpCenter[1]);
            break;
        }
    }
}