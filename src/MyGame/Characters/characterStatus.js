class characterStatus {
    constructor(statusType) {
        this.type = statusType;
    }

    /**
     * 计算结果
     * @param character {Character}
     */
    computeStatus(character) {

    }
}

class BuffStatus extends characterStatus {
    /**
     *
     * @param attributeName
     * @param turn
     * @param value
     * @param effectType {number} :
     */
    constructor(attributeName, turn, value, effectType) {
        this.attributeName = attributeName;
        this.turn = turn;
        this.value = value;
        this.type = effectType;
    }

    computeStatus(character) {

    }
}


