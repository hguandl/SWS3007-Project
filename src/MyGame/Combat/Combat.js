// todo: change character

/** A new level.
 * Call this function to turn into combat scene.
 * @param firstCharacter: 第一个出场的人物，请在每次调用该场景前修改该变量。
 * @param monster: 出场的怪物，请在每次调用该场景前修改该变量。
 * @property displaying {boolean} : 是否正在显示战斗动画。设置为true会自动使得按钮不能使用，设置为false时按钮又可以使用了。
 */
function Combat(firstCharacter, monster) {
    this._turn = null;

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
            this.characterAnimate.setAnimationSpeed(_C.combatSpeed);
        }
    });

    /** @type Character */
    this.firstCharacter = firstCharacter;
    /** @type Character */
    this.monster = monster;

    // todo: change this with respect to battle place
    this.kBackground = "assets/map/zhuzishan/zhuzishan-battle.png";
    this.monster.spriteURL = "assets/hero/fight/monster.png";

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
            // 如果不在等待用户操作状态，就禁止按钮
            UIButton.disableButtons(v !== _C.waiting);
        }
    });

    /**
     * 这个函数将会在用户点击攻击或技能或换人按钮的时候被调用
     * @param actionType {number}
     * @param actionParam {Object}
     */
    this.takeAction = function (actionType, actionParam) {
        this.status = _C.commandGiven;
        this._turn = TURN.hero;

        this._action = makeAction(actionType, actionParam);

        this.displayAction(enemyTurn, this);

        function enemyTurn(combat) {
            this.character.computeTurnEndStatus(true);
            this.monster.computeTurnEndStatus(false);

            combat.checkAlive();

            // monster take action
            combat._turn = TURN.monster;
            combat._action = combat.getMonsterAction();

            combat.displayAction(endTurn, combat);
        }

        function endTurn(combat) {
            combat.character.computeTurnEndStatus(false);
            combat.monster.computeTurnEndStatus(true);
            combat.checkAlive();
        }
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

    this.displayAction = function (callback, param) {
        this._callback = callback;
        this._callbackParam = param;

        this.status = _C.displaying;
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
        const damage = this._action.param.defender.randChangeHP(-calDamage(this._action.param.attacker, this._action.param.defender));
        this.showMsg(this._action.param.attacker.characterType + " use attack. Damage: " + damage);
    };

    this.takeChangeAction = function () {
        this._character = this._action['aimCharacter'];
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
    ALL_SPRITE_TEXTURE.forEach(value => {
        gEngine.Textures.loadTexture(value);
    });
    gEngine.Textures.loadTexture(this.kBackground);

    UIButton.displayButtonGroup("combat-button-group");
};

Combat.prototype.unloadScene = function () {
    ALL_SPRITE_TEXTURE.forEach(value => {
        gEngine.Textures.unloadTexture(value);
    });
    gEngine.Textures.unloadTexture(this.kBackground);
    // 回到大地图
    this.closeMsg(true);
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

    // 改变显示的怪物图标
    /**  @type SpriteAnimateRenderable  */
    this.monsterAnimate = new SpriteAnimateRenderable(this.monster.spriteURL);
    this.monsterAnimate.setColor([0, 0, 0, 0.0]);
    this.monsterAnimate.getXform().setPosition(22, 0);
    this.monsterAnimate.getXform().setSize(10, 9);
    this.monsterAnimate.setSpriteSequence(256, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
        512 / 9, 256 / 6,       // width * height in pixels
        9,              // number of elements in this sequence
        0);             // horizontal padding in between
    this.monsterAnimate.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.monsterAnimate.setAnimationSpeed(_C.combatSpeed);

    document.mShowStatusBar = true;

    // initialize character params
    CharacterSet.forEach(value => {
        value.turnEndStatus = [];
    });
};

Combat.prototype.draw = function () {
    gEngine.Core.clearCanvas([1.0, 1.0, 1.0, 1.0]);

    this.camera.setupViewProjection();

    this.mBackground.draw(this.camera);

    this.characterAnimate.draw(this.camera);
    this.monsterAnimate.draw(this.camera);

    if (document.mShowPackage) {
        window.package.draw();
    }

    if (document.mShowStatusBar) {
        window.statusBar.draw();
    }
};

Combat.prototype.update = function () {
    window.statusBar.update();
    window.package.update();

    if (this.status !== _C.displaying)
        return;

    if (this._turn === TURN.hero) {
        if (this.characterAnimate.updateAnimation()) {
            this.closeMsg();
            this.status = _C.commandGiven;
            if (this._callback) {
                this._callback(this._callbackParam);
                this._callback = this._callbackParam = null;
            }
        }
    } else {
        console.assert(this._turn === TURN.monster);
        if (this.monsterAnimate.updateAnimation()) {
            if (this._callback) {
                this._callback(this._callbackParam);
                this._callback = this._callbackParam = null;
            }
            this.closeMsg();
            this.status = _C.waiting;
        }
    }
};

function enterCombat(game) {
    window.combatScene = new Combat(CharacterSet[0], CharacterSet[1]);
    game.nextScene = window.combatScene;
    gEngine.GameLoop.stop();
}
