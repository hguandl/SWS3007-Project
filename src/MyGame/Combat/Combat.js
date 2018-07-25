//  todo: 商量人物技能的接口，skill1表示第一个技能，应该包含damage, VP（疲劳值）

/** A new level.
 * Call this function to turn into combat scene.
 * @param topCharacter: 第一个出场的人物，请在每次调用该场景前修改该变量。
 * @param monster: 出场的怪物，请在每次调用该场景前修改该变量。
 * @property displaying {boolean} : 是否正在显示战斗动画。设置为true会自动使得按钮不能使用，设置为false时按钮又可以使用了。
 */
function Combat(topCharacter, monster) {
    this.topCharacter = topCharacter;
    this.monster = monster;

    this.characterIcon = null;
    this.monsterIcon = null;

    this.camera = null;
    this._action = new Action(_C.none);

    this._status = _C.waiting;
    Object.defineProperty(this, "status", {
        get: () => {
            return this._status;
        },
        set: v => {
            this._status = v;
            UIButton.disableButtons(v);
        }
    });

    this.chooseAction = function(action) {
        this.status = true;
        this._action = action;
    };

    this.takeAction = function() {
        switch (this._action.type) {
            case _C.attack:
                this.takeAttackAction();
                break;
            case _C.change:
                this.takeChangeAction();
                break;
            case _C.item:
                // todo: item action
                break;
            default:
                console.warn("unknown action type");
                break;
        }
    };

    this.takeAttackAction = function() {
        this.monster.mHP -= calDamage(this.topCharacter, this.monster);
        // todo: animate
    };

    this.takeChangeAction = function() {
        this.topCharacter = this._action['aimCharacter'];

        // todo: animate
    };
}

gEngine.Core.inheritPrototype(Combat, Scene);

Combat.prototype.loadScene = function() {
    // todo: check if this works
    gEngine.Textures.loadTexture(this.topCharacter.iconURL);
    gEngine.Textures.loadTexture(this.monster.iconURL);
};

Combat.prototype.unloadScene = function() {
    gEngine.Textures.unloadTexture(this.topCharacter.iconURL);
    gEngine.Textures.unloadTexture(this.monster.iconURL);
};

Combat.prototype.initialize = function() {
    this.camera = new Camera(
        vec2.fromValues(0, 0),
        100,
        _C.gameViewport
    );
    this.camera.setBackgroundColor([1.0, 1.0, 1.0, 1.0]);

    this.characterIcon = new TextureRenderable(this.topCharacter.iconURL);  // todo: 商量iconURL的接口，该接口用于获取icon的URL
    this.characterIcon.setColor([0.0, 0.0, 0.0, 0.0]);
    this.characterIcon.getXform().setPosition(-22, 0);
    this.characterIcon.getXform().setSize(20, 20);

    this.monsterIcon = new TextureRenderable(this.monster.iconURL);
    this.monsterIcon.setColor([0.0, 0.0, 0.0, 0.0]);
    this.monsterIcon.getXform().setPosition(22, 0);
    this.monsterIcon.getXform().setSize(20, 20);
};

Combat.prototype.draw = function() {
    gEngine.Core.clearCanvas([1.0, 1.0, 1.0, 1.0]);

    this.camera.setupViewProjection();

    this.characterIcon.draw(this.camera);
    this.monsterIcon.draw(this.camera);
};

Combat.prototype.update = function() {
    if (this._action.type === _C.none)
        return;

    // todo : add animation to actions
    this._action.takeAction();
    this._action = makeAction(_C.none);
    this.status = _C.waiting;
};

window.testCharacter = {
    iconURL: "assets/character/character.png"
};

window.testMonster = {
    iconURL: "assets/character/monster1.jpg"
};
