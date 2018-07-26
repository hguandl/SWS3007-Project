/**
 * This class stores all the skill and there parameters.
 */
class SkillList {
    static getParamNmae(skillName, argIndex) {
        return allSkills[skillName]["args"][argIndex];
    }
}

/**
 *
 * @type {{string}}
 */
window.allSkills = {
    "fiery eyes with golden pupils": {
        description: "The eyes of Monkey King is baked by the \"Samadhi Fire\", which makes it penetrating.",
        usage: "Decrease the defense of the enemy by %0 percent for %1 turn.",
        args: [
            50, // 防御减少的百分比
            5, // 回合
        ],
    }
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
