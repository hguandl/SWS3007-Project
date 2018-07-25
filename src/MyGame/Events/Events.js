"use strict";

var GameEvents = GameEvents || { };

GameEvents.shop = function(game) {
    CharacterSet_Recover();

    game.showMsg("Your HP and VP have recovered!");

    var hero = game.getHero();
    hero.getXform().incYPosBy(-0.1);
};

GameEvents.battle = function(game) {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        // TODO, go to next stage

        // todo: 这两行是为了能使现在版本能使用，将在下一个版本删除
        CharacterSet[0].iconURL = "assets/character/character.png";
        CharacterSet[1].iconURL = "assets/character/monster1.jpg";

        window.combatScene = new Combat(CharacterSet[0], CharacterSet[1]);
        game.nextScene = window.combatScene;
        gEngine.GameLoop.stop();
    }
};

GameEvents.treasure = function(game) {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter) && game.mMyHero.getDir() == "Up") {
        ItemSet_addItem("Key", 1);
        game.showMsg("You've found a key!");
    }
};

GameEvents.next = function(game) {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (ItemSet_have("Key") > 0) {
            ShowDiv('Finished','fade');
        } else {
            game.showMsg("You have to find a key to pass");
        }
        var hero = game.getHero();
        hero.getXform().incXPosBy(-0.1);
    }
};
