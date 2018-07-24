"use strict";

function PropsTestGame() {
    this.kSmallRedIcon = "assets/smallred_icon.png";
    this.kSmallBlueIcon = "assets/smallblue_icon.png";

    this.mCamera = null;

    this.mPropsSet = [];
}
gEngine.Core.inheritPrototype(PropsTestGame, Scene);

PropsTestGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kSmallRedIcon);
    gEngine.Textures.loadTexture(this.kSmallBlueIcon);


};

PropsTestGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kSmallRedIcon);
    gEngine.Textures.unloadTexture(this.kSmallBlueIcon);
};

PropsTestGame.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mPropsSet[0] = new Props("Small Red Bottle", this.kSmallRedIcon, "Retrieve 50 HP");
    this.mPropsSet[1] = new Props("Small Blue Bottle", this.kSmallBlueIcon, "Retrieve 50 VP");

};


PropsTestGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    this.mCamera.setupViewProjection();

    this.mPropsSet[0].drawIconByPos(30, 30, 10, 9, this.mCamera);
    this.mPropsSet[1].drawIconByPos(60, 40, 15, 15, this.mCamera);
};

PropsTestGame.prototype.update = function () {

};
