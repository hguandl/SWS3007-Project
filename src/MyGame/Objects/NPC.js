"use strict";

MyNPC.prototype.animate = function(_config) {
    var bias = this.mJson["height"];
    var w = _config[1][0] - _config[0][0];
    var h = _config[0][1] - _config[1][1];
    this.mMyNPC.getXform().setSize(w / h, 1);
    this.mMyNPC.setElementPixelPositions(_config[0][0], _config[1][0], bias - _config[0][1], bias - _config[1][1]);
};

function MyNPC(kPic, kJson) {
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
