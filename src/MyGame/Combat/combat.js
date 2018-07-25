/** A new level.
 *
 */
function Combat {
    this.topCharacter = null;
    this.monster = null;
}


gEngine.Core.inheritPrototype(BlueLevel, Scene);

/**
 * Call this function to turn into combat scene.
 * @param topCharacter
 * @param monster
 */
Combat.prototype.startCombat = function(topCharacter, monster) {
    this.topCharacter = topCharacter;
    this.monster = monster;

    gEngine.Core.startScene(this);
};

Combat.prototype.loadScene = function() {

};

Combat.prototype.initialize = function() {

};

Combat.prototype.update = function() {

};

