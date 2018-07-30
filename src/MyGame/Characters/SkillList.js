"use strict";

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
    "heavy hit": HeavyHit,
    "Samadhi fire": SamadhiFire,
    "slack sleep": SlackSleep,
    "chant": Chant,
    "bat strike": BatStrike,
    "holy redemption": HolyRedemption,
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

function assertHasProperties(obj, ...properties) {
    properties.forEach(value => {
        if (!value in obj) {
            console.error("value not in obj", value, obj);
        }
    });
}
