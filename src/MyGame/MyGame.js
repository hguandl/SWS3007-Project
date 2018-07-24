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
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";
    this.kParticleTexture = "assets/particle.png";
    this.kHeroDWalk = "assets/hero/hero1.png";
    this.kHeroDStand = "assets/hero/hero2.png";
    this.kHeroDWalk2 = "assets/hero/hero3.png";
    this.kHeroLWalk = "assets/hero/hero4.png";
    this.kHeroLStand = "assets/hero/hero5.png";
    this.kHeroLWalk2 = "assets/hero/hero6.png";
    this.kHeroRWalk = "assets/hero/hero7.png";
    this.kHeroRStand = "assets/hero/hero8.png";
    this.kHeroRWalk2 = "assets/hero/hero9.png";
    this.kHeroUWalk = "assets/hero/hero10.png";
    this.kHeroUStand = "assets/hero/hero11.png";
    this.kHeroUWalk2 = "assets/hero/hero12.png";

    this.kMapFile = "assets/map_data.json";
    this.kMapBkg = "assets/map/map1.png";
    this.kMapFrg = "assets/map/map2.png";

    
    // The camera to view the scene
    this.mCamera = null;
    this.mSmallCamera = null;

    this.mMsg = null;
    this.mShapeMsg = null;

    this.mAllObjs = null;
    this.mAllParticles = null;
    this.mBounds = null;
    this.mCollisionInfos = [];
    this.mHero = null;

    this.mMainView = null;

    this.mHeroAction = 0;
    this.mMsgBoxShow = false;
    this.mHeroLastDir = null;
    
    this.mCurrentObj = 0;
    this.mTarget = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    gEngine.Textures.loadTexture(this.kParticleTexture);
    gEngine.Textures.loadTexture(this.kHeroDStand);
    gEngine.Textures.loadTexture(this.kHeroDWalk);
    gEngine.Textures.loadTexture(this.kHeroDWalk2);
    gEngine.Textures.loadTexture(this.kHeroRStand);
    gEngine.Textures.loadTexture(this.kHeroRWalk);
    gEngine.Textures.loadTexture(this.kHeroRWalk2);
    gEngine.Textures.loadTexture(this.kHeroUStand);
    gEngine.Textures.loadTexture(this.kHeroUWalk);
    gEngine.Textures.loadTexture(this.kHeroUWalk2);
    gEngine.Textures.loadTexture(this.kHeroLStand);
    gEngine.Textures.loadTexture(this.kHeroLWalk);
    gEngine.Textures.loadTexture(this.kHeroLWalk2);

    gEngine.Textures.loadTexture(this.kMapBkg);
    gEngine.Textures.loadTexture(this.kMapFrg);
    gEngine.TextFileLoader.loadTextFile(this.kMapFile, gEngine.TextFileLoader.eTextFileType.eJsonFile);

};

MyGame.prototype.unloadScene = function () {
};

MyGame.prototype.initialize = function () {
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mHero = new TextureRenderable(this.kHeroDStand);
    this.mHero.setColor([0, 0, 0, 0]);
    this.mHero.getXform().setPosition(14, 10);
    this.mHero.getXform().setSize(1, 1);


    this.mAllParticles = new ParticleGameObjectSet();
    
    this.createBounds();
    this.mMyMap = new Map(this.kMapFile);

    this.mMapBkg = new Background(this.kMapBkg, [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);
    this.mMapFrg = new Background(this.kMapFrg, [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);

    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, this.mMapBkg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mHero);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mMapFrg);

    this.mCamera = this.mMyMap.centerCamera(0.5, [20, 40, this.mMyMap.mViewWidth, this.mMyMap.mViewHeight]);
    this.mMainView = new MainView(this.mCamera);
    this.mSmallCamera = this.mMyMap.centerCamera(1, [1050, 550, 100, 100]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mMainView.setup();

    /*draw as a whole main view view-port*/
    gEngine.LayerManager.drawAllLayers(this.mMainView.getCam());

    this.mSmallCamera.setupViewProjection();
    this.mMapBkg.draw(this.mSmallCamera);
    this.mMapFrg.draw(this.mSmallCamera);
    this.mHero.draw(this.mSmallCamera);
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
    this.mHero.getXform().setPosition(14, 10);
    this.resume();
}

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
    var deltaX = 0.05;
    var xform = this.mHero.getXform();

    var newCenter = [xform.getXPos(), xform.getYPos()];
    var canUpdate = true;
    if (newCenter[0] + this.mCamera.getWCWidth() / 2 >= this.mMyMap.mWidth)
        canUpdate = false;
    if (newCenter[0] - this.mCamera.getWCWidth() / 2 <= 0)
        canUpdate = false;
    if (newCenter[1] + this.mCamera.getWCWidth() / 2 >= this.mMyMap.mWidth)
        canUpdate = false;
    if (newCenter[1] - this.mCamera.getWCWidth() / 2 <= 0)
        canUpdate = false;
    if (canUpdate == true) {
        this.mCamera.setWCCenter(newCenter[0], newCenter[1]);
    }

    this.mCamera.update();
    // Support hero movements
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Right)) return ;
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroRWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroRStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroRWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroRStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroRStand;

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Right", this.mHeroLastDir) == false)
            return ;
        this.mHeroLastDir = "Right";
        xform.incXPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Up)) return ;
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroUWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroUStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroUWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroUStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroUStand;

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Up", this.mHeroLastDir) == false)
            return ;
        this.mHeroLastDir = "Up";
        xform.incYPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Down)) return ;
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroDWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroDStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroDWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroDStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroDStand;

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Down", this.mHeroLastDir) == false)
            return ;
        this.mHeroLastDir = "Down";
        xform.incYPosBy(-deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Left)) return ;
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroLWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroLStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroLWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroLStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroLStand;

        if (this.mMyMap.canWalk(xform.getXPos(), xform.getYPos(), "Left", this.mHeroLastDir) == false)
            return ;
        this.mHeroLastDir = "Left";
        xform.incXPosBy(-deltaX);
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Right)) {
        this.mHero.mTexture = this.kHeroRStand;
        this.mHeroAction = 0;
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Up)) {
        this.mHero.mTexture = this.kHeroUStand;
        this.mHeroAction = 0;
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Left)) {
        this.mHero.mTexture = this.kHeroLStand;
        this.mHeroAction = 0;
    }

    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Down)) {
        this.mHero.mTexture = this.kHeroDStand;
        this.mHeroAction = 0;
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
};

MyGame.prototype.pause = function() {
    gEngine.GameLoop.stop();
    document.getElementById('pauseUI').style.visibility = "visible";
};

MyGame.prototype.resume = function() {
    document.getElementById('pauseUI').style.visibility = "hidden";
    gEngine.GameLoop.resume();
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