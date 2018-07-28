"use strict";

var GameEvents = GameEvents || { };

GameEvents.handle = function (e) {
    // 无事件
    if (!e || e[e.length - 1])
        return null;

    // 是否按触发键
    if (e[0] && !gEngine.Input.isKeyClicked(gEngine.Input.keys[e[0]]))
        return null;

    // 是否重复触发
    if (!e[e.length - 2])
        e[e.length - 1] = true;  // 不再触发

    switch (e[1]) {

        case "Go":
        return function(game) {
            game.nextScene = getScene(e[2]);
            gEngine.GameLoop.stop();
        }
        break;

        case "Show":
        return function(game) {
            var i;
            for (i = 0; i < e[2].length; ++i)
                document.mMsgQueue.push(e[2][i]);
        }

        case "Battle":
        return function(game) {
            CharacterSet[0].iconURL = "assets/character/character.png";
            CharacterSet[1].iconURL = "assets/character/monster1.jpg";

            window.combatScene = new Combat(CharacterSet[0], CharacterSet[1]);
            game.nextScene = window.combatScene;
            game.nextScene.nextScene = game;
            gEngine.GameLoop.stop();
        }

        case "Win":
        if (document.mWin) {
            return function(game) {
                ShowDiv('Finished','fade');
                window.mMapFreezed = true;
            }
        } else {
            return function(game) {
                game.showMsg("You must find the flower.")
                game.mMyHero.getHero().getXform().incYPosBy(0.05);
            }
        }
        default:
        return null;
    }
    return null;
};
