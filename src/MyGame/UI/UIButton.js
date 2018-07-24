"use strict";

class UIButton {
    /** Display one button group and hide all other button groups.
     * @param groupId {string}: The 'id' attribute of the button-group element. The button-group is a 'div' element in
     * index.html.
     */
    static displayButtonGroup(groupId) {
        let btn;
        const buttons_groups = document.getElementsByClassName("UI-button-group");
        for (btn in buttons_groups) {
            if (buttons_groups[btn].id === groupId)
                buttons_groups[btn].style.display = "block";
            else
                buttons_groups[btn].style.display = "none";
        }
    }

    /** Set the skill name displayed by a button in the skill button group.
     * @param skillIndex {number} : An integer specifying the index of the skill. Range from 1 to 4.
     * @param skillName {string} : What name to display on the button.
     */
    static setSkillNmae(skillIndex, skillName) {
        document.getElementById("skill" + skillIndex.toString() + "-button").innerText = skillName;
    }
}
