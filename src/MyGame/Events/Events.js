"use strict;"

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
        // gEngine.GameLoop.stop();
    }
};

GameEvents.treasure = function(game) {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter) && game.mMyHero.getDir() == "Up") {
        game.showMsg("You've find a treasure!");
    }
};

GameEvents.next = function(game) {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        ShowDiv('Finished','fade');
        var hero = game.getHero();
        hero.getXform().incXPosBy(-0.1);
    }
};
