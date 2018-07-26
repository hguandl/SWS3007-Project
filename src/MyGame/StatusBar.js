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

function StatusBar() {
    // The camera to view the scene
    this.kBar = "assets/hero/status.png";

    this.mBarCamera = null;
    this.mHPCamera = null;

    this.mBar = null;
    this.mHP = [];
    this.mVP = [];
}

StatusBar.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kBar);
};

StatusBar.prototype.initialize = function () {
    gEngine.Textures.loadTexture(this.kBar);

    this.mBarCamera = new Camera(
        vec2.fromValues(0, 2015),   // position of the camera
        1024,                        // width of camera
        [0, 0, 970, 120]        // viewport (orgX, orgY, width, height)
    );
    this.mBarCamera.setBackgroundColor([1, 0, 0, 0]);

    this.mBar = new TextureRenderable(this.kBar);
    this.mBar.setColor([0, 0, 1, 0]);  // tints red
    this.mBar.getXform().setPosition(0, 2000);
    this.mBar.getXform().setSize(1024, 256);

    var i;
    for (i = 0; i < 3; ++i) {
        this.mHP.push(new Renderable());
        this.mHP[i].setColor([.9921975, .25283019, .39453125, 0.5]);
        this.mHP[i].getXform().setPosition(-210 + i * 290, 2030);
        this.mHP[i].getXform().setSize(130, 20);
    }
    // this.mHP = new Renderable();
    // this.mHP.setColor([.9921975, .25283019, .39453125, 0.5]);
    // this.mHP.getXform().setPosition(-210, 2030);
    // this.mHP.getXform().setSize(130, 20);

    for (i = 0; i < 3; ++i) {
        this.mVP.push(new Renderable());
        this.mVP[i].setColor([.625, .9296875, .87890625, 0.5]);
        this.mVP[i].getXform().setPosition(-210 + i * 290, 1990);
        this.mVP[i].getXform().setSize(130, 20);
    }
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StatusBar.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mBarCamera.setupViewProjection();
    this.mBar.draw(this.mBarCamera);

    var i;
    for (i = 0; i < this.mHP.length; ++i) {
        this.mHP[i].draw(this.mBarCamera);
        this.mVP[i].draw(this.mBarCamera);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!

StatusBar.prototype.incHP = function (delta, i) {
    // ratio between Bar length and HP, of the ith Hero
    var ratio = 130 / CharacterSet[i].getMaxHP();
    var delta_len = ratio * delta;

    // 130是HP VP条的长度
    var current_width = this.mHP[i].getXform().getWidth();
    if (current_width + delta_len > 130) {
        delta_len = 130 - current_width;
        this.mHP[i].getXform().incWidthBy(delta_len);
        this.mHP[i].getXform().incXPosBy(delta_len / 2);
    }
    else if (current_width + delta_len < 0) {
        delta_len = -current_width;
        this.mHP[i].getXform().incWidthBy(delta_len);
        this.mHP[i].getXform().incXPosBy(delta_len / 2);
    }
    else {
        this.mHP[i].getXform().incWidthBy(delta_len);
        this.mHP[i].getXform().incXPosBy(delta_len / 2);
    }
};

StatusBar.prototype.incVP = function (delta, i) {
    // ratio between Bar length and HP, of the ith Hero
    var ratio = 130 / CharacterSet[i].getMaxVP();
    var delta_len = ratio * delta;

    // 130是HP VP条的长度
    var current_width = this.mVP[i].getXform().getWidth();
    if (current_width + delta_len > 130) {
        delta_len = 130 - current_width;
        this.mVP[i].getXform().incWidthBy(delta_len);
        this.mVP[i].getXform().incXPosBy(delta_len / 2);
    }
    else if (current_width + delta_len < 0) {
        delta_len = -current_width;
        this.mVP[i].getXform().incWidthBy(delta_len);
        this.mVP[i].getXform().incXPosBy(delta_len / 2);
    }
    else {
        this.mVP[i].getXform().incWidthBy(delta_len);
        this.mVP[i].getXform().incXPosBy(delta_len / 2);
    }
};
