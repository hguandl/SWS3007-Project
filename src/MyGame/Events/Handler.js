"use strict";

var GameEvents = GameEvents || { };

GameEvents.handle = function (e) {
    if (!e)
        return null;
    // console.debug(event);
    switch (e[0]) {
        case "Go":
        return function(game) {
            game.nextScene = new MyGame(e[1]);
            gEngine.GameLoop.stop();
        }
        break;
        case "Show":
        e[e.length - 1] = true;
        return function(game) {
            game.showMsg(e[1]);
        }
        case "Battle":
        e[e.length - 1] = true;
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
            e[e.length - 1] = true;
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
};
