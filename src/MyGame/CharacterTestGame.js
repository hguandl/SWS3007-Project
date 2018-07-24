"use strict";

function CharacterTestGame() {
    this.kMonkeyIconSprite = "assets/monkey_icon.png";

    this.kMonkeyFile = "assets/Monkey.json";

    this.mCamera = null;

}
gEngine.Core.inheritPrototype(CharacterTestGame, Scene);

CharacterTestGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMonkeyIconSprite);
};

CharacterTestGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMonkeyIconSprite);
};

CharacterTestGame.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mCharacter = new Character(this.kMonkeyFile, this.kMonkeyIconSprite);
};

CharacterTestGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    this.mCharacter.draw();
};

CharacterTestGame.prototype.update = function () {
    // do nothing
};
