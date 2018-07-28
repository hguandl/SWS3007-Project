"use strict";

class Skill {
    constructor(name, VP) {
        this.name = name;
        this.VP = VP;
    }

    static parse(skillInfo) {
        return new Skill(skillInfo["name"], skillInfo["VP"]);
    }

    static getDescription() {
        return "Skill prototype description";
    }

    getUsage() {
        return formatString("Produce %0 VP.", this.VP);
    }

    useSkill(user, ...args) {
        user.mCurrentVP += this.VP;
    }

    /**
     * 按照index展示按钮
     * @param index
     */
    displaySkillOnButton(index) {
        const btnId = "#skill" + index.toString() + "-button";
        document.getElementById(btnId.slice(1)).innerText = this.name;
        $(btnId).text(this.name);
        const usage = this.getUsage();
        const mouseOn = function () {
            window.currentScene.showMsg(usage);
        };
        const mouseOff = function() {
            window.currentScene.closeMsg(true);
        };
        $(btnId).hover(mouseOn, mouseOff);
    }
}

/**
 * 改变对方防御百分比为<defPercent>
 */
class FieryEyes extends Skill {
    constructor(VP, defPercent, turn) {
        super("fiery eyes", VP);
        this.defPercent = defPercent;
        this.turn = turn;
    }

    static getDescription() {
        return "The eyes of Monkey King is baked by the \"Samadhi Fire\", which makes it penetrating.";
    }

    getUsage() {
        return formatString("Decrease the defense of the enemy by %0 percent for %1 turn.", this.defPercent, this.turn)
            + super.getUsage();
    }

    /**
     *
     * @param user {Character}
     * @param aim {Character}
     */
    useSkill(user, aim) {
        super.useSkill(user);
        aim.status.push(new BuffStatus("DEF", this.turn, this.defPercent, _C.percent));
    }

    static parse(skillInfo) {
        return new FieryEyes(skillInfo["VP"], skillInfo["defPercent"], skillInfo["turn"]);
    }
}

/**
 * 重击。造成百分之<dmgPercent>的伤害。
 */
class HeavyHit extends Skill {
    constructor(VP, dmgPercent) {
        super("heavy hit", VP);
        this.dmgPercent = dmgPercent;
    }

    static getDescription() {
        return "A heavy hit will cause more damage than attack."
    }

    getUsage() {
        return formatString("Deal %0 damage of your attack.", this.dmgPercent) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        aim.mCurrentHP -= calDamage(user, aim) * this.dmgPercent;
    }

    static parse(skillInfo) {
        return new HeavyHit(skillInfo["VP"], skillInfo["dmgPercent"]);
    }
}

/**
 * 三昧真火。造成百分之<dmgPercent>的伤害，无视防御。
 */
class SamadhiFire extends Skill {
    constructor(VP, dmgPercent) {
        super("Samadhi fire", VP);
        this.dmgPercent = dmgPercent;
    }

    static getDescription() {
        return "Burn your emery with Samadhi fire."
    }

    getUsage() {
        return formatString("Deal %0 damage of your attack, disregarding the emery's defense.", this.dmgPercent)
            + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        aim.mCurrentHP -= user.mCurrentATK * this.dmgPercent;
    }

    static parse(skillInfo) {
        return new SamadhiFire(skillInfo["VP"], skillInfo["dmgPercent"]);
    }
}

/**
 * 睡懒觉。增加<HP>点HP。
 */
class SlackSleep extends Skill {
    constructor(VP, HP, atkPercent) {
        super("slack sleep", VP);
        this.HP = HP;
        this.atkPercent = atkPercent;
    }

    static getDescription() {
        return "Take a slack sleep."
    }

    getUsage() {
        return formatString("Recover %0 HP and change your attack to %1 percent.", this.HP, this.atkPercent) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        user.mCurrentHP += this.HP;
        user.status.push(new BuffStatus("ATK", 2, this.atkPercent, _C.percent));
    }

    static parse(skillInfo) {
        return new SlackSleep(skillInfo["VP"], skillInfo["HP"],  skillInfo["atkPercent"]);
    }
}

/**
 * 念经。改变对方攻击力为<atkPercent>。
 */
class Chant extends Skill {
    constructor(VP, atkPercent, turn) {
        super("chant", VP);
        this.turn = turn;
        this.atkPercent = atkPercent;
    }

    static getDescription() {
        return "Chant."
    }

    getUsage() {
        return formatString("Decrease the attack of emery to 0% percent in %1 turn.", this.atkPercent, this.turn) + super.getUsage();
    }

    useSkill(user, aim) {
        super.useSkill(user);
        aim.status.push(new BuffStatus("ATK", this.turn, this.atkPercent, _C.percent));
    }

    static parse(skillInfo) {
        return new Chant(skillInfo["VP"], skillInfo["atkPercent"], skillInfo["turn"]);
    }
}
