function calDamage (attacker, defender) {
    return attacker.mCurrentATK * (100 / (defender.mCurrentDEF +100));
}

/**
 * There are four kinds of action: attack, skill, change (change character), prop (use prop).
 */
class Action {
    /**
     * @param  {number} actionType: Use _C.[actionType] as the parameter.
     * For example: const action1 = new Action(_C.attack);
     * @param [actionParam]
     */
    constructor(actionType, actionParam) {
        this.type = actionType;
        this.param = actionParam;
    }
}

class Attack extends Action {
    constructor(actionParam) {
        super(_C.attack, actionParam);
    }
}

class Skill extends Action {
    constructor(actionParam) {
        super(_C.attack, actionParam);
    }

    takeAction() {

    }
}

class Change extends Action {
    constructor(actionParam) {
        super(_C.attack, actionParam);
    }
}

class Item extends Action {
    constructor(actionParam) {
        super(_C.attack, actionParam);
    }
}

class NoneAction extends Action {
    constructor(actionParam) {
        super(_C.attack, actionParam);
    }

    takeAction() {
        console.error("None action should not be taken.");
    }
}

function makeAction(actionType, actionParam) {
    switch (actionType) {
        case _C.skill:
            return new Skill(actionParam);
        case  _C.attack:
            return new Attack(actionParam);
        case  _C.change:
            return new Change(actionParam);
        case  _C.item:
            return new Item(actionParam);
        case _C.none:
            return new NoneAction(actionParam);
        default:
            console.error("Reach undefined branch");
            return undefined;
    }
}

