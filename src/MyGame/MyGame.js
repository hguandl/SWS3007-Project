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

function MyGame(mapName) {
    this.mMapName = mapName;

    this.kHeroPic = "assets/hero/tangseng_walk.png";
    this.kHeroJson = "assets/hero/tangseng_walk.json";

    this.kHeroInfo = "assets/hero/character_info.json";

    this.kMapFile = [];
    this.kMapEvents = [];
    this.kMapBkg = [];
    this.kMapFrg = [];

    this.kMapFile["palace"] = "assets/map/palace/palace-dat.json";
    this.kMapEvents["palace"] = "assets/map/palace/palace-event.json";
    this.kMapBkg["palace"] = "assets/map/palace/palace-bkg.png";
    this.kMapFrg["palace"] = "assets/map/palace/palace-frg.png";

    this.kMapFile["plateau"] = "assets/map/plateau/plateau-dat.json"
    this.kMapEvents["plateau"] = "assets/map/plateau/plateau-event.json";;
    this.kMapBkg["plateau"] = "assets/map/plateau/plateau-bkg.png";
    this.kMapFrg["plateau"] = "assets/map/plateau/plateau-frg.png";

    this.kPackageBg = "assets/package/package_bg.png";
    this.kPackageBrick = "assets/package/package_brick.png";
    this.kPackageUIBg = "assets/package/package_ui.png";
    this.kPackageMoneyIcon = "assets/package/package_money_icon.png";
    this.kPackageFontType = "assets/fonts/package_font";

    // region food icon
    this.kQueenPeach = "assets/props/queen_peach_icon.png";
    this.kNineTurnDan = "assets/props/nine_turn_dan_icon.png";
    this.kBloodOfDragon = "assets/props/blood_of_dragon_icon.png";
    this.kSpiritOfDragon = "assets/props/spirit_of_dragon_icon.png";
    this.kGlutinousRiceCongee = "assets/props/glutinous_rice_congee_icon.png";
    this.kHamBone = "assets/props/ham_bone_icon.png";
    this.kDongpoPork = "assets/props/dongpo_pork_icon.png";
    this.kWhatsThis = "assets/props/whats_this_icon.png";
    // endregion

    this.mCamera = null;
    this.mSmallCamera = null;

    this.mMainView = null;

    this.nextScene = null;
    this.startMsg = null;

    this.startMsgContent = null;

    this.lastPos = null;

}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    document.currentScene = this;
    gEngine.Textures.loadTexture(this.kMapBkg[this.mMapName]);
    gEngine.Textures.loadTexture(this.kMapFrg[this.mMapName]);
    gEngine.Textures.loadTexture(this.kHeroPic);
    gEngine.TextFileLoader.loadTextFile(this.kMapFile[this.mMapName], gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.TextFileLoader.loadTextFile(this.kMapEvents[this.mMapName], gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.TextFileLoader.loadTextFile(this.kHeroJson, gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.TextFileLoader.loadTextFile(this.kHeroInfo, gEngine.TextFileLoader.eTextFileType.eJsonFile);

    gEngine.Textures.loadTexture(this.kPackageBg);
    gEngine.Textures.loadTexture(this.kPackageBrick);
    gEngine.Textures.loadTexture(this.kPackageUIBg);
    gEngine.Textures.loadTexture(this.kPackageMoneyIcon);

    gEngine.Textures.loadTexture(this.kQueenPeach);
    gEngine.Textures.loadTexture(this.kNineTurnDan);
    gEngine.Textures.loadTexture(this.kBloodOfDragon);
    gEngine.Textures.loadTexture(this.kSpiritOfDragon);
    gEngine.Textures.loadTexture(this.kGlutinousRiceCongee);
    gEngine.Textures.loadTexture(this.kHamBone);
    gEngine.Textures.loadTexture(this.kDongpoPork);
    gEngine.Textures.loadTexture(this.kWhatsThis);

    gEngine.Fonts.loadFont(this.kPackageFontType);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMapBkg[this.mMapName]);
    gEngine.Textures.unloadTexture(this.kMapFrg[this.mMapName]);
    gEngine.Textures.unloadTexture(this.kHeroPic);

    if (this.nextScene) {
        this.lastPos = [this.mMyHero.getHero().getXform().getXPos(), this.mMyHero.getHero().getXform().getYPos()];
        document.currentScene = this.nextScene;
        gEngine.Core.startScene(this.nextScene);
    }
};

MyGame.prototype.initialize = function () {
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    window.statusBar.initialize();
    window.package = new Package(this.kPackageBg, this.kPackageBrick, this.kPackageUIBg, this.kPackageMoneyIcon, this.kPackageFontType, 20);

    this.mMyHero = new MyHero(this.kHeroPic, this.kHeroJson);

    this.mMyMap = new Map(this.kMapFile[this.mMapName], this.kMapEvents[this.mMapName]);

    if (this.lastPos === null) {
       this.mMyHero.getHero().getXform().setPosition(this.mMyMap.mBorn[0], this.mMyMap.mBorn[1]);
    } else {
        this.mMyHero.getHero().getXform().setPosition(this.lastPos[0], this.lastPos[1]);
    }

    this.mMapBkg = new Background(this.kMapBkg[this.mMapName], [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);
    this.mMapFrg = new Background(this.kMapFrg[this.mMapName], [0, 0, 0, 0], [this.mMyMap.mWidth/2, this.mMyMap.mHeight/2], [this.mMyMap.mWidth, this.mMyMap.mHeight]);

    gEngine.LayerManager.cleanUp();
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, this.mMapBkg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mMyHero.getHero());
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mMapFrg);

    var propsSet = [];
    propsSet[0] = new Props("Queen Peach", this.kQueenPeach, "Retrieve All HP");
    propsSet[1] = new Props("Nine Turn Dan", this.kNineTurnDan, "Retrieve All VP");
    propsSet[2] = new Props("Blood of Dragon", this.kBloodOfDragon, "Retrieve 400 HP");
    propsSet[3] = new Props("Spirit of Dragon", this.kSpiritOfDragon, "Retrieve 400 VP");
    propsSet[4] = new Props("Ham Bone", this.kHamBone, "Retrieve 250 HP");
    propsSet[5] = new Props("Glutinous Congee", this.kGlutinousRiceCongee, "Retrieve 250 VP");
    propsSet[6] = new Props("Dongpo Pork", this.kDongpoPork, "Just delicious...");
    propsSet[7] = new Props("What's this?", this.kWhatsThis, "Taste awful...");

    var i;
    for (i = 0; i < 8; i++) {
        window.package.addProps(propsSet[i]);
    }
    for (i = 2; i < 8; i++) {
        window.package.addProps(propsSet[i]);
    }
    for (i = 6; i < 8; i++) {
        window.package.addProps(propsSet[i]);
    }

    this.mMyMap.addItems();

    this.mCamera = this.mMyMap.centerCamera(0.5, [0, 0, this.mMyMap.mViewWidth, this.mMyMap.mViewHeight]);
    this.mMainView = new MainView(this.mCamera);
    this.mSmallCamera = this.mMyMap.centerCamera(0.75, [850, 480, 120, 120]);
    this.mSmallCamera.setBackgroundColor([0.105, 0.169, 0.204, 1]);

    UIButton.displayButtonGroup('default-button-group');

    if (window.combatScene) {
        switch (window.combatScene.combatResult) {
            case "win":
                this.startMsg = 1;
                break;
            case "lose":
                this.startMsg = 2;
                break;
        }
        return;
    }

    CharacterSet_Init(this.kHeroInfo);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    this.mMainView.setup();

    gEngine.LayerManager.drawAllLayers(this.mMainView.getCam());

    if (document.mShowSmallMap) {
        this.mSmallCamera.setupViewProjection();
        var i;
        for (i = 0; i < this.mMyMap.mItems.length; ++i)
            this.mMyMap.mItems[i].draw(this.mSmallCamera);
        this.mMyHero.getHero().draw(this.mSmallCamera);
    }

    if (document.mShowPackage) {
        window.package.draw();
    }

    if (document.mShowStatusBar) {
        window.statusBar.draw();
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

    window.package.update();

    var deltaX = 0.05;
    var xform = this.mMyHero.getHero().getXform();

    this.moveCamera(xform);

    if (window.mMapFreezed) return ;

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

    // var e = null;
    var e = this.mMyMap.detectEvent(xform.getXPos(), xform.getYPos());
    if (e)
        e(this);

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
    this.mSmallCamera.setWCCenter(newCenter[0], newCenter[1]);
    this.mSmallCamera.update();
};
