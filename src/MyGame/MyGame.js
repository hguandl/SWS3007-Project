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

    this.kMapFile = "assets/map/map-1-dat.json";
    this.kMapBkg = "assets/map/map-1-bkg.png";
    this.kMapFrg = "assets/map/map-1-frg.png";

    this.mCamera = null;
    this.mSmallCamera = null;

    this.mMainView = null;

    this.mMsgBoxShow = false;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMapBkg);
    gEngine.Textures.loadTexture(this.kMapFrg);
    gEngine.Textures.loadTexture(this.kHeroPic);
    gEngine.TextFileLoader.loadTextFile(this.kMapFile, gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.TextFileLoader.loadTextFile(this.kHeroJson, gEngine.TextFileLoader.eTextFileType.eJsonFile);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMapBkg);
    gEngine.Textures.unloadTexture(this.kMapFrg);
    gEngine.Textures.unloadTexture(this.kHeroPic);
};

MyGame.prototype.initialize = function () {
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mMyHero = new MyHero(this.kHeroPic, this.kHeroJson);

    this.mAllParticles = new ParticleGameObjectSet();

    this.mMyMap = new Map(this.kMapFile);

    this.mMapBkg = new Background(this.kMapBkg, [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);
    this.mMapFrg = new Background(this.kMapFrg, [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);

    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, this.mMapBkg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mMyHero.getHero());
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mMapFrg);

    this.mMyMap.addItems();

    this.mCamera = this.mMyMap.centerCamera(0.5, [0, 0, this.mMyMap.mViewWidth, this.mMyMap.mViewHeight]);
    this.mMainView = new MainView(this.mCamera);
    this.mSmallCamera = this.mMyMap.centerCamera(1, [850, 480, 120, 120]);
    this.mSmallCamera.setBackgroundColor([0.105, 0.169, 0.204, 1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mMainView.setup();

    /*draw as a whole main view view-port*/
    gEngine.LayerManager.drawAllLayers(this.mMainView.getCam());

    this.mSmallCamera.setupViewProjection();
    // this.mMapBkg.draw(this.mSmallCamera);
    // this.mMapFrg.draw(this.mSmallCamera);
    var i;
    for (i = 0; i < this.mMyMap.mItems.length; ++i)
        this.mMyMap.mItems[i].draw(this.mSmallCamera);
    this.mMyHero.getHero().draw(this.mSmallCamera);
};

MyGame.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

MyGame.prototype.showMsg = function(msg) {
    document.getElementById('infoBox').style.visibility = "visible";
    document.getElementById('info_0').innerText=msg;
    this.mMsgBoxShow = true;
};

MyGame.prototype.resetPos = function() {
    this.mMyHero.getHero().getXform().setPosition(14, 10);
    this.resume();
}

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
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

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        if (this.mSmallCamera.isMouseInViewport()) {
            this.pause();
        }
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Space)) {
        if (this.mMsgBoxShow) {
            document.getElementById('infoBox').style.visibility = "hidden";
            document.getElementById('info_0').innerText=null;
            this.mMsgBoxShow = false;
        }
    }

    if (this.mMyMap.detectEvent(xform.getXPos(), xform.getYPos())) {
        this.showMsg("An event!");
    }

    this.mMyMap.clearEventBuffer(xform.getXPos(), xform.getYPos());
};

MyGame.prototype.pause = function() {
    gEngine.GameLoop.stop();
    document.getElementById('pauseUI').style.visibility = "visible";
};

MyGame.prototype.resume = function() {
    document.getElementById('pauseUI').style.visibility = "hidden";
    gEngine.GameLoop.resume();
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
    // this.mSmallCamera.setWCCenter(newCenter[0] + 4.38144, newCenter[1] + 0.5);
    this.mCamera.update();
    // this.mSmallCamera.update();
};

MyGame.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);

    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);

    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);

    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);

    // size delta
    p.setSizeDelta(0.98);

    return p;
};
