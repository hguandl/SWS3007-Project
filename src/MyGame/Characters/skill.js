"use strict";

class Skill {
    constructor(name, VP) {
        this.name = name;
        this.VP = VP;
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP");
        return new Skill(skillInfo["name"], skillInfo["VP"]);
    }

    static getDescription() {
        return "Skill prototype description";
    }

    getUsage() {
        return formatString("产生 %0 疲劳值。", this.VP);
    }

    useSkill(user, ...args) {
        user.mCurrentVP += this.VP;
        document.currentScene.showMsg(user.characterType + " 使用了 " + this.name + "。");
    }

    /**
     * 按照index展示按钮
     * @param index
     */
    displaySkillOnButton(index) {
        try {
            UIButton.setSkillName(index, this.name);
            const btnId = "#skill" + index.toString() + "-button";
            // document.getElementById(btnId.slice(1)).innerText = this.name;
            $(btnId).text(this.name);
            const usage = this.getUsage();
            const mouseOn = function () {
                document.currentScene.showMsg(usage);
            };
            const mouseOff = function () {
                document.currentScene.closeMsg(true);
            };
            $(btnId).hover(mouseOn, mouseOff);
        }
        catch (error) {
            console.warn(error.message);
            console.debug(this);
        }
    }
}

/**
 * 改变对方防御百分比为<defPercent>
 */
class FieryEyes extends Skill {
    constructor(VP, defPercent, turn) {
        super("火眼金睛", VP);
        this.defPercent = defPercent;
        this.turn = turn;
    }

    static getDescription() {
        return "The eyes of Monkey King is baked by the \"三昧真火\", which makes it penetrating.";
    }

    getUsage() {
        return formatString("将目标的防御减为当前的 %0， 持续 %1 回合。\n", this.defPercent, this.turn)
            + super.getUsage();
    }

    /**
     *
     * @param user {Character}
     * @param aim {Character}
     */
    useSkill(user, aim) {
        super.useSkill(user);
        // window.combatScene.showMsg(user.characterType + " use FieryEyes.");
        aim.turnEndStatus.push(new BuffStatus("DEF", this.turn, this.defPercent, _C.percent));
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "defPercent", "turn");
        return new FieryEyes(skillInfo["VP"], skillInfo["defPercent"], skillInfo["turn"]);
    }
}

/**
 * 重击。造成百分之<dmgPercent>的伤害。
 */
class HeavyHit extends Skill {
    constructor(VP, dmgPercent) {
        super("强力打击", VP);
        this.dmgPercent = dmgPercent;
    }

    static getDescription() {
        return "A 强力打击 will cause more 伤害 than attack.";
    }

    getUsage() {
        return formatString("比普通攻击造成 %0 额外伤害。\n", this.dmgPercent) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        const damage = aim.randChangeHP(-calDamage(user, aim) * this.dmgPercent);
        window.combatScene.appendMsg(" 伤害: " + damage);
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "dmgPercent");
        return new HeavyHit(skillInfo["VP"], skillInfo["dmgPercent"]);
    }
}

/**
 * 三昧真火。造成百分之<dmgPercent>的伤害，无视防御。
 */
class SamadhiFire extends Skill {
    constructor(VP, dmgPercent) {
        super("三昧真火", VP);
        this.dmgPercent = dmgPercent;
    }

    static getDescription() {
        return "Burn your emery with 三昧真火.";
    }

    getUsage() {
        return formatString("造成你的攻击力的 %0 的伤害, 无视防御。\n", this.dmgPercent)
            + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        const damage = aim.randChangeHP(-user.mCurrentATK * this.dmgPercent);
        window.combatScene.appendMsg(" 伤害: " + damage);
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "dmgPercent");
        return new SamadhiFire(skillInfo["VP"], skillInfo["dmgPercent"]);
    }
}

/**
 * 睡懒觉。增加<HP>点HP。
 */
class SlackSleep extends Skill {
    constructor(VP, HP, atkPercent) {
        super("睡懒觉", VP);
        this.HP = HP;
        this.atkPercent = atkPercent;
    }

    static getDescription() {
        return "Take a 睡懒觉.";
    }

    getUsage() {
        return formatString("恢复 %0 HP 并将你的攻击变为原来的 %1。\n", this.HP, this.atkPercent) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        user.mCurrentHP += this.HP;
        user.turnEndStatus.push(new BuffStatus("ATK", 2, this.atkPercent, _C.percent));
        window.combatScene.appendMsg(" Recovered HP: " + this.HP);
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "HP", "atkPercent");
        return new SlackSleep(skillInfo["VP"], skillInfo["HP"], skillInfo["atkPercent"]);
    }
}

/**
 * 念经。改变对方攻击力为<atkPercent>。
 */
class Chant extends Skill {
    constructor(VP, atkPercent, turn) {
        super("念经", VP);
        this.turn = turn;
        this.atkPercent = atkPercent;
    }

    static getDescription() {
        return "Chant.";
    }

    getUsage() {
        return formatString("将目标的攻击降为原来的 %0，持续 %1 回合。\n", this.atkPercent, this.turn) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        aim.turnEndStatus.push(new BuffStatus("ATK", this.turn, this.atkPercent, _C.percent));
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "turn", "atkPercent");
        return new Chant(skillInfo["VP"], skillInfo["atkPercent"], skillInfo["turn"]);
    }
}

/**
 * 棒击。造成固定的额外伤害，并且略微降低防御力。（注意防御力属性应该为负数。
 */
class BatStrike extends Skill {
    constructor(VP, atkNumber, defNumber, turn) {
        super("锤击", VP);
        this.turn = turn;
        this.atkNumber = atkNumber;
        this.defNumber = defNumber;
    }

    static getDescription() {
        return "Strick with a bat.";
    }

    getUsage() {
        return formatString("比普通攻击额外造成 %0 伤害，并将目标的防御力降低 %1，持续 %2 回合。\n", this.atkNumber, this.defNumber, this.defNumber) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        const damage = aim.randChangeHP(-calDamage(user, aim) - _damageFoumula(this.atkNumber, aim.mCurrentDEF));
        window.combatScene.appendMsg(" 伤害: " + damage);
        aim.turnEndStatus.push(new BuffStatus("DEF", this.turn, this.defNumber, _C.numeric));
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "turn", "atkNumber", "defNumber");
        return new BatStrike(skillInfo["VP"], skillInfo["atkNumber"], skillInfo["defNumber"], skillInfo["turn"]);
    }
}

class HolyRedemption extends Skill {
    constructor(VP, HP) {
        super("神圣治愈", VP);
        this.HP = HP;
    }

    static getDescription() {
        return "Holy Redemption.";
    }

    getUsage() {
        return formatString("将所有人的HP恢复 %0。\n", this.HP) + super.getUsage();
    }

    useSkill(user) {
        super.useSkill(user);
        let i;
        for (i=0; i<3; i++)
            CharacterSet[i].mCurrentHP += this.HP;
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "HP");
        return new HolyRedemption(skillInfo["VP"], skillInfo["HP"]);
    }
}

class Bite extends Skill {
    constructor(VP, dmg) {
        super("撕咬", VP);
        this.dmg = dmg;
    }

    static getDescription() {
        return "Bite your enemy.";
    }

    getUsage() {
        return formatString("造成 %0 伤害.\n", this.dmg) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        aim.mCurrentHP -= this.dmg;
        window.combatScene.appendMsg(" 伤害: " + damage);
    }

    static parse(skillInfo) {
        assertHasProperties(skillInfo, "VP", "dmg");
        return new HolyRedemption(skillInfo["VP"], skillInfo["dmg"]);
    }
}
