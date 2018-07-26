/*
 * File: MyGame.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {

    this.kHeroPic = "assets/hero/tangseng_walk.png";
    this.kHeroJson = "assets/hero/tangseng_walk.json";

    this.kHeroInfo = "assets/hero/character_info.json";

    this.kMapFile = "assets/map/map-1-dat.json";
    this.kMapBkg = "assets/map/map-1-bkg.png";
    this.kMapFrg = "assets/map/map-1-frg.png";

    this.mCamera = null;
    this.mSmallCamera = null;

    this.mMainView = null;

    this.mShowSmallMap = true;

    this.nextScene = null;
    this.startMsg = null;

    this.mStatusBar = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    document.currentScene = this;
    gEngine.Textures.loadTexture(this.kMapBkg);
    gEngine.Textures.loadTexture(this.kMapFrg);
    gEngine.Textures.loadTexture(this.kHeroPic);
    gEngine.TextFileLoader.loadTextFile(this.kMapFile, gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.TextFileLoader.loadTextFile(this.kHeroJson, gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.TextFileLoader.loadTextFile(this.kHeroInfo, gEngine.TextFileLoader.eTextFileType.eJsonFile);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMapBkg);
    gEngine.Textures.unloadTexture(this.kMapFrg);
    gEngine.Textures.unloadTexture(this.kHeroPic);

    if (this.nextScene) {
        document.currentScene = this.nextScene;
        gEngine.Core.startScene(this.nextScene);
    }
};

MyGame.prototype.initialize = function () {
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    window.statusBar.initialize();

    this.mMyHero = new MyHero(this.kHeroPic, this.kHeroJson);

    this.mMyMap = new Map(this.kMapFile);

    this.mMapBkg = new Background(this.kMapBkg, [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);
    this.mMapFrg = new Background(this.kMapFrg, [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);

    gEngine.LayerManager.cleanUp();
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, this.mMapBkg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mMyHero.getHero());
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mMapFrg);

    this.mMyMap.addItems();

    this.mCamera = this.mMyMap.centerCamera(0.5, [0, 120, this.mMyMap.mViewWidth, this.mMyMap.mViewHeight]);
    this.mMainView = new MainView(this.mCamera);
    this.mSmallCamera = this.mMyMap.centerCamera(1, [850, 600, 120, 120]);
    this.mSmallCamera.setBackgroundColor([0.105, 0.169, 0.204, 1]);

    UIButton.displayButtonGroup('default-button-group');

    switch (window.combatScene.combatResult) {
        case "win":
            this.startMsg = 1;
            ItemSet_addItem("Key", 1);
            break;
        case "lose":
            this.startMsg = 2;
            break;
    }

    if (window.combatScene.combatResult !== null) return ;
    CharacterSet_Init(this.kHeroInfo);
    ItemSet_addItem("Peach", 10);
    ItemSet_addItem("Baozi", 5);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    window.statusBar.draw();
    this.mMainView.setup();

    /*draw as a whole main view view-port*/
    gEngine.LayerManager.drawAllLayers(this.mMainView.getCam());

    if (this.mShowSmallMap) {
        this.mSmallCamera.setupViewProjection();
        var i;
        for (i = 0; i < this.mMyMap.mItems.length; ++i)
            this.mMyMap.mItems[i].draw(this.mSmallCamera);
        this.mMyHero.getHero().draw(this.mSmallCamera);
    }
};

MyGame.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

MyGame.prototype.resetPos = function() {
    this.mMyHero.getHero().getXform().setPosition(14, 10);
    this.resume();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
    this.closeMsg();

    window.statusBar.update();
    if (window.mMapFreezed) return ;

    switch (this.startMsg) {
        case 1:
            this.showMsg("You have won the battle!\nNow you have got a key!");
            this.startMsg = null;
            break;
        case 2:
            this.showMsg("You lost the battle!\nGo to shop to recover and try again!");
            this.startMsg = null;
            break;
    }

    if (this.showWinMsg) {
        this.showWinMsg = false;

    }

    var deltaX = 0.05;
    var xform = this.mMyHero.getHero().getXform();

    this.moveCamera(xform);

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Right)) return ;
        this.mMyHero.walk("Right");

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Right") == false)
            return ;
        if (xform.getXPos() > this.mMyMap.mWidth - 0.5)
            return ;

        xform.incXPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Up)) return ;
        this.mMyHero.walk("Up");

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Up") == false)
            return ;
        if (xform.getYPos() > this.mMyMap.mHeight - 0.5)
            return ;

        xform.incYPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Down)) return ;
        this.mMyHero.walk("Down");

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Down") == false)
            return ;
        if (xform.getYPos() < 0.5)
            return ;

        xform.incYPosBy(-deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Left)) return ;
        this.mMyHero.walk("Left");

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Left") == false)
            return ;
        if (xform.getXPos() < 0.5)
            return ;

        xform.incXPosBy(-deltaX);
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Right)) {
        this.mMyHero.stand("Right");
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Up)) {
        this.mMyHero.stand("Up");
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Left)) {
        this.mMyHero.stand("Left");
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Down)) {
        this.mMyHero.stand("Down");
    }

    var e = null;
    if (e = this.mMyMap.detectEvent(xform.getXPos(), xform.getYPos())) {
        // console.log(e);
        GameEvents.handle(this, e);
    }
    // this.mMyMap.clearEventBuffer(xform.getXPos(), xform.getYPos());
};

MyGame.prototype.pause = function() {
    window.mMapFreezed = true;
    document.getElementById('pauseUI').style.display = "block";
};

MyGame.prototype.resume = function() {
    document.getElementById('pauseUI').style.display = "none";
    window.mMapFreezed = false;
};

MyGame.prototype.getHero = function() {
    return this.mMyHero.getHero();
};

MyGame.prototype.moveCamera = function(xform) {
    var newCenter = [xform.getXPos(), xform.getYPos()];

    var ratio = this.mMyMap.mViewHeight / this.mMyMap.mViewWidth;

    if (newCenter[0] + this.mCamera.getWCWidth() / 2 >= this.mMyMap.mWidth)
        newCenter[0] = this.mMyMap.mWidth - this.mCamera.getWCWidth() / 2;
    if (newCenter[0] - this.mCamera.getWCWidth() / 2 <= 0)
        newCenter[0] = this.mCamera.getWCWidth() / 2;
    if (newCenter[1] + this.mCamera.getWCWidth() / 2 * ratio >= this.mMyMap.mWidth)
        newCenter[1] = this.mMyMap.mWidth - this.mCamera.getWCWidth() / 2 * ratio;
    if (newCenter[1] - this.mCamera.getWCWidth() / 2 * ratio <= 0)
        newCenter[1] = this.mCamera.getWCWidth() / 2 * ratio;

    this.mCamera.setWCCenter(newCenter[0], newCenter[1]);
    this.mCamera.update();
};
