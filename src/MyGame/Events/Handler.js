"use strict";

var GameEvents = GameEvents || { };

GameEvents.handle = function (game, event) {
    // console.debug(event);
    switch (event) {
        case "Shop":
        GameEvents.shop(game);
        break;
        case "Battle":
        GameEvents.battle(game);
        break;
        case "Treasure":
        GameEvents.treasure(game);
        break;
        case "Next":
        GameEvents.next(game);
    }
};
