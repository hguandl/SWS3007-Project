/*
 * File: MyGame.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, BlueLevel:false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // textures:
    this.kPortal = "assets/minion_portal.png";      // supports png with transparency
    this.kCollector = "assets/minion_collector.png";
    this.kHeroDWalk = "assets/hero1.png";
    this.kHeroDStand = "assets/hero2.png";
    this.kHeroDWalk2 = "assets/hero3.png";
    this.kHeroLWalk = "assets/hero4.png";
    this.kHeroLStand = "assets/hero5.png";
    this.kHeroLWalk2 = "assets/hero6.png";
    this.kHeroRWalk = "assets/hero7.png";
    this.kHeroRStand = "assets/hero8.png";
    this.kHeroRWalk2 = "assets/hero9.png";
    this.kHeroUWalk = "assets/hero10.png";
    this.kHeroUStand = "assets/hero11.png";
    this.kHeroUWalk2 = "assets/hero12.png";

    // The camera to view the scene
    this.mCamera = null;

    // the hero and the support objects
    this.mHero = null;
    this.mPortal = null;
    this.mCollector = null;

    this.mHeroAction = 0;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.kPortal);
    gEngine.Textures.loadTexture(this.kCollector);
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
};

MyGame.prototype.unloadScene = function () {
    // Game loop not running, unload all assets

    gEngine.Textures.unloadTexture(this.kPortal);
    gEngine.Textures.unloadTexture(this.kCollector);

    // starts the next level
    var nextLevel = new BlueLevel();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(20, 60),   // position of the camera
        20,                        // width of camera
        [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    // Step B: Create the game objects
    this.mPortal = new TextureRenderable(this.kPortal);
    this.mPortal.setColor([1, 0, 0, 0.2]);  // tints red
    this.mPortal.getXform().setPosition(25, 60);
    this.mPortal.getXform().setSize(3, 3);

    this.mCollector = new TextureRenderable(this.kCollector);
    this.mCollector.setColor([0, 0, 0, 0]);  // No tinting
    this.mCollector.getXform().setPosition(15, 60);
    this.mCollector.getXform().setSize(3, 3);

    // Step C: Create the hero object in blue
    // this.mHero = new Renderable();
    // this.mHero.setColor([0, 0, 1, 1]);
    this.mHero = new TextureRenderable(this.kHeroDStand);
    this.mHero.setColor([0, 0, 0, 0]);
    this.mHero.getXform().setPosition(20, 60);
    this.mHero.getXform().setSize(3, 3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: Draw everything
    this.mPortal.draw(this.mCamera.getVPMatrix());
    this.mHero.draw(this.mCamera.getVPMatrix());
    this.mCollector.draw(this.mCamera.getVPMatrix());
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // let's only allow the movement of hero,
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.05;
    var xform = this.mHero.getXform();

    // Support hero movements
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroRWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroRStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroRWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroRStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroRStand;

        if (xform.getXPos() > 30) {
            return ;
        }
        xform.incXPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {

        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroUWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroUStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroUWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroUStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroUStand;

        xform.incYPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroDWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroDStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroDWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroDStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroDStand;

        xform.incYPosBy(-deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        this.mHeroAction = (this.mHeroAction + 1) % 40;

        if (this.mHeroAction > 1 && this.mHeroAction < 10) this.mHero.mTexture = this.kHeroLWalk;
        if (this.mHeroAction > 9 && this.mHeroAction < 20) this.mHero.mTexture = this.kHeroLStand;
        if (this.mHeroAction > 19 && this.mHeroAction < 30) this.mHero.mTexture = this.kHeroLWalk2;
        if (this.mHeroAction > 29 && this.mHeroAction < 40) this.mHero.mTexture = this.kHeroLStand;
        if (this.mHeroAction == 0) this.mHero.mTexture = this.kHeroLStand;

        if (xform.getXPos() < 11) {
            return ;
        }
        xform.incXPosBy(-deltaX);
        // if (xform.getXPos() < 11) {  // this is the left-bound of the window
        //     gEngine.GameLoop.stop();
        // }
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

    // continously change texture tinting
    var c = this.mPortal.getColor();
    var ca = c[3] + deltaX;
    if (ca > 1) {
        ca = 0;
    }
    c[3] = ca;
};
