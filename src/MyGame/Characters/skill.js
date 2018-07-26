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
        return "Skill prototype usage";
    }

    useSkill(user, ...args) {

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
        return formatString("Decrease the defense of the enemy by %0 percent for %1 turn.", this.defPercent, this.turn);
    }

    /**
     *
     * @param user {Character}
     * @param aim {Character}
     */
    useSkill(user, aim) {
        user.mCurrentVP += this.VP;
        aim.status.push(new BuffStatus("DEF", this.turn, this.defPercent, _C.percent));
    }

    static parse(skillInfo) {
        return new FieryEyes(skillInfo["VP"], skillInfo["defPercent"], skillInfo["turn"]);
    }
}

/**
 * This class stores all the Skill and there parameters.
 */
class SkillList {
    static parseSkill(skillInfo) {
        return window.allSkills[skillInfo["name"]].parse(skillInfo);
    }
}

/**
 *
 * @type {{Skill}}
 */
window.allSkills = {
    "fiery eyes": FieryEyes,

};

/**
 * Replace the '%0', '%1', '%2 and so on with replacer. (the placeholder index must be continuous integer start from 0)
 * @param string1: the string to format.
 * @param replacer: string or any thing that can be convert to string.
 * @returns {string}
 */
function formatString(string1, ...replacer) {
    let rst = string1;
    replacer.forEach((value, index) => {
        rst = rst.replace("%" + index.toString(), value.toString());
    });
    return rst;
}

