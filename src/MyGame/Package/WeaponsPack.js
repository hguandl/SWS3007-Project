"use strict";

function WeaponsPack () {
    this.kBgFile = [];
    this.kBgFile[0] = "assets/weapons_pack/bg_tangseng_2.png";
    this.kBgFile[1] = "assets/weapons_pack/bg_sunwukong_2.png";
    this.kBgFile[2] = "assets/weapons_pack/bg_zhubajie_2.png";
    this.kBgFile[3] = "assets/weapons_pack/bg_shaseng_2.png";
    this.kBrickFile = "assets/weapons_pack/brick_2.png";
    this.kMonkeyPhotoFile = "assets/weapons_pack/monkey.png";

    this.kSword_A1 = "assets/weapons_pack/Sword_A1.png";
    this.kHelmet_A1 = "assets/weapons_pack/Helmet_A1.png";

    this.kFontType = "assets/fonts/system-default-font";

    this.kTypesNum = [];
    this.kTypes = [];

    this.mCamera = null;

    this.mBg = [];
    this.mBrick = null;
    this.mUIBg = null;
    this.choosingUI = null;

    this.mSize = 0;
    this.mCapacity = 15;

    this.leftX = 0;
    this.topY = 75;
    this.width = 160;
    this.singleW1 = 0.0322 * this.width;
    this.gapY1 = 0.0078 * this.width;
    this.firstBrickX = this.leftX + 0.5483 * this.width;
    this.firstBrickY = this.topY - 0.1372 * this.width;

    this.weaponsCollections = [];
    this.equipedWeapons = [];
    for (var k = 0; k < 4; k++) {
        this.equipedWeapons[k] = [];
    }

    this.currentSelectPage = 0;        // left page = 0, right page = 1;
    this.currentSelectCharacter = 0;   // tangseng = 0, sunwukong = 1 ...
    this.currentSelectWeapon = 0;      // first weapon = 0, ...

}
gEngine.Core.inheritPrototype(WeaponsPack, Scene);

WeaponsPack.prototype.loadScene = function () {
    for (var i = 0; i < 4; i++) {
        gEngine.Textures.loadTexture(this.kBgFile[i]);
    }
    gEngine.Textures.loadTexture(this.kBrickFile);
    gEngine.Textures.loadTexture(this.kMonkeyPhotoFile);
    gEngine.Textures.loadTexture(this.kSword_A1);
    gEngine.Textures.loadTexture(this.kHelmet_A1);

    gEngine.Fonts.loadFont(this.kFontType);
};

WeaponsPack.prototype.unloadScene = function () {

};

var WeaponsSet = [];
WeaponsPack.prototype.initialize = function () {
    // region need not change
    this.mCamera = new Camera(
        vec2.fromValues(this.leftX + 0.5 * this.width, this.topY - 0.25 * this.width),
        0.75 * this.width,
        [0, 0, 960, 600],
        true
    );
    this.mCamera.setBackgroundColor([1.0, 1.0, 1.0, 0]);
    this.mCamera.setupViewProjection();

    var i;
    for (i = 0; i < 4; i++) {
        this.mBg[i] = new TextureRenderable(this.kBgFile[i]);
        this.mBg[i].setColor([1, 1, 1, 0]);
        this.mBg[i].getXform().setPosition(this.leftX + 0.5 * this.width, this.topY - 0.25 * this.width);
        this.mBg[i].getXform().setSize(this.width, 0.5 * this.width);
    }

    this.mBrick = new TextureRenderable(this.kBrickFile);
    this.mBrick.setColor([1, 1, 1, 0]);
    this.mBrick.getXform().setPosition(-200, -200);
    this.mBrick.getXform().setSize(this.singleW1 + 0.025 * this.width, this.singleW1 + 0.025 * this.width);

    // this.mUIBg = new TextureRenderable(this.kUIBgFile);
    // this.mUIBg.setColor([1, 1, 1, 0]);
    // this.mUIBg.getXform().setPosition(-200, -200);

    // endregion

    this.kTypesNum["Helmet"] = 0;
    this.kTypesNum["Necklace"] = 1;
    this.kTypesNum["Arm"] = 2;
    this.kTypesNum["Bracelet"] = 3;
    this.kTypesNum["Bracelet2"] = 4;
    this.kTypesNum["Shoes"] = 5;
    this.kTypesNum["Sword"] = 6;
    this.kTypesNum["Shield"] = 7;
    this.kTypes = ["Helmet", "Necklace", "Arm", "Bracelet", "Bracelet2", "Shoes", "Sword", "Shield"];

    WeaponsSet["倚天剑"] = new Weapons("倚天剑", this.kSword_A1, "Super Rare" + "Attack + 200", "Sword");
    WeaponsSet["头盔"] = new Weapons("头盔", this.kHelmet_A1, "Very Rare" + "Defense + 100, Avoid + 0.10", "Shoes");

    var i;
    for (i in WeaponsSet) {
        this.addWeapons(WeaponsSet[i]);                     // 全给玩家
    }
    for (i in this.weaponsCollections) {
        // console.log(i);
        //this.equipWeapons(i, 0);    // 全给唐僧穿上,这里没有成功穿上
        this.equipWeapons(this.weaponsCollections[i], 0);
    }

};

WeaponsPack.prototype.update = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        if (this.currentSelectPage == 0) {
            this.currentSelectCharacter = Math.min(3, this.currentSelectCharacter + 1);
        } else {
            this.currentSelectWeapon = Math.min(14, this.currentSelectWeapon + 1);
        }
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W)) {
        if (this.currentSelectPage == 0) {
            this.currentSelectCharacter = Math.max(0, this.currentSelectCharacter - 1);
        } else {
            this.currentSelectWeapon = Math.max(0, this.currentSelectWeapon - 1);
        }


    }

    if (gEngine.Input.isKeyReleased(gEngine.Input.keys.Escape)) {
        this.currentSelectPage = 0;
        switchWeaponsPack();
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D)) {
        if (this.currentSelectPage == 0) {
            this.currentSelectPage = 1;
            this.currentSelectWeapon = 0;
        } else if (this.currentSelectWeapon <= 7) {
            this.currentSelectWeapon += 8;
        }
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A)) {
        if (this.currentSelectPage == 1) {
            if (this.currentSelectWeapon >= 8) {
                this.currentSelectWeapon -= 8;
            } else {
                this.currentSelectPage = 0;
                this.currentSelectWeapon = 0;
            }
        }
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        if (this.currentSelectPage == 0) {
            this.currentSelectPage = 1;
            this.currentSelectWeapon = 0;
        } else {
            // show the UI
        }
    }
};

WeaponsPack.prototype.draw = function () {
    this.mCamera.setupViewProjection();

    this.mBg[this.currentSelectCharacter].draw(this.mCamera);

    var i;
    for (i = 0; i < 15; i++) {
        var cx = this.firstBrickX;
        //var cy = this.topY - (0.1372 + i * 0.0322) * this.width - i * this.gapY1;
        var cy = this.firstBrickY - i * (0.0322 * this.width + this.gapY1);

        if (this.currentSelectPage == 1 && this.currentSelectWeapon == i) {
            this.mBrick.getXform().setPosition(cx - 0.2, cy);
            this.mBrick.draw(this.mCamera);
        }

        var weapon = this.equipedWeapons[this.currentSelectCharacter][i];
        if (weapon != null) {
            weapon.drawIconByPos(cx, cy, this.singleW1, this.singleW1, this.mCamera);
            if (this.currentSelectWeapon == i) {
                weapon.showInfoByPos(this.kFontType, cx, cy, [1, 1, 1, 1], this.singleW1, this.mCamera);
            }
        }
    }
};

WeaponsPack.prototype.addWeapons = function (newWeapons) {
    if (this.mSize < this.mCapacity) {
        newWeapons.setEquipedInfo(-1);
        this.weaponsCollections.push(newWeapons);
        this.mSize += 1;
    }
};

WeaponsPack.prototype.equipWeapons = function (weapon, charNum) {
    //var weapon = this.weaponsCollections[weaponNum];

    var type = weapon.getType();

    var typeNum = this.kTypesNum[type];

    if (this.equipedWeapons[charNum][typeNum] != null) {
        this.addWeapons(this.equipedWeapons[charNum][typeNum]);
    }
    this.equipedWeapons[charNum][typeNum] = weapon;
    weapon.setEquipedInfo(charNum);
};

WeaponsPack.prototype.unequipWeapons = function (type, charNum) {
    var typeNum = this.kTypesNum[type];
    if (this.equipedWeapons[charNum][typeNum] != null) {
        this.addWeapons(this.equipedWeapons[charNum][typeNum]);
        this.equipedWeapons[charNum][typeNum] = null;
    }
};
