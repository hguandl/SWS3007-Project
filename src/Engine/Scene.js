/*
 * The template for a scene.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Default Constructor
 * @memberOf Scene
 * @returns {Scene}
 */
function Scene() {
    this.mMsgBoxShow = false;
    this.mMapFreezed = false;
}

Scene.prototype.showMsg = function(msg) {
    document.getElementById('infoBox').style.display = "block";
    document.getElementById('info_0').innerText=msg;
    this.mMsgBoxShow = true;
    this.mMapFreezed = true;
};

Scene.prototype.closeMsg = function() {
    if  (gEngine.Input.isKeyReleased(gEngine.Input.keys.Space)) {
        if (this.mMsgBoxShow) {
            document.getElementById('infoBox').style.display = "none";
            document.getElementById('info_0').innerText=null;
            this.mMsgBoxShow = false;
            this.mMapFreezed = false;
        }
    }
}

//<editor-fold desc="functions subclass should override">
/**
 * Begin Scene: must load all the scene contents when done <p>
 *   => start the GameLoop<p>
 * The game loop will call initialize and then update/draw
 * @memberOf Scene
 * @returns {void}
 */
Scene.prototype.loadScene = function () {
    // override to load scene specific contents
};

/**
 * Performs all initialization functions.<p>
 *   => Should call gEngine.GameLoop.start(this)!
 *   @memberOf Scene
 * @returns {void}
 */
Scene.prototype.initialize = function () {
    // initialize the level (called from GameLoop)
};

/**
 * update function to be called from EngineCore.GameLoop.
 * @memberOf Scene
 * @returns {void}
 */
Scene.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
};

/**
 * draw function to be called from EngineCore.GameLoop.
 * @memberOf Scene
 * @returns {void}
 */
Scene.prototype.draw = function () {};

/**
 * Must unload all resources.
 * @memberOf Scene
 * @returns {void}
 */
Scene.prototype.unloadScene = function () {
    // .. unload all resources
};
//</editor-fold>
