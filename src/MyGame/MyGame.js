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

    this.kSceneFile = "assets/map.json";
    
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

    this.mBlocks = [];

    this.mHeroAction = 0;
    this.mMsgBoxShow = false;
    
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

    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eJsonFile);
};

MyGame.prototype.unloadScene = function () {
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(20, 60),   // position of the camera
        20,                        // width of camera
        [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mSmallCamera = new Camera(
        vec2.fromValues(20, 60),   // position of the camera
        20,                        // width of camera
        [540, 430, 100, 50]         // viewport (orgX, orgY, width, height)
        );
    this.mSmallCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mHero = new TextureRenderable(this.kHeroDStand);
    this.mHero.setColor([0, 0, 0, 0]);
    this.mHero.getXform().setPosition(20, 58);
    this.mHero.getXform().setSize(1, 1);
    this.mAllParticles = new ParticleGameObjectSet();
    
    this.createBounds();

    this.mSceneJson = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
    var mapInfo = this.mSceneJson["map"];
    var i;
    var cnt = 0;
    for (i = 0; i < mapInfo.length; ++i) {
        if (mapInfo[i] == 1) {
            ++ cnt;
            var tmp = new Renderable();
            tmp.setColor([0, 1, 0, 1]);
            tmp.getXform().setPosition(10.5 + i % 20, 64.5 - Math.floor(i / 20));
            tmp.getXform().setSize(1, 1);
            this.mBlocks.push(tmp);
        }
        if (mapInfo[i] == 2) {
            ++ cnt;
            var tmp = new Renderable();
            tmp.setColor([1, 0, 0, 1]);
            tmp.getXform().setPosition(10.5 + i % 20, 64.5 - Math.floor(i / 20));
            tmp.getXform().setSize(1, 1);
            this.mBlocks.push(tmp);
        }
        if (mapInfo[i] == 3) {
            ++ cnt;
            var tmp = new Renderable();
            tmp.setColor([0, 0, 1, 1]);
            tmp.getXform().setPosition(10.5 + i % 20, 64.5 - Math.floor(i / 20));
            tmp.getXform().setSize(1, 1);
            this.mBlocks.push(tmp);
        }
    }
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: Draw everything
    var i;
    this.mHero.draw(this.mCamera);
    for (i = 0; i < this.mBlocks.length; ++i)
        this.mBlocks[i].draw(this.mCamera);

    this.mSmallCamera.setupViewProjection();
    this.mHero.draw(this.mSmallCamera);
    for (i = 0; i < this.mBlocks.length; ++i)
        this.mBlocks[i].draw(this.mSmallCamera);
};

MyGame.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

MyGame.prototype.mapPos = function(xPos, yPos) {
    return 20 * Math.round(64.5 - yPos) + Math.round(xPos - 10.5);
};

MyGame.prototype.showMsg = function(msg) {
    document.getElementById('infoBox').style.visibility = "visible";
    document.getElementById('info_0').innerText=msg;
    this.mMsgBoxShow = true;
};

MyGame.prototype.resetPos = function() {
    this.mHero.getXform().setPosition(20, 58);
    this.resume();
}

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
    var deltaX = 0.05;
    var xform = this.mHero.getXform();

    // Support hero movements
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (gEngine.Input.isDirectionLocked(gEngine.Input.keys.Right)) return ;
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroRWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroRStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroRWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroRStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroRStand;

        var status = this.mSceneJson["map"][this.mapPos(xform.getXPos(), xform.getYPos()) + 1];
        switch (status) {
            case 1:
            return;
            break;
            case 2:
            this.showMsg("You've met a monster!");
            return ;
            break;
            case 3:
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space))
                this.showMsg("You've found a treasure!");
            return ;
            break;
        }
        if (xform.getXPos() > 29.5) {
            return ;
        }
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

        var status = this.mSceneJson["map"][this.mapPos(xform.getXPos(), xform.getYPos()) - 20];
        switch (status) {
            case 1:
            return;
            break;
            case 2:
            this.showMsg("You've met a monster!");
            return ;
            break;
            case 3:
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space))
                this.showMsg("You've found a treasure!");
            return ;
            break;
        }

        if (xform.getYPos() > 64.5) {
            return ;
        }
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

        var status = this.mSceneJson["map"][this.mapPos(xform.getXPos(), xform.getYPos()) + 20];
        switch (status) {
            case 1:
            return;
            break;
            case 2:
            this.showMsg("You've met a monster!");
            return ;
            break;
            case 3:
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space))
                this.showMsg("You've found a treasure!");
            return ;
            break;
        }

        if (xform.getYPos() < 55.5) {
            return ;
        }
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

        var status = this.mSceneJson["map"][this.mapPos(xform.getXPos(), xform.getYPos()) - 1];
        switch (status) {
            case 1:
            return;
            break;
            case 2:
            this.showMsg("You've met a monster!");
            return ;
            break;
            case 3:
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space))
                this.showMsg("You've found a treasure!");
            return ;
            break;
        }
        if (xform.getXPos() < 10.5) {
            return ;
        }
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