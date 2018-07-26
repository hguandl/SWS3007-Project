"use strict";

class skill {
    constructor(name, VP) {
        this.name = name;
        this.VP = VP;
    }

    static getDescription() {
        return "skill prototype description";
    }

    getUsage() {
        return "skill prototype usage";
    }

    useSkill(user, ...args) {

    }

    /**
     * 按照index展示按钮
     * @param index
     */
    displaySkillOnButton(index) {
        const btnId = "#skill" + index.toString() + "-button";
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

class FieryEyes extends skill {
    constructor(VP, defPercent, turn) {
        super("fiery eyes with golden pupils", VP);
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
}


