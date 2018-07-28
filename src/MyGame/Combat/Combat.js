/** A new level.
 * Call this function to turn into combat scene.
 * @param firstCharacter: 第一个出场的人物，请在每次调用该场景前修改该变量。
 * @param monster: 出场的怪物，请在每次调用该场景前修改该变量。
 * @property displaying {boolean} : 是否正在显示战斗动画。设置为true会自动使得按钮不能使用，设置为false时按钮又可以使用了。
 */
function Combat(firstCharacter, monster) {
    /**  @type Character  */
    this._character = null;
    Object.defineProperty(this, "character", {
        get: () => {
            return this._character;
        },
        set: v => {
            if (this._character)
                this._character.turnEndStatus = [];

            this._character = v;

            if (this._character)
                this._character.turnEndStatus = [];

            // 改变显示的人物图标
            /**  @type SpriteAnimateRenderable  */
            this.characterAnimate = new SpriteAnimateRenderable(this._character.spriteURL);
            this.characterAnimate.setColor([0, 0, 0, 0.0]);
            this.characterAnimate.getXform().setPosition(-22, 0);
            this.characterAnimate.getXform().setSize(10, 9);
            this.characterAnimate.setSpriteSequence(256, 5,     // first element pixel position: top-left 512 is top of image, 0 is left of image
                512 / 9, 256 / 6,       // width * height in pixels
                9,              // number of elements in this sequence
                0);             // horizontal padding in between
            this.characterAnimate.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
            this.characterAnimate.setAnimationSpeed(12);
        }
    });

    /** @type Character */
    this.firstCharacter = firstCharacter;
    /** @type Character */
    this.monster = monster;

    // todo: change this with respect to battle place
    this.kBackground = "assets/map/plateau/plateau-battle.png";
    /**  @type Camera  */
    this.camera = null;
    /**  @type Action  */
    this._action = new Action(_C.none);
    this.combatResult = null;

    this._status = _C.waiting;
    Object.defineProperty(this, "status", {
        get: () => {
            return this._status;
        },
        set: v => {
            this._status = v;
            UIButton.disableButtons(v !== _C.waiting);
        }
    });

    this.takeAction = function (actionType, actionParam) {
        this.status = _C.displaying;

        this._action = makeAction(actionType, actionParam);

        this.character.computeTurnEndStatus(true);
        this.monster.computeTurnEndStatus(false);

        this.displayAction();

        this.checkAlive();

        UIButton.disableButtons(false);
        // monster take action

        this._action = this.getMonsterAction();

        this.character.computeTurnEndStatus(false);
        this.monster.computeTurnEndStatus(true);

        this.displayAction();

        this.checkAlive();

        // end turn
        this.status = _C.waiting;
    };

    this.checkAlive = function () {
        if (this.monster.mCurrentHP <= 0) {
            this.combatResult = "win";
            document.mWin = true;
            document.currentScene.showMsg("Congratulations!\n Now you've got the flower.");
            // todo: add die
            gEngine.GameLoop.stop();
        } else if (this.character.mCurrentHP <= 0) {
            // todo: add die
            this.combatResult = "lose";
            gEngine.GameLoop.stop();
        }
    };

    this.displayAction = function () {
        switch (this._action.type) {
            case _C.skill:
                this.takeSkillAction();
                break;
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

    this.takeSkillAction = function () {
        this._action.param.skill.useSkill(this._action.param.user, this._action.param.aim);
    };

    this.takeAttackAction = function () {
        // add VP to attacker
        if (this._action.param.attacker.charaterType === _C.Hero) {
            this._action.param.attacker.mCurrentVP += _C.attackVP;
        }
        // calculate damage
        const damage = calDamage(this._action.param.attacker, this._action.param.defender);
        console.debug("attack, damage: ", damage);
        this._action.param.defender.mCurrentHP -= damage;
        this._action.param.defender.mCurrentHP = Math.round(this._action.param.defender.mCurrentHP);
        // todo: animate
    };

    this.takeChangeAction = function () {
        this._character = this._action['aimCharacter'];
        // todo: animate
    };

    this.getMonsterAction = function () {
        return makeAction(_C.attack, {
            attacker: this.monster,
            defender: this.character,
        });
    };
}

gEngine.Core.inheritPrototype(Combat, Scene);

Combat.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.monster.iconURL);

    ALL_SPRITE_TEXTURE.forEach(value => {
        gEngine.Textures.loadTexture(value);
    });
    gEngine.Textures.loadTexture(this.kBackground);

    UIButton.displayButtonGroup("combat-button-group");
};

Combat.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.character.iconURL);
    gEngine.Textures.unloadTexture(this.monster.iconURL);

    ALL_SPRITE_TEXTURE.forEach(value => {
        gEngine.Textures.unloadTexture(value);
    });
    gEngine.Textures.unloadTexture(this.kBackground);
    // 回到大地图
    // this.closeMsg(true);
    document.currentScene = this.nextScene;
    gEngine.Core.startScene(this.nextScene);
};

Combat.prototype.initialize = function () {
    this.camera = new Camera(
        vec2.fromValues(0, 0),
        100,
        _C.gameViewport
    );
    this.camera.setBackgroundColor([1.0, 1.0, 1.0, 1.0]);

    // set background
    this.mBackground = new TextureRenderable(this.kBackground);
    this.mBackground.setColor([0.0, 0.0, 0.0, 0.0]);
    this.mBackground.getXform().setPosition(0, 0);
    this.mBackground.getXform().setSize(this.camera.getWCWidth(), this.camera.getWCHeight());

    this.character = this.firstCharacter;
    delete this.firstCharacter;

    /** next version
     this.character.setBattleFigureSize(20, 20);
     this.character.setBattleFigurePosition(-22, 0);

     this.monster.setBattleFigureSize(20, 20);
     this.monster.setBattleFigurePosition(22, 0);
     */

    // set character icon position

    this.monsterIcon = new TextureRenderable(this.monster.iconURL);
    this.monsterIcon.setColor([0.0, 0.0, 0.0, 0.0]);
    this.monsterIcon.getXform().setPosition(22, 0);
    this.monsterIcon.getXform().setSize(20, 20);

    document.mShowStatusBar = true;

    // initialize character params
    CharacterSet.forEach(value => {
        value.turnEndStatus = [];
    });
};

Combat.prototype.draw = function () {
    gEngine.Core.clearCanvas([1.0, 1.0, 1.0, 1.0]);

    this.camera.setupViewProjection();

    /** next version
     this.character.drawBattleFigureByPos(-22, 0, 20, 20, this.camera);
     this.monster.drawBattleFigureByPos(22, 0, 20, 20, this.camera);
     */
    this.mBackground.draw(this.camera);

    this.characterAnimate.draw(this.camera);
    this.monsterIcon.draw(this.camera);

    if (document.mShowPackage) {
        window.package.draw();
    }

    if (document.mShowStatusBar) {
        window.statusBar.draw();
    }
};

Combat.prototype.update = function () {
    this.closeMsg();
    window.statusBar.update();
    window.package.update();
    updateCharacterStatus();

    this.characterAnimate.updateAnimation();

    // if (this._action.type === _C.none)
    //     return;

    // todo : add animation to actions
};

function enterCombat(game) {
    // todo: 这两行是为了能使现在版本能使用，将在下一个版本删除
    CharacterSet[0].iconURL = "assets/character/character.png";
    CharacterSet[1].iconURL = "assets/character/monster1.jpg";

    window.combatScene = new Combat(CharacterSet[0], CharacterSet[1]);
    game.nextScene = window.combatScene;
    gEngine.GameLoop.stop();
}

window.testCharacter = {
    iconURL: "assets/character/character.png"
};

window.testMonster = {
    iconURL: "assets/character/monster1.jpg"
};
