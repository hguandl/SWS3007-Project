"use strict";

/** A class to control buttons in the UI.
 * There are 0 custom buttons at the beginning.
 */
class UIButton {
    /**
     * The developer are supposed to use static methods rather than creating new instance.
     */
    constructor() {
        console.warn("The developer are supposed to use static methods rather than creating new instance.")
    }

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

    /**
     * Set the number of custom buttons.
     * @param buttonNumber {number} : An integer, the custom buttons number.
     */
    static setCustomButtonNumber(buttonNumber) {
        const wrapper = document.getElementById("custom-button-group");
        while (wrapper.childNodes.length > buttonNumber)
            wrapper.removeChild(wrapper.firstChild);
        let button;
        while (wrapper.childNodes.length < buttonNumber) {
            button = document.createElement('button');
            button.className = "button button-parchment button-rounded";
            wrapper.appendChild(button);
        }
    }

    /**
     * @returns {number} : Custom buttons number.
     */
    static getCustomButtonNumber() {
        return document.getElementById("custom-button-group").childNodes.length;
    }

    /**
     * Set the onclick event listener of a custom button.
     * @param buttonNumber {number} : An integer specifying the index of the custom button.
     * @param onclick {function} : The function will receive 1 parameter: event.
     */
    static setCustomButtonOnclick(buttonNumber, onclick) {
        document.getElementById("custom-button" + buttonNumber.toString()).onclick = onclick;
    }

    /**
     * Add a attribute to the button whose 'id' attribute is buttonId. Use this with caution.
     * @param buttonId
     * @param attributeName
     * @param attributeValue
     */
    static setAttributeById(buttonId, attributeName, attributeValue) {
        document.getElementById(buttonId).setAttribute(attributeName, attributeValue);
    }
}
