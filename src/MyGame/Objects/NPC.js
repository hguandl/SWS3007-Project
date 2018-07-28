"use strict";

MyNPC.prototype.animate = function(_config) {
    var bias = this.mJson["height"];
    var w = _config[1][0] - _config[0][0];
    var h = _config[0][1] - _config[1][1];
    this.mMyNPC.getXform().setSize(w / h, 1);
    this.mMyNPC.setElementPixelPositions(_config[0][0], _config[1][0], bias - _config[0][1], bias - _config[1][1]);
};

function MyNPC(kPic, kJson) {
    this.mWalk = new Array();
    this.mStand = [];
    this.mAction = 0;
    this.mSpeed = 30;
    this.mJson = gEngine.ResourceMap.retrieveAsset(kJson);

    this.mMyNPC = null;

    var config = this.mJson["Down"]["Stand"];

    this.mMyNPC = new SpriteRenderable(kPic);
    this.mMyNPC.setColor([1, 1, 1, 0]);
    this.animate(config);

    this.mDir = "Down";
}

// MyNPC.prototype.walk = function(dir) {
//     this.mAction = (this.mAction + 1) % this.mSpeed;
//     var base = this.mSpeed / 3;
//     var config = null;
//     if (this.mAction >= 1 && this.mAction < base) {
//         config = this.mJson[dir]["Walk"][0];
//     }
//     if (this.mAction >= base && this.mAction < 2 * base) {
//         config = this.mJson[dir]["Walk"][1];
//     }
//     if (this.mAction >= 2 * base && this.mAction < 3 * base) {
//         config = this.mJson[dir]["Stand"];
//     }
//     if (this.mAction == 0) {
//         config = this.mJson[dir]["Stand"];
//     }
//     this.mDir = dir;
//     this.animate(config);
// };

MyNPC.prototype.stand = function(dir) {
    this.mAction = 0;
    this.animate(this.mJson[dir]["Stand"]);
};

MyNPC.prototype.getNPC = function() {
    return this.mMyNPC;
};

MyNPC.prototype.getDir = function() {
    return this.mDir;
};
