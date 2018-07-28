class characterStatus {
    constructor(statusType, turn) {
        this.type = statusType;
        this.turn = turn;
    }

    /**
     * 计算结果
     * @param character {Character}
     * @return {boolean} : 该状态是否仍然存在
     */
    computeStatus(character) {

    }
}

/**
 * buff或者debuff
 */
class BuffStatus extends characterStatus {
    /**
     * @param attributeName {string}
     * @param turn {number}
     * @param value {number}
     * @param [effectType = _C.percent] {number} : 是按照百分比计算还是按照数值计算
     */
    constructor(attributeName, turn, value, effectType = _C.percent) {
        super(_C.BuffStatus, turn);
        this.attributeName = attributeName;
        this.value = value;
        this.effectType = effectType;
    }

    computeStatus(character) {
        if (this.effectType === _C.percent) {
            character["mCurrent" + this.attributeName] = character["m" + this.attributeName] * (1.0 + this.value);
        } else if (this.effectType === _C.numeric) {
            character["mCurrent" + this.attributeName] -= this.value;
        }
    }
}


